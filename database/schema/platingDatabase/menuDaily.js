const { DataTypes } = require('sequelize');

module.exports = seq =>
    seq.define(
        'menuDaily',
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                field: 'idx',
              },
            serveDate: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'serve_date',
            },
            menuIdx: {
                type: DataTypes.INTEGER(11),
                allowNull: true,
                field: 'menu_idx',
            },
            stock: {
                type: DataTypes.INTEGER(11),
                allowNull: true,
            },
            ordered: {
                type: DataTypes.INTEGER(11),
                allowNull: true,
            },
            area: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            serviceType: {
                type: DataTypes.STRING(45),
                allowNull: true,
                field: 'service_type',
            }
        },
        {
            tableName: 'menu_daily',
            timestamps: false
        }
    );