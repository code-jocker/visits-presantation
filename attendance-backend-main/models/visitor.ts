import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface IVisitorAttributes {
    id?: string;
    fullName: string;
    mobile?: string;
    email?: string;
    visitorCompany?: string;
    purpose?: string;
    department?: string;
    hostName?: string;
    idProofType?: string;
    idNumber?: string;
    passType?: string;
status?: 'IN' | 'OUT' | 'ACTIVE' | 'CHECKED_IN' | 'CHECKED_OUT' | 'BLACKLISTED';
    badgeId?: string;
    profilePhoto?: string;
    createdAt?: Date;
    updatedAt?: Date;
    entryTime?: Date;
    exitTime?: Date;
}

class Visitor extends Model<IVisitorAttributes, Optional<IVisitorAttributes, 'id' | 'createdAt' | 'updatedAt'>> implements IVisitorAttributes {
    declare id?: string;
    declare fullName: string;
    declare mobile?: string;
    declare email?: string;
    declare visitorCompany?: string;
    declare purpose?: string;
    declare department?: string;
    declare hostName?: string;
    declare idProofType?: string;
    declare idNumber?: string;
    declare passType?: string;
    declare status?: 'IN' | 'OUT' | 'ACTIVE' | 'CHECKED_IN' | 'CHECKED_OUT' | 'BLACKLISTED';
    declare badgeId?: string;
    declare profilePhoto?: string;
    declare entryTime?: Date;
    declare exitTime?: Date;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
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
        validate: {
            len: [2, 100],
        },
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^[0-9]{10,15}$/,
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
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
        type: DataTypes.ENUM('AADHAR', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'OTHER'),
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
        type: DataTypes.ENUM('IN', 'OUT', 'ACTIVE', 'CHECKED_IN', 'CHECKED_OUT', 'BLACKLISTED'),
        allowNull: true,
        defaultValue: 'ACTIVE',
    },
    badgeId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePhoto: {
        type: DataTypes.BLOB('long'),
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
    modelName: 'Visitor',
    indexes: [
        { fields: ['status'] },
        { fields: ['mobile'] },
        { fields: ['email'] },
    ],
});

export default Visitor;
