const MessageService = require('./services/messageService')
const messageService = new MessageService()

module.exports = (io) => {

    let messages = [{ username: "fake-user", message: "welcome" }]

    io.on('connection', async (socket) => {
        console.log("Un nuevo usuario conectado")

        const messages = await messageService.getAll()

        io.emit('all-messages', messages)

        socket.on('writing', (username) => {
            socket.broadcast.emit('writing', username)
        })

        socket.on('new-message', async (data) => {
            await messageService.createMessage(data)
            const messages = await messageService.getAll()
            io.emit('all-messages', messages)
        })

    })
}