import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from '@/shared/dto/paginated-result.dto';
import { PaginatedDataService } from '@/shared/services/paginated-data.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { AssetsService } from './assets.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
    private paginatedDataService: PaginatedDataService,
    private videosService: AssetsService,
  ) { }

  create(userId: number, dto: CreateCategoryDto): Promise<Category> {
    return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
  }

  findAll(): Promise<Category[]> {
    return this.repo.find();
  }
  
  async userFindAll(): Promise<Category[]> {
    const usedCategoryId = await this.videosService.getUsedCategoryIds();
    return this.repo.findBy({
      id: In(usedCategoryId),
    });
  }

  findOne(id: number): Promise<Category> {
    return this.repo.findOne({ where: { id } });
  }

  findAllPaginated(dto: PaginatedDataQueryDto): Promise<PaginatedResultDto<Category>> {
    return this.paginatedDataService.findAll(Category, dto, {
      relations: {
        createdBy: true,
        updatedBy: true,
      }
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...updateCategoryDto }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
