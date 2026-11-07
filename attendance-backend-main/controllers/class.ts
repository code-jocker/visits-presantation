import { ServiceResponse } from '../utils/serviceResponse';
import { asyncCatch } from '../middlewares/errorHandler';
import { Body, Controller, Delete, Get, Path, Post, Put, Query, Route, Security, Tags } from 'tsoa';
import Class from '../models/class';
import { Op } from 'sequelize';

export interface ClassCreateRequest {
  name: string;
  description?: string;
  level?: string;
}

export interface ClassUpdateRequest {
  name?: string;
  description?: string;
  level?: string;
  isActive?: boolean;
}

export interface ClassResponse {
  id: string;
  name: string;
  description?: string | null;
  level?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Route('api/classes')
@Tags('Classes')
export class ClassController extends Controller {

  @Security('jwt', ['class:read'])
  @Get('/')
  @asyncCatch
  public async getAllClasses(
    @Query() limit?: number,
    @Query() search?: string,
    @Query() isActive?: boolean,
  ): Promise<ServiceResponse<ClassResponse[]>> {
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { level: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const classes = await Class.findAll({
      where,
      limit: limit ?? 50,
      order: [['name', 'ASC']],
    });

    return ServiceResponse.success('Classes retrieved successfully', classes as unknown as ClassResponse[], 200);
  }

  @Security('jwt', ['class:read'])
  @Get('/{classId}')
  @asyncCatch
  public async getClassById(@Path() classId: string): Promise<ServiceResponse<ClassResponse | null>> {
    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return ServiceResponse.failure('Class not found', null, 404);
    }
    return ServiceResponse.success('Class retrieved successfully', classItem as unknown as ClassResponse, 200);
  }

  @Security('jwt', ['class:create'])
  @Post('/')
  @asyncCatch
  public async createClass(@Body() data: ClassCreateRequest): Promise<ServiceResponse<ClassResponse>> {
    const classItem = await Class.create(data as any);
    return ServiceResponse.success('Class created successfully', classItem as unknown as ClassResponse, 201);
  }

  @Security('jwt', ['class:update'])
  @Put('/{classId}')
  @asyncCatch
  public async updateClass(
    @Path() classId: string,
    @Body() data: ClassUpdateRequest,
  ): Promise<ServiceResponse<ClassResponse | null>> {
    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return ServiceResponse.failure('Class not found', null, 404);
    }
    await classItem.update(data as any);
    return ServiceResponse.success('Class updated successfully', classItem as unknown as ClassResponse, 200);
  }

  @Security('jwt', ['class:delete'])
  @Delete('/{classId}')
  @asyncCatch
  public async deleteClass(@Path() classId: string): Promise<ServiceResponse<null>> {
    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return ServiceResponse.failure('Class not found', null, 404);
    }
    await classItem.destroy();
    return ServiceResponse.success('Class deleted successfully', null, 200);
  }
}
