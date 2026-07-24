import { Router } from 'express';
import getAllLatestAssets from './controllers/getAllLatestAssets';
import getAssetHistory from './controllers/getAssetHistory';
import getLatestAsset from './controllers/getLatestAsset';
import deleteAsset from './controllers/deleteAsset';
import addAsset from './controllers/addAsset';
import addAssetVersion from './controllers/addAssetVersion';

export default Router()
   .get('/', getAllLatestAssets)
   .get('/:uuid/history', getAssetHistory)
   .get('/:uuid', getLatestAsset)
   .delete('/:uuid', deleteAsset)
   .post('/', addAsset)
   .post('/:uuid', addAssetVersion);
