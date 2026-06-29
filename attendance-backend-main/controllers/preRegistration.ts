import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags, SuccessResponse, Res, TsoaResponse } from "tsoa";
import { ServiceResponse } from "../utils/serviceResponse";
import { asyncCatch } from "../middlewares/errorHandler";
import { Op } from "sequelize";
import db from "../models";
import PreRegistration from "../models/preRegistration";

export interface PreRegistrationCreateRequest {
    fullName: string;
    mobile?: string;
    email?: string;
    visitorCompany?: string;
    purpose?: string;
    department?: string;
    hostName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    timeDuration?: string;
    appointmentLocation?: string;
    idProofType?: string;
    idNumber?: string;
    profilePhoto?: string;
}

export interface PreRegistrationResponse {
    id: string;
    preRegistrationId: string;
    fullName: string;
    mobile?: string;
    email?: string;
    visitorCompany?: string;
    purpose?: string;
    department?: string;
    hostName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    timeDuration?: string;
    appointmentLocation?: string;
    status: string;
    profilePhoto?: string;
    qrCode?: string;
    expiresAt?: string;
    approvedAt?: string;
    approvedBy?: string;
    createdAt: string;
}

function generatePreRegistrationId(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PR-${timestamp}-${random}`;
}

function generateQRCode(preRegistrationId: string, fullName: string): string {
    const payload = {
        type: 'pre-registration',
        id: preRegistrationId,
        name: fullName,
        timestamp: Date.now(),
    };
    return btoa(JSON.stringify(payload));
}

@Route("api/pre-registrations")
@Tags("PreRegistrations")
export class PreRegistrationController {
    @Get("/")
    @SuccessResponse(200, "Pre-registrations retrieved successfully")
    @Security("jwt", ["preregistration:read"])
    @asyncCatch
    public async getAll(
        @Query() status?: string,
        @Query() date?: string,
        @Query() limit?: number
    ): Promise<ServiceResponse<PreRegistrationResponse[]>> {
        const where: any = {};
        if (status) where.status = status;
        if (date) where.appointmentDate = date;

        const preRegs = await PreRegistration.findAll({
            where,
            order: [["createdAt", "DESC"]],
            limit: limit || 100,
        });

        return ServiceResponse.success("Pre-registrations retrieved successfully", preRegs.map(pr => pr.toJSON()));
    }

    @Post("/")
    @SuccessResponse(201, "Pre-registration created successfully")
    @Security("jwt", ["preregistration:create"])
    @asyncCatch
    public async create(
        @Body() request: PreRegistrationCreateRequest,
        @Res() res: TsoaResponse<201 | 400, ServiceResponse<PreRegistrationResponse | null>>
    ): Promise<void> {
        if (!request.fullName?.trim()) {
            res(400, ServiceResponse.failure("Full name is required", null, 400));
            return;
        }

        const preRegistrationId = generatePreRegistrationId();
        const qrCode = generateQRCode(preRegistrationId, request.fullName);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        const preReg = await PreRegistration.create({
            ...request,
            preRegistrationId,
            qrCode,
            expiresAt,
            status: 'pending',
        } as any);

        res(201, ServiceResponse.success("Pre-registration created successfully", preReg.toJSON() as any, 201));
    }

    @Post("/public")
    @SuccessResponse(201, "Pre-registration created successfully")
    @asyncCatch
    public async publicCreate(
        @Body() request: PreRegistrationCreateRequest,
        @Res() res: TsoaResponse<201 | 400, ServiceResponse<PreRegistrationResponse | null>>
    ): Promise<void> {
        if (!request.fullName?.trim()) {
            res(400, ServiceResponse.failure("Full name is required", null, 400));
            return;
        }

        if (!request.hostName?.trim()) {
            res(400, ServiceResponse.failure("Host name is required", null, 400));
            return;
        }

        const preRegistrationId = generatePreRegistrationId();
        const qrCode = generateQRCode(preRegistrationId, request.fullName);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        const preReg = await PreRegistration.create({
            ...request,
            preRegistrationId,
            qrCode,
            expiresAt,
            status: 'pending',
        } as any);

        // Notify host about pre-registration request
        const hostUser = await db.User.findOne({ where: { fullName: request.hostName } });
        if (hostUser) {
            await db.Notification.create({
                recipientId: hostUser.id,
                recipientType: 'user',
                title: 'Pre-Registration Request',
                message: `${request.fullName} has requested a visit${request.department ? ` to ${request.department}` : ''}${request.appointmentDate ? ` on ${request.appointmentDate}` : ''}. Please approve or deny.`,
                type: 'preregistration_request',
                relatedId: String(preReg.id),
                relatedType: 'pre_registration',
            });
        }

        res(201, ServiceResponse.success("Pre-registration created successfully", preReg.toJSON() as any, 201));
    }

    @Get("/:id")
    @SuccessResponse(200, "Pre-registration retrieved successfully")
    @Security("jwt", ["preregistration:read"])
    @asyncCatch
    public async getById(@Path() id: string): Promise<ServiceResponse<PreRegistrationResponse | null>> {
        const preReg = await PreRegistration.findByPk(id);
        if (!preReg) {
            return ServiceResponse.failure("Pre-registration not found", null, 404);
        }
        return ServiceResponse.success("Pre-registration retrieved successfully", preReg.toJSON() as any);
    }

    @Get("/validate/:preRegistrationId")
    @SuccessResponse(200, "Pre-registration validated")
    @asyncCatch
    public async validate(@Path() preRegistrationId: string): Promise<ServiceResponse<PreRegistrationResponse | null>> {
        const preReg = await PreRegistration.findOne({
            where: { preRegistrationId },
        });

        if (!preReg) {
            return ServiceResponse.failure("Invalid pre-registration ID", null, 404);
        }

        // Check expiration
        if (preReg.expiresAt && new Date(preReg.expiresAt) < new Date()) {
            return ServiceResponse.failure("Pre-registration has expired", null, 400);
        }

        return ServiceResponse.success("Pre-registration validated", preReg.toJSON() as any);
    }

    @Put("/:id/approve")
    @SuccessResponse(200, "Pre-registration approved")
    @Security("jwt", ["preregistration:update"])
    @asyncCatch
    public async approve(
        @Path() id: string,
        @Body() body: { approvedBy?: string }
    ): Promise<ServiceResponse<PreRegistrationResponse | null>> {
        const preReg = await PreRegistration.findByPk(id);
        if (!preReg) {
            return ServiceResponse.failure("Pre-registration not found", null, 404);
        }

        await preReg.update({
            status: 'approved',
            approvedAt: new Date(),
            approvedBy: body.approvedBy,
            hostResponse: 'approved',
        });

        // Notify visitor (if email/mobile exists)
        // This would trigger an email/SMS with the QR code or calendar invite
        const visitor = await db.Visitor.findOne({ where: { mobile: preReg.mobile } });
        if (visitor) {
            await db.Notification.create({
                recipientId: preReg.mobile || '',
                recipientType: 'visitor',
                title: 'Visit Approved',
                message: `Your visit request has been approved. Pre-registration ID: ${preReg.preRegistrationId}`,
                type: 'visit_approved',
                relatedId: String(preReg.id),
                relatedType: 'pre_registration',
            });
        }

        return ServiceResponse.success("Pre-registration approved", preReg.toJSON() as any);
    }

    @Put("/:id/deny")
    @SuccessResponse(200, "Pre-registration denied")
    @Security("jwt", ["preregistration:update"])
    @asyncCatch
    public async deny(
        @Path() id: string,
        @Body() body: { rejectionReason?: string; rejectedBy?: string }
    ): Promise<ServiceResponse<PreRegistrationResponse | null>> {
        const preReg = await PreRegistration.findByPk(id);
        if (!preReg) {
            return ServiceResponse.failure("Pre-registration not found", null, 404);
        }

        await preReg.update({
            status: 'rejected',
            rejectionReason: body.rejectionReason,
            approvedBy: body.rejectedBy,
            hostResponse: 'denied',
        });

        return ServiceResponse.success("Pre-registration denied", preReg.toJSON() as any);
    }

    @Delete("/:id")
    @SuccessResponse(200, "Pre-registration deleted")
    @Security("jwt", ["preregistration:delete"])
    @asyncCatch
    public async delete(@Path() id: string): Promise<ServiceResponse<null>> {
        const preReg = await PreRegistration.findByPk(id);
        if (!preReg) {
            return ServiceResponse.failure("Pre-registration not found", null, 404);
        }
        await preReg.destroy();
        return ServiceResponse.success("Pre-registration deleted", null);
    }
}