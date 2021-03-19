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

let clientMap = {};
let socketMap = {};
let nearbyMap = {};

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
  console.log(req.body.uuid + ", " + req.body.carName)
  await prisma.cars.create({
    data: {
      id: req.body.uuid,
      name: req.body.carName,
      image_path: req.body.carPic,

    }
  })
})

app.use(express.static(path.resolve(__dirname,"../build")))
io.on('connection', (socket) => {
  console.log("connection")
  console.log(socket.id)

    socket.on("message", async (event) => {
      const car = await getCar(event.id)
      console.log("message received")
      console.log(socketMap[socket.id]);
      console.log(nearbyMap[socketMap[socket.id]])
      // console.log('client map',clientMap)
      nearbyMap[socketMap[socket.id]].forEach((id) => {
        console.log("to uuid", id)
        clientMap[id].emit('message', {
          uuid: v4(),
          image: car.image_path,
          message: event.message,
          carName: car.name
        });
      });
      // for (nearbyId in nearbyMap[socketMap[socket.id]].keys()) {
      //   console.log('nearby id',nearbyId)
      //   let sock = clientMap[nearbyId];
      //   // console.log(sock)
      //   if (sock) {
      //     console.log('sending msg to', nearbyId);
      //     sock.emit('message', {
      //       uuid: v4(),
      //       image: car.image_path,
      //       message: event.message,
      //       carName: car.name
      //     });
      //   }
      // }
    })

    socket.on('intro', (uuid) => {
      console.log(`intro ${uuid}`);
      clientMap[uuid] = socket;
      socketMap[socket.id] = uuid;
      nearbyMap[uuid] = new Set();
    })

    socket.on('disconnect', (event) => {
        let uuid = socketMap[socket.id];
        delete clientMap[uuid];
        delete socketMap[socket.id];

        console.log(event)
        console.log('USER DISCONNECTED')
    })

    socket.on('error',(event) => {
        console.log("SOME ERROR HAS HAPPENED")
    })

    socket.on("found", ({me, them}) => {
      console.log("me",me);
      nearbyMap[me].add(them);
    });

    socket.on("delete", ({me, them}) => {
      nearbyMap[me].delete(them);
    });
  });


  

http.listen(4000, () => {
    console.log("SUCCESSFULLY LAUNCHED SERVER")
})