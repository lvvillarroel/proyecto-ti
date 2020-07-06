'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orden_fabricacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  orden_fabricacion.init({
    sku: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    fecha_llegada: DataTypes.DATE,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'orden_fabricacion',
  });
  return orden_fabricacion;
};