const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    //check for exisiting user
    const exisitingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(exisitingUser){
        return {
            error: 'Username is in use!'
        }
    }

    // store user
    const user = {id, username, room}
    users.push(user)
    
    return {user}

}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>user.id === id)
    if(index !== -1){
        return users.splice(index, 1)[0]
    }

    return index;
}

const getUser = (id) => {
    const user = users.find((user)=>{
        return user.id === id
    })

    return user
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const user = users.filter((user)=>{
        return user.room === room
    })

    return user
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}