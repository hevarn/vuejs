// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const sellHistory = sequelizeClient.define('pdt_sellHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    sellPrice: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    ratio: {
      type: DataTypes.DECIMAL(8, 2),
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
  sellHistory.associate = function (models) {
    // Define associations here
    sellHistory.belongsTo(models.pdt_product)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return sellHistory
}
