import { ProductNameType } from 'src/generated/prisma/client/client';

export const DISPLAY_NAMES: Record<ProductNameType, string> = {
  [ProductNameType.BASE]: 'Базовый',
  [ProductNameType.PRO]: 'Профессиональный',
  [ProductNameType.PREMIUM]: 'Премиум',
  [ProductNameType.UNLIMITED]: 'Безлимитный',
};
