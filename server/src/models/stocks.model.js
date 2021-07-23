// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const stocks = sequelizeClient.define('pdt_stocks', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    referenceProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    qtyExpected: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: false
    },
    qtyReceived: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: false
    },
    buyPrice: {
      type: DataTypes.DECIMAL(8, 3),
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
  stocks.associate = function (models) {
    // Define associations here
    stocks.belongsTo(models.pdt_references)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return stocks
}
