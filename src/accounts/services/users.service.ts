import { EVENT_USER_CREATED } from '@/events';
import { PaginatedDataQueryDto } from '@/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from '@/shared/dto/paginated-result.dto';
import { PaginatedDataService } from '@/shared/services/paginated-data.service';
import { fileExists } from '@/shared/utils/file-exists';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path';
import { unlink, writeFile } from 'fs/promises';
import { In, Not, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersCountDto } from '../dto/user-count.dto';
import { User } from '../entities/user.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class UsersService {


  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private eventEmitter: EventEmitter2,
    private paginatedDataService: PaginatedDataService,
  ) { }


  findByEmail(email: string): Promise<User> {
    return this.repo.findOne({ where: { email: email } });
  }

  async create(createCustomerDto: CreateUserDto): Promise<User> {
    const user = await this.repo.save(this.repo.create(createCustomerDto));
    this.eventEmitter.emit(EVENT_USER_CREATED, user);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findAllPaginated(query: PaginatedDataQueryDto): Promise<PaginatedResultDto<User>> {
    return this.paginatedDataService.findAll(User, query)
  }

  findOne(id: number): Promise<User> {
    return this.repo.findOne({ where: { id } });
  }

  findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.repo.findOne({ where: { phoneNumber } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...dto }));
  }

  async remove(id: number): Promise<boolean> {
    await this.repo.delete({ id });
    return true;
  }


  async getUsersCountReport(): Promise<UsersCountDto> {
    const usersCount = await this.repo.count();
    const maleUserCount = await this.repo.count({
      where: { gender: true }
    });

    const femaleUsersCount = await this.repo.count({
      where: { gender: false }
    });

    return {
      usersCount: usersCount,
      maleUsersCount: maleUserCount,
      femaleUsersCount: femaleUsersCount
    };
  }

  async updateProfilePicture(customerId: number, file: Express.Multer.File) {
    const user = await this.repo.findOneByOrFail({ id: customerId });
    // remove existing file
    if (user.fileName) {
      const currentFilePath = resolve(global.__basedir, '../../', 'public/uploads/customers', user.fileName);
      if (await fileExists(currentFilePath)) {
        await unlink(currentFilePath);
      }
    }

    // update user file name
    const ext = file.originalname.split('.').reverse()[0];
    user.fileName = `${nanoid()}.${ext}`;

    //write file to disk
    const filePath = resolve(global.__basedir, '../../', 'public/uploads/customers', user.fileName);
    await writeFile(filePath, file.buffer);


    // update user db record
    await this.repo.save(user);
    return user;
  }

  async userIsAdmin(userId: number): Promise<boolean> {
    const user = await this.repo.findOne({
      where: { id: userId, isAdmin: true, isActive: true },
      cache: true,
    });
    return !!user;
  }

  async getAdminsFBTokens(/* ids: number[] */): Promise<string[]> {
    return (await this.repo.find({
      where: {
        // id: Not(In([ids])),
        isAdmin: true,
      },
      select: { firebaseToken: true }
    },)).map(e => e.firebaseToken);
  }

}
