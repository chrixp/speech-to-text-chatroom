const express = require('express')
const app = express();
const https = require('https')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const chatRoomMembers = []
const { speechToText } = require('./speechToText')

app.use(express.static(path.resolve(__dirname,"../build")))
io.on('connection', (socket) => {
    socket.on('leaveroom',(user) => {
        chatRoomMembers.pop(user)
        io.sockets.emit('memberReset',chatRoomMembers)
        io.sockets.emit('message', {
            notification: true,
            color: 'red',
            message: `${user} has left the chat room`
        })
    })

    socket.on('enterroom',(user) => {
        chatRoomMembers.push(user)
        io.sockets.emit('memberReset',chatRoomMembers)
        io.sockets.emit('message', {
            notification: true,
            color: 'blue',
            message: `${user} has entered the chat room`
        })
    })

    socket.on("audioMessage", async (event) => {
        const { audio, username } = event
        if(event && event.audio) {
            const transcript = await speechToText(audio)
            if(!transcript ) {
                socket.emit('conversionError','not convertible to speech')
            } else {
                io.sockets.emit('message', {
                    username,
                    message: transcript
                })
            }
        } else {
            socket.emit('conversionError','empty')
        }
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