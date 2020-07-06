const Sequelize = require("sequelize");

require("dotenv").config({path: ".env"});

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        define: {
            timestamps: false
        },
        pool:{
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        logging: false // quitar para ver operaciones por consola
    }
);

module.exports.sequelize = sequelize;