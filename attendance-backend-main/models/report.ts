import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";

interface IReportAttributes {
    id?: string;
    filename: string;
    format: 'excel' | 'excel_v2' | 'csv' | 'word' | 'pdf' | 'html';
    visitorCount: number;
    firstVisitorId?: string;
    lastVisitorId?: string;
    generatedAt: Date;
    generatedBy?: string;
    visitorsDeleted: number;
    department?: string;
    downloadUrl?: string;
}

class Report extends Model<IReportAttributes, Optional<IReportAttributes, 'id' | 'generatedAt'>> implements IReportAttributes {
    declare id?: string;
    declare filename: string;
    declare format: 'excel' | 'excel_v2' | 'csv' | 'word' | 'pdf' | 'html';
    declare visitorCount: number;
    declare firstVisitorId?: string;
    declare lastVisitorId?: string;
    declare generatedAt: Date;
    declare generatedBy?: string;
    declare visitorsDeleted: number;
    declare department?: string;
    declare downloadUrl?: string;
}


Report.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    format: {
        type: DataTypes.ENUM('excel', 'excel_v2', 'csv', 'word', 'pdf', 'html'),
        allowNull: false,
    },
    visitorCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    firstVisitorId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    lastVisitorId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    generatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    generatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    visitorsDeleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    downloadUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'reports',
    sequelize,
    timestamps: true,
    modelName: 'Report',
});

export default Report;