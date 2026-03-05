import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export interface RequestUser {
  userId: string;
  email: string;
  role: string;
}

interface ValidateTokenResponse {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class RmqAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<{ headers: Record<string, string>; user?: RequestUser }>();

    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    try {
      const payload = await lastValueFrom(
        this.authClient.send('auth.validate-token', {
          token,
        }),
      );

      request.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

