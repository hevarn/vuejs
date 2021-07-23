// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const orderProvider = sequelizeClient.define('pdt_orderProvider', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    buyPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    delivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    marketId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  orderProvider.associate = function (models) {
    // Define associations here
    orderProvider.belongsTo(models.pdt_references)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return orderProvider
}
