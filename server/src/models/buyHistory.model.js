// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const buyHistory = sequelizeClient.define('pdt_buyHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    buyPrice1: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false
    },
    buyPrice2: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    buyPrice3: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    buyPrice4: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    buyPrice5: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  buyHistory.associate = function (models) {
    // Define associations here
    buyHistory.belongsTo(models.pdt_references)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return buyHistory
}
