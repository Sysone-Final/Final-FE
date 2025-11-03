import axios from "axios";
import type { ServerRoom } from "../types";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://api.serverway.shop/api",
});

/**
 * 서버실 생성 (POST)
 * @param serverRoomData 서버실 생성 정보
 */
export const createServerRoom = async (
  serverRoomData: CreateServerRoomRequest,
): Promise<ServerRoom> => {
  const response = await apiClient.post<ServerRoom>(
    "/serverrooms",
    serverRoomData,
  );
  return response.data;
};

/**
 * 서버실 목록 조회 (GET)
 */
export const getServerRooms = async (): Promise<ServerRoom[]> => {
  const response = await apiClient.get<ServerRoom[]>("/serverrooms");
  return response.data;
};

// 서버실 생성 요청 타입
export interface CreateServerRoomRequest {
  name: string;
  code: string;
  location: string;
  floor: string;
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
