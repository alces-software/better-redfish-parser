import { router } from '../../base';
import addAsset from './controllers/addAsset';
import addAssetVersion from './controllers/addAssetVersion';
import deleteAsset from './controllers/deleteAsset';
import getAllLatestAssets from './controllers/getAllLatestAssets';
import getAssetHistory from './controllers/getAssetHistory';
import getLatestAsset from './controllers/getLatestAsset';

export default router({
   getAllLatest: getAllLatestAssets,
   getHistory: getAssetHistory,
   getLatest: getLatestAsset,
   delete: deleteAsset,
   add: addAsset,
   addVersion: addAssetVersion
});
