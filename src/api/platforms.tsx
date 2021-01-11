import { getPlatforms } from '@ionic/react';
const platforms = getPlatforms();
export const isMobile = platforms.includes("ios");
