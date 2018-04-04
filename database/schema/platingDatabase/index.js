const db = require('../../../db/sequelize');
const menuDaily = require('./menuDaily.js')(db);
// const orderMeta = require('./orderMeta')(db);
// const timeSlot = require('./timeSlot')(db);

module.exports = {
//   orderMeta,
//   timeSlot,
    menuDaily
};
