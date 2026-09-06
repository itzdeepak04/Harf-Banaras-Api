"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
const crypto_1 = require("crypto");
let NotificationGateway = class NotificationGateway {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.identities = new Map();
    }
    handleConnection(client) {
        const token = this.readToken(client);
        if (!token) {
            client.disconnect(true);
            return;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            this.identities.set(client.id, { userId: payload.sub, role: payload.role });
        }
        catch {
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.identities.delete(client.id);
    }
    notifyRoles(roles, notification) {
        this.emitTo((identity) => roles.includes(identity.role), notification);
    }
    notifyUser(userId, notification) {
        this.emitTo((identity) => identity.userId === userId, notification);
    }
    notifyCustomers(notification) {
        this.notifyRoles(['customer'], notification);
    }
    emitTo(predicate, notification) {
        const payload = {
            ...notification,
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date().toISOString(),
        };
        for (const [socketId, identity] of this.identities) {
            if (predicate(identity))
                this.server.to(socketId).emit('notification', payload);
        }
    }
    readToken(client) {
        const authToken = client.handshake.auth?.token;
        if (typeof authToken === 'string')
            return authToken.replace(/^Bearer\s+/i, '');
        const authorization = client.handshake.headers.authorization;
        return authorization?.replace(/^Bearer\s+/i, '');
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleDisconnect", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'notifications',
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:3001',
                'https://harf-banaras-gvl9ue2y4-nahak-deepak-prakashchandras-projects.vercel.app',
                process.env.FRONTEND_URL
            ].filter(Boolean),
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map