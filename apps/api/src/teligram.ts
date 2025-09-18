
import TelegramBot from "node-telegram-bot-api";


export async function telegramBot(data : any , message :string){ 
    const token = data.token;
    const chatId= data.chatId ;

    const bot = new TelegramBot(token , {polling:false});

    await bot.sendMessage(chatId ,message)
}