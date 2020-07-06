'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  products.init({
    sku: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    precio_venta: DataTypes.INTEGER,
    lote_produccion: DataTypes.INTEGER,
    tiempo_esperado: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};