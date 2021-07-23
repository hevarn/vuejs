// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const cart = sequelizeClient.define('cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1
    }
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  cart.associate = function (models) {
    // Define associations here
    cart.belongsTo(models.users)
    cart.belongsTo(models.pdt_product)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return cart
}
