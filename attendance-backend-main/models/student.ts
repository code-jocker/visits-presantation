import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

export interface StudentAttributes {
  id: string;
  studentId: string;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
  admissionNumber?: string | null;
  classId?: string | null;
  status?: string | null;
}

export interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  declare id: string;
  declare studentId: string;
  declare fullName: string;
  declare email?: string | null;
  declare phoneNumber?: string | null;
  declare admissionNumber?: string | null;
  declare classId?: string | null;
  declare status?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Student.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  admissionNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  classId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
}, {
  tableName: 'students',
  sequelize,
  timestamps: true,
  modelName: 'Student',
});

export default Student;
