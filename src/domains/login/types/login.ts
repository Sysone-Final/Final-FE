export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  id: number;
  userName: string;
  name: string;
  role: string;
  companyName: string;
  companyId?: number;
}
