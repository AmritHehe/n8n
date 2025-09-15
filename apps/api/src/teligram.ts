
import TelegramBot from "node-telegram-bot-api";


export async function telegramBot(data : any){ 
    const token = data.token;
    const chatId= data.chatId ;

    const bot = new TelegramBot(token , {polling:true});

    await bot.sendMessage(chatId ,"hello from mini n8n")
}