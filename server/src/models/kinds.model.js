// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const kinds = sequelizeClient.define('pdt_kind', {
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
  kinds.associate = function (models) {
    // Define associations here
    kinds.belongsTo(models.pdt_type)
    kinds.hasMany(models.pdt_variety)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return kinds
}
