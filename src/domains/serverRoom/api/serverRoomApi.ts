import client from "@api/client";
import type { ServerRoom, CompanyServerRoomsResponse } from "../types";

// 데이터센터 타입
export interface DataCenter {
  id: number;
  code: string;
  name: string;
}

export interface DataCentersResponse {
  status_code: number;
  status_message: string;
  result: DataCenter[];
}

/**
 * 데이터센터 목록 조회 (GET)
 */
export const getDataCenters = async (): Promise<DataCenter[]> => {
  const response = await client.get<DataCentersResponse>("/datacenters");
  return response.data.result;
};

/**
 * 회사의 서버실 매핑 조회 (GET)
 * @param companyId 회사 ID
 */
export const getCompanyServerRooms = async (companyId: number): Promise<ServerRoom[]> => {
  const response = await client.get<CompanyServerRoomsResponse>(
    `/company-serverrooms/company/${companyId}`
  );
  
  // API 응답을 ServerRoom 형태로 변환
  return response.data.result.map((item) => ({
    id: item.serverRoomId.toString(),
    name: item.serverRoomName,
    code: item.code || "N/A",
    location: item.location || "위치 정보 없음",
    description: item.description || "설명 없음",
  }));
};

/**
 * 서버실 생성 (POST)
 * @param serverRoomData 서버실 생성 정보
 */
export const createServerRoom = async (
  serverRoomData: CreateServerRoomRequest,
): Promise<ServerRoom> => {
  const response = await client.post<ServerRoom>(
    "/serverrooms",
    serverRoomData,
  );
  return response.data;
};

// 서버실 생성 요청 타입
export interface CreateServerRoomRequest {
  name: string;
  code: string;
  // location: string;
  dataCenterId: number;
  floor: number;
  rows: number;
  columns: number;
  description?: string;
  managerId?: number;
}
