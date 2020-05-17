const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const filter = require('bad-words')

const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

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


    //listener for join
    socket.on('join',({username,room},callback)=>{
        const {error, user} = addUser({id:socket.id, username, room})

        if(error){
            return callback(error)
        }
        socket.join(user.room)      
        socket.emit('message',generateMessage('Welcome! '+user.username))

        // send to everyone except the client who tried to connect
        //socket.broadcast.emit('message',generateMessage('A new user has joined'))

        // broadcast the message to everyone in the room
        socket.broadcast.to(user.room).emit('message',generateMessage('Server',`${user.username} has joined!`))
        
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        const ftr = new filter()
        if(ftr.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        //io.emit('message',generateMessage(message)) // io.emit to send to everyone
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username,message)) // broadcast to only room"friend"
        callback('Delivered')
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)) // io.emit to send to everyone
        callback('ACK from Server')
    })

    socket.on('disconnect',()=>{
        const removedUser = removeUser(socket.id)
        //console.log(removedUser)
        if(removedUser)
        {
            console.log(removedUser)
            socket.broadcast.to(removedUser[0].room).emit('message',generateMessage('Server',`${removedUser[0].username} has left!`))
            io.to(removedUser[0].room).emit('roomData',{
                room:removedUser[0].room,
                users:getUsersInRoom(removedUser[0].room)
            })
        }
        
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
