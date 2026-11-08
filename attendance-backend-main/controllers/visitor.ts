import { ServiceResponse } from '../utils/serviceResponse';
import { asyncCatch } from '../middlewares/errorHandler';
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags } from 'tsoa';
import { Op } from 'sequelize';
import Visitor from '../models/visitor';
import SystemFeature from '../models/systemFeature';
import Student from '../models/student';
import Class from '../models/class';
import { sendWhatsAppMessage, buildVisitorWelcomeMessage, initWhatsApp, isWhatsAppReady, getWhatsAppQR } from '../utils/whatsappService';

export interface VisitorCreateRequest {
  fullName: string;
  studentName?: string;
  studentId?: string;
  classId?: string;
  mobile?: string;
  email?: string;
  visitorCompany?: string;
  purpose?: string;
  department?: string;
  hostName?: string;
  idProofType?: string;
  idNumber?: string;
  passType?: string;
  status?: string;
  badgeId?: string;
  profilePhoto?: string;
  entryTime?: string;
  exitTime?: string;
}

export interface VisitorUpdateRequest {
  fullName?: string;
  studentName?: string;
  studentId?: string;
  classId?: string;
  mobile?: string;
  email?: string;
  visitorCompany?: string;
  purpose?: string;
  department?: string;
  hostName?: string;
  idProofType?: string;
  idNumber?: string;
  passType?: string;
  status?: string;
  badgeId?: string;
  profilePhoto?: string;
  entryTime?: string | null;
  exitTime?: string | null;
}

export interface SystemFeatureUpdate {
  featureKey: string;
  isEnabled: boolean;
}

export interface VisitorResponse {
  id: string;
  fullName: string;
  studentName?: string | null;
  studentId?: string | null;
  classId?: string | null;
  className?: string | null;
  classLevel?: string | null;
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
  entryTime?: string | null;
  exitTime?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemFeatureResponse {
  selfRegistrationEnabled: boolean;
  selfCheckoutEnabled: boolean;
}

@Route('api/visitors')
@Tags('Visitors')
export class VisitorController extends Controller {

