// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const favoritProducts = sequelizeClient.define('favoritProducts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    }
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  favoritProducts.associate = function (models) {
    // Define associations here
    favoritProducts.belongsTo(models.users)
    favoritProducts.belongsTo(models.pdt_product)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return favoritProducts
}
