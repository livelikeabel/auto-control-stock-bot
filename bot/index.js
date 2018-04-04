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

    // 런치 재고 확인
    menuDailyLunch.map((menuLunch) => {
      if(menuLunch.remain === 0) {
        const menuLunchName = menuLunch.menuInformation.name.short;
        console.log(`${menuLunchName}메뉴가 매진 입니다.`)

        //menuDailyDinner에서 돌면서 menuDinner와 menuLunch가 겹치는 부분을 찾는다. 나중에 메소드 분리하기
        menuDailyDinner.find((menuDinner) => {
            const menuDinnerName = menuDinner.menuInformation.name.short;
            if(menuLunchName === menuDinnerName) {
              console.log(`점심 ${menuLunchName}의 재고가 0 임으로, 저녁 ${menuDinnerName} 수량을 점심으로 옮깁니다. `);
            }
        })
        

        //예외 처리. 점심과 저녁의 메뉴가 안겹칠 수 도있다. 
        //예외 처리. 저녁도 0이면 아무것도 안한다.
        //저녁데일리메뉴의 menuLunch(현재 돌고 있는) 수량을 1개만 남기고,  - 비동기 처리 해야함
        //dinner 수량이 1개 밖에 안남아 있다면, 디너는 0을 만들고 lunch 수량은 1만 올린다.

      }
    });



    // 디너 재고확인
    // menuDailyDinner.map((menuDinner) => {
    //   if(menuDailyDinner.remain === 0) {
    //     //저녁데일리메뉴의
    //   }
    // });

    bot.sendMessage(chatId, 'Received your message');
  });