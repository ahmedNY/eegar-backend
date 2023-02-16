import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { SettingsService } from 'src/config/services/settings.service';
import { EVENT_OTP_CREATED } from 'src/events';
import { PaginatedDataQueryDto } from 'src/shared/dto/paginated-data.dto';
import { PaginatedResultDto } from 'src/shared/dto/paginated-result.dto';
import { PaginatedDataService } from 'src/shared/services/paginated-data.service';
import { Repository, DeleteResult } from 'typeorm';
import { CreateOtpDto } from '../dto/create-otp.dto';
import { UpdateOtpDto } from '../dto/update-otp.dto';
import { Otp } from '../entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private repo: Repository<Otp>,
    private eventEmitter: EventEmitter2,
    private settingsService: SettingsService,
    private paginatedDataService: PaginatedDataService,
  ) { }

  async create(createOtpDto: CreateOtpDto, shouldEmitEvent: boolean = true): Promise<Otp> {
    const row = await this.repo.save(this.repo.create(createOtpDto));
    if (shouldEmitEvent) {
      this.eventEmitter.emit(EVENT_OTP_CREATED, createOtpDto);
    }
    return row;
  }


  findAll(dto: PaginatedDataQueryDto): Promise<PaginatedResultDto<Otp>> {
    return this.paginatedDataService.findAll(Otp, dto);
  }

  async findOne(args: Partial<Otp>): Promise<Otp> {
    const otp = await this.repo.findOne({ where: args });
    if (!otp) {
      return null;
    }
    const sendTime = moment(otp.send_time);
    const currentTime = moment();
    const otpDuration = moment.duration(currentTime.diff(sendTime)).asMinutes();
    const allowedOtpDuration = await this.settingsService.getOTPDuration()
    if (otpDuration > allowedOtpDuration) {
      await this.remove(otp.id);
      return null;
    }
    return otp;
  }

  async update(id: number, updateOtpDto: UpdateOtpDto): Promise<Otp> {
    const row = await this.repo.findOneOrFail({ where: { id } });
    return this.repo.save(this.repo.create({ ...row, ...updateOtpDto }));
  }

  async remove(id: number): Promise<boolean> {
    await this.repo.delete({ id });
    return true;
  }

  async removeByPhoneNumber(phone: string): Promise<boolean> {
    await this.repo.delete({ phoneNumber: phone });
    return true;
  }
}
