// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const users = sequelizeClient.define('users', {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rank: {
      type: DataTypes.ENUM('user', 'kulteur', 'admin'),
      defaultValue: 'user'
    },
    nbHome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN
    },
    verifyToken: {
      type: DataTypes.STRING
    },
    verifyShortToken: {
      type: DataTypes.STRING
    },
    verifyChanges: {
      type: DataTypes.JSON
    },
    verifyExpires: {
      type: DataTypes.DATE
    },
    resetToken: {
      type: DataTypes.STRING
    },
    resetExpires: {
      type: DataTypes.DATE
    }
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    // Define associations here
    users.belongsTo(models.pdt_provider)
    users.hasMany(models.pdt_kulteurStocks)
    users.hasMany(models.favoritProducts)
    users.hasMany(models.cart)
    users.hasMany(models.participations)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }
  return users
}
