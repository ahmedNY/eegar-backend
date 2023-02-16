import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAppInfoDto } from '../dto/create-app-info.dto';
import { FindAppInfoDto } from '../dto/find-app-info.dto';
import { UpdateAppInfoDto } from '../dto/update-app-info.dto';
import { AppInfo } from '../entities/app-info.entity';
import { SettingKey, SettingsService } from './settings.service';

@Injectable()
export class AppInfoService {
  constructor(
    private settingsService: SettingsService,
  ) { }

  async create(createAppInfoDto: CreateAppInfoDto): Promise<AppInfo> {
    const appInfoList = await this.findAll();
    const setting = await this.settingsService.create({
      settingName: SettingKey.appsInfo,
      settingValue: [...appInfoList, createAppInfoDto],
    });
    return setting.settingValue;
  }

  async findAll(): Promise<AppInfo[]> {
    return (await this.settingsService.getSettingValue(SettingKey.appsInfo)) || [];
  }

  async findOneByType(dto: FindAppInfoDto): Promise<AppInfo> {
    const appInfoList = await this.findAll();
    const result =  appInfoList.find((appInfo) => appInfo.os == dto.osType);
    
    if (!result) {
      throw new HttpException('App info not found', HttpStatus.NOT_FOUND);
    }
    
    return result;

  }

  async update(dto: UpdateAppInfoDto): Promise<AppInfo> {
    const appInfoList = await this.findAll();
    // get the app info index on app info list
    const currentAppInfo = appInfoList.find(appInfo => appInfo.os == dto.osType);
    if (!currentAppInfo) {
      throw new HttpException('App info not found', HttpStatus.NOT_FOUND);
    }

    const index = appInfoList.indexOf(currentAppInfo);
    // replace app info
    appInfoList[index] = { ...currentAppInfo, ...dto };

    await this.settingsService.updateByName(SettingKey.appsInfo, {
      settingValue: appInfoList,
    });

    return this.findOneByType({
      osType: dto.osType
    });
  }

  async remove(type: string, os: string) {
    const appInfoList = await this.findAll();
    const updatedAppInfoList = appInfoList.filter(appInfo => appInfo.os);
    await this.settingsService.updateByName(SettingKey.appsInfo, {
      settingValue: updatedAppInfoList
    });
  }
}
