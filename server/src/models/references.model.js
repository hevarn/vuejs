// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const references = sequelizeClient.define('pdt_references', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    kanopeeReference: {
      type: DataTypes.STRING,
      allowNull: false
    },
    providerReference: {
      type: DataTypes.STRING,
      allowNull: false
    },
    infoRef: {
      type: DataTypes.STRING,
      allowNull: true
    },
    package: {
      type: DataTypes.INTEGER,
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
  references.associate = function (models) {
    // Define associations here
    references.belongsTo(models.pdt_provider)
    references.belongsTo(models.pdt_product)
    references.hasMany(models.pdt_buyHistory)
    references.hasMany(models.pdt_stocks)
    references.hasMany(models.pdt_orderProvider)
    references.hasMany(models.pdt_kulteurStocks)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return references
}
