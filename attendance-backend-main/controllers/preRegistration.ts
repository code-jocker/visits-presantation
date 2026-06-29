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
    profilePhoto?: string;
}

export interface PreRegistrationResponse {
    id: string;
    visitorName: string;
    visitorPhone?: string;
    visitorEmail?: string;
    visitorCompany?: string;
    purpose: string;
    department?: string;
    hostName: string;
    appointmentDate: string;
    appointmentTime: string;
    timeDuration?: string;
    appointmentLocation?: string;
    status: string;
    visitorPhoto?: string;
    approvedAt?: string;
    approvedBy?: string;
    deniedAt?: string;
    deniedBy?: string;
    denialReason?: string;
    createdAt: string;
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

        return ServiceResponse.success(
            "Pre-registrations retrieved successfully",
            preRegs.map((pr: any) => ({
                id: pr.id,
                visitorName: pr.visitorName,
                visitorPhone: pr.visitorPhone,
                visitorEmail: pr.visitorEmail,
                visitorCompany: pr.visitorCompany,
                purpose: pr.purpose,
                department: pr.department,
                hostName: pr.hostName,
                appointmentDate: pr.appointmentDate,
                appointmentTime: pr.appointmentTime,
                timeDuration: pr.timeDuration,
                appointmentLocation: pr.appointmentLocation,
                status: pr.status,
                visitorPhoto: pr.visitorPhoto,
                approvedAt: pr.approvedAt ? String(pr.approvedAt) : undefined,
                approvedBy: pr.approvedBy,
                deniedAt: pr.deniedAt ? String(pr.deniedAt) : undefined,
                deniedBy: pr.deniedBy,
                denialReason: pr.denialReason,
                createdAt: pr.createdAt ? String(pr.createdAt) : String(pr.id),
            })) as any
        );
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

        if (!request.purpose?.trim()) {
            res(400, ServiceResponse.failure("Purpose is required", null, 400));
            return;
        }

        if (!request.hostName?.trim()) {
            res(400, ServiceResponse.failure("Host name is required", null, 400));
            return;
        }

        if (!request.department?.trim()) {
            res(400, ServiceResponse.failure("Department is required", null, 400));
            return;
        }

        if (!request.appointmentDate?.trim()) {
            res(400, ServiceResponse.failure("Appointment date is required", null, 400));
            return;
        }

        if (!request.appointmentTime?.trim()) {
            res(400, ServiceResponse.failure("Appointment time is required", null, 400));
            return;
        }

