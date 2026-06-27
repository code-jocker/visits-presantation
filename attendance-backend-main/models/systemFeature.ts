import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface ISystemFeatureAttributes {
    id?: string;
    featureKey: string;
    isEnabled: boolean;
    description?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

interface ISystemFeatureCreationAttributes extends Optional<ISystemFeatureAttributes, 'id' | 'description' | 'updatedAt' | 'createdAt'> {}

class SystemFeature extends Model<ISystemFeatureAttributes, ISystemFeatureCreationAttributes> implements ISystemFeatureAttributes {
    declare id?: string;
    declare featureKey: string;
    declare isEnabled: boolean;
    declare description?: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

SystemFeature.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    featureKey: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'system_features',
    sequelize,
    timestamps: true,
    modelName: 'SystemFeature',
});

export default SystemFeature;