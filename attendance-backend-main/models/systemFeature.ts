import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface SystemFeatureAttributes {
  id: string;
  featureKey: string;
  isEnabled: boolean;
  description?: string | null;
}

export interface SystemFeatureCreationAttributes extends Optional<SystemFeatureAttributes, 'id'> {}

class SystemFeature extends Model<SystemFeatureAttributes, SystemFeatureCreationAttributes> implements SystemFeatureAttributes {
  declare id: string;
  declare featureKey: string;
  declare isEnabled: boolean;
  declare description?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SystemFeature.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  featureKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'system_features',
  sequelize,
  timestamps: true,
  modelName: 'SystemFeature',
});

export default SystemFeature;
