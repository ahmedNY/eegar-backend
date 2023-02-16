import { OSType } from "../dto/os-types.enum";

export class AppInfo {
    versionTitle: string;
    versionName: string;
    versionCode: string;
    isRequired: boolean;
    versionUrl: string;
    termsUrl: string;
    privacyUrl: string;
    rateUrl: string;
    os: OSType;
}
