require('../config/env');

const TelegramBot = require('node-telegram-bot-api');

const token = '581322990:AAFU_K4UsShGm6s_kb_O8YViO1bUirw58ug';

const bot = new TelegramBot(token, { polling: true });

const { getMenuDaily, testGetMenuDailyDB, addStock, substractStock } = require('../cron/jobs/autoControlStock');


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

  menuDailyLunch = await getMenuDaily('LUNCH', 'seoul-2', '2018-01-24');
  menuDailyDinner = await getMenuDaily('DINNER', 'seoul-2', '2018-01-24');

  // 런치 재고 확인
  menuDailyLunch.map((menuLunch) => {
    if (menuLunch.remain === 0) {
      const menuLunchName = menuLunch.menuInformation.name.short;
      console.log(`${menuLunchName}메뉴가 매진 입니다.(메뉴번호 : ${menuLunch.menuIdx})`)

      //menuDailyDinner에서 돌면서 menuDinner와 menuLunch가 겹치는 부분을 찾는다. 나중에 메소드 분리하기
      menuDailyDinner.find((menuDinner) => {
        const menuDinnerName = menuDinner.menuInformation.name.short;
        const menuLunchId = menuLunch.idx
        const menuDinnerId = menuDinner.idx
        const initialLunchStock = menuLunch.stock;
        const initialDinnerStock = menuDinner.stock;


        if (menuLunchName === menuDinnerName) {
          console.log(`점심 ${menuLunchName}의 재고(${menuLunchId})가 0 임으로, 저녁 ${menuDinnerName}(${menuDinnerId}) 수량을 점심으로 옮깁니다. `);
          // const dinnerRemainStock = menuDinner.remain;
          // const controlStockNumber = menuDinner.remain - 1;
          // console.log('dinnerRemainStock : ', dinnerRemainStock)
          // console.log('controlStockNumber : ', controlStockNumber)

          // const plusStock;
          // const minusStock;
          //현재 scope의 menuDinner는 점심 재고 0인 메뉴와 같다
          //console.log(menuDinner.stock); //stock이 99 이면 운영팀이 일부로 한것. 예외처리 떄 참고하자
          // 저녁의 남은 개수를 줄이고, 점심을 올리는 function
          //console.log(menuDinner.remain); // 저녁 남은게 5개라고 하면,

          //addStock(menuLunch.idx, lunchStock);

          if (menuDinner.remain === 0) {
            console.log(` => 저녁 ${menuDinnerName}(${menuDinnerId}) 재고도 0 입니다 ㅠㅠ`);
            console.log('==================================================================');
            return;
          }; //점심, 저녁 둘다 재고가 0 임으로 return


          // 저녁의 수량이 1개 뿐이라면, 0개를 남기고, lunch수량을 1개 올린다.
          if (menuDinner.remain === 1) {
            const controlNumber = 1;
            console.log(` => 저녁(id : ${menuDinnerId})의 수량이 1개여서, 점심 1 올리고 저녁은 0으로 하겠습니당`);
          
            //점심 올리는 함수 
            addStock(menuLunchId, initialLunchStock, controlNumber)
            //저녁 내리는 함수
            substractStock(menuDinnerId, initialDinnerStock, controlNumber)
            console.log('==================================================================');
          }
          else {
            const controlNumber = menuDinner.remain - 1; //4개를 옮겨주어야 한다.
            //console.log(controlNumber);
            console.log(` => 점심의 ${menuLunchName}(${menuLunchId})는 ${controlNumber}만큼 올리고, 저녁 ${menuDinnerName}(${menuDinnerId})는 ${controlNumber}만큼 내립니다.`);

            // 점심 올리는 함수 //
            addStock(menuLunchId, initialLunchStock, controlNumber)
            // 저녁 내리는 함수 
            substractStock(menuDinnerId, initialDinnerStock, controlNumber)
            console.log('==================================================================');
          }

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

  //testGetMenuDailyDB();
  console.log(process.env.MYSQL_USER);
  bot.sendMessage(chatId, 'Received your message');
});