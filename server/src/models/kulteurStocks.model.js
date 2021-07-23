// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const kulteurStocks = sequelizeClient.define('pdt_kulteurStocks', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quantity: {
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
  kulteurStocks.associate = function (models) {
    // Define associations here
    kulteurStocks.belongsTo(models.pdt_references)
    kulteurStocks.belongsTo(models.pdt_stocksActions)
    kulteurStocks.belongsTo(models.users)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return kulteurStocks
}
