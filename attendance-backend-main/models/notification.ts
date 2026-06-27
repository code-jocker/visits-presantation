import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface INotificationAttributes {
    id: string;
    recipientId: string;
    recipientType: "user" | "visitor";
    title: string;
    message: string;
    type: "appointment_request" | "appointment_confirmed" | "appointment_canceled" | "checkin_pending" | "checkin_approved" | "general";
    relatedId?: string;
    relatedType?: "appointment" | "visitor" | "visitor_badge";
    isRead: boolean;
    readAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface INotificationCreationAttributes extends Optional<INotificationAttributes, "id" | "isRead" | "readAt" | "createdAt" | "updatedAt" | "relatedId" | "relatedType"> {}

class Notification extends Model<INotificationAttributes, INotificationCreationAttributes> implements INotificationAttributes {
    declare id: string;
    declare recipientId: string;
    declare recipientType: "user" | "visitor";
    declare title: string;
    declare message: string;
    declare type: "appointment_request" | "appointment_confirmed" | "appointment_canceled" | "checkin_pending" | "checkin_approved" | "general";
    declare relatedId?: string;
    declare relatedType?: "appointment" | "visitor" | "visitor_badge";
    declare isRead: boolean;
    declare readAt?: Date;
    declare readonly createdAt?: Date;
    declare readonly updatedAt?: Date;
}

Notification.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    recipientId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    recipientType: {
        type: DataTypes.ENUM("user", "visitor"),
        allowNull: false,
        defaultValue: "user",
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(
            "appointment_request",
            "appointment_confirmed",
            "appointment_canceled",
            "checkin_pending",
            "checkin_approved",
            "general"
        ),
        allowNull: false,
        defaultValue: "general",
    },
    relatedId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    relatedType: {
        type: DataTypes.ENUM("appointment", "visitor", "visitor_badge"),
        allowNull: true,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "notifications",
    sequelize,
    timestamps: true,
    modelName: "Notification",
    indexes: [
        { fields: ["recipientId"] },
        { fields: ["isRead"] },
        { fields: ["type"] },
    ],
});

export default Notification;
