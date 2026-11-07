import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ClassAttributes {
  id: string;
  name: string;
  description?: string | null;
  level?: string | null;
  isActive: boolean;
}

export interface ClassCreationAttributes extends Optional<ClassAttributes, 'id'> {}

class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  declare id: string;
  declare name: string;
  declare description?: string | null;
  declare level?: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Class.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'classes',
  sequelize,
  timestamps: true,
  modelName: 'Class',
});

export default Class;
