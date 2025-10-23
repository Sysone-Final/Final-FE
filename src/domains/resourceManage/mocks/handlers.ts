import { http, HttpResponse, delay } from "msw";
import type { Resource, ResourceStatus } from "../types/resource.types";

// NOTE(user): Mock Data는 가변적이므로 let 사용
let MOCK_DATA: Resource[] = [
  {
    id: "1",
    assetName: "DB-Server-01",
    status: "정상",
    ipAddress: "192.168.1.101",
    model: "Dell PowerEdge R740",
    location: "IDC A-Zone, Rack A-01, U:22",
  },
  {
    id: "2",
    assetName: "Web-Server-02",
    status: "경고",
    ipAddress: "192.168.1.102",
    model: "HP ProLiant DL380",
    location: "IDC A-Zone, Rack A-02, U:15",
  },
  {
    id: "3",
    assetName: "Switch-Core-01",
    status: "정보 필요",
    ipAddress: "192.168.1.103",
    model: "Cisco Catalyst 9300",
    location: "IDC B-Zone, Rack B-01, U:42",
  },
  {
    id: "4",
    assetName: "Storage-Array-01",
    status: "미할당",
    ipAddress: "192.168.1.104",
    model: "NetApp FAS8200",
    location: "IDC C-Zone, Rack C-01, U:35",
  },
  {
    id: "5",
    assetName: "Firewall-01",
    status: "정상",
    ipAddress: "192.168.1.105",
    model: "Fortinet FortiGate 600E",
    location: "IDC A-Zone, Rack A-03, U:10",
  },
  {
    id: "6",
    assetName: "Backup-Server-01",
    status: "경고",
    ipAddress: "192.168.1.106",
    model: "IBM System x3650 M5",
    location: "IDC B-Zone, Rack B-02, U:28",
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
          r.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.ipAddress.includes(searchTerm),
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

  // --- POST /resourceManage ---
  http.post(`${API_BASE_URL}/resourceManage`, async ({ request }) => {
    await delay(500);
    const formData = await request.formData();
    const newResource: Resource = {
      id: `new-${Date.now()}`,
      assetName: formData.get("assetName") as string,
      ipAddress: (formData.get("ipAddress") as string) || "N/A",
      model: formData.get("model") as string,
      status: (formData.get("status") as ResourceStatus) || "미할당",
      vendor: (formData.get("vendor") as string) || "Unknown",
      osType: (formData.get("osType") as string) || "Unknown",
      location: "미지정",
      imageUrl: formData.get("imageFile")
        ? `https://via.placeholder.com/150?text=${formData.get("assetName")}`
        : undefined,
    };
    MOCK_DATA.unshift(newResource);
    console.log("[MSW] 자원 생성됨:", newResource);
    return HttpResponse.json(newResource, { status: 201 });
  }),

  // --- PUT /resourceManage/:id ---
  http.put(
    `${API_BASE_URL}/resourceManage/:id`,
    async ({ params, request }) => {
      await delay(500);
      const { id } = params;
      const formData = await request.formData();
      const index = MOCK_DATA.findIndex((r) => r.id === id);

      if (index > -1) {
        const existingResource = MOCK_DATA[index];
        const updatedResource: Resource = {
          ...existingResource,
          assetName:
            (formData.get("assetName") as string) || existingResource.assetName,
          ipAddress:
            (formData.get("ipAddress") as string) || existingResource.ipAddress,
          model: (formData.get("model") as string) || existingResource.model,
          status:
            (formData.get("status") as ResourceStatus) ||
            existingResource.status,
          vendor: (formData.get("vendor") as string) || existingResource.vendor,
          osType: (formData.get("osType") as string) || existingResource.osType,
          imageUrl: formData.get("imageFile")
            ? `https://via.placeholder.com/150?text=updated-${formData.get("assetName")}`
            : existingResource.imageUrl,
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
