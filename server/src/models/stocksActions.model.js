// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const stocksActions = sequelizeClient.define('pdt_stocksActions', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
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
  stocksActions.associate = function (models) {
    // Define associations here
    stocksActions.hasMany(models.pdt_kulteurStocks)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return stocksActions
}
