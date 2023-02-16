import { Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';
import { AdminGatewayModule } from './admin-gateway/admin-gateway.module';
import { AppGatewayModule } from './app-gateway/app-gateway.module';
import { IndexController } from './index.controller';

const gatewayRoutes: Routes = [
  {
    path: 'web',
    module: AdminGatewayModule,
  },
  {
    path: 'app',
    module: AppGatewayModule,
  },
]

@Module({
  imports: [
    AdminGatewayModule,
    AppGatewayModule,
    RouterModule.register(gatewayRoutes),
  ],
  controllers: [
    IndexController,
  ]
})
export class GatewayModule { }
