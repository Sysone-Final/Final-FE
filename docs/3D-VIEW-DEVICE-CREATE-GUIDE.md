# 3D View에서 장치 생성 가이드

## 개요
서버실 3D 뷰에서 편집 모드를 통해 장치를 생성할 때 실제 POST API(`/api/devices`)를 호출하여 백엔드에 장치를 저장합니다.

## API 엔드포인트
```
POST /api/devices
```

## 요청 데이터 구조
```json
{
  "deviceName": "Dell PowerEdge R750",
  "deviceCode": "DEV-2024-0551",
  "gridY": 5,
  "gridX": 15,
  "gridZ": 0,
  "rotation": 0,
  "status": "NORMAL",
  "modelName": "PowerEdge R750",
  "manufacturer": "Dell",
  "serialNumber": "SN-DEV-001",
  "purchaseDate": "2024-01-15",
  "warrantyEndDate": "2027-01-15",
  "notes": "메인 서버",
  "deviceTypeId": 1,
  "datacenterId": 1,
  "rackId": 2,
  "serverRoomId": 1
}
```

## 구현 내용

### 1. 타입 정의 추가 (`types/index.ts`)
```typescript
// 새 장비 생성 요청 데이터 구조
export interface CreateDeviceRequest {
  deviceName: string;
  deviceCode: string;
  gridY: number;
  gridX: number;
  gridZ: number;
  rotation: number; // 각도 (degree)
  status: string;
  modelName?: string;
  manufacturer?: string;
  serialNumber?: string;
  purchaseDate?: string;
  warrantyEndDate?: string;
  notes?: string;
  deviceTypeId: number;
  datacenterId: number;
  rackId?: number | null;
  serverRoomId: number;
}

// 장비 생성 응답 구조
export interface CreateDeviceResponse {
  status_code: number;
  status_message: string;
  result: BackendDevice;
}
```

### 2. API 함수 추가 (`api/serverRoomEquipmentApi.ts`)
```typescript
/**
 * deviceTypeId 매핑 (EquipmentType -> deviceTypeId)
 */
const DEVICE_TYPE_ID_MAP: Record<string, number> = {
  server: 1,
  door: 2,
  climatic_chamber: 3,
  fire_extinguisher: 4,
  thermometer: 5,
  aircon: 6,
};

/**
 * 새 장비 생성 (실제 POST /api/devices 사용)
 * @param equipment 추가할 장비 정보
 * @param serverRoomId 서버실 ID
 * @param datacenterId 데이터센터 ID
 * @returns 생성된 장비 정보
 */
export async function createDevice(
  equipment: Omit<Equipment3D, "id" | "equipmentId">,
  serverRoomId: number,
  datacenterId: number,
): Promise<Equipment3D>
```

### 3. 컴포넌트 수정 (`components/BabylonDatacenterView.tsx`)

#### Props 추가
```typescript
interface BabylonDatacenterViewProps {
  mode?: 'edit' | 'view';
  serverRoomId?: string;
  datacenterId?: number; // 데이터센터 ID 추가
}
```

#### 장비 추가 핸들러 수정
```typescript
const handleAddEquipment = useCallback(async (type: EquipmentType) => {
  if (!serverRoomId) {
    showToast('서버실 ID가 없습니다', 'error');
    return;
  }

  try {
    // API를 통해 장비 생성
    const createdEquipment = await createDevice(
      {
        type,
        gridX: centerX,
        gridY: centerY,
        gridZ: 0,
        rotation: 0,
        metadata: {
          name: `새 ${type}`,
          status: 'NORMAL',
        },
      },
      Number(serverRoomId),
      datacenterId,
    );

    // 스토어에 추가
    useBabylonDatacenterStore.setState((state) => ({
      equipment: [...state.equipment, createdEquipment],
    }));

    showToast('장비가 추가되었습니다', 'success');
  } catch (error) {
    console.error('Failed to add equipment:', error);
    showToast('장비 추가에 실패했습니다', 'error');
  }
}, [serverRoomId, datacenterId, gridConfig.columns, gridConfig.rows, showToast]);
```

## 사용 방법

### 1. 컴포넌트 사용 시 Props 전달
```tsx
<BabylonDatacenterView 
  mode="edit" 
  serverRoomId="1" 
  datacenterId={1} // 필수!
/>
```

### 2. 팔레트에서 장비 추가
- 오른쪽 장비 팔레트에서 원하는 장비 타입 클릭
- 자동으로 중앙에 장비가 배치되고 API 호출

### 3. 드래그 앤 드롭으로 장비 추가
- 장비 팔레트에서 장비를 드래그
- 원하는 위치에 드롭
- API를 통해 해당 위치에 장비 생성

## 주요 기능

### 자동 생성되는 데이터
- **deviceCode**: `DEV-{연도}-{랜덤4자리}` 형식으로 자동 생성
- **deviceName**: `새 {장비타입}` 형식으로 기본값 설정
- **status**: 기본값 `NORMAL`
- **rotation**: 라디안(프론트) ↔ 각도(백엔드) 자동 변환

### deviceTypeId 매핑
| EquipmentType | deviceTypeId | Category | Description |
|--------------|--------------|----------|-------------|
| server | 1 | SERVER | 서버 랙 |
| door | 2 | DOOR | 출입문 |
| thermometer | 3 | THERMOMETER | 온도 센서 |
| fire_extinguisher | 4 | FIRE_EXTINGUISHER | 소화기 |
| climatic_chamber | 5 | CLIMATIC_CHAMBER | 항온항습기 |
| aircon | 6 | AIRCON | 정밀 에어컨 |

### 유효성 검사
- 격자 범위 내 위치인지 확인
- 이미 다른 장비가 있는 위치인지 확인
- API 호출 실패 시 에러 메시지 표시

## 에러 처리
- 서버실 ID 없음: "서버실 ID가 없습니다"
- 격자 범위 벗어남: "격자 범위를 벗어났습니다"
- 위치 중복: "이미 장비가 배치되어 있습니다"
- API 호출 실패: "장비 추가에 실패했습니다"

## 향후 개선사항
1. **메타데이터 입력 모달**: 장비 생성 시 상세 정보(modelName, manufacturer 등) 입력
2. **deviceCode 백엔드 생성**: 현재는 프론트에서 생성하지만 백엔드에서 생성하는 것이 권장됨
3. **장비 수정 API 연동**: 위치/회전 변경 시 PATCH API 호출
4. **장비 삭제 API 연동**: DELETE API 호출
5. **낙관적 업데이트**: API 호출 전 UI 먼저 업데이트하고 실패 시 롤백

## 참고사항
- 3D 좌표계와 백엔드 좌표계 차이 주의
  - 프론트: rotation은 라디안 (0 ~ 2π)
  - 백엔드: rotation은 각도 (0 ~ 360)
  - 자동 변환 처리됨
