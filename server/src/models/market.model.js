// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { BOOLEAN, DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const market = sequelizeClient.define('market', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    opening: {
      type: DataTypes.DATE,
      allowNull: false
    },
    closing: {
      type: DataTypes.DATE,
      allowNull: false
    },
    minAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    },
    ordered: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }

  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  market.associate = function (models) {
    // Define associations here
    market.hasMany(models.marketEvents)
    market.belongsTo(models.pdt_siteGrouping)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return market
}
