const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        created: new Date().getTime(),
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
}