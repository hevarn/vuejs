// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const providers = sequelizeClient.define('pdt_provider', {
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
    admin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mailAdmin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telAdmin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nameKultor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mailKultor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telKultor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nbEmployees: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isSite: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    receptionOpen: {
      type: DataTypes.DATE,
      allowNull: true
    },
    receptionClose: {
      type: DataTypes.DATE,
      allowNull: true
    },
    packaging1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    packaging2: {
      type: DataTypes.INTEGER
    },
    packaging3: {
      type: DataTypes.INTEGER
    },
    packaging4: {
      type: DataTypes.INTEGER
    },
    packaging5: {
      type: DataTypes.INTEGER
    },
    minAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    scheduleImg: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  providers.associate = function (models) {
    // Define associations here
    providers.hasMany(models.pdt_references)
    providers.hasMany(models.users)
    providers.belongsTo(models.pdt_siteGrouping)
    providers.hasMany(models.pdt_orderProvider)
    providers.hasMany(models.evenement)
    providers.hasMany(models.marketEvents)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return providers
}
