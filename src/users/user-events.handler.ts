import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserEventsHandler {
  private readonly logger = new Logger(UserEventsHandler.name);

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any) {
    this.logger.log(`Received user.created event: ${JSON.stringify(data)}`);
  }
}

