import { http, HttpResponse, delay } from "msw";
import type {
  Resource,
  ResourceStatus,
  EquipmentType,
  PositionType,
} from "../types/resource.types";
// NOTE(user): Mock Data는 가변적이므로 let 사용
let MOCK_DATA: Resource[] = [
  {
    id: "1",
    equipmentName: "DB-Server-01",
    status: "NORMAL",
    ipAddress: "192.168.1.101",
    modelName: "Dell PowerEdge R740",
    location: "IDC A-Zone, Rack A-01, U:22",
    manufacturer: "Dell",
    equipmentType: "SERVER",
    unitSize: 2,
    rackId: "rack1",
    startUnit: 22,
  },
  {
    id: "2",
    equipmentName: "Web-Server-02",
    status: "MAINTENANCE", // '경고' -> '점검중' (타입 변경)
    ipAddress: "192.168.1.102",
    modelName: "HP ProLiant DL380",
    location: "IDC A-Zone, Rack A-02, U:15",
    manufacturer: "HP",
    equipmentType: "SERVER",
    unitSize: 2,
  },
  {
    id: "3",
    equipmentName: "Switch-Core-01",
    status: "NORMAL", // '정보 필요' -> '정상' (타입 변경)
    ipAddress: "192.168.1.103",
    modelName: "Cisco Catalyst 9300",
    location: "IDC B-Zone, Rack B-01, U:42",
    manufacturer: "Cisco",
    equipmentType: "SWITCH",
    unitSize: 1,
  },
  {
    id: "4",
    equipmentName: "Storage-Array-01",
    status: "INACTIVE", // '미할당' -> '비활성' (타입 변경)
    ipAddress: "192.168.1.104",
    modelName: "NetApp FAS8200",
    location: "미지정",
    manufacturer: "NetApp",
    equipmentType: "SERVER", // (예시)
    unitSize: 4,
  },
];

const API_BASE_URL = "https://api.yserverway.shop/api";

