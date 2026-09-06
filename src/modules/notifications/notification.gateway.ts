import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import { RealtimeNotification } from './notification.types';

interface SocketIdentity {
  userId: string;
  role: string;
}

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://harf-banaras-ui.vercel.app',
      'https://harf-banaras-gvl9ue2y4-nahak-deepak-prakashchandras-projects.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly identities = new Map<string, SocketIdentity>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    const token = this.readToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; role: string }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      this.identities.set(client.id, { userId: payload.sub, role: payload.role });
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.identities.delete(client.id);
  }

  notifyRoles(roles: string[], notification: Omit<RealtimeNotification, 'id' | 'createdAt'>) {
    this.emitTo((identity) => roles.includes(identity.role), notification);
  }

  notifyUser(userId: string, notification: Omit<RealtimeNotification, 'id' | 'createdAt'>) {
    this.emitTo((identity) => identity.userId === userId, notification);
  }

  notifyCustomers(notification: Omit<RealtimeNotification, 'id' | 'createdAt'>) {
    this.notifyRoles(['customer'], notification);
  }

  private emitTo(
    predicate: (identity: SocketIdentity) => boolean,
    notification: Omit<RealtimeNotification, 'id' | 'createdAt'>,
  ) {
    const payload: RealtimeNotification = {
      ...notification,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    for (const [socketId, identity] of this.identities) {
      if (predicate(identity)) this.server.to(socketId).emit('notification', payload);
    }
  }

  private readToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string') return authToken.replace(/^Bearer\s+/i, '');

    const authorization = client.handshake.headers.authorization;
    return authorization?.replace(/^Bearer\s+/i, '');
  }
}
