const sequelizePaginate = require('sequelize-paginate');
const { Op } = require('sequelize');
const { verify } = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        numberOfCancelJobs: {
            type: DataTypes.INTEGER,
            defaultValue:0
        },
        postCode: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.INTEGER // 1 admin , 2 subAdmin , 3 user
        },
        verify: {
            type: DataTypes.BOOLEAN, //user can change thi
            defaultValue: false
        },
        active: {
            type: DataTypes.BOOLEAN,  //admin can change this 
            defaultValue: true
        },
        drivingLicenceNum: {
            type: DataTypes.STRING,
        },
        drivingLicenceUrlFront: {
            type: DataTypes.STRING,
        },
        drivingLicenceUrlBack: {
            type: DataTypes.STRING,
        },
        hasDrivingLicence: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        profileUrl: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        latitude: {
            type: DataTypes.FLOAT(30),
        },
        longitude: {
            type: DataTypes.FLOAT(30),
        },
        address: {
            type: DataTypes.STRING(100),
        },
        password: {
            type: DataTypes.STRING(100),
        },
        fcmToken: {
            type: DataTypes.STRING,
        },
        DOB: {
            type: DataTypes.STRING,
        },
        earning: {
            type: DataTypes.FLOAT,
            defaultValue: 0

        },
        badgeFrontSidePicture: {
            type: DataTypes.STRING(),
        },
        badgeBackSidePicture: {
            type: DataTypes.STRING(),
        },
        utr: {
            type: DataTypes.STRING(),
        },
        proofOfAddress: {
            type: DataTypes.STRING(),
        },
        staffType: {
            type: DataTypes.STRING(),
        },
        niNumber: {
            type: DataTypes.STRING(),
        }

    });


    User.associate = function (models) {
        User.hasMany(models.UserRight)
    };


    User.byEmail = async (req) => {
        return User.findOne({
            where: {
                email: req.email,
                type: req.type
            },
            include: [sequelize.models.UserRight]

        })

    },
        User.byPhone = async (req) => {
            return User.findOne({
                where: {
                    phone: req.phone,
                    type: req.type
                }
            })
        },
        User.getProfile = async (req) => {
            let attributes = [
                "id",
                "name",
                "email",
                "city",
                "postCode",
                "type",
                "verify",
                "drivingLicenceNum",
                "drivingLicenceUrlFront",
                "drivingLicenceUrlBack",
                "hasDrivingLicence",
                "profileUrl",
                "phone",
                "latitude",
                "longitude",
                "address",
                "fcmToken",
                "DOB",
                "earning",
                "badgeFrontSidePicture",
                "badgeBackSidePicture",
                "utr",
                "proofOfAddress",
                "staffType",
                "niNumber",
                "createdAt",
                "updatedAt"
            ]
            return User.findOne({
                where: {
                    attributes,
                    id: req.id,
                },
                include: [
                    {
                        model: sequelize.models.DriverFeature,
                        required: false,
                    },
                ],
            })
        },
        User.add = async (req) => {
            return User.create(req)
        },
        User.getAll = async function (query) {
            let attributes = [
                "id",
                "name",
                "email",
                "city",
                "postCode",
                "type",
                "verify",
                "drivingLicenceNum",
                "drivingLicenceUrlFront",
                "drivingLicenceUrlBack",
                "hasDrivingLicence",
                "profileUrl",
                "phone",
                "latitude",
                "longitude",
                "address",
                "fcmToken",
                "DOB",
                "earning",
                "badgeFrontSidePicture",
                "badgeBackSidePicture",
                "utr",
                "proofOfAddress",
                "staffType",
                "niNumber",
                "createdAt",
                "updatedAt"
            ]
            let where = {
                type: 3
            }
            if (query.verify) {
                where.verify = query.verify
            }


            // if (query.name) where.name = { [Op.like]: `%${query.name}%` };
            // if (query.address) where.address = { [Op.like]: `%${query.address}%` };if (query.search) {
                if(query.search){
                where = {
                    ...where,
                    [Op.or]:
                        [
                            { name: { [Op.iLike]: `%${query.search}%` } },
                            { city: { [Op.iLike]: `%${query.search}%` } },
                            { address: { [Op.iLike]: `%${query.search}%` } },
                            { phone: { [Op.iLike]: `%${query.search}%` } },
                            { postCode: { [Op.iLike]: `%${query.search}%` } }
                        ]
                }
            }
            const options = {
                attributes,
                page: parseInt(query.page) || 1, // defaultValue 1
                paginate: parseInt(query.size) || 10,
                where,
                order: [['id', 'DESC']]
            };
            const { docs, pages, total } = await User.paginate(options);
            return { docs, pages, total };


        };



    User.getSubAmins = async function (query) {
        let attributes = [
            "id",
            "name",
            "email",
            "city",
            "postCode",
            "type",
            "verify",
            "drivingLicenceNum",
            "drivingLicenceUrlFront",
            "drivingLicenceUrlBack",
            "hasDrivingLicence",
            "profileUrl",
            "phone",
            "latitude",
            "longitude",
            "address",
            "fcmToken",
            "DOB",
            "earning",
            "badgeFrontSidePicture",
            "badgeBackSidePicture",
            "utr",
            "proofOfAddress",
            "staffType",
            "niNumber",
            "createdAt",
            "updatedAt"
        ]
        let where = {
            type: 2
        }
        if (query.verify) {
            where.verify = query.verify
        }
        if(query.search){
            where = {
                ...where,
                [Op.or]:
                    [
                        { name: { [Op.iLike]: `%${query.search}%` } },
                        { city: { [Op.iLike]: `%${query.search}%` } },
                        { address: { [Op.iLike]: `%${query.search}%` } },
                        { phone: { [Op.iLike]: `%${query.search}%` } },
                        { postCode: { [Op.iLike]: `%${query.search}%` } }
                    ]
            }
        }
        const options = {
            attributes,
            page: parseInt(query.page) || 1, // defaultValue 1
            paginate: parseInt(query.size) || 10,
            where,
            include: [sequelize.models.UserRight],
            order: [['id', 'DESC']],

        };
        const { docs, pages, total } = await User.paginate(options);
        return { docs, pages, total };


    };
    // User.getOneNearestDrivers = async function (lat,lang,drivers) {
    //     let where = {
    //         type:1,
    //         online:true,
    //         available:true,
    //         id: {
    //             [Op.notIn]: drivers
    //         },
    //     }            
    //     if (lat && lang) {
    //         where.latitude = {
    //             [Op.between]: [lat - (0.06), parseFloat(lat) + parseFloat( 0.06)],  //0.02 = 2 kilo meter, 1 degree=111 kilo meter
    //         },
    //             where.longitude = {
    //                 [Op.between]: [lang - (0.06), parseFloat(lang) + parseFloat(0.06)],
    //             }
    //     }
    //     const options = {
    //         where,
    //     };
    //     let users= await User.findOne(options)
    //     return  users;


    // };

    User.byId = async function (id) {
        let attributes = [
            "id",
            "name",
            "email",
            "city",
            "postCode",
            "type",
            "verify",
            "drivingLicenceNum",
            "drivingLicenceUrlFront",
            "drivingLicenceUrlBack",
            "hasDrivingLicence",
            "profileUrl",
            "phone",
            "latitude",
            "longitude",
            "address",
            "fcmToken",
            "DOB",
            "earning",
            "badgeFrontSidePicture",
            "badgeBackSidePicture",
            "utr",
            "proofOfAddress",
            "staffType",
            "niNumber",
            "createdAt",
            "updatedAt"
        ]
        return await User.findOne({
            attributes,
            where: {
                id
            }
        })

    };
    User.updateUser = async function (req) {
        const { params, body } = req;
        return await User.update(body, {
            where: {
                id: params.id
            }
        })

    };


    sequelizePaginate.paginate(User);
    return User;
};