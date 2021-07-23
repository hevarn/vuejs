// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const siteGrouping = sequelizeClient.define('pdt_siteGrouping', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    opening: {
      type: DataTypes.DATE,
      allowNull: false
    },
    closing: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isOpen: {
      type: DataTypes.BOOLEAN,
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
  siteGrouping.associate = function (models) {
    // Define associations here
    siteGrouping.hasMany(models.pdt_provider)
    siteGrouping.hasMany(models.market)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return siteGrouping
}
