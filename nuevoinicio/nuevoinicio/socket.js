const MessageService = require('./services/messageService')
const messageService = new MessageService()

module.exports = (io) => {
    io.on('connection', async (socket) => {
        console.log("🟢 Un nuevo usuario se ha conectado a Socket.IO")

        const messages = await messageService.getAll()
        io.emit('all-messages', messages)

        socket.on('writing', (username) => {
            socket.broadcast.emit('writing', username)
        })

        socket.on('new-message', async (data) => {
            await messageService.createMessage(data)
            const updatedMessages = await messageService.getAll()
            io.emit('all-messages', updatedMessages)
        })
    })
}
