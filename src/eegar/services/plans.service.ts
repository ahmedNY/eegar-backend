import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from '@/shared/dto/paginated-result.dto';
import { PaginatedDataService } from '@/shared/services/paginated-data.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreatePlanDto } from '../dto/create-plan.dto';
import { UpdatePlanDto } from '../dto/update-plan.dto';
import { Plan } from '../entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private repo: Repository<Plan>,
    private paginatedDataService: PaginatedDataService,
  ) { }

  create(userId: number, dto: CreatePlanDto): Promise<Plan> {
    return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
  }

  findAll(): Promise<Plan[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Plan> {
    return this.repo.findOne({ where: { id } });
  }

  findAllPaginated(dto: PaginatedDataQueryDto): Promise<PaginatedResultDto<Plan>> {
    return this.paginatedDataService.findAll(Plan, dto, {
      relations: {
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...updatePlanDto }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
