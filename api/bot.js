const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const allowedChatId = process.env.ALLOWED_CHAT_ID

async function getChatIdByUsername(username) {
    try {
        const chat = await bot.telegram.getChat(username);
        return chat.id;
    } catch (error) {
        return null;
    }
}

bot.command('start', (ctx) => {
    if (String(ctx.chat.id) === allowedChatId) {
        ctx.reply('Salom! Men jilddagi guruhlarga xabar forward qila olaman. /forward buyrug‘i bilan xabar yuboring.');
    } else {
        ctx.reply('Sizga bu botdan foydalanishga ruxsat yo‘q.');
    }
});
// Har qanday xabarni forward qilish
bot.on('message', async (ctx) => {
    if (String(ctx.chat.id) === allowedChatId) { // Faqat shaxsiy chatdan
        const messageId = ctx.message.message_id;
        const fromChatId = ctx.chat.id;

        try {
            for (let i = 1; i <= 12; i++ ) {
                const username = `@test_group${i}www`
                const chatId = await getChatIdByUsername(username);
                if (chatId) {
                    await bot.telegram.forwardMessage(chatId, fromChatId, messageId);
                }
            }
            ctx.reply('Xabar jilddagi guruhlarga forward qilindi!');
        } catch (error) {
            ctx.reply('Xatolik yuz berdi: ' + error.message);
        }
    }
});

// Vercel uchun serverless funksiya
module.exports = async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.status(200).end();
    } catch (error) {
        res.status(500).send('Server xatosi');
    }
};
