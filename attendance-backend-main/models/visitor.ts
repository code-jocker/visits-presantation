import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import Student from "./student";
import Class from "./class";

export interface VisitorAttributes {
  id: string;
  fullName: string;
  studentName?: string | null;
  studentId?: string | null;
  classId?: string | null;
  mobile?: string | null;
  email?: string | null;
  visitorCompany?: string | null;
  purpose?: string | null;
  department?: string | null;
  hostName?: string | null;
  idProofType?: string | null;
  idNumber?: string | null;
  passType?: string | null;
  status?: string | null;
  badgeId?: string | null;
  profilePhoto?: string | null;
  entryTime?: Date | null;
  exitTime?: Date | null;
}

export interface VisitorCreationAttributes extends Optional<VisitorAttributes, 'id'> {}

class Visitor extends Model<VisitorAttributes, VisitorCreationAttributes> implements VisitorAttributes {
  declare id: string;
  declare fullName: string;
  declare studentName?: string | null;
  declare studentId?: string | null;
  declare classId?: string | null;
  declare mobile?: string | null;
  declare email?: string | null;
  declare visitorCompany?: string | null;
  declare purpose?: string | null;
  declare department?: string | null;
  declare hostName?: string | null;
  declare idProofType?: string | null;
  declare idNumber?: string | null;
  declare passType?: string | null;
  declare status?: string | null;
  declare badgeId?: string | null;
  declare profilePhoto?: string | null;
  declare entryTime?: Date | null;
  declare exitTime?: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt?: Date | null;

  declare getStudent?: () => Promise<Student | null>;
  declare getClass?: () => Promise<Class | null>;
}

Visitor.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  classId: {
    type: DataTypes.CHAR(36),
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  visitorCompany: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hostName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idProofType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'ACTIVE',
  },
  badgeId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  entryTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  exitTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'visitors',
  sequelize,
  timestamps: true,
  paranoid: true,
  modelName: 'Visitor',
});

Visitor.belongsTo(Student, { foreignKey: 'studentId', as: 'student', constraints: false });
Visitor.belongsTo(Class, { foreignKey: 'classId', as: 'visitorClass', constraints: false });

export default Visitor;
