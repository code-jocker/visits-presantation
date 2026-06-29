import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface PreRegistrationAttributes {
    id: string;
    visitorName: string;
    visitorEmail?: string;
    visitorPhone?: string;
    visitorCompany?: string;
    visitorPhoto?: string;
    purpose: string;
    hostName: string;
    hostEmail?: string;
    hostPhone?: string;
    department: string;
    appointmentDate: string;
    appointmentTime: string;
    timeDuration?: string;
    appointmentLocation?: string;
    status: 'pending' | 'approved' | 'denied' | 'completed' | 'canceled';
    approvedBy?: string;
    approvedAt?: Date;
    deniedBy?: string;
    deniedAt?: Date;
    denialReason?: string;
    note?: string;
    createdBy: string;
    relatedAppointmentId?: string;
}

interface PreRegistrationCreationAttributes extends Optional<PreRegistrationAttributes, "id" | "status" | "approvedBy" | "approvedAt" | "deniedBy" | "deniedAt" | "denialReason" | "note" | "relatedAppointmentId"> {}

class PreRegistration extends Model<PreRegistrationAttributes, PreRegistrationCreationAttributes> implements PreRegistrationAttributes {
    declare id: string;
    declare visitorName: string;
    declare visitorEmail?: string;
    declare visitorPhone?: string;
    declare visitorCompany?: string;
    declare visitorPhoto?: string;
    declare purpose: string;
    declare hostName: string;
    declare hostEmail?: string;
    declare hostPhone?: string;
    declare department: string;
    declare appointmentDate: string;
    declare appointmentTime: string;
    declare timeDuration?: string;
    declare appointmentLocation?: string;
    declare status: 'pending' | 'approved' | 'denied' | 'completed' | 'canceled';
    declare approvedBy?: string;
    declare approvedAt?: Date;
    declare deniedBy?: string;
    declare deniedAt?: Date;
    declare denialReason?: string;
    declare note?: string;
    declare createdBy: string;
    declare relatedAppointmentId?: string;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

PreRegistration.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    visitorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    visitorEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmailOrNull(value: string | null) {
                if (value !== null && value !== undefined && value !== '') {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        throw new Error('Must be a valid email address');
                    }
                }
            }
        }
    },
    visitorPhone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    visitorCompany: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    visitorPhoto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hostName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hostEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hostPhone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    appointmentDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    appointmentTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timeDuration: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    appointmentLocation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'denied', 'completed', 'canceled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deniedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    deniedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    denialReason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    relatedAppointmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'appointments',
            key: 'id'
        }
    },
}, {
    tableName: 'pre_registrations',
    sequelize,
    timestamps: true,
    modelName: 'PreRegistration',
    indexes: [
        { fields: ["createdBy"] },
        { fields: ["status"] },
        { fields: ["hostName"] },
    ],
});

export default PreRegistration;
