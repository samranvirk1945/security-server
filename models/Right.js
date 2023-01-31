const sequelizePaginate = require('sequelize-paginate');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Right = sequelize.define('Right', {
        name: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,  //admin can change this 
            defaultValue: true
        }
    });

    Right.add = async (req) => {
        return Right.create(req)
    },
        Right.getAll = async (req) => {
            return Right.findAll()
        },
        Right.byId = async function (id) {
            return await Right.findOne({
                where: {
                    id
                }
            })

        };
    Right.updateRight = async function (req) {
        const { params, body } = req;
        return await Right.update(body, {
            where: {
                id: params.id
            }
        })

    };


    sequelizePaginate.paginate(Right);
    return Right;
};