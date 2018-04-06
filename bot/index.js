require('../config/env');

const TelegramBot = require('node-telegram-bot-api');
const token = '581322990:AAFU_K4UsShGm6s_kb_O8YViO1bUirw58ug';
const bot = new TelegramBot(token, { polling: true });

const { getMenuDaily, testGetMenuDailyDB, addStock, substractStock } = require('../cron/jobs/autoControlStock');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const jinsuSays = '';

  const menuDailyLunch = await getMenuDaily('LUNCH', 'seoul-2', '2018-01-24');
  const menuDailyDinner = await getMenuDaily('DINNER', 'seoul-2', '2018-01-24');
  
  const filteredMenuDailyLunch = checkZeroStock(menuDailyLunch);
  const filteredMenuDailyDinner = checkZeroStock(menuDailyDinner);

  // 런치 재고 확인
  filteredMenuDailyLunch.map((menuLunch) => {
      const menuLunchName = menuLunch.menuInformation.name.short;
      console.log('==================================================================');
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
          //현재 scope의 menuDinner는 점심 재고 0인 메뉴와 같다

          if (menuDinner.remain === 0) {
            console.log(` => 저녁 ${menuDinnerName}(${menuDinnerId}) 재고도 0 이라 아무것도 못해유 ㅠㅠ`);
            return;
          }; //점심, 저녁 둘다 재고가 0 임으로 return


          // 저녁의 수량이 1개 뿐이라면, 0개를 남기고, lunch수량을 1개 올린다.
          if (menuDinner.remain === 1) {
            const controlNumber = 1;
            console.log(` => 저녁(id : ${menuDinnerId})의 수량이 1개여서, 점심 1 올리고 저녁은 0으로 하겠습니당`);
          
            addStock(menuLunchId, initialLunchStock, controlNumber)
            substractStock(menuDinnerId, initialDinnerStock, controlNumber)
          }
          if (menuDinner.remain > 1) {
            const controlNumber = menuDinner.remain - 1; //4개를 옮겨주어야 한다.
            console.log(` => 점심의 ${menuLunchName}(${menuLunchId})는 ${controlNumber}만큼 올리고, 저녁 ${menuDinnerName}(${menuDinnerId})는 ${controlNumber}만큼 내립니다.`);

            addStock(menuLunchId, initialLunchStock, controlNumber)
            substractStock(menuDinnerId, initialDinnerStock, controlNumber)
            
          }
        }
      })
      //예외 처리. 점심과 저녁의 메뉴가 안겹칠 수 도있다. 
      //저녁데일리메뉴의 menuLunch(현재 돌고 있는) 수량을 1개만 남기고,  - 비동기 처리 해야함
  });
  
  console.log('===================== LUNCH CHECK FINISH =========================');


  filteredMenuDailyDinner.map((menuDinner) => {
    const menuDinnerName = menuDinner.menuInformation.name.short;
    const menuLunch = findSameMenu(menuDinnerName, menuDailyLunch);
    const menuLunchName = menuLunch.menuInformation.name.short;
    const menuDinnerId = menuDinner.idx;
    const menuLunchId = menuLunch.idx;
    const initialDinnerStock = menuDinner.stock;
    const initialLunchStock = menuLunch.stock;

    if(menuDinner.stock === 99) return; // 99이면 운영팀에서 일부로 없앤거기 때문에 return한다.
    console.log('==================================================================');
    console.log(`저녁 ${menuDinnerName} 메뉴가 매진 입니다.(메뉴번호 : ${menuDinner.menuIdx})`);
    if(menuLunch.remain === 0 || menuLunch.remain === 1) {
      console.log(` => 점심 ${menuDinnerName} 메뉴도 ${menuLunch.remain}개 뿐이여서 저녁으로 옮길 수 없습니다 ㅠㅠ`);
    } 
    
    // 런치의 재고가 1개 초과일 때
    if(menuLunch.remain > 1) {
      console.log(`저녁 ${menuDinnerName}의 재고(${menuDinnerId})가 0 임으로, 점심 ${menuLunchName}(${menuLunchId}) 수량을 저녁으로 옮겨야 합니다. `);
      const controlNumber = 1;

      addStock(menuDinnerId, initialDinnerStock, controlNumber);
      substractStock(menuLunchId, initialLunchStock, controlNumber);
      //sendmessage funciton 을 만들자.
      console.log(`송파 Dinner에 ${menuDinnerName}가 매진이 되어 LUNCH에서 ${controlNumber}개 차감하고 DINNER에 ${controlNumber}개 추가 했습니다 \r`)
      // console.log(jinsuSays)
    }
  })

  function findSameMenu(menuName, menuDailyRawData) {
    return menuDailyRawData.filter(menu => menu.menuInformation.name.short === menuName)[0];
  } 

  function checkZeroStock(menuDailyServiceType) {
    return menuDailyServiceType.filter(menu => menu.remain === 0);
  }

  bot.sendMessage(chatId, 'Received your message');
});

//"역삼 Lunch에 치킨벤또가 매진이 되어 Dinner에서 2개를 차감하고 Lunch에 2개를 추가했습니다")


bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});