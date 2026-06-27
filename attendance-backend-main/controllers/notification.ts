import { ServiceResponse } from '../utils/serviceResponse';
import { asyncCatch } from '../middlewares/errorHandler';
import { Op } from 'sequelize';
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags } from 'tsoa';
import Notification from '../models/notification';
import db from '../models';

export interface NotificationResponse {
    id: string;
    recipientId: string;
    recipientType: 'user' | 'visitor';
    title: string;
    message: string;
    type: string;
    relatedId?: string;
    relatedType?: string;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
    updatedAt: string;
}

const mapNotificationToResponse = (n: any): NotificationResponse => {
    const readAt = n?.readAt;
    const createdAt = n?.createdAt;
    const updatedAt = n?.updatedAt;

    return {
        id: String(n?.id ?? ''),
        recipientId: String(n?.recipientId ?? ''),
        recipientType: n?.recipientType,
        title: String(n?.title ?? ''),
        message: String(n?.message ?? ''),
        type: String(n?.type ?? ''),
        relatedId: n?.relatedId != null ? String(n.relatedId) : undefined,
        relatedType: n?.relatedType != null ? String(n.relatedType) : undefined,
        isRead: Boolean(n?.isRead),
            readAt: readAt ? (typeof readAt === 'string' ? new Date(readAt).toISOString() : readAt.toISOString()) : undefined,

        createdAt: createdAt ? new Date(createdAt).toISOString() : new Date(0).toISOString(),
        updatedAt: updatedAt ? new Date(updatedAt).toISOString() : new Date(0).toISOString(),
    };
};


@Route('api/notifications')
@Tags('Notifications')
export class NotificationController extends Controller {
    @Security('jwt', ['notification:read'])
    @Get('/')
    @asyncCatch
    public async getMyNotifications(
        @Query() isRead?: string,
        @Query() limit?: string,
        @Query() offset?: string
    ): Promise<ServiceResponse<NotificationResponse[]>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }




        const where: any = { recipientId: user.id, recipientType: 'user' };
        if (isRead !== undefined) {
            where.isRead = isRead === 'true';
        }

        const notifications = await Notification.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: limit ? parseInt(limit, 10) : 50,
            offset: offset ? parseInt(offset, 10) : 0,
        });

        return ServiceResponse.success(
            'Notifications retrieved successfully',
            notifications.map(n => mapNotificationToResponse(n.toJSON()))
        );

    }


    @Security('jwt', ['notification:read'])
    @Get('/unread-count')
    @asyncCatch
    public async getUnreadCount(): Promise<ServiceResponse<{ count: number }>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', { count: 0 }, 401);
        }


        const count = await Notification.count({
            where: { recipientId: user.id, recipientType: 'user', isRead: false },
        });

        return ServiceResponse.success('Unread count retrieved successfully', { count });
    }

    @Security('jwt', ['notification:read'])
    @Get('/:id')
    @asyncCatch
    public async getNotificationById(@Path() id: string): Promise<ServiceResponse<NotificationResponse | null>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null, 401);
        }

        const notification = await Notification.findOne({
            where: { id, recipientId: user.id, recipientType: 'user' },
        });

        if (!notification) {
            return ServiceResponse.failure('Notification not found', null, 404);
        }

        return ServiceResponse.success(
            'Notification retrieved successfully',
            mapNotificationToResponse(notification.toJSON())
        );
    }

    @Security('jwt', ['notification:update'])
    @Put('/:id/read')
    @asyncCatch
    public async markAsRead(@Path() id: string): Promise<ServiceResponse<NotificationResponse | null>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null, 401);
        }

        const notification = await Notification.findOne({
            where: { id, recipientId: user.id, recipientType: 'user' },
        });

        if (!notification) {
            return ServiceResponse.failure('Notification not found', null, 404);
        }

        await notification.update({
            isRead: true,
            // readAt is a DATE column in Sequelize model; use Date instance.
            readAt: new Date() as any,
        });


        return ServiceResponse.success(
            'Notification marked as read',
            mapNotificationToResponse(notification.toJSON())
        );

    }

    @Security('jwt', ['notification:update'])
    @Put('/read-all')
    @asyncCatch
    public async markAllAsRead(): Promise<ServiceResponse<null>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null as any, 401);
        }

        await Notification.update(
            { isRead: true, readAt: new Date() },
            { where: { recipientId: user.id, recipientType: 'user', isRead: false } }
        );

        return ServiceResponse.success('All notifications marked as read', null as any);
    }


    @Security('jwt', ['appointment:read'])
    @Post('/appointment-request')
    @asyncCatch
    public async notifyHostAppointmentRequest(@Body() body: {
        hostName: string;
        visitorName: string;
        appointmentId?: string;
        department?: string;
        appointmentDate?: string;
        appointmentTime?: string;
    }): Promise<ServiceResponse<NotificationResponse | null>> {
        const host = await db.User.findOne({ where: { fullName: body.hostName } });
        if (!host) {
            return ServiceResponse.failure('Host not found', null, 404);
        }

        const title = 'New Appointment Request';
        const message = `${body.visitorName} has requested a meeting with you${body.department ? ` in ${body.department}` : ''}${body.appointmentDate ? ` on ${body.appointmentDate}` : ''}${body.appointmentTime ? ` at ${body.appointmentTime}` : ''}. Please review and approve.`;

        const notification = await Notification.create({
            recipientId: host.id,
            recipientType: 'user',
            title,
            message,
            type: 'appointment_request',
            relatedId: body.appointmentId,
            relatedType: 'appointment',
        });

        return ServiceResponse.success('Host notified successfully', mapNotificationToResponse(notification.toJSON()), 201);
    }

    @Security('jwt', ['notification:delete'])
    @Delete('/:id')
    @asyncCatch
    public async deleteNotification(@Path() id: string): Promise<ServiceResponse<null>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null, 401);
        }

        const notification = await Notification.findOne({
            where: { id, recipientId: user.id, recipientType: 'user' },
        });

        if (!notification) {
            return ServiceResponse.failure('Notification not found', null, 404);
        }

        await notification.destroy();
        return ServiceResponse.success('Notification deleted successfully', null);
    }

    @Security('jwt', ['notification:delete'])
    @Delete('/')
    @asyncCatch
    public async deleteAllRead(): Promise<ServiceResponse<null>> {
        const user = (this as any).req?.user as { id: string } | undefined;
        if (!user) {
            return ServiceResponse.failure('Unauthorized', null, 401);
        }

        await Notification.destroy({
            where: { recipientId: user.id, recipientType: 'user', isRead: true },
        });

        return ServiceResponse.success('Read notifications deleted successfully', null);
    }
}
