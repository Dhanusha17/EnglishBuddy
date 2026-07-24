import { IStorageProvider } from './IStorageProvider';
import { LocalStorageProvider } from './LocalStorageProvider';
import { S3StorageProvider } from './S3StorageProvider';
import { CloudinaryStorageProvider } from './CloudinaryStorageProvider';

class StorageFactory {
  private static instance: IStorageProvider | null = null;

  public static getStorageProvider(): IStorageProvider {
    if (!StorageFactory.instance) {
      const providerType = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();

      switch (providerType) {
        case 's3':
        case 'aws':
          StorageFactory.instance = new S3StorageProvider();
          break;
        case 'cloudinary':
          StorageFactory.instance = new CloudinaryStorageProvider();
          break;
        case 'local':
        default:
          StorageFactory.instance = new LocalStorageProvider();
          break;
      }
    }

    return StorageFactory.instance;
  }

  public static setStorageProvider(provider: IStorageProvider): void {
    StorageFactory.instance = provider;
  }
}

export const getStorageProvider = StorageFactory.getStorageProvider;
export { StorageFactory };
