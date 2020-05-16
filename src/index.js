const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server) // now the http server supports web sockets

const port = process.env.PORT||3000
const publicDirectoryPath =path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// an event is triggered when a new client connects to the web socket server

let count = 0

// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

io.on('connection',(socket)=>{
    //count+=1
    console.log('New web socket connection')

    socket.emit('message','Welcome!')

    // send to everyone except the client who tried to connect
    socket.broadcast.emit('message','A new user has joined')

    socket.on('sendMessage',(message)=>{
        io.emit('message',message) // io.emit to send to everyone
    })

    socket.on('sendLocation',(coords)=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`) // io.emit to send to everyone
    })

    socket.on('disconnect',()=>{
        io.emit('message','A user has left')
    })

/*     socket.emit('countUpdated',count)

    socket.on('increment',()=>{
        count++
        //socket.emit('countUpdated',count) // emit to a specific client
        io.emit('countUpdated',count) // emit to all the connected client

    }) */
})

// server is listening on port 3000
server.listen(port,()=>{
    console.log(`server is up on port ${port}!`)
})
