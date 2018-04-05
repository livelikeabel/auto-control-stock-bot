const fetch = require('node-fetch');
const { Op } = require('sequelize');
const { menuDaily } = require('../../database/schema/platingDatabase');

exports.getMenuDaily = async (serviceType, area, date) => {
    const response = await fetch(`https://apidev.plating.co.kr/v2/menu/daily?serviceType=${serviceType}&area=${area}&date=${date}`, {
        method: 'GET',
        headers: {
            pt: 'MaS+ErT0KeN::P1a+iNgIsG00dF0oD#@!123!@#321#I@m_P1a+ing_D2V210pm2N++E@m_Y0wU',
            iu: 0,
            'Content-Type': 'application/json',
        },
    });
    const menuDaily = await response.json();
    //console.log(menuDaily);
    return menuDaily;
};

// pram 으로 당일 날짜를 넣어주어야 한다.
exports.testGetMenuDailyDB = async () => {
    const dailyMenusOptions = {
        where: {
            service_type: {
              [Op.or]: ['DINNER','LUNCH']
            },
            serve_date: '2018-01-24',
        },
      };
      //주문관련 정보를 받아온다.
      console.log(menuDaily);
      console.log(typeof(menuDaily));
    
      const dailyMenus = await menuDaily.findAll(dailyMenusOptions);
      if(dailyMenus.length === 0){
        console.log('없습니다.!');
      }
      await console.log(dailyMenus);
}

exports.addStock = (id, initialStock, stockToBeAdded) => {
    console.log('addStock method start');
    console.log(`메뉴 id : ${id} || 초기Stock : ${initialStock} || 추가 개수 : ${stockToBeAdded}`);
    menuDaily.update({
        stock: initialStock + stockToBeAdded,
        },{
        where: {
             idx: id 
        }
    }).then((result) => {
        console.log(result, 'success!')
    }).catch((err)=>{
        console.log(err);
    });
    console.log('done')
};

exports.substractStock = (id, initialStock, stockToBeSubstracted) => {
    console.log('substractStock method start');
    console.log(`메뉴 id : ${id} || 초기Stock : ${initialStock} || 감소 개수 : ${stockToBeSubstracted}`);
    menuDaily.update({
        stock: initialStock - stockToBeSubstracted,
        },{
        where: {
            idx: id
        }
    }).then((result) => {
        console.log(result, 'success!')
    }).catch((err) => {
        console.log(err);
    });
    console.log('done')
};