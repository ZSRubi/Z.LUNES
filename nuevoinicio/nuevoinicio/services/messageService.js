const Message = require('../models/messageModel')

class MessageService{
    constructor(){
    }

    async getAll(){
        const messages = await Message.find({})
        return messages    
    }

    async createMessage(msg){
        const message = new Message(msg)
        return await message.save()
    }
}

module.exports = MessageService