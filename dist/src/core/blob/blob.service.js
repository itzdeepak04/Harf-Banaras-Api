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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_blob_1 = require("@azure/storage-blob");
let BlobService = class BlobService {
    constructor(config) {
        this.config = config;
        const connectionString = this.config.get('AZURE_STORAGE_CONNECTION_STRING');
        this.containerName = this.config.get('AZURE_STORAGE_CONTAINER_NAME') || 'products';
        this.accountName = this.config.get('AZURE_STORAGE_ACCOUNT_NAME') || '';
        this.accountKey = this.config.get('AZURE_STORAGE_ACCOUNT_KEY') || '';
        if (connectionString) {
            this.client = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        }
        else if (this.accountName && this.accountKey) {
            this.client = new storage_blob_1.BlobServiceClient(`https://${this.accountName}.blob.core.windows.net`, new storage_blob_1.StorageSharedKeyCredential(this.accountName, this.accountKey));
        }
    }
    async createSasUrl(path, contentType, mode) {
        if (!this.client) {
            throw new common_1.BadRequestException('Blob storage is not configured. Set AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY.');
        }
        const cleanPath = path.replace(/^\/+/, '').replace(/\.\.+/g, '');
        if (!cleanPath || cleanPath.includes('\\')) {
            throw new common_1.BadRequestException('A valid blob path is required');
        }
        if (mode === 'upload' && !contentType) {
            throw new common_1.BadRequestException('contentType is required for uploads');
        }
        const container = this.client.getContainerClient(this.containerName);
        const blob = container.getBlockBlobClient(cleanPath);
        const credential = this.client.credential;
        if (!(credential instanceof storage_blob_1.StorageSharedKeyCredential)) {
            throw new common_1.BadRequestException('Blob SAS generation requires a shared key credential');
        }
        const permissions = mode === 'upload'
            ? storage_blob_1.BlobSASPermissions.parse('cw')
            : storage_blob_1.BlobSASPermissions.parse('r');
        const expiresOn = new Date(Date.now() + 15 * 60 * 1000);
        const sas = (0, storage_blob_1.generateBlobSASQueryParameters)({
            containerName: this.containerName,
            blobName: cleanPath,
            permissions,
            startsOn: new Date(Date.now() - 60 * 1000),
            expiresOn,
            protocol: storage_blob_1.SASProtocol.Https,
            contentType: mode === 'upload' ? contentType : undefined,
        }, credential).toString();
        return {
            path: cleanPath,
            url: `${blob.url}?${sas}`,
            expiresOn,
        };
    }
};
exports.BlobService = BlobService;
exports.BlobService = BlobService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BlobService);
//# sourceMappingURL=blob.service.js.map