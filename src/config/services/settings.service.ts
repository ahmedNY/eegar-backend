import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { Setting } from '../entities/setting.entity';


export enum SettingKey {
  requestSpreadRange = "REQUEST_SPREAD_RANGE",
  // allowedPickupZones = "ALLOWED_PICKUP_ZONES",
  // smsSenders = "SMS_SENDERS",
  // driverActivation = "DRIVER_ACTIVATION",
  // promoSettings = "PROMO_SETTINGS",
  // invitation = "INVITATION",
  // contactUsInfo = "CONTACT_US_INFO",
  // defaultDriverCategory = "DEFAULT_DRIVER_CATEGORY",
  // defaultDriverCarTypes = "DEFAULT_DRIVER_CAR_TYPES",
  // testersOtp = "TESTERS_OTP",
  otpDuration = "OTP_DURATION",
  otpResendLimit = "OTP_RESEND_LIMIT",
  // driverIsAutoActivated = "DRIVER_IS_AUTO_ACTIVATED",
  // promoBulkGeneratorConfig = "PROMO_BULK_GENERATOR_CONFIG",
  // contactUs = "CONTACT_US",
  appsInfo = "APPS_INFO",
  // paymentSettings = "PAYMENT_SETTINGS",
  // googleMapsSettings = "GOOGLE_MAPS_SETTINGS",
  // allowedMinutesBetweenZonesExit = "ALLOWED_MINUTES_BETWEEN_ZONES_EXIT",
  // tripTransactionsSettings = 'TRIP_TRANSACTIONS_SETTINGS',
  // tripNotificationsSettings = 'TRIP_NOTIFICATIONS_SETTINGS',
  // driversDocumentsTypes = 'DRIVERS_DOCUMENTS_TYPES',
}

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private repo: Repository<Setting>,
  ) { }

  create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const createSettingObj = this.repo.create(createSettingDto);
    return this.repo.save(createSettingObj);
  }

  findAll(): Promise<Setting[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Setting> {
    return this.repo.findOne({ where: { id } });
  }

  findByName(settingName: SettingKey): Promise<Setting> {
    return this.repo.findOne({ where: { settingName }, cache: true });
  }

  update(id: number, updateSettingDto: UpdateSettingDto): Promise<UpdateResult> {
    return this.repo.update(id, updateSettingDto);
  }

  updateByName(settingName: string, updateSettingDto: UpdateSettingDto): Promise<UpdateResult> {
    return this.repo.update({ settingName }, updateSettingDto);
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return true;
  }

  async getSettingValue<T>(key: SettingKey): Promise<T> {
    const setting = await this.findByName(key);
    if (setting?.settingValue?.value != undefined) {
      return setting.settingValue.value;
    }
    return setting?.settingValue;
  }

  async getRequestSpreadRange(): Promise<number> {
    return +(await this.getSettingValue<string>(SettingKey.requestSpreadRange));
  }

  // getAllowedPickupZones(): Promise<Zone[]> {
  //   return this.getSettingValue<Zone[]>(SettingKey.allowedPickupZones);
  // }

  // getDriverActivationSetting(): Promise<DriverActivationSetting> {
  //   return this.getSettingValue<DriverActivationSetting>(SettingKey.driverActivation);
  // }

  // getInvitationSetting(): Promise<InvitationSettings> {
  //   return this.getSettingValue<InvitationSettings>(SettingKey.invitation);
  // }

  // /** get default driver category for newly registered drivers */
  // getDefaultDriverCategoryId(): Promise<number> {
  //   return this.getSettingValue<number>(SettingKey.defaultDriverCategory)
  // }

  // /** get default car types for newly registered drivers */
  // async getDefaultDriverCarTypes(): Promise<number[]> {
  //   return this.getSettingValue<number[]>(SettingKey.defaultDriverCarTypes);
  // }

  // /** Get testers default OTP */
  // async getTestersOTP(): Promise<number> {
  //   return this.getSettingValue<number>(SettingKey.testersOtp);
  // }

  /** Get otp durations before it expires in minutes */
  async getOTPDuration(): Promise<number> {
    return this.getSettingValue<number>(SettingKey.otpDuration);
  }

  /** Get otp durations before it expires in minutes */
  async getOTPResendLimit(): Promise<number> {
    return this.getSettingValue<number>(SettingKey.otpResendLimit);
  }

  // async getDriverIsAutoActivated(): Promise<boolean> {
  //   return this.getSettingValue<boolean>(SettingKey.driverIsAutoActivated);
  // }

  // getPromoBulkGeneratorConfig(): Promise<generatorConfig> {
  //   return this.getSettingValue<generatorConfig>(SettingKey.promoBulkGeneratorConfig);
  // }

  // getPaymentSettings() {
  //   return this.getSettingValue<PaymentProvidersSettings>(SettingKey.paymentSettings);
  // }

  // getGoogleMapsSettings() {
  //   return this.getSettingValue<GoogleMapSettingsDto>(SettingKey.googleMapsSettings);
  // }

  // getAllowedMinutesBetweenZonesExit() {
  //   return this.getSettingValue<number>(SettingKey.allowedMinutesBetweenZonesExit);
  // }

  // getTripTransactionSettings() {
  //   return this.getSettingValue<TripTransactionSettings>(SettingKey.tripTransactionsSettings);
  // }

  // getTripNotificationSettings() {
  //   return this.getSettingValue<TripNotificationsSettings>(SettingKey.tripNotificationsSettings);
  // }

  // getContactInfo(): Promise<ContactUsInfoDto[]> {
  //   return this.getSettingValue<ContactUsInfoDto[]>(SettingKey.contactUsInfo);
  // }

  // getDriversDocumentsTypes(): Promise<DriverDocumentTypeDto[]> {
  //   return this.getSettingValue<DriverDocumentTypeDto[]>(SettingKey.driversDocumentsTypes);
  // }
}
