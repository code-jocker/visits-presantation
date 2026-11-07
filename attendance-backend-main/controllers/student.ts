import { ServiceResponse } from '../utils/serviceResponse';
import { asyncCatch } from '../middlewares/errorHandler';
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags } from 'tsoa';
import { Op } from 'sequelize';
import Student from '../models/student';
import Class from '../models/class';

export interface StudentCreateRequest {
  studentId: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  admissionNumber?: string;
  classId?: string;
  status?: string;
}

export interface StudentUpdateRequest {
  studentId?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  admissionNumber?: string;
  classId?: string;
  status?: string;
}

export interface StudentResponse {
  id: string;
  studentId: string;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
  admissionNumber?: string | null;
  classId?: string | null;
  className?: string | null;
  classLevel?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentSearchResult {
  id: string;
  studentId: string;
  fullName: string;
  className?: string | null;
  classLevel?: string | null;
}

@Route('api/students')
@Tags('Students')
export class StudentController extends Controller {

  @Security('jwt', ['student:read'])
  @Get('/')
  @asyncCatch
  public async getAllStudents(
    @Query() limit?: number,
    @Query() search?: string,
    @Query() classId?: string,
    @Query() status?: string,
  ): Promise<ServiceResponse<StudentResponse[]>> {
    const where: any = {};
    if (classId) where.classId = classId;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { studentId: { [Op.like]: `%${search}%` } },
        { admissionNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    const students = await Student.findAll({
      where,
      include: [{
        model: Class,
        as: 'class',
        attributes: ['id', 'name', 'level'],
      }],
      limit: limit ?? 50,
      order: [['fullName', 'ASC']],
    });

    const results: StudentResponse[] = students.map(s => ({
      id: s.id,
      studentId: s.studentId,
      fullName: s.fullName,
      email: s.email,
      phoneNumber: s.phoneNumber,
      admissionNumber: s.admissionNumber,
      classId: s.classId,
      className: s.class?.name ?? null,
      classLevel: s.class?.level ?? null,
      status: s.status,
      createdAt: s.createdAt?.toISOString(),
      updatedAt: s.updatedAt?.toISOString(),
    }));

    return ServiceResponse.success('Students retrieved successfully', results, 200);
  }

  // Search students (must come before /{studentId} to avoid route conflict)
  @Security('jwt', ['student:read'])
  @Get('/search')
  @asyncCatch
  public async searchStudents(
    @Query() q: string,
    @Query() limit?: number,
  ): Promise<ServiceResponse<StudentSearchResult[]>> {
    if (!q || !q.trim()) {
      return ServiceResponse.success('Search query required', [], 200);
    }

    const students = await Student.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${q.trim()}%` } },
          { studentId: { [Op.like]: `%${q.trim()}%` } },
          { admissionNumber: { [Op.like]: `%${q.trim()}%` } },
        ],
      },
      include: [{
        model: Class,
        as: 'class',
        attributes: ['id', 'name', 'level'],
      }],
      limit: limit ?? 10,
      order: [['fullName', 'ASC']],
    });

    const results: StudentSearchResult[] = students.map(s => ({
      id: s.id,
      studentId: s.studentId,
      fullName: s.fullName,
      className: s.class?.name ?? null,
      classLevel: s.class?.level ?? null,
    }));

    return ServiceResponse.success('Students found', results, 200);
  }

  @Security('jwt', ['student:read'])
  @Get('/{studentId}')
  @asyncCatch
  public async getStudentById(@Path() studentId: string): Promise<ServiceResponse<StudentResponse | null>> {
    const student = await Student.findByPk(studentId, {
      include: [{
        model: Class,
        as: 'class',
        attributes: ['id', 'name', 'level'],
      }],
    });
    if (!student) {
      return ServiceResponse.failure('Student not found', null, 404);
    }
    return ServiceResponse.success('Student retrieved successfully', {
      id: student.id,
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      admissionNumber: student.admissionNumber,
      classId: student.classId,
      className: student.class?.name ?? null,
      classLevel: student.class?.level ?? null,
      status: student.status,
      createdAt: student.createdAt?.toISOString(),
      updatedAt: student.updatedAt?.toISOString(),
    }, 200);
  }

  @Security('jwt', ['student:create'])
  @Post('/')
  @asyncCatch
  public async createStudent(@Body() data: StudentCreateRequest): Promise<ServiceResponse<StudentResponse>> {
    const student = await Student.create(data as any);
    return ServiceResponse.success('Student created successfully', {
      id: student.id,
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      admissionNumber: student.admissionNumber,
      classId: student.classId,
      className: null,
      classLevel: null,
      status: student.status,
      createdAt: student.createdAt?.toISOString(),
      updatedAt: student.updatedAt?.toISOString(),
    }, 201);
  }

  @Security('jwt', ['student:update'])
  @Put('/{studentId}')
  @asyncCatch
  public async updateStudent(
    @Path() studentId: string,
    @Body() data: StudentUpdateRequest,
  ): Promise<ServiceResponse<StudentResponse | null>> {
    const student = await Student.findByPk(studentId);
    if (!student) {
      return ServiceResponse.failure('Student not found', null, 404);
    }
    await student.update(data as any);
    return ServiceResponse.success('Student updated successfully', {
      id: student.id,
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      admissionNumber: student.admissionNumber,
      classId: student.classId,
      className: null,
      classLevel: null,
      status: student.status,
      createdAt: student.createdAt?.toISOString(),
      updatedAt: student.updatedAt?.toISOString(),
    }, 200);
  }

  @Security('jwt', ['student:delete'])
  @Delete('/{studentId}')
  @asyncCatch
  public async deleteStudent(@Path() studentId: string): Promise<ServiceResponse<null>> {
    const student = await Student.findByPk(studentId);
    if (!student) {
      return ServiceResponse.failure('Student not found', null, 404);
    }
    await student.destroy();
    return ServiceResponse.success('Student deleted successfully', null, 200);
  }
}
