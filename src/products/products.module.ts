import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Product } from './product.model';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { RmqAuthGuard } from '../auth/rmq-auth.guard';

@Module({
  imports: [
    TypegooseModule.forFeature([Product]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>('RABBITMQ_URL') ||
                'amqp://guest:guest@localhost:5672',
            ],
            queue:
              configService.get<string>('RABBITMQ_AUTH_QUEUE') ||
              'auth-service-auth-queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, RmqAuthGuard],
  exports: [ProductsService],
})
export class ProductsModule {}
