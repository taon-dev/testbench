import type { ManualTestDefinition } from './manual-test.types';
import { MultipartUploadComponent } from './test2-multipart-upload/multipart-upload.component';
import { NormalUploadComponent } from './test1-normal-upload/normal-upload.component';
import { PrivateAssetsComponent } from './test4-private-assets/private-assets.component';
import { PublicAssetsComponent } from './test3-public-assets/public-assets.component';

export const manualTestRegistry: readonly ManualTestDefinition[] = [
  {
    id: 'normal-upload',
    title: 'Normal File Upload',
    description: 'Standard upload, maximum 50 MB',
    component: NormalUploadComponent,
  },
  {
    id: 'multipart-upload',
    title: 'Multipart File Upload',
    description: 'Large files, chunk progress, cancellation',
    component: MultipartUploadComponent,
  },
  {
    id: 'public-assets',
    title: 'Public Assets',
    description: 'Public file downloads and native video/audio playback',
    component: PublicAssetsComponent,
  },
  {
    id: 'private-assets',
    title: 'Private Assets',
    description: 'Protected downloads and native media access',
    component: PrivateAssetsComponent,
  },
];
