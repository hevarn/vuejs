// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { DataTypes } from 'sequelize'

export default function (app) {
  const sequelizeClient = app.get('sequelizeClient')
  const products = sequelizeClient.define('pdt_product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sharedReference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    spotlight: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    favouriteRefId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    disassemble: {
      type: DataTypes.DECIMAL(6, 3),
      allowNull: true,
      default: null
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    }
  }, {
    hooks: {
      beforeCount (options) {
        options.raw = true
      }
    }
  })

  // eslint-disable-next-line no-unused-vars
  products.associate = function (models) {
    // Define associations here
    products.belongsTo(models.pdt_variety)
    products.belongsTo(models.pdt_category)
    products.belongsTo(models.pdt_country)
    products.belongsTo(models.pdt_weight_unity, { as: 'buyUnity', foreignKey: 'pdtWeightUnityId' })
    products.belongsTo(models.pdt_weight_unity, { as: 'sellUnity', foreignKey: 'sellUnityId' })
    products.belongsTo(models.pdt_distance)
    products.belongsTo(models.pdt_siteGrouping)
    // products.belongsTo(models.pdt_type)
    products.hasMany(models.pdt_references)
    products.hasMany(models.pdt_references, { as: 'othersRef', foreignKey: 'pdtProductId' })
    products.hasMany(models.pdt_sellHistory)
    products.hasMany(models.favoritProducts)

    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  }

  return products
}
