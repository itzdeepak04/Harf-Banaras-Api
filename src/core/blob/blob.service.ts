import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

@Injectable()
export class BlobService {
  private readonly client?: BlobServiceClient;
  private readonly containerName: string;
  private readonly accountName: string;
  private readonly accountKey: string;

  constructor(private readonly config: ConfigService) {
    const connectionString = this.config.get<string>('AZURE_STORAGE_CONNECTION_STRING');
    this.containerName = this.config.get<string>('AZURE_STORAGE_CONTAINER_NAME') || 'products';
    this.accountName = this.config.get<string>('AZURE_STORAGE_ACCOUNT_NAME') || '';
    this.accountKey = this.config.get<string>('AZURE_STORAGE_ACCOUNT_KEY') || '';

    if (connectionString) {
      this.client = BlobServiceClient.fromConnectionString(connectionString);
    } else if (this.accountName && this.accountKey) {
      this.client = new BlobServiceClient(
        `https://${this.accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(this.accountName, this.accountKey),
      );
    }
  }

  async createSasUrl(path: string, contentType: string, mode: 'upload' | 'read') {
    if (!this.client) {
      throw new BadRequestException(
        'Blob storage is not configured. Set AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY.',
      );
    }
    const cleanPath = path.replace(/^\/+/, '').replace(/\.\.+/g, '');
    if (!cleanPath || cleanPath.includes('\\')) {
      throw new BadRequestException('A valid blob path is required');
    }
    if (mode === 'upload' && !contentType) {
      throw new BadRequestException('contentType is required for uploads');
    }

    const container = this.client.getContainerClient(this.containerName);
    const blob = container.getBlockBlobClient(cleanPath);
    const credential = this.client.credential;
    if (!(credential instanceof StorageSharedKeyCredential)) {
      throw new BadRequestException('Blob SAS generation requires a shared key credential');
    }

    const permissions = mode === 'upload'
      ? BlobSASPermissions.parse('cw')
      : BlobSASPermissions.parse('r');
    const expiresOn = new Date(Date.now() + 15 * 60 * 1000);
    const sas = generateBlobSASQueryParameters({
      containerName: this.containerName,
      blobName: cleanPath,
      permissions,
      startsOn: new Date(Date.now() - 60 * 1000),
      expiresOn,
      protocol: SASProtocol.Https,
      contentType: mode === 'upload' ? contentType : undefined,
    }, credential).toString();

    return {
      path: cleanPath,
      url: `${blob.url}?${sas}`,
      expiresOn,
    };
  }
}
