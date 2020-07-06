'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orden_municipalidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  orden_municipalidad.init({
    idd: DataTypes.INTEGER,
    sku_caja: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    monto: DataTypes.INTEGER,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'orden_municipalidad',
  });
  return orden_municipalidad;
};