export const handlers = [
  // --- GET /resourceManage ---
  http.get(`${API_BASE_URL}/resourceManage`, async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const size = parseInt(url.searchParams.get("size") || "10");
    const searchTerm = url.searchParams.get("searchTerm") || "";
    const status = url.searchParams.get("status") || "";
    // const type = url.searchParams.get('type') || '';
    // const location = url.searchParams.get('location') || '';

    let filteredData = MOCK_DATA;

    if (searchTerm) {
      filteredData = filteredData.filter(
        (r) =>
          // [수정] 필드명 변경
          r.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.modelName &&
            r.modelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (r.ipAddress && r.ipAddress.includes(searchTerm)),
      );
    }
    if (status) {
      filteredData = filteredData.filter((r) => r.status === status);
    }

    const start = page * size;
    const end = start + size;
    const paginatedContent = filteredData.slice(start, end);

    return HttpResponse.json({
      content: paginatedContent,
      totalElements: filteredData.length,
      totalPages: Math.ceil(filteredData.length / size),
      last: end >= filteredData.length,
      size: size,
      number: page,
    });
  }),

  // --- DELETE /resourceManage/:id ---
  http.delete(`${API_BASE_URL}/resourceManage/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const initialLength = MOCK_DATA.length;
    MOCK_DATA = MOCK_DATA.filter((r) => r.id !== id);
    console.log(`[MSW] 자원 삭제됨 (ID: ${id})`);
    if (MOCK_DATA.length < initialLength) {
      return new HttpResponse(null, { status: 204 });
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  }),

  // --- POST /resourceManage (새 자원 등록) ---
  http.post(`${API_BASE_URL}/resourceManage`, async ({ request }) => {
    await delay(500);
    const formData = await request.formData();

    // [수정] 3단계 폼의 모든 필드를 받도록 수정
    const newResource: Resource = {
      id: `new-${Date.now()}`,
      // 1단계
      equipmentName: formData.get("equipmentName") as string,
      // [수정] 'as any' 대신 'as EquipmentType' 사용
      equipmentType:
        (formData.get("equipmentType") as EquipmentType) || "SERVER",
      unitSize: Number(formData.get("unitSize")) || 1, // (필수)
      // [수정] 'as any' 대신 'as ResourceStatus' 사용
      status: (formData.get("status") as ResourceStatus) || "INACTIVE", // (필수)
      manufacturer: (formData.get("manufacturer") as string) || undefined,
      modelName: (formData.get("modelName") as string) || undefined,
      serialNumber: (formData.get("serialNumber") as string) || undefined,
      equipmentCode: (formData.get("equipmentCode") as string) || undefined,
      imageUrlFront: formData.get("imageFrontFile")
        ? `https://via.placeholder.com/150?text=Front`
        : undefined,
      imageUrlRear: formData.get("imageRearFile")
        ? `https://via.placeholder.com/150?text=Rear`
        : undefined,

      // 2단계
      datacenterId: (formData.get("datacenterId") as string) || undefined,
      rackId: (formData.get("rackId") as string) || undefined,
      startUnit: Number(formData.get("startUnit")) || undefined,
      // [수정] 'as any' 대신 'as PositionType' 사용
      positionType: (formData.get("positionType") as PositionType) || undefined,
      os: (formData.get("os") as string) || undefined,
      cpuSpec: (formData.get("cpuSpec") as string) || undefined,
      memorySpec: (formData.get("memorySpec") as string) || undefined,
      diskSpec: (formData.get("diskSpec") as string) || undefined,
      ipAddress: (formData.get("ipAddress") as string) || undefined,
      macAddress: (formData.get("macAddress") as string) || undefined,

      // 3단계
      managerId: (formData.get("managerId") as string) || undefined,
      installationDate:
        (formData.get("installationDate") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
      monitoringEnabled: formData.get("monitoringEnabled") === "true",

      location: "미지정", // (임시)
    };
    MOCK_DATA.unshift(newResource);
    console.log("[MSW] 자원 생성됨:", newResource);
    return HttpResponse.json(newResource, { status: 201 });
  }),

  // --- PUT /resourceManage/:id (자원 수정) ---
  http.put(
    `${API_BASE_URL}/resourceManage/:id`,
    async ({ params, request }) => {
      await delay(500);
      const { id } = params;
      const formData = await request.formData();
      const index = MOCK_DATA.findIndex((r) => r.id === id);

      if (index > -1) {
        const existingResource = MOCK_DATA[index];

        // [수정] 3단계 폼의 모든 필드를 업데이트하도록 수정
        const updatedResource: Resource = {
          ...existingResource,
          // 1단계
          equipmentName:
            (formData.get("equipmentName") as string) ||
            existingResource.equipmentName,
          // [수정] 'as any' 대신 'as EquipmentType' 사용
          equipmentType:
            (formData.get("equipmentType") as EquipmentType) ||
            existingResource.equipmentType,
          unitSize:
            Number(formData.get("unitSize")) || existingResource.unitSize,
          // [수정] 'as any' 대신 'as ResourceStatus' 사용
          status:
            (formData.get("status") as ResourceStatus) ||
            existingResource.status,
          manufacturer:
            (formData.get("manufacturer") as string) ||
            existingResource.manufacturer,
          modelName:
            (formData.get("modelName") as string) || existingResource.modelName,
          serialNumber:
            (formData.get("serialNumber") as string) ||
            existingResource.serialNumber,
          equipmentCode:
            (formData.get("equipmentCode") as string) ||
            existingResource.equipmentCode,
          imageUrlFront: formData.get("imageFrontFile")
            ? `https://via.placeholder.com/150?text=Front-Upd`
            : existingResource.imageUrlFront,
          imageUrlRear: formData.get("imageRearFile")
            ? `https://via.placeholder.com/150?text=Rear-Upd`
            : existingResource.imageUrlRear,

          // 2단계
          datacenterId:
            (formData.get("datacenterId") as string) ||
            existingResource.datacenterId,
          rackId: (formData.get("rackId") as string) || existingResource.rackId,
          startUnit:
            Number(formData.get("startUnit")) || existingResource.startUnit,
          // [수정] 'as any' 대신 'as PositionType' 사용
          positionType:
            (formData.get("positionType") as PositionType) ||
            existingResource.positionType,
          os: (formData.get("os") as string) || existingResource.os,
          cpuSpec:
            (formData.get("cpuSpec") as string) || existingResource.cpuSpec,
          memorySpec:
            (formData.get("memorySpec") as string) ||
            existingResource.memorySpec,
          diskSpec:
            (formData.get("diskSpec") as string) || existingResource.diskSpec,
          ipAddress:
            (formData.get("ipAddress") as string) || existingResource.ipAddress,
          macAddress:
            (formData.get("macAddress") as string) ||
            existingResource.macAddress,

          // 3단계
          managerId:
            (formData.get("managerId") as string) || existingResource.managerId,
          installationDate:
            (formData.get("installationDate") as string) ||
            existingResource.installationDate,
          notes: (formData.get("notes") as string) || existingResource.notes,
          monitoringEnabled: formData.get("monitoringEnabled") === "true",
        };
        MOCK_DATA[index] = updatedResource;
        console.log("[MSW] 자원 수정됨:", updatedResource);
        return HttpResponse.json(updatedResource);
      } else {
        console.error(`[MSW] 수정할 자원 없음 (ID: ${id})`);
        return new HttpResponse(null, { status: 404 });
      }
    },
  ),

  // --- DELETE /resourceManage (Batch) ---
  http.delete(`${API_BASE_URL}/resourceManage`, async ({ request }) => {
    await delay(400);
    const { ids } = (await request.json()) as { ids?: string[] };
    if (!ids || ids.length === 0) {
      return new HttpResponse("삭제할 ID 목록이 없습니다.", { status: 400 });
    }
    const initialLength = MOCK_DATA.length;
    MOCK_DATA = MOCK_DATA.filter((r) => !ids.includes(r.id));
    const deletedCount = initialLength - MOCK_DATA.length;
    console.log(
      `[MSW] 자원 ${deletedCount}개 대량 삭제됨 (요청 IDs: ${ids.join(", ")})`,
    );
    return new HttpResponse(null, { status: 204 });
  }),
];
