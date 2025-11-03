import { http, HttpResponse } from 'msw';
import {
  MOCK_FLOOR_PLAN_DATA,
  MOCK_ASSETS,
} from './mockData';
import type { Asset } from '../types';

export const handlers = [
  //  평면도 데이터 조회 (GET)
  http.get('/api/server-rooms/:roomId/floorplan', ({ params }) => {
    const { roomId } = params;
    console.log(`[MSW] GET /api/server-rooms/${roomId}/floorplan`);
    return HttpResponse.json(MOCK_FLOOR_PLAN_DATA);
  }),

  // 서버실 상세 정보(크기 등) 업데이트 (PUT)
  http.put('/api/server-rooms/:roomId/floorplan/details', async ({ params, request }) => {
    const { roomId } = params;
    const updatedDetails = (await request.json()) as { gridCols?: number, gridRows?: number };
    
    console.log(`[MSW] PUT /api/server-rooms/${roomId}/floorplan/details`, updatedDetails);

    if (updatedDetails.gridCols) {
      MOCK_FLOOR_PLAN_DATA.gridCols = updatedDetails.gridCols;
    }
    if (updatedDetails.gridRows) {
      MOCK_FLOOR_PLAN_DATA.gridRows = updatedDetails.gridRows;
    }
    return HttpResponse.json(MOCK_FLOOR_PLAN_DATA);
  }),

  //  자산 추가 (POST) 
  http.post('/api/floorplan/assets', async ({ request }) => {
    const newAssetTemplate = (await request.json()) as Omit<Asset, 'id'>;
    
    // MSW에서 새 자산에 ID와 생성일 추가
    const newAsset: Asset = {
      ...newAssetTemplate,
      id: `asset_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    
    console.log('[MSW] POST /api/floorplan/assets (New Asset):', newAsset);

    // Mock DB에 실제로 추가
    MOCK_ASSETS.push(newAsset);
    MOCK_FLOOR_PLAN_DATA.assets = MOCK_ASSETS;

    // 클라이언트(floorPlanStore)는 ID가 포함된 완전한 자산 객체를 받길 기대함
    return HttpResponse.json(newAsset, { status: 201 }); // 201 Created
  }),

  //  자산 업데이트 (PUT) 
  http.put('/api/floorplan/assets/:assetId', async ({ params, request }) => {
    const { assetId } = params;
    const updatedProps = (await request.json()) as Partial<Asset>;
    
    console.log(`[MSW] PUT /api/floorplan/assets/${assetId}`, updatedProps);

    let updatedAsset: Asset | undefined;

    // MOCK_ASSETS 배열을 map을 돌며 해당 ID를 찾아 업데이트
    const newAssetsArray = MOCK_ASSETS.map((asset) => {
      if (asset.id === assetId) {
        updatedAsset = {
          ...asset,
          ...updatedProps,
          updatedAt: new Date().toISOString(),
        };
        return updatedAsset;
      }
      return asset;
    });

    if (updatedAsset) {
      // Mock DB 업데이트
      MOCK_ASSETS.length = 0; // 배열 비우기
      MOCK_ASSETS.push(...newAssetsArray); // 새 배열 내용으로 채우기
      MOCK_FLOOR_PLAN_DATA.assets = MOCK_ASSETS;
      
      return HttpResponse.json(updatedAsset);
    } else {
      return HttpResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      );
    }
  }),

  // 자산 삭제 (DELETE)
  http.delete('/api/floorplan/assets/:assetId', ({ params }) => {
    const { assetId } = params;
    console.log(`[MSW] DELETE /api/floorplan/assets/${assetId}`);

    const index = MOCK_ASSETS.findIndex((asset) => asset.id === assetId);
    
    if (index > -1) {
      MOCK_ASSETS.splice(index, 1);
      MOCK_FLOOR_PLAN_DATA.assets = MOCK_ASSETS;
      return HttpResponse.json({ success: true, id: assetId });
    } else {
      return HttpResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      );
    }
  }),
];