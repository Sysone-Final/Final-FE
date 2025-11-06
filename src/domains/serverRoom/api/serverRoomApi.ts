import client from "@api/client";
import type { ServerRoom, CompanyDataCentersResponse } from "../types";

/**
 * 회사의 전산실 매핑 조회 (GET)
 * @param companyId 회사 ID
 */
export const getCompanyDataCenters = async (companyId: number): Promise<ServerRoom[]> => {
  const response = await client.get<CompanyDataCentersResponse>(
    `/company-datacenters/company/${companyId}`
  );
  
  // API 응답을 ServerRoom 형태로 변환
  return response.data.result.map((item) => ({
    id: item.dataCenterId.toString(),
    name: item.dataCenterName,
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
  location: string;
  floor: number;
  rows: number;
  columns: number;
  status?: string;
  description?: string;
  totalArea?: number;
  totalPowerCapacity?: number;
  totalCoolingCapacity?: number;
  maxRackCount?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  humidityMin?: number;
  humidityMax?: number;
  managerId?: number;
}
