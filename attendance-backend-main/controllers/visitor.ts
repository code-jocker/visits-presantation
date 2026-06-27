import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Tags, Response, SuccessResponse, Security, Res, TsoaResponse } from "tsoa";
import { ServiceResponse } from "../utils/serviceResponse";
import { asyncCatch } from "../middlewares/errorHandler";
import { buildVisitorSmsMessage, sendEasySendSms } from "../utils/easySendSms";
import { normalizeVisitorEmail, normalizeVisitorMobile } from "../utils/visitorNormalization";
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
    declare status?: "IN" | "OUT" | "ACTIVE" | "CHECKED_IN" | "CHECKED_OUT" | "BLACKLISTED";
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
    declare status?: "IN" | "OUT" | "ACTIVE" | "CHECKED_IN" | "CHECKED_OUT" | "BLACKLISTED";
    declare badgeId?: string;
    declare profilePhoto?: string;
    declare entryTime?: Date | null;
    declare exitTime?: Date | null;
}

export interface PublicCheckInRequest {
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
    visitorType?: string;
    date?: string;
    time?: string;
    [key: string]: any;
}

// SystemFeatureUpdateRequest: must match frontend payload exactly.
// Frontend sends: { featureKey, isEnabled }
export class SystemFeatureUpdateRequest {
    declare featureKey: string;
    declare isEnabled: boolean;
}



