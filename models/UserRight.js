const sequelizePaginate = require('sequelize-paginate');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const UserRight = sequelize.define('UserRight', {
        name: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,  //admin can change this 
            defaultValue: true
        }
    });

    UserRight.associate = function (models) {
        UserRight.belongsTo(models.User);
    };

    UserRight.add = async (req) => {
        return UserRight.create(req)
    },
        UserRight.getAll = async (req) => {
            return UserRight.findAll()
        },
        UserRight.byId = async function (id) {
            return await UserRight.findOne({
                where: {
                    id
                }
            })

        };
    UserRight.updateUserRight = async function (req) {
        const { params, body } = req;
        return await UserRight.update(body, {
            where: {
                id: params.id
            }
        })

    };


    sequelizePaginate.paginate(UserRight);
    return UserRight;
};