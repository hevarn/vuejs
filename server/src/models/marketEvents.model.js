// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const marketEvents = sequelizeClient.define('marketEvents', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    receptionOpen: {
      type: DataTypes.DATE,
      allowNul: false
    },
    receptionClose: {
      type: DataTypes.DATE,
      allowNul: false
    }

  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  marketEvents.associate = function (models) {
    // Define associations here
    marketEvents.belongsTo(models.market)
    marketEvents.belongsTo(models.pdt_provider)
    marketEvents.hasMany(models.evenement)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return marketEvents
}
