const fetch = require('node-fetch');
const { Op } = require('sequelize');
const { menuDaily } = require('../../database/schema/platingDatabase');

exports.getMenuDaily = async (serviceType, area, date) => {
    const response = await fetch(`https://apialpha.plating.co.kr/v2/menu/daily?serviceType=${serviceType}&area=${area}&date=${date}`, {
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

exports.testGetMenuDailyDB = async () => {
    const dailyMenusOptions = {
        where: {
            service_type: {
              [Op.or]: ['DINNER','LUNCH']
            },
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
