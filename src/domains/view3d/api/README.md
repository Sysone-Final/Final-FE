# 서버실 장비 API 연동 가이드

## 📋 백엔드 API 명세

### 1. 서버실 장비 목록 조회

```http
GET /api/server-rooms/{serverRoomId}/equipment
```

**응답 예시:**
```json
{
  "serverRoomId": "550e8400-e29b-41d4-a716-446655440000",
  "serverRoomName": "IDC A-Zone Floor 3",
  "equipment": [
    {
      "equipmentId": "eq-001-uuid",
      "equipmentType": "server",
      "rackId": "rack-001-uuid",
      "gridPosition": {
        "x": 2,
        "y": 2,
        "z": 0
      },
      "rotation": 0,
      "metadata": {
        "name": "Server Rack A1",
        "status": "active",
        "temperature": 25.5
      }
    },
    {
      "equipmentId": "eq-002-uuid",
      "equipmentType": "aircon",
      "gridPosition": {
        "x": 9,
        "y": 0,
        "z": 0
      },
      "rotation": -1.5707963267948966,
      "metadata": {
        "name": "Air Conditioner 1",
        "status": "active"
      }
    }
  ]
}
```

### 2. 장비 추가

```http
POST /api/server-rooms/{serverRoomId}/equipment/add
Content-Type: application/json

{
  "equipmentType": "server",
  "rackId": "rack-001-uuid",
  "gridPosition": {
    "x": 3,
    "y": 3,
    "z": 0
  },
  "rotation": 0,
  "metadata": {
    "name": "New Server Rack"
  }
}
```

**응답:**
```json
{
  "equipmentId": "eq-new-uuid",
  "equipmentType": "server",
  "rackId": "rack-001-uuid",
  "gridPosition": {
    "x": 3,
    "y": 3,
    "z": 0
  },
  "rotation": 0,
  "metadata": {
    "name": "New Server Rack"
  }
}
```

### 3. 장비 정보 수정

```http
PATCH /api/server-rooms/{serverRoomId}/equipment/{equipmentId}
Content-Type: application/json

{
  "gridPosition": {
    "x": 4,
    "y": 4,
    "z": 0
  },
  "rotation": 1.57,
  "metadata": {
    "name": "Updated Server Rack",
    "status": "maintenance"
  }
}
```

### 4. 장비 삭제

```http
DELETE /api/server-rooms/{serverRoomId}/equipment/{equipmentId}
```

### 5. 전체 레이아웃 일괄 저장

```http
POST /api/server-rooms/{serverRoomId}/equipment
Content-Type: application/json

[
  {
    "equipmentType": "server",
    "rackId": "rack-001-uuid",
    "gridPosition": { "x": 2, "y": 2, "z": 0 },
    "rotation": 0,
    "metadata": { "name": "Server 1" }
  },
  {
    "equipmentType": "aircon",
    "gridPosition": { "x": 9, "y": 0, "z": 0 },
    "rotation": -1.57,
    "metadata": { "name": "AC 1" }
  }
]
```

---

## 🔧 프론트엔드 사용법

### 1. 목 데이터 대신 실제 API 사용

**Before (목 데이터):**
```typescript
import { getServerRoomEquipment } from '../data/mockServerRoomEquipment';

const equipment = getServerRoomEquipment('a1');
```

**After (실제 API):**
```typescript
import { fetchServerRoomEquipment } from '../api/serverRoomEquipmentApi';

const equipment = await fetchServerRoomEquipment('550e8400-e29b-41d4-a716-446655440000');
```

### 2. 컴포넌트에서 사용 예시

```typescript
import { useEffect, useState } from 'react';
import { fetchServerRoomEquipment } from '../api/serverRoomEquipmentApi';
import type { Equipment3D } from '../types';

function ServerRoomView({ serverRoomId }: { serverRoomId: string }) {
  const [equipment, setEquipment] = useState<Equipment3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        const data = await fetchServerRoomEquipment(serverRoomId);
        setEquipment(data);
      } catch (err) {
        setError('Failed to load equipment');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [serverRoomId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Loaded {equipment.length} equipment items</div>;
}
```

### 3. 장비 추가 예시

```typescript
import { addEquipment } from '../api/serverRoomEquipmentApi';

async function handleAddServer() {
  const newEquipment = await addEquipment(serverRoomId, {
    type: 'server',
    gridX: 5,
    gridY: 5,
    gridZ: 0,
    rotation: 0,
    metadata: {
      name: 'New Server Rack',
      status: 'active',
    },
  });

  console.log('Created equipment with ID:', newEquipment.equipmentId);
}
```

### 4. 장비 위치 업데이트 예시

```typescript
import { updateEquipment } from '../api/serverRoomEquipmentApi';

async function handleMoveEquipment(equipmentId: string, newX: number, newY: number) {
  await updateEquipment(serverRoomId, equipmentId, {
    gridX: newX,
    gridY: newY,
  });
}
```

---

## 🔑 ID 처리 방식 정리

### 프론트엔드 측면

1. **`id` 필드**: 프론트엔드에서 장비를 식별하는 데 사용
   - 백엔드에서 받은 `equipmentId` (UUID)를 그대로 사용
   - 예: `"eq-550e8400-e29b-41d4-a716-446655440000"`

2. **`equipmentId` 필드**: 백엔드 원본 ID 보관
   - API 호출 시 사용 (업데이트, 삭제 등)
   - 백엔드와의 데이터 동기화에 필수

3. **`rackId` 필드**: 서버 랙인 경우 랙 ID
   - 백엔드의 랙 테이블과 연동
   - 서버 타입이 아닌 경우 `undefined`

### 백엔드 측면

백엔드 개발자에게 전달할 DB 스키마 예시:

```sql
-- 서버실 테이블
CREATE TABLE server_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 장비 테이블
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_room_id UUID REFERENCES server_rooms(id),
  rack_id UUID REFERENCES racks(id),  -- 서버인 경우만
  equipment_type VARCHAR(50) NOT NULL,  -- 'server', 'aircon', etc.
  grid_x INT NOT NULL,
  grid_y INT NOT NULL,
  grid_z INT DEFAULT 0,
  rotation FLOAT DEFAULT 0,
  metadata JSONB,  -- 추가 정보 저장
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_equipment_server_room ON equipment(server_room_id);
CREATE INDEX idx_equipment_type ON equipment(equipment_type);
```

---

## 🎯 마이그레이션 체크리스트

프로젝트가 목 데이터에서 실제 API로 전환할 때:

- [ ] 백엔드 API 엔드포인트 확인
- [ ] API 베이스 URL 환경변수 설정 (`VITE_API_BASE_URL`)
- [ ] `BabylonDatacenterView.tsx`에서 `getServerRoomEquipment` → `fetchServerRoomEquipment`로 변경
- [ ] 에러 핸들링 추가 (로딩 상태, 에러 메시지)
- [ ] 인증 토큰 헤더 추가 (필요한 경우)
- [ ] API 응답 형식 백엔드와 재확인

---

## 💡 추가 고려사항

### 1. 인증 토큰
실제 API 사용 시 인증이 필요한 경우:

```typescript
// serverRoomEquipmentApi.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. 에러 처리
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 처리
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. 캐싱
자주 변경되지 않는 데이터는 React Query 등을 사용해 캐싱:

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['serverRoomEquipment', serverRoomId],
  queryFn: () => fetchServerRoomEquipment(serverRoomId),
  staleTime: 5 * 60 * 1000, // 5분
});
```