export interface CheckInRequest {
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
    [key: string]: any;
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
            mobile: normalizeVisitorMobile(request.mobile),
            email: normalizeVisitorEmail(request.email),
            status: request.status || "ACTIVE",
        });

        const smsResult = await sendEasySendSms({
            numbers: visitor.mobile,
            message: buildVisitorSmsMessage(visitor.toJSON()),
        });

        return ServiceResponse.success("Visitor created successfully", {
            ...visitor.toJSON(),
            sms: smsResult,
        }, 201);
    }

    @Post("/public-check-in")
    @SuccessResponse(200, "Visitor checked in successfully")
    @asyncCatch
    public async publicCheckIn(
        @Body() request: PublicCheckInRequest,
        @Res() res: TsoaResponse<200 | 400 | 403, ServiceResponse<any>>
    ): Promise<void> {
        const isDev = process.env.NODE_ENV === 'development';
        const [selfRegFeature] = await db.SystemFeature.findOrCreate({
            where: { featureKey: 'self_registration' },
            defaults: { featureKey: 'self_registration', isEnabled: true, description: 'default-enabled' },
        });
        if (!selfRegFeature.isEnabled) {
            res(403, ServiceResponse.failure("Self-registration is currently disabled. Please contact administrator.", null, 403));
            return;
        }

        const { visitor, department: reqDepartment } = request;

        const fullName = visitor?.fullName ? String(visitor.fullName).trim() : '';
        if (!fullName) {
            res(400, ServiceResponse.failure("Visitor fullName is required", null, 400));
            return;
        }

        // Normalize early so downstream logic & DB writes are consistent
        visitor.fullName = fullName;


        // Security: Check against watchlist/blacklisted visitors before allowing check-in
        const normalizedMobile = normalizeVisitorMobile(visitor.mobile);

        // Helpful debug to prevent "Internal Server Error" when DB rejects payload/enum.
        if (isDev) {
            console.log('[VisitorController.publicCheckIn] incoming payload:', {
                fullName: visitor?.fullName,
                mobile: visitor?.mobile,
                normalizedMobile,
                department: visitor?.department || reqDepartment,
                hasIdNumber: Boolean(visitor?.idNumber),
                verificationMode: request?.verificationMode,
                badgeType: request?.badgeType,
            });
        }

        const blacklistedExisting = normalizedMobile
            ? await db.Visitor.findOne({
                where: { mobile: normalizedMobile, status: 'BLACKLISTED' }
              })
            : null;
        if (blacklistedExisting) {
            res(403, ServiceResponse.failure("Access denied: Visitor is on the watchlist", null, 403));
            return;
        }


        // Duplicate check: Same phone within 24 hours
        if (normalizedMobile) {
            const recentDuplicate = await db.Visitor.findOne({
                where: {
                    mobile: normalizedMobile,
                    createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                }
            });
            if (recentDuplicate) {
                res(200, ServiceResponse.success("Welcome back! Existing badge restored", {
                    badgeId: recentDuplicate.badgeId,
                    visitorId: recentDuplicate.id,
                    isReturning: true
                }));
                return;
            }
        }

        visitor.mobile = normalizedMobile;

        // Prefer department from top-level request payload, then fallback to visitor.department.
        // This prevents 400s when frontend sends different shapes.
        const departmentRaw = reqDepartment ?? (visitor as any)?.department;
        const department =
            departmentRaw === undefined || departmentRaw === null ? '' : String(departmentRaw).trim();

        if (!department) {
            res(
                400,
                ServiceResponse.failure(
                    "Visitor department is required",
                    {
                        department: null,
                        received: {
                            visitorDepartment: (visitor as any)?.department,
                            topLevelDepartment: reqDepartment,
                            resolvedDepartment: department,
                        },
                    },
                    400
                )
            );
            return;
        }





        const badgeId = `V-${Date.now().toString().slice(-6)}`;

        const newVisitor = await db.Visitor.create({
            ...visitor,
            passType: request.visitorType,
            // DB enum mismatch can cause hard failures. Align with Visitor model values.
            status: "CHECKED_IN",
            badgeId,
            department,
            entryTime: new Date(),
        });

        const smsResult = await sendEasySendSms({
            numbers: newVisitor.mobile,
            message: buildVisitorSmsMessage(newVisitor.toJSON()),
        });

        if (visitor.hostName) {
            const hostUser = await db.User.findOne({ where: { fullName: visitor.hostName } });
            if (hostUser) {
                await db.Notification.create({
                    recipientId: hostUser.id,
                    recipientType: 'user',
                    title: 'New Visitor Check-in Request',
                    message: `${visitor.fullName} has checked in and selected you as host${visitor.purpose ? ` for "${visitor.purpose}"` : ''}${visitor.department ? ` in ${visitor.department}` : ''}. Please review and confirm availability.`,
                    type: 'checkin_pending',
                    relatedId: String(newVisitor.id),
                    relatedType: 'visitor',
                });
            }
        }

        res(200, ServiceResponse.success("Visitor checked in successfully", {
            badgeId: newVisitor.badgeId,
            visitorId: newVisitor.id,
            sms: smsResult,
        }));

    }

    @Post("/check-in")
    @SuccessResponse(200, "Visitor checked in successfully")
    @Security("jwt", ["visitor:create"])
    @asyncCatch
    public async checkIn(
        @Body() request: CheckInRequest,
        @Res() res: TsoaResponse<200 | 400 | 403, ServiceResponse<any>>
    ): Promise<void> {
        const isDev = process.env.NODE_ENV === 'development';
        const { visitor, department: reqDepartment } = request;

        const fullName = visitor?.fullName ? String(visitor.fullName).trim() : '';
        if (!fullName) {
            res(400, ServiceResponse.failure("Visitor fullName is required", null, 400));
            return;
        }

        // Normalize early so downstream logic & DB writes are consistent
        visitor.fullName = fullName;


        visitor.mobile = normalizeVisitorMobile(visitor.mobile);
        visitor.email = normalizeVisitorEmail(visitor.email);

        // Helpful server-side logging to identify 500 causes
        if (isDev) {
            console.log('[VisitorController.checkIn] incoming payload:', {
                fullName: visitor?.fullName,
                mobile: visitor?.mobile,
                department: visitor?.department || reqDepartment,
                appointmentId: request?.appointmentId,
                badgeType: request?.badgeType,
            });
        }

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

        const smsResult = await sendEasySendSms({
            numbers: newVisitor.mobile,
            message: buildVisitorSmsMessage(newVisitor.toJSON()),
        });

        res(200, ServiceResponse.success("Visitor checked in successfully", {
            badgeId: newVisitor.badgeId,
            visitorId: newVisitor.id,
            sms: smsResult,
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

    @Post("/public-check-out")
    @SuccessResponse(200, "Visitor checked out successfully")
    @asyncCatch
    public async publicCheckOut(
        @Body() request: {
            badgeId?: string;
        },
        @Res() res: TsoaResponse<200 | 400 | 403 | 404, ServiceResponse<any>>
    ): Promise<void> {
        const [selfCheckoutFeature] = await db.SystemFeature.findOrCreate({
            where: { featureKey: 'self_checkout' },
            defaults: { featureKey: 'self_checkout', isEnabled: true, description: 'default-enabled' },
        });
        if (!selfCheckoutFeature.isEnabled) {
            res(403, ServiceResponse.failure("Self-checkout is currently disabled. Please contact administrator.", null, 403));
            return;
        }

        const { badgeId } = request;

        if (!badgeId) {
            res(400, ServiceResponse.failure("Badge ID is required", null, 400));
            return;
        }

        const visitor = await db.Visitor.findOne({ where: { badgeId } });

        if (!visitor) {
            res(404, ServiceResponse.failure("Visitor not found - invalid badge ID", null, 404));
            return;
        }

        if (visitor.status === "CHECKED_OUT") {
            res(200, ServiceResponse.success("Visitor already checked out", {
                visitorId: visitor.id,
                badgeId: visitor.badgeId,
            }));
            return;
        }

        await visitor.update({
            status: "CHECKED_OUT",
            exitTime: new Date(),
        });

        res(200, ServiceResponse.success("Visitor checked out successfully", {
            visitorId: visitor.id,
            badgeId: visitor.badgeId,
            fullName: visitor.fullName,
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

    @Get("/system-features")
    @SuccessResponse(200, "System features retrieved")
    // Public endpoint: used by kiosk/self-checkout screens without staff JWT.
    @asyncCatch
    public async getSystemFeatures(): Promise<ServiceResponse<{ selfRegistrationEnabled: boolean; selfCheckoutEnabled: boolean }>> {


        const [selfRegistration] = await db.SystemFeature.findOrCreate({
            where: { featureKey: 'self_registration' },
            defaults: { featureKey: 'self_registration', isEnabled: true, description: 'default-enabled' },
        });
        const [selfCheckout] = await db.SystemFeature.findOrCreate({
            where: { featureKey: 'self_checkout' },
            defaults: { featureKey: 'self_checkout', isEnabled: true, description: 'default-enabled' },
        });

        if (!selfRegistration.isEnabled && !selfRegistration.description) {
            await selfRegistration.update({ isEnabled: true, description: 'default-enabled' });
        }
        if (!selfCheckout.isEnabled && !selfCheckout.description) {
            await selfCheckout.update({ isEnabled: true, description: 'default-enabled' });
        }

        return ServiceResponse.success("System features retrieved", {
            selfRegistrationEnabled: selfRegistration.isEnabled,
            selfCheckoutEnabled: selfCheckout.isEnabled,
        });
    }

    @Put("/system-features")
    @SuccessResponse(200, "System feature updated")
    @Security("jwt", ["setting:update"])
    @asyncCatch
    @Response<ServiceResponse<null>>(400, "Invalid request")
    public async updateSystemFeature(
        @Body() request: SystemFeatureUpdateRequest,
        @Res() res: TsoaResponse<200 | 400, ServiceResponse<any>>
    ): Promise<void> {
        const featureKey = request.featureKey;
        const isEnabled = request.isEnabled;

        if (typeof featureKey !== 'string' || featureKey.trim().length === 0) {
            res(400, ServiceResponse.failure(
                "featureKey must be a non-empty string",
                { received: request },
                400
            ));
            return;
        }

        if (typeof isEnabled !== 'boolean') {
            res(400, ServiceResponse.failure(
                "isEnabled must be a boolean",
                { received: request },
                400
            ));
            return;
        }

        const [feature] = await db.SystemFeature.findOrCreate({
            where: { featureKey },
            defaults: { featureKey, isEnabled },
        });

        await feature.update({
            isEnabled,
            description: isEnabled ? (feature.description || 'default-enabled') : 'disabled-by-admin',
        });
        res(200, ServiceResponse.success("System feature updated", feature));
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





