import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const evenement = sequelizeClient.define('evenement', {
    eventId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM('Atelier', 'Reception', 'Entretien', 'Culture'),
      allowNull: false
    },

    startAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    endAt: {
      type: DataTypes.DATE,
      allowNull: false
    },

    userCurrent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    userMax: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    description: {
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
  evenement.associate = function (models) {
    // Define associations here
    evenement.hasOne(models.workshops)
    evenement.belongsTo(models.pdt_provider)
    evenement.belongsTo(models.marketEvents)
    evenement.hasMany(models.participations)
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return evenement
}
