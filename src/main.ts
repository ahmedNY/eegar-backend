import * as dotenv from 'dotenv'
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminGatewayModule } from './gateway/admin-gateway/admin-gateway.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { initCustomSocketAdapter } from './socket-gateway/init-custom-socket-adapters';
import { AppGatewayModule } from './gateway/app-gateway/app-gateway.module';

global.__basedir = __dirname
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '../..', 'uploads'));
  app.enableCors({origin: "*", allowedHeaders: '*'});
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  
  app.useStaticAssets(join(__dirname, '../..', 'public'))
  
  setupSwagger(app, {
    title: 'Admin API',
    desc: 'Admin gateway rest api reference',
    nestModule: AdminGatewayModule,
    gatewayPath: 'web',
  });

  setupSwagger(app, {
    title: 'App API',
    desc: 'App gateway api reference',
    nestModule: AppGatewayModule,
    gatewayPath: 'app',
  });
  
  initCustomSocketAdapter(app);
  await app.startAllMicroservices();
  await app.listen(5050);
  console.log(`Server is running on: ${await app.getUrl()}`);
  console.log(process.cwd())
}

bootstrap();

function setupSwagger(
  app: INestApplication,
  swaggerConfig: {
    title: string,
    desc: string,
    nestModule: any,
    gatewayPath: string,
  },) {
  const { nestModule, gatewayPath, title, desc } = swaggerConfig;
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(desc)
    .setVersion('2.0')
    // .addServer(`http://localhost:5050/${gatewayPath}`)
    .addServer(`/${gatewayPath}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [nestModule],
  });

  const { paths: pathsObject} = document;

  for (const path of Object.keys(pathsObject)) {
    const trimmedPath = path.replace(`/${gatewayPath}`, '');
    pathsObject[trimmedPath] = pathsObject[path];
    delete pathsObject[path];
  }

  SwaggerModule.setup(`${gatewayPath}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      // docExpansion: 'none',
    }
  });
}

