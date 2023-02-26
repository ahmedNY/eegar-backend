import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateExtensionDto } from '../dto/create-extension.dto';
import { UpdateExtensionDto } from '../dto/update-extension.dto';
import { Extension } from '../entities/extension.entity';

@Injectable()
export class ExtensionsService {
  constructor(
    @InjectRepository(Extension) private repo: Repository<Extension>
  ) { }

  create(dto: CreateExtensionDto, userId: number): Promise<Extension> {
    return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
  }

  findAll(): Promise<Extension[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Extension> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateExtensionDto, userId: number): Promise<Extension> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto, updatedById: userId }));
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
}
