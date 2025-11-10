export interface ServerRoom {
  id: string;
  name: string; // dataCenterName
  code: string; // 서버실 코드
  location: string; // 위치 정보
  description: string; // 설명
  rackCount?: number; // 옵셔널로 변경
  status?: "Normal" | "Warning" | "Critical" | "Maintenance"; // 옵셔널로 변경
}

// API 응답 타입
export interface CompanyServerRoomMapping {
  id: number;
  companyId: number;
  companyName: string;
  serverRoomId: number;
  serverRoomName: string;
  code: string; // 서버실 코드
  description: string;
  location: string; // 위치 정보
  grantedBy: string;
  createdAt: string;
}

export interface CompanyServerRoomsResponse {
  status_code: number;
  status_message: string;
  result: CompanyServerRoomMapping[];
}
