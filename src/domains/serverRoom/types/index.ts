export interface ServerRoom {
  id: string;
  name: string;
  location: string;
  rackCount: number;
  status: "Normal" | "Warning" | "Critical" | "Maintenance";
}

// API 응답 타입
export interface CompanyDataCenterMapping {
  id: number;
  companyId: number;
  companyName: string;
  dataCenterId: number;
  dataCenterName: string;
  description: string;
  grantedBy: string;
  createdAt: string;
}

export interface CompanyDataCentersResponse {
  status_code: number;
  status_message: string;
  result: CompanyDataCenterMapping[];
}
