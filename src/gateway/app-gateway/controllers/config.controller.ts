import { JwtAuthGuard } from "@/accounts/guards/jwt-auth.guard";
import { OSType } from "@/config/dto/os-types.enum";
import { AppInfoService } from "@/config/services/app-info.service";
import { Controller, Get, UseGuards, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('config')
@UseGuards(JwtAuthGuard)
@ApiTags('config')
@ApiBearerAuth()
export class ConfigController {
    constructor(
        private appInfoService: AppInfoService,
    ) { }

    @Get('app-info/:osType')
    async getAppInfo(@Param('osType') osType: OSType) {
        return this.appInfoService.findOneByType({
            osType: osType,
        })
    }
}
