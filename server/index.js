const express = require('express')
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { PrismaClient } = require('@prisma/client')
const path = require('path')
const { promisify } = require('util')
const imageToBase64 = require('image-to-base64');
const promisifiedImageToBase64 = promisify(imageToBase64)
const prisma = new PrismaClient()

const getAbsoluteImagePath = (imagePath) => path.resolve(__dirname, '../images', imagePath)
const getCar = async (id) => {
  const car = await prisma.cars.findUnique({
    where: {
      id
    },
    include: {
      image: true
    }
  })
  return car
}

app.use(express.static(path.resolve(__dirname,"../build")))
io.on('connection', (socket) => {
    socket.on("message", async (event) => {
      const car = await getCar(event.id)
      const absoluteImagePath = getAbsoluteImagePath(car.image.path)
      imageToBase64(absoluteImagePath)
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