  // Get all visitors with optional filtering
  @Security('jwt', ['visitor:read'])
  @Get('/')
  @asyncCatch
  public async getAllVisitors(
    @Query() limit?: number,
    @Query() query?: string,
    @Query() status?: string,
    @Query() department?: string,
  ): Promise<ServiceResponse<VisitorResponse[]>> {
    const where: any = {};
    if (status) where.status = status;
    if (department) where.department = { [Op.like]: `%${department}%` };
    if (query) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${query}%` } },
        { studentName: { [Op.like]: `%${query}%` } },
        { idNumber: { [Op.like]: `%${query}%` } },
        { mobile: { [Op.like]: `%${query}%` } },
        { email: { [Op.like]: `%${query}%` } },
      ];
    }

    const visitors = await Visitor.findAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['id', 'studentId', 'fullName'] },
        { model: Class, as: 'visitorClass', attributes: ['id', 'name', 'level'] },
      ],
      limit: limit ?? 50,
      order: [['createdAt', 'DESC']],
    });

    const results: VisitorResponse[] = visitors.map(v => ({
      id: v.id,
      fullName: v.fullName,
      studentName: v.studentName,
      studentId: v.studentId,
      classId: v.classId,
      className: v.visitorClass?.name ?? null,
      classLevel: v.visitorClass?.level ?? null,
      mobile: v.mobile,
      email: v.email,
      visitorCompany: v.visitorCompany,
      purpose: v.purpose,
      department: v.department,
      hostName: v.hostName,
      idProofType: v.idProofType,
      idNumber: v.idNumber,
      passType: v.passType,
      status: v.status,
      badgeId: v.badgeId,
      profilePhoto: v.profilePhoto,
      entryTime: v.entryTime?.toISOString?.() ?? v.entryTime,
      exitTime: v.exitTime?.toISOString?.() ?? v.exitTime,
      createdAt: v.createdAt?.toISOString(),
      updatedAt: v.updatedAt?.toISOString(),
    }));

    return ServiceResponse.success('Visitors retrieved successfully', results, 200);
  }

  // Get system features (public - no auth required)
  @Get('/system-features')
  @asyncCatch
  public async getSystemFeatures(): Promise<ServiceResponse<SystemFeatureResponse>> {
    const [selfRegistration] = await SystemFeature.findOrCreate({
      where: { featureKey: 'self_registration' },
      defaults: { featureKey: 'self_registration', isEnabled: true, description: 'Self registration enabled' },
    });
    const [selfCheckout] = await SystemFeature.findOrCreate({
      where: { featureKey: 'self_checkout' },
      defaults: { featureKey: 'self_checkout', isEnabled: true, description: 'Self checkout enabled' },
    });

    return ServiceResponse.success('System features retrieved', {
      selfRegistrationEnabled: selfRegistration.isEnabled,
      selfCheckoutEnabled: selfCheckout.isEnabled,
    }, 200);
  }

  // Get WhatsApp status (public - for checking if WhatsApp is connected)
  @Get('/whatsapp/status')
  @asyncCatch
  public async getWhatsAppStatus(): Promise<ServiceResponse<any>> {
    return ServiceResponse.success('WhatsApp status retrieved', {
      isReady: isWhatsAppReady(),
      hasQR: getWhatsAppQR() !== null,
    }, 200);
  }

  // Get WhatsApp QR code (public - for scanning to authenticate)
  @Get('/whatsapp/qr')
  @asyncCatch
  public async getWhatsAppQRCode(): Promise<ServiceResponse<any>> {
    return ServiceResponse.success('WhatsApp QR code retrieved', {
      qrCode: getWhatsAppQR(),
    }, 200);
  }

  // Initialize WhatsApp (public - starts the client)
  @Post('/whatsapp/init')
  @asyncCatch
  public async initWhatsAppClient(): Promise<ServiceResponse<any>> {
    await initWhatsApp();
    return ServiceResponse.success('WhatsApp client initialized', {
      isReady: isWhatsAppReady(),
    }, 200);
  }

  // Send WhatsApp message (public - for testing)
  @Post('/whatsapp/send')
  @asyncCatch
  public async sendWhatsAppTest(
    @Body() data: { phoneNumber: string; message?: string }
  ): Promise<ServiceResponse<any>> {
    const { phoneNumber, message } = data;
    const msg = message || 'Test message from E-Visitors system';
    const result = await sendWhatsAppMessage(phoneNumber, msg);
    return ServiceResponse.success('WhatsApp message sent', result, 200);
  }

  // Update system feature (public - no auth required for kiosk)
  @Put('/system-features')
  @asyncCatch
  public async updateSystemFeature(@Body() data: SystemFeatureUpdate): Promise<ServiceResponse<any>> {
    const [feature] = await SystemFeature.findOrCreate({
      where: { featureKey: data.featureKey },
      defaults: { featureKey: data.featureKey, isEnabled: data.isEnabled, description: 'System feature' },
    });
    await feature.update({ isEnabled: data.isEnabled });

    return ServiceResponse.success('System feature updated', { featureKey: data.featureKey, isEnabled: data.isEnabled }, 200);
  }

  // Get recent taps (static route - must come before /{visitorId})
  @Security('jwt', ['visitor:read'])
  @Get('/recent-taps')
  @asyncCatch
  public async getRecentTaps(
    @Query() department?: string,
    @Query() query?: string,
    @Query() searchType?: 'name' | 'phone' | 'voice',
    @Query() limit?: number,
  ): Promise<ServiceResponse<any[]>> {
    const where: any = {};
    if (department) where.department = { [Op.like]: `%${department}%` };
    if (query) {
      const searchField = searchType === 'phone' ? 'mobile' : searchType === 'voice' ? 'fullName' : 'fullName';
      where[searchField] = { [Op.like]: `%${query}%` };
    }

    const visitors = await Visitor.findAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['id', 'studentId', 'fullName'] },
        { model: Class, as: 'visitorClass', attributes: ['id', 'name', 'level'] },
      ],
      limit: limit ?? 50,
      order: [['createdAt', 'DESC']],
    });

    const taps = visitors.map(v => ({
      id: v.id,
      visitorName: v.fullName,
      studentName: v.studentName,
      studentId: v.studentId,
      className: v.visitorClass?.name ?? null,
      classLevel: v.visitorClass?.level ?? null,
      documentType: v.idProofType,
      phoneNumber: v.mobile,
      entryTime: v.entryTime,
      exitTime: v.exitTime,
      department: v.department,
      badgeId: v.badgeId,
    }));

    return ServiceResponse.success('Recent taps retrieved', taps, 200);
  }

  // Search visitors (static route - must come before /{visitorId})
  @Security('jwt', ['visitor:read'])
  @Get('/search')
  @asyncCatch
  public async searchVisitors(
    @Query() query: string,
    @Query() searchType: 'name' | 'phone' | 'voice',
    @Query() department?: string,
    @Query() limit?: number,
  ): Promise<ServiceResponse<any[]>> {
    const where: any = {};
    if (department) where.department = { [Op.like]: `%${department}%` };

    const searchField = searchType === 'phone' ? 'mobile' : 'fullName';
    where[searchField] = { [Op.like]: `%${query}%` };

    const visitors = await Visitor.findAll({
      where,
      include: [
        { model: Student, as: 'student', attributes: ['id', 'studentId', 'fullName'] },
        { model: Class, as: 'visitorClass', attributes: ['id', 'name', 'level'] },
      ],
      limit: limit ?? 20,
      order: [['createdAt', 'DESC']],
    });

    const results = visitors.map(v => ({
      id: v.id,
      visitorName: v.fullName,
      studentName: v.studentName,
      className: v.visitorClass?.name ?? null,
      documentType: v.idProofType,
      phoneNumber: v.mobile,
      email: v.email,
      visitorCompany: v.visitorCompany,
      purpose: v.purpose,
      department: v.department,
      hostName: v.hostName,
      idNumber: v.idNumber,
      passType: v.passType,
      status: v.status,
      badgeId: v.badgeId,
      entryTime: v.entryTime,
      exitTime: v.exitTime,
    }));

    return ServiceResponse.success('Search results', results, 200);
  }

  // Get visitor by ID (parameterized route - must come after static routes)
  @Security('jwt', ['visitor:read'])
  @Get('/{visitorId}')
  @asyncCatch
  public async getVisitorById(@Path() visitorId: string): Promise<ServiceResponse<VisitorResponse | null>> {
    const visitor = await Visitor.findByPk(visitorId, {
      include: [
        { model: Student, as: 'student', attributes: ['id', 'studentId', 'fullName'] },
        { model: Class, as: 'visitorClass', attributes: ['id', 'name', 'level'] },
      ],
    });
    if (!visitor) {
      return ServiceResponse.failure('Visitor not found', null, 404);
    }
    return ServiceResponse.success('Visitor retrieved successfully', {
      id: visitor.id,
      fullName: visitor.fullName,
      studentName: visitor.studentName,
      studentId: visitor.studentId,
      classId: visitor.classId,
      className: visitor.visitorClass?.name ?? null,
      classLevel: visitor.visitorClass?.level ?? null,
      mobile: visitor.mobile,
      email: visitor.email,
      visitorCompany: visitor.visitorCompany,
      purpose: visitor.purpose,
      department: visitor.department,
      hostName: visitor.hostName,
      idProofType: visitor.idProofType,
      idNumber: visitor.idNumber,
      passType: visitor.passType,
      status: visitor.status,
      badgeId: visitor.badgeId,
      profilePhoto: visitor.profilePhoto,
      entryTime: visitor.entryTime?.toISOString?.() ?? visitor.entryTime,
      exitTime: visitor.exitTime?.toISOString?.() ?? visitor.exitTime,
      createdAt: visitor.createdAt?.toISOString(),
      updatedAt: visitor.updatedAt?.toISOString(),
    }, 200);
  }

  // Create visitor
  @Security('jwt', ['visitor:create'])
  @Post('/')
  @asyncCatch
  public async createVisitor(@Body() data: VisitorCreateRequest): Promise<ServiceResponse<VisitorResponse>> {
    const visitor = await Visitor.create(data as any);
    return ServiceResponse.success('Visitor created successfully', {
      id: visitor.id,
      fullName: visitor.fullName,
      studentName: visitor.studentName,
      studentId: visitor.studentId,
      classId: visitor.classId,
      className: null,
      classLevel: null,
      mobile: visitor.mobile,
      email: visitor.email,
      visitorCompany: visitor.visitorCompany,
      purpose: visitor.purpose,
      department: visitor.department,
      hostName: visitor.hostName,
      idProofType: visitor.idProofType,
      idNumber: visitor.idNumber,
      passType: visitor.passType,
      status: visitor.status,
      badgeId: visitor.badgeId,
      profilePhoto: visitor.profilePhoto,
      entryTime: visitor.entryTime?.toISOString?.() ?? visitor.entryTime,
      exitTime: visitor.exitTime?.toISOString?.() ?? visitor.exitTime,
      createdAt: visitor.createdAt?.toISOString(),
      updatedAt: visitor.updatedAt?.toISOString(),
    }, 201);
  }

  // Public check-in (no JWT required - for kiosk)
  @Post('/public-check-in')
  @asyncCatch
  public async publicCheckIn(@Body() data: any): Promise<ServiceResponse<any>> {
    const { visitor, verificationMode, appointmentId, department, badgeType } = data;

    if (!visitor?.fullName) {
      return ServiceResponse.failure('Visitor fullName is required', null, 400);
    }

    if (!visitor.studentName || !visitor.studentName.trim()) {
      return ServiceResponse.failure('Student name is required', null, 400);
    }

    const badgeId = badgeType === 'QR' ? `V-${Date.now().toString(36).toUpperCase()}` : visitor.badgeId;

    let resolvedStudentId: string | null = null;
    let resolvedClassId: string | null = null;

    if (visitor.studentId) {
      const student = await Student.findOne({ where: { studentId: visitor.studentId } });
      if (student) resolvedStudentId = student.id;
    }

    if (visitor.classId) {
      const cls = await Class.findOne({ where: { name: visitor.classId } });
      if (cls) resolvedClassId = cls.id;
    }

    const newVisitor = await Visitor.create({
      fullName: visitor.fullName,
      studentName: visitor.studentName.trim(),
      studentId: resolvedStudentId,
      classId: resolvedClassId,
      mobile: visitor.mobile,
      email: visitor.email,
      visitorCompany: visitor.visitorCompany,
      purpose: visitor.purpose,
      department: visitor.department || 'General',
      hostName: visitor.hostName,
      idProofType: visitor.idProofType,
      idNumber: visitor.idNumber,
      passType: visitor.passType || 'Visitor',
      badgeId,
      status: 'CHECKED_IN',
      entryTime: new Date(),
      profilePhoto: visitor.profilePhoto,
    } as any);

    // Send WhatsApp welcome message to visitor's phone
    if (visitor.mobile) {
      const welcomeMsg = buildVisitorWelcomeMessage({
        fullName: visitor.fullName,
        studentName: visitor.studentName.trim(),
        department: visitor.department || 'General',
        hostName: visitor.hostName,
        purpose: visitor.purpose,
        badgeId,
      });
      await sendWhatsAppMessage(visitor.mobile, welcomeMsg).catch((err) => {
        console.error('WhatsApp send failed:', err.message);
      });
    }

    return ServiceResponse.success('Visitor checked in successfully', {
      badgeId: newVisitor.badgeId,
      visitorId: newVisitor.id,
      studentName: newVisitor.studentName,
      studentId: newVisitor.studentId,
      classId: newVisitor.classId,
      className: null,
      classLevel: null,
      isReturning: false,
    }, 201);
  }

  // Check-in (auth required)
  @Security('jwt', ['visitor:create'])
  @Post('/check-in')
  @asyncCatch
  public async checkIn(@Body() data: any): Promise<ServiceResponse<any>> {
    const { visitor, verificationMode, appointmentId, department, badgeType } = data;

    if (!visitor?.fullName) {
      return ServiceResponse.failure('Visitor fullName is required', null, 400);
    }

    if (!visitor.studentName || !visitor.studentName.trim()) {
      return ServiceResponse.failure('Student name is required', null, 400);
    }

    const badgeId = badgeType === 'QR' ? `V-${Date.now().toString(36).toUpperCase()}` : visitor.badgeId;

    let resolvedStudentId: string | null = null;
    let resolvedClassId: string | null = null;

    if (visitor.studentId) {
      const student = await Student.findOne({ where: { studentId: visitor.studentId } });
      if (student) resolvedStudentId = student.id;
    }

    if (visitor.classId) {
      const cls = await Class.findOne({ where: { name: visitor.classId } });
      if (cls) resolvedClassId = cls.id;
    }

    const newVisitor = await Visitor.create({
      fullName: visitor.fullName,
      studentName: visitor.studentName.trim(),
      studentId: resolvedStudentId,
      classId: resolvedClassId,
      mobile: visitor.mobile,
      email: visitor.email,
      visitorCompany: visitor.visitorCompany,
      purpose: visitor.purpose,
      department: visitor.department || 'General',
      hostName: visitor.hostName,
      idProofType: visitor.idProofType,
      idNumber: visitor.idNumber,
      passType: visitor.passType || 'Visitor',
      badgeId,
      status: 'CHECKED_IN',
      entryTime: new Date(),
      profilePhoto: visitor.profilePhoto,
    } as any);

    // Send WhatsApp welcome message to visitor's phone
    if (visitor.mobile) {
      const welcomeMsg = buildVisitorWelcomeMessage({
        fullName: visitor.fullName,
        studentName: visitor.studentName.trim(),
        department: visitor.department || 'General',
        hostName: visitor.hostName,
        purpose: visitor.purpose,
        badgeId,
      });
      await sendWhatsAppMessage(visitor.mobile, welcomeMsg).catch((err) => {
        console.error('WhatsApp send failed:', err.message);
      });
    }

    return ServiceResponse.success('Visitor checked in successfully', {
      badgeId: newVisitor.badgeId,
      visitorId: newVisitor.id,
      studentName: newVisitor.studentName,
      studentId: newVisitor.studentId,
      classId: newVisitor.classId,
      className: null,
      classLevel: null,
      isReturning: false,
    }, 201);
  }

  // Check-out
  @Security('jwt', ['visitor:update'])
  @Post('/check-out')
  @asyncCatch
  public async checkOut(@Body() data: { visitorId?: string; badgeId?: string; department?: string; checkoutReason?: string }): Promise<ServiceResponse<any>> {
    const { visitorId, badgeId, department } = data;

    let visitor: Visitor | null = null;
    if (visitorId) {
      visitor = await Visitor.findByPk(visitorId, {
        include: [
          { model: Student, as: 'student', attributes: ['id', 'studentId', 'fullName'] },
          { model: Class, as: 'visitorClass', attributes: ['id', 'name', 'level'] },
        ],
      });
    } else if (badgeId) {
      visitor = await Visitor.findOne({ where: { badgeId } });
    }

    if (!visitor) {
      return ServiceResponse.failure('Visitor not found', null, 404);
    }

    await visitor.update({
      status: 'CHECKED_OUT',
      exitTime: new Date(),
    });

    return ServiceResponse.success('Visitor checked out successfully', {
      badgeId: visitor.badgeId,
      visitorId: visitor.id,
      studentName: visitor.studentName,
      studentId: visitor.studentId,
      classId: visitor.classId,
      className: visitor.visitorClass?.name ?? null,
      classLevel: visitor.visitorClass?.level ?? null,
    }, 200);
  }

  // Public check-out (no JWT required)
  @Post('/public-check-out')
  @asyncCatch
  public async publicCheckOut(@Body() data: { badgeId: string }): Promise<ServiceResponse<any>> {
    const { badgeId } = data;

    const visitor = await Visitor.findOne({ where: { badgeId } });
    if (!visitor) {
      return ServiceResponse.failure('Visitor not found', null, 404);
    }

    await visitor.update({
      status: 'CHECKED_OUT',
      exitTime: new Date(),
    });

    return ServiceResponse.success('Visitor checked out successfully', {
      badgeId: visitor.badgeId,
      visitorId: visitor.id,
      fullName: visitor.fullName,
      studentName: visitor.studentName,
      studentId: visitor.studentId,
      classId: visitor.classId,
    }, 200);
  }

  // Update visitor
  @Security('jwt', ['visitor:update'])
  @Put('/{visitorId}')
  @asyncCatch
  public async updateVisitor(
    @Path() visitorId: string,
    @Body() data: VisitorUpdateRequest,
  ): Promise<ServiceResponse<VisitorResponse | null>> {
    const visitor = await Visitor.findByPk(visitorId);
    if (!visitor) {
      return ServiceResponse.failure('Visitor not found', null, 404);
    }
    await visitor.update(data as any);
    return ServiceResponse.success('Visitor updated successfully', {
      id: visitor.id,
      fullName: visitor.fullName,
      studentName: visitor.studentName,
      studentId: visitor.studentId,
      classId: visitor.classId,
      className: null,
      classLevel: null,
      mobile: visitor.mobile,
      email: visitor.email,
      visitorCompany: visitor.visitorCompany,
      purpose: visitor.purpose,
      department: visitor.department,
      hostName: visitor.hostName,
      idProofType: visitor.idProofType,
      idNumber: visitor.idNumber,
      passType: visitor.passType,
      status: visitor.status,
      badgeId: visitor.badgeId,
      profilePhoto: visitor.profilePhoto,
      entryTime: visitor.entryTime?.toISOString?.() ?? visitor.entryTime,
      exitTime: visitor.exitTime?.toISOString?.() ?? visitor.exitTime,
      createdAt: visitor.createdAt?.toISOString(),
      updatedAt: visitor.updatedAt?.toISOString(),
    }, 200);
  }

  // Delete visitor
  @Security('jwt', ['visitor:delete'])
  @Delete('/{visitorId}')
  @asyncCatch
  public async deleteVisitor(@Path() visitorId: string): Promise<ServiceResponse<null>> {
    const visitor = await Visitor.findByPk(visitorId);
    if (!visitor) {
      return ServiceResponse.failure('Visitor not found', null, 404);
    }
    await visitor.destroy();
    return ServiceResponse.success('Visitor deleted successfully', null, 200);
  }
}
