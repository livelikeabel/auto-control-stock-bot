const fetch = require('node-fetch');

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

//module.exports.getMenuDaily = getMenuDaily;
