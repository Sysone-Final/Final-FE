# 🔑 ID 처리 방식 - 간단 요약

## 문제 상황
```typescript
// 기존 목 데이터
{
  id: "a1-server-1",  // ❌ 이건 임시 ID
  type: "server",
  gridX: 2,
  gridY: 2,
}
```
- `a1`, `b2` 등은 **임시 서버실 코드**
- 실제 백엔드에서는 **UUID**를 사용

---

## ✅ 해결 방법

### 1️⃣ 백엔드가 보내야 할 데이터 구조

```json
GET /api/server-rooms/{serverRoomId}/equipment

{
  "serverRoomId": "550e8400-e29b-41d4-a716-446655440000",
  "serverRoomName": "IDC A-Zone Floor 3",
  "equipment": [
    {
      "equipmentId": "eq-001-uuid-xxxx",  // ✅ 이게 진짜 ID
      "equipmentType": "server",
      "rackId": "rack-001-uuid-xxxx",
      "gridPosition": { "x": 2, "y": 2, "z": 0 },
      "rotation": 0,
      "metadata": {
        "name": "Server Rack A1",
        "status": "active"
      }
    }
  ]
}
```

### 2️⃣ 프론트엔드가 사용하는 방식

```typescript
// ✅ API에서 데이터 받기
import { fetchServerRoomEquipment } from '../api/serverRoomEquipmentApi';

// 실제 서버실 UUID 사용
const serverRoomId = "550e8400-e29b-41d4-a716-446655440000";
const equipment = await fetchServerRoomEquipment(serverRoomId);

// equipment 배열의 각 아이템:
// {
//   id: "eq-001-uuid-xxxx",          // ← 백엔드 equipmentId가 여기 들어감
//   type: "server",
//   gridX: 2,
//   gridY: 2,
//   gridZ: 0,
//   rotation: 0,
//   equipmentId: "eq-001-uuid-xxxx", // ← 원본 백엔드 ID도 별도 저장
//   rackId: "rack-001-uuid-xxxx",
//   metadata: { name: "Server Rack A1" }
// }
```

---

## 🔄 ID 필드 정리

| 필드 | 설명 | 예시 |
|------|------|------|
| `id` | 프론트엔드에서 장비를 구분하는 ID<br/>백엔드의 `equipmentId`를 그대로 사용 | `"eq-001-uuid-xxxx"` |
| `equipmentId` | 백엔드 DB의 원본 ID (UUID)<br/>API 호출(수정/삭제)시 필요 | `"eq-001-uuid-xxxx"` |
| `type` | 장비 타입 | `"server"`, `"aircon"` |
| `rackId` | 서버 랙인 경우, 연결된 랙의 ID | `"rack-001-uuid-xxxx"` |

---

## 📝 실제 사용 예시

### 컴포넌트에서 사용
```typescript
import { useServerRoomEquipment } from '../hooks/useServerRoomEquipment';

function ServerRoom3DView({ serverRoomId }: { serverRoomId: string }) {
  const { equipment, loading, error } = useServerRoomEquipment(serverRoomId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {equipment.map((item) => (
        <Equipment3D
          key={item.id}  // ← 백엔드 UUID 사용
          equipment={item}
        />
      ))}
    </div>
  );
}
```

### 장비 추가
```typescript
import { addEquipment } from '../api/serverRoomEquipmentApi';

const newEquipment = await addEquipment(serverRoomId, {
  type: 'server',
  gridX: 5,
  gridY: 5,
  gridZ: 0,
  rotation: 0,
});

// 백엔드가 생성한 UUID를 받음
console.log(newEquipment.id); // "eq-new-uuid-xxxx"
console.log(newEquipment.equipmentId); // "eq-new-uuid-xxxx"
```

### 장비 수정
```typescript
import { updateEquipment } from '../api/serverRoomEquipmentApi';

await updateEquipment(
  serverRoomId,
  equipment.equipmentId,  // ← 백엔드 UUID 사용
  {
    gridX: 10,
    gridY: 10,
  }
);
```

### 장비 삭제
```typescript
import { deleteEquipment } from '../api/serverRoomEquipmentApi';

await deleteEquipment(
  serverRoomId,
  equipment.equipmentId  // ← 백엔드 UUID 사용
);
```

---

## 🎯 핵심 정리

1. **서버실 ID**: 백엔드가 주는 UUID 사용
   - 예: `"550e8400-e29b-41d4-a716-446655440000"`
   - URL에서 받음: `/server-room/:id`

2. **장비 ID**: 백엔드가 주는 UUID 사용
   - 백엔드 `equipmentId` → 프론트엔드 `id`로 변환
   - 예: `"eq-001-uuid-xxxx"`

3. **목 데이터 (`a1`, `b2`)**: 
   - 개발 단계 임시 코드
   - 실제 운영에서는 백엔드 UUID로 대체

4. **데이터 흐름**:
   ```
   백엔드 DB (UUID)
      ↓
   API 응답 (equipmentId)
      ↓
   프론트엔드 변환 (id = equipmentId)
      ↓
   화면 렌더링
   ```

---

## 🚀 백엔드 개발자에게 전달할 내용

### 필요한 API 엔드포인트

1. **장비 목록 조회**
   - `GET /api/server-rooms/{serverRoomId}/equipment`
   - 응답: 장비 배열 (equipmentId, equipmentType, gridPosition, rotation, metadata)

2. **장비 추가**
   - `POST /api/server-rooms/{serverRoomId}/equipment/add`
   - 요청: equipmentType, gridPosition, rotation, metadata
   - 응답: 생성된 장비 (equipmentId 포함)

3. **장비 수정**
   - `PATCH /api/server-rooms/{serverRoomId}/equipment/{equipmentId}`
   - 요청: 변경할 필드들

4. **장비 삭제**
   - `DELETE /api/server-rooms/{serverRoomId}/equipment/{equipmentId}`

### DB 스키마 제안
```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY,
  server_room_id UUID,
  rack_id UUID,
  equipment_type VARCHAR(50),  -- 'server', 'aircon', 'door' 등
  grid_x INT,
  grid_y INT,
  grid_z INT,
  rotation FLOAT,
  metadata JSONB
);
```
