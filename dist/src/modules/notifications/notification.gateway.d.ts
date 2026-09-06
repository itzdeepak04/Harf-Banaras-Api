import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { RealtimeNotification } from './notification.types';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    server: Server;
    private readonly identities;
    constructor(jwtService: JwtService, configService: ConfigService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    notifyRoles(roles: string[], notification: Omit<RealtimeNotification, 'id' | 'createdAt'>): void;
    notifyUser(userId: string, notification: Omit<RealtimeNotification, 'id' | 'createdAt'>): void;
    notifyCustomers(notification: Omit<RealtimeNotification, 'id' | 'createdAt'>): void;
    private emitTo;
    private readToken;
}
