
import client from "@api/client";
import type {
 PaginatedResourceResponse,
 Resource,
 ResourceListFilters,
 ServerRoom,
 Rack,
 ResourceStatus,
} from "../types/resource.types";

//  API 엔드포인트를 백엔드와 일치시킵니다.
const RESOURCE_API_URL = "/equipments"; 

// API 응답 래퍼 타입 (로그인 때와 동일한 '포장지')
interface ApiResponseWrapper<T> {
 status_code: number;
 status_message: string;
 result: T;
}

/**
* 자원 목록 조회 (GET)
*/
export const getResourceList = async (
 page: number,
 size: number,
 filters: ResourceListFilters,
): Promise<PaginatedResourceResponse> => {
 
  //  응답 타입을 '포장지'로 감싸줍니다.
 const response = await client.get<ApiResponseWrapper<PaginatedResourceResponse>>(
  RESOURCE_API_URL,
  {
   params: {
    page,
    size,
    ...filters,
   },
  },
 );
  // '포장지'에서 '내용물'을 꺼내 반환
 return response.data.result; 
};

/**
* 신규 자원 등록 (POST)
*/
export const createResource = async (data: Resource): Promise<Resource> => { 
  const response = await client.post<ApiResponseWrapper<Resource>>(
    RESOURCE_API_URL, 
    data, 
    // { headers: { "Content-Type": "multipart/form-data" } } 
  );
  return response.data.result;
};

/**
* 자원 정보 수정 (PUT)
*/
export const updateResource = async (
  id: number,
  data: Resource, 
): Promise<Resource> => {
  const response = await client.put<ApiResponseWrapper<Resource>>(
    `${RESOURCE_API_URL}/${id}`,
    data, 
    // { headers: { "Content-Type": "multipart/form-data" } } 
  );
  return response.data.result;
};

/**
* 자원 삭제 (DELETE)
*/
export const deleteResource = async (id: number): Promise<void> => {
 await client.delete(`${RESOURCE_API_URL}/${id}`);
};

/**
* 자원 대량 삭제 (DELETE)
*/
export const deleteMultipleResources = async (ids: number[]): Promise<void> => {
 await client.delete(RESOURCE_API_URL, {
  data: { ids },
 });
};


/**
 *  자원 대량 상태 변경 (PUT /equipments/status - API 명세 가정)
 */
export const updateMultipleResourceStatus = async (
  ids: number[],
  status: ResourceStatus,
): Promise<void> => {
  // 백엔드 API 엔드포인트를 가정 (예: /equipments/status)
  await client.put(`${RESOURCE_API_URL}/status`, {
    ids,
    status,
  });
};
/**
* 9.2 자원 상세 정보 조회 (GET /resourceManage/{id})
*/
export const getResourceById = async (id: number): Promise<Resource> => {
  //  '포장지'로 감싸기
 const response = await client.get<ApiResponseWrapper<Resource>>(`${RESOURCE_API_URL}/${id}`); 
  //  '내용물' 꺼내기
 return response.data.result; 
};




// API 응답 래퍼 타입 정의
interface ApiResponseWrapper<T> {
 status_code: number;
 status_message: string;
 result: T;
}

// (getDatacenters, getRacksByDatacenter는 이미 'result'를 사용 중이므로 수정 불필요)
/**
* 3.1 접근 가능한 전산실 목록 조회 (GET /datacenters)
*/
export const getServerRooms = async (): Promise<ServerRoom[]> => {
 const response =
  await client.get<ApiResponseWrapper<ServerRoom[]>>("/serverrooms");
 return response.data.result;
};

/**
* 5.1 전산실별 랙 목록 조회 (GET /racks/datacenter/{dataCenterId})
*/
export const getRacksByServerRoom = async (
  serverRoomId: number,
): Promise<Rack[]> => {
 const response = await client.get<ApiResponseWrapper<Rack[]>>(
  `/racks/serverroom/${serverRoomId}`,
 );
 return response.data.result;
};
