const TelegramBot = require('node-telegram-bot-api');

const token = '581322990:AAFU_K4UsShGm6s_kb_O8YViO1bUirw58ug';

const bot = new TelegramBot(token, {polling: true});

const { getMenuDaily } = require('../cron/jobs/autoControlStock');

bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
  
    console.log('hi');

    menuDailyLunch = await getMenuDaily('LUNCH', 'seoul-2', '2018-04-03');
    menuDailyDinner = await getMenuDaily('DINNER', 'seoul-2', '2018-04-03');
    console.log(menuDailyLunch[0]);

    

    // let lunchRemain = menuDailyLunch[0].remain
    // if(lunchRemain === 0) {

    // }

    bot.sendMessage(chatId, 'Received your message');
    bot.sendMessage(chatId, JSON.stringify(menuDaily[0]));
  });