import { http, HttpResponse } from 'msw';
import { MOCK_FLOOR_PLAN_DATA, MOCK_ASSETS } from './mockData';

export const handlers = [
  // 1. 평면도 데이터 조회 (GET)
  http.get('/api/server-rooms/:roomId/floorplan', ({ params }) => {
    const { roomId } = params;
    console.log(`[MSW] GET /api/server-rooms/${roomId}/floorplan`);

    // 지금은 모든 roomId에 동일한 데이터를 반환하지만,
    // 나중에는 roomId에 따라 다른 목업 데이터를 반환하도록 확장 가능
    return HttpResponse.json(MOCK_FLOOR_PLAN_DATA);
  }),

  // 5. (신규) 서버실 상세 정보(크기 등) 업데이트 (PUT)
 http.put('/api/server-rooms/:roomId/floorplan/details', async ({ params, request }) => {
  const { roomId } = params;
  const updatedDetails = (await request.json()) as { gridCols?: number, gridRows?: number };
  
  console.log(`[MSW] PUT /api/server-rooms/${roomId}/floorplan/details`, updatedDetails);

  // Mock DB 업데이트
  if (updatedDetails.gridCols) {
   MOCK_FLOOR_PLAN_DATA.gridCols = updatedDetails.gridCols;
  }
  if (updatedDetails.gridRows) {
   MOCK_FLOOR_PLAN_DATA.gridRows = updatedDetails.gridRows;
  }

  // 업데이트된 전체 데이터 반환 (혹은 성공 여부만)
  return HttpResponse.json(MOCK_FLOOR_PLAN_DATA);
 }),

  // 2. (추후 구현) 자산 추가 (POST)
  http.post('/api/floorplan/assets', async ({ request }) => {
    const newAsset = (await request.json()) as any;
    const id = `asset_${crypto.randomUUID()}`;
    console.log('[MSW] POST /api/floorplan/assets', newAsset);
    // TODO: MOCK_ASSETS 배열에 newAsset 추가 (실제 DB처럼 동작)
    return HttpResponse.json({ ...newAsset, id });
  }),

  // 3. (추후 구현) 자산 업데이트 (PUT)
  http.put('/api/floorplan/assets/:assetId', async ({ params, request }) => {
    const { assetId } = params;
    const updatedProps = await request.json();
    console.log(`[MSW] PUT /api/floorplan/assets/${assetId}`, updatedProps);
    // TODO: MOCK_ASSETS 배열에서 assetId에 해당하는 항목 찾아 업데이트
    return HttpResponse.json({ id: assetId, ...updatedProps });
  }),

  // 4. (추후 구현) 자산 삭제 (DELETE)
  http.delete('/api/floorplan/assets/:assetId', ({ params }) => {
    const { assetId } = params;
    console.log(`[MSW] DELETE /api/floorplan/assets/${assetId}`);
    // TODO: MOCK_ASSETS 배열에서 assetId에 해당하는 항목 삭제
    return HttpResponse.json({ success: true, id: assetId });
  }),
];