        const preReg = await PreRegistration.create({
            visitorName: request.fullName,
            visitorPhone: request.mobile,
            visitorEmail: request.email,
            visitorCompany: request.visitorCompany,
            purpose: request.purpose,
            department: request.department,
            hostName: request.hostName,
            appointmentDate: request.appointmentDate,
            appointmentTime: request.appointmentTime,
            timeDuration: request.timeDuration,
            appointmentLocation: request.appointmentLocation,
            visitorPhoto: request.profilePhoto,
            status: 'pending',
            createdBy: (res as any).locals?.user?.id ?? undefined,
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

        if (!request.purpose?.trim()) {
            res(400, ServiceResponse.failure("Purpose is required", null, 400));
            return;
        }

        if (!request.hostName?.trim()) {
            res(400, ServiceResponse.failure("Host name is required", null, 400));
            return;
        }

        if (!request.department?.trim()) {
            res(400, ServiceResponse.failure("Department is required", null, 400));
            return;
        }

        if (!request.appointmentDate?.trim()) {
            res(400, ServiceResponse.failure("Appointment date is required", null, 400));
            return;
        }

        if (!request.appointmentTime?.trim()) {
            res(400, ServiceResponse.failure("Appointment time is required", null, 400));
            return;
        }

        const preReg = await PreRegistration.create({
            visitorName: request.fullName,
            visitorPhone: request.mobile,
            visitorEmail: request.email,
            visitorCompany: request.visitorCompany,
            purpose: request.purpose,
            department: request.department,
            hostName: request.hostName,
            appointmentDate: request.appointmentDate,
            appointmentTime: request.appointmentTime,
            timeDuration: request.timeDuration,
            appointmentLocation: request.appointmentLocation,
            visitorPhoto: request.profilePhoto,
            status: 'pending',
        } as any);

        // Notify host about pre-registration request (use only allowed Notification.type/relatedType)
        const hostUser = await db.User.findOne({ where: { id: request.hostName } });
        if (hostUser) {
            await db.Notification.create({
                recipientId: hostUser.id,
                recipientType: 'user',
                title: 'Pre-Registration Request',
                message: `${request.fullName} has requested a visit${request.department ? ` to ${request.department}` : ''}${request.appointmentDate ? ` on ${request.appointmentDate}` : ''}. Please approve or deny.`,
                type: 'general',
                relatedId: String(preReg.id),
                relatedType: 'visitor',
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
            where: { id: preRegistrationId },
        });

        if (!preReg) {
            return ServiceResponse.failure("Invalid pre-registration ID", null, 404);
        }

        return ServiceResponse.success("Pre-registration validated", {
            id: preReg.id,
            visitorName: preReg.visitorName,
            visitorPhone: preReg.visitorPhone,
            visitorEmail: preReg.visitorEmail,
            visitorCompany: preReg.visitorCompany,
            purpose: preReg.purpose,
            department: preReg.department,
            hostName: preReg.hostName,
            appointmentDate: preReg.appointmentDate,
            appointmentTime: preReg.appointmentTime,
            timeDuration: preReg.timeDuration,
            appointmentLocation: preReg.appointmentLocation,
            status: preReg.status,
            visitorPhoto: preReg.visitorPhoto,
            approvedAt: preReg.approvedAt ? String(preReg.approvedAt) : undefined,
            approvedBy: preReg.approvedBy,
            deniedAt: preReg.deniedAt ? String(preReg.deniedAt) : undefined,
            deniedBy: preReg.deniedBy,
            denialReason: preReg.denialReason,
            createdAt: preReg.createdAt ? String(preReg.createdAt) : String(preReg.id),
        } as any);
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
        });

        // Notify visitor
        if (preReg.visitorPhone || preReg.visitorEmail) {
            await db.Notification.create({
                recipientId: preReg.createdBy,
                recipientType: 'user',
                title: 'Pre-registration approved',
                message: `Your pre-registration has been approved. ID: ${preReg.id}`,
                type: 'appointment_confirmed',
                relatedId: String(preReg.id),
                relatedType: 'appointment',
            });
        }

        return ServiceResponse.success("Pre-registration approved", {
            id: preReg.id,
            visitorName: preReg.visitorName,
            visitorPhone: preReg.visitorPhone,
            visitorEmail: preReg.visitorEmail,
            visitorCompany: preReg.visitorCompany,
            purpose: preReg.purpose,
            department: preReg.department,
            hostName: preReg.hostName,
            appointmentDate: preReg.appointmentDate,
            appointmentTime: preReg.appointmentTime,
            timeDuration: preReg.timeDuration,
            appointmentLocation: preReg.appointmentLocation,
            status: preReg.status,
            visitorPhoto: preReg.visitorPhoto,
            approvedAt: preReg.approvedAt ? String(preReg.approvedAt) : undefined,
            approvedBy: preReg.approvedBy,
            deniedAt: preReg.deniedAt ? String(preReg.deniedAt) : undefined,
            deniedBy: preReg.deniedBy,
            denialReason: preReg.denialReason,
            createdAt: preReg.createdAt ? String(preReg.createdAt) : String(preReg.id),
        } as any);
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
            status: 'denied',
            denialReason: body.rejectionReason,
            deniedBy: body.rejectedBy,
            deniedAt: new Date(),
        });

        return ServiceResponse.success("Pre-registration denied", {
            id: preReg.id,
            visitorName: preReg.visitorName,
            visitorPhone: preReg.visitorPhone,
            visitorEmail: preReg.visitorEmail,
            visitorCompany: preReg.visitorCompany,
            purpose: preReg.purpose,
            department: preReg.department,
            hostName: preReg.hostName,
            appointmentDate: preReg.appointmentDate,
            appointmentTime: preReg.appointmentTime,
            timeDuration: preReg.timeDuration,
            appointmentLocation: preReg.appointmentLocation,
            status: preReg.status,
            visitorPhoto: preReg.visitorPhoto,
            approvedAt: preReg.approvedAt ? String(preReg.approvedAt) : undefined,
            approvedBy: preReg.approvedBy,
            deniedAt: preReg.deniedAt ? String(preReg.deniedAt) : undefined,
            deniedBy: preReg.deniedBy,
            denialReason: preReg.denialReason,
            createdAt: preReg.createdAt ? String(preReg.createdAt) : String(preReg.id),
        } as any);
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