// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const workshops = sequelizeClient.define('workshops', {
    workshopId: {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userSupport: {
      type: DataTypes.STRING,
      allowNull: true
    },
    kulteurSupport: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    pdfLink: {
      type: DataTypes.STRING,
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
  workshops.associate = function (models) {
    // Define associations here
    workshops.belongsTo(models.evenement)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return workshops
}
