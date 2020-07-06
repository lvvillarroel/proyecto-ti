'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orden_compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  orden_compra.init({
    sku_producto: DataTypes.INTEGER,
    grupo_compra: DataTypes.INTEGER,
    grupo_vende: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    monto: DataTypes.INTEGER,
    fecha_venc: DataTypes.DATE,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'orden_compra',
  });
  return orden_compra;
};