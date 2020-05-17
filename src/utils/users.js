const users=[]

// addUser, removeUser, getUser, getUsersInRoom

const addUser=({id, username, room})=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if(!username||!room){
        return {
            error:'Username and room are required!'
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return{
            error: 'Username is in use!'
        }
    }

    //store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

//remove user
const removeUser =(id)=>{
    const index = users.findIndex((user)=>user.id === id)

    if(index !== -1)
    {
        return users.splice(index, 1 )
    }
}

// get user by id
const getUser =(id)=>{
    const index = users.findIndex((user)=>user.id === id)

    if(index !== -1)
    {
        return users[index]
    }
}

// get users by room
const getUsersInRoom = (room)=>{
    /* const usersInRoom = []
    users.forEach((user)=>{
        if(user.room === room){
            usersInRoom.push(user)
        }
    })
    return usersInRoom */

    return users.filter((user)=> user.room === room)

}
/* 

addUser({
    id:21,
    username:'abhijeet',
    room:'friend'
})

addUser({
    id:22,
    username:'sipra',
    room:'friend'
})
addUser({
    id:23,
    username:'pooja',
    room:'friend'
})
addUser({
    id:24,
    username:'suman',
    room:'family'
})

addUser({
    id:25,
    username:'anita',
    room:'family'
})

const removedUser = removeUser(22)
 */

/* 
const res = addUser({
    id:23,
    username:'sipra',
    room:'friend'
})
console.log(res) */
/* console.log(users)

console.log(getUser(23))

console.log(getUsersInRoom('family')) */

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
