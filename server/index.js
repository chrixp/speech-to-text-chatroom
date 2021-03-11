const express = require('express')
const app = express();
const { writeFileSync } = require('fs')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const { v4 } = require('uuid')
const { PrismaClient } = require('@prisma/client')
const path = require('path')
var cors = require('cors')
const imageToBase64 = require('image-to-base64');
const prisma = new PrismaClient()

const getAbsoluteImagePath = (imagePath) => path.resolve(__dirname, '../images', imagePath)
const getCar = async (id) => {
  const car = await prisma.cars.findUnique({
    where: {
      id
    }
  })
  return car
}

app.use(cors())
app.use(fileUpload({
  createParentPath: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.post('/cars', async (req, res) => {
  const image = req.files.carPic

  const imageNameSuffix = image.name.split('.').pop()
  const newImageName = `${v4()}.${imageNameSuffix}`
  const absoluteImagePath = getAbsoluteImagePath(newImageName)
  image.mv(absoluteImagePath)
  await prisma.cars.create({
    data: {
      id: req.body.uuid,
      name: req.body.carName,
      image_path: absoluteImagePath,

    }
  })
})

app.use(express.static(path.resolve(__dirname,"../build")))
io.on('connection', (socket) => {
    socket.on("message", async (event) => {
      const car = await getCar(event.id)
      console.log(car['image_path'])
      imageToBase64(car['image_path'])
        .then(imageURI =>  {
          socket.broadcast.emit('message', {
            imageURI,
            message: event.message,
            name: car.name
          })
        })
    })


    socket.on('disconnect', (event) => {
        console.log(event)
        console.log('USER DISCONNECTED')
    })

    socket.on('error',(event) => {
        console.log("SOME ERROR HAS HAPPENED")
    })
  });


  

http.listen(4000, () => {
    console.log("SUCCESSFULLY LAUNCHED SERVER")
})