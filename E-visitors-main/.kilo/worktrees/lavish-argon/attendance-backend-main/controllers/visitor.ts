import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Tags, Response, SuccessResponse, Security, Res, TsoaResponse } from "tsoa";
import { ServiceResponse } from "../utils/serviceResponse";
import { asyncCatch } from "../middlewares/errorHandler";
import db from "../models";
import { Op } from "sequelize";

export class VisitorCreateAttributes {
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
    declare status?: "IN" | "OUT" | "ACTIVE" | "CHECKED_IN" | "CHECKED_OUT";
    declare badgeId?: string;
    declare profilePhoto?: string;
    declare entryTime?: Date;
    declare exitTime?: Date;
}

export class VisitorUpdateAttributes {
    declare fullName?: string;
    declare mobile?: string;
    declare email?: string;
    declare visitorCompany?: string;
    declare purpose?: string;
    declare department?: string;
    declare hostName?: string;
    declare idProofType?: string;
    declare idNumber?: string;
    declare passType?: string;
    declare status?: "IN" | "OUT" | "ACTIVE" | "CHECKED_IN" | "CHECKED_OUT";
    declare badgeId?: string;
    declare profilePhoto?: string;
    declare entryTime?: Date | null;
    declare exitTime?: Date | null;
}

@Route("api/visitors")
@Tags("Visitors")
export class VisitorController {
    @Get("/")
    @SuccessResponse(200, "Visitors retrieved successfully")
    @Security("jwt", ["visitor:read"])
    @asyncCatch
    public async getAllVisitors(
        @Query() limit?: number,
        @Query() query?: string,
        @Query() status?: string,
        @Query() department?: string
    ): Promise<ServiceResponse<any[]>> {
        const where: any = {};

        if (status) where.status = status;
        if (department) where.department = { [Op.like]: `%${department}%` };
        if (query) {
            where[Op.or] = [
                { fullName: { [Op.like]: `%${query}%` } },
                { mobile: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
                { badgeId: { [Op.like]: `%${query}%` } },
            ];
        }

        const visitors = await db.Visitor.findAll({
            where,
            order: [["createdAt", "DESC"]],
            limit: limit || 100,
        });

        return ServiceResponse.success("Visitors retrieved successfully", visitors.map(v => v.toJSON()));
    }

    @Get("/recent-taps")
    @SuccessResponse(200, "Recent taps retrieved successfully")
    @Security("jwt", ["visitor:read"])
    @asyncCatch
    public async getRecentTaps(
        @Query() department?: string,
        @Query() query?: string,
        @Query() searchType?: "name" | "phone" | "voice",
        @Query() limit?: number,
        @Res() res?: TsoaResponse<200, ServiceResponse<any[]>>
    ): Promise<ServiceResponse<any[]>> {
        const where: any = {};

        if (department) {
            where.department = { [Op.like]: `%${department}%` };
        }

        if (query && searchType) {
            if (searchType === "name") {
                where.fullName = { [Op.like]: `%${query}%` };
            } else if (searchType === "phone") {
                where.mobile = { [Op.like]: `%${query}%` };
            }
        }

        const visitors = await db.Visitor.findAll({
            where,
            order: [["createdAt", "DESC"]],
            limit: limit || 20,
        });

        const recentTaps = visitors.map(v => ({
            id: v.id,
            visitorName: v.fullName,
            documentType: v.idProofType,
            phoneNumber: v.mobile,
            entryTime: v.entryTime,
            exitTime: v.exitTime,
            department: v.department,
        }));

        return ServiceResponse.success("Recent taps retrieved successfully", recentTaps);
    }

    @Get("/search")
    @SuccessResponse(200, "Visitors searched successfully")
    @Security("jwt", ["visitor:read"])
    @asyncCatch
    public async searchVisitors(
        @Query() query?: string,
        @Query() searchType: "name" | "phone" | "voice" = "name",
        @Query() department?: string,
        @Query() limit?: number,
        @Res() res?: TsoaResponse<200, ServiceResponse<any[]>>
    ): Promise<ServiceResponse<any[]>> {
        const where: any = {};

        if (department) {
            where.department = { [Op.like]: `%${department}%` };
        }

        if (query) {
            if (searchType === "name") {
                where.fullName = { [Op.like]: `%${query}%` };
            } else if (searchType === "phone") {
                where.mobile = { [Op.like]: `%${query}%` };
            }
        }

        const visitors = await db.Visitor.findAll({
            where,
            order: [["createdAt", "DESC"]],
            limit: limit || 20,
        });

        const results = visitors.map(v => ({
            id: v.id,
            fullName: v.fullName,
            mobile: v.mobile,
            email: v.email,
            visitorCompany: v.visitorCompany,
            purpose: v.purpose,
            department: v.department,
            hostName: v.hostName,
            documentType: v.idProofType,
            entryTime: v.entryTime,
            exitTime: v.exitTime,
            badgeId: v.badgeId,
            status: v.status,
        }));

        return ServiceResponse.success("Visitors searched successfully", results);
    }

    @Post("/")
    @SuccessResponse(201, "Visitor created successfully")
    @Security("jwt", ["visitor:create"])
    @asyncCatch
    @Response<ServiceResponse<null>>(400, "Visitor fullName is required")
    public async createVisitor(@Body() request: VisitorCreateAttributes): Promise<ServiceResponse<any | null>> {
        if (!request.fullName?.trim()) {
            return ServiceResponse.failure("Visitor fullName is required", null, 400);
        }

        const visitor = await db.Visitor.create({
            ...request,
            mobile: request.mobile ? String(request.mobile).replace(/\D/g, "") : request.mobile,
            status: request.status || "ACTIVE",
        });

        return ServiceResponse.success("Visitor created successfully", visitor.toJSON(), 201);
    }

    @Post("/public-check-in")
    @SuccessResponse(200, "Visitor checked in successfully")
    @asyncCatch
    public async publicCheckIn(
        @Body() request: {
            visitor: {
                fullName: string;
                mobile?: string;
                email?: string;
                visitorCompany?: string;
                purpose?: string;
                department?: string;
                hostName?: string;
                idProofType?: string;
                idNumber?: string;
                profilePhoto?: string;
            };
            verificationMode?: string;
            department?: string;
            badgeType?: "QR" | "RFID";
        },
        @Res() res: TsoaResponse<200 | 400, ServiceResponse<any>>
    ): Promise<void> {
        const { visitor, department: reqDepartment } = request;

        if (!visitor?.fullName) {
            res(400, ServiceResponse.failure("Visitor fullName is required", null, 400));
            return;
        }

        if (visitor.mobile) {
            visitor.mobile = String(visitor.mobile).replace(/\D/g, '');
        }

        const department = visitor.department || reqDepartment;
        if (!department) {
            res(400, ServiceResponse.failure("Visitor department is required", null, 400));
            return;
        }

        const badgeId = `V-${Date.now().toString().slice(-6)}`;

        const newVisitor = await db.Visitor.create({
            ...visitor,
            status: "CHECKED_IN",
            badgeId,
            department,
            entryTime: new Date(),
        });

        res(200, ServiceResponse.success("Visitor checked in successfully", {
            badgeId: newVisitor.badgeId,
            visitorId: newVisitor.id,
        }));
    }

    @Post("/check-in")
    @SuccessResponse(200, "Visitor checked in successfully")
    @Security("jwt", ["visitor:create"])
    @asyncCatch
    public async checkIn(
        @Body() request: {
            visitor: {
                fullName: string;
                mobile?: string;
                email?: string;
                visitorCompany?: string;
                purpose?: string;
                department?: string;
                hostName?: string;
                idProofType?: string;
                idNumber?: string;
            };
            verificationMode?: string;
            appointmentId?: string;
            department?: string;
            badgeType?: "QR" | "RFID";
        },
        @Res() res: TsoaResponse<200 | 400, ServiceResponse<any>>
    ): Promise<void> {
        const { visitor, department: reqDepartment } = request;

        if (!visitor?.fullName) {
            res(400, ServiceResponse.failure("Visitor fullName is required", null, 400));
            return;
        }

        // Normalize phone to digits-only to match database expectations/validation
        if (visitor.mobile) {
            visitor.mobile = String(visitor.mobile).replace(/\D/g, '');
        }

        // Helpful server-side logging to identify 500 causes
        console.log('[VisitorController.checkIn] incoming payload:', {
            fullName: visitor?.fullName,
            mobile: visitor?.mobile,
            department: visitor?.department || reqDepartment,
            appointmentId: request?.appointmentId,
            badgeType: request?.badgeType,
        });

        const badgeId = `V-${Date.now().toString().slice(-6)}`;

        const department = visitor.department || reqDepartment;
        if (!department) {
            res(400, ServiceResponse.failure("Visitor department is required", { department: null }, 400));
            return;
        }

        const newVisitor = await db.Visitor.create({
            ...visitor,
            // DB enum mismatch can cause hard failures. Align with Visitor model values.
            status: "CHECKED_IN",
            badgeId,
            department,
            entryTime: new Date(),
        });

        res(200, ServiceResponse.success("Visitor checked in successfully", {
            badgeId: newVisitor.badgeId,
            visitorId: newVisitor.id,
        }));
    }

    @Post("/check-out")
    @SuccessResponse(200, "Visitor checked out successfully")
    @Security("jwt", ["visitor:update"])
    @asyncCatch
    public async checkOut(
        @Body() request: {
            visitorId?: string;
            badgeId?: string;
        },
        @Res() res: TsoaResponse<200 | 404, ServiceResponse<any>>
    ): Promise<void> {
        const { visitorId, badgeId } = request;

        let visitor: any;
        if (visitorId) {
            visitor = await db.Visitor.findByPk(visitorId);
        } else if (badgeId) {
            visitor = await db.Visitor.findOne({ where: { badgeId } });
        }

        if (!visitor) {
            res(404, ServiceResponse.failure("Visitor not found", null, 404));
            return;
        }

        await visitor.update({
            status: "CHECKED_OUT",
            exitTime: new Date(),
        });

        res(200, ServiceResponse.success("Visitor checked out successfully", {
            visitorId: visitor.id,
            badgeId: visitor.badgeId,
        }));
    }

    @Get("/{visitorId}")
    @SuccessResponse(200, "Visitor retrieved successfully")
    @Security("jwt", ["visitor:read"])
    @asyncCatch
    @Response<ServiceResponse<null>>(404, "Visitor not found")
    public async getVisitorById(@Path() visitorId: string): Promise<ServiceResponse<any | null>> {
        const visitor = await db.Visitor.findByPk(visitorId);
        if (!visitor) {
            return ServiceResponse.failure("Visitor not found", null, 404);
        }

        return ServiceResponse.success("Visitor retrieved successfully", visitor.toJSON());
    }

    @Put("/{visitorId}")
    @SuccessResponse(200, "Visitor updated successfully")
    @Security("jwt", ["visitor:update"])
    @asyncCatch
    @Response<ServiceResponse<null>>(404, "Visitor not found")
    public async updateVisitor(
        @Path() visitorId: string,
        @Body() request: VisitorUpdateAttributes
    ): Promise<ServiceResponse<any | null>> {
        const visitor = await db.Visitor.findByPk(visitorId);
        if (!visitor) {
            return ServiceResponse.failure("Visitor not found", null, 404);
        }

        const updateData: any = {
            ...request,
            mobile: request.mobile ? String(request.mobile).replace(/\D/g, "") : request.mobile,
        };

        await visitor.update(updateData);
        return ServiceResponse.success("Visitor updated successfully", visitor.toJSON());
    }

    @Delete("/{visitorId}")
    @SuccessResponse(200, "Visitor deleted successfully")
    @Security("jwt", ["visitor:delete"])
    @asyncCatch
    @Response<ServiceResponse<null>>(404, "Visitor not found")
    public async deleteVisitor(@Path() visitorId: string): Promise<ServiceResponse<null>> {
        const visitor = await db.Visitor.findByPk(visitorId);
        if (!visitor) {
            return ServiceResponse.failure("Visitor not found", null, 404);
        }

        await visitor.destroy();
        return ServiceResponse.success("Visitor deleted successfully", null);
    }
}
