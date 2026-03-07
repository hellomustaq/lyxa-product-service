import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rabbitMqUrl =
    process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const userEventsQueue =
    process.env.RABBITMQ_USER_EVENTS_QUEUE ||
    'auth-service-user-events-queue';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: userEventsQueue,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  const port = Number(process.env.PRODUCT_PORT || process.env.PORT || 3001);
  await app.listen(port);
}
bootstrap();
