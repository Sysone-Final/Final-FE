import client from "@api/client";

interface RefreshApiResponse {
  status_code: number;
  status_message: string;
  result: {
    accessToken: string;
  };
}

export const refreshTokenApi = async (): Promise<string> => {
  const response = await client.post<RefreshApiResponse>("/auth/refresh");
  return response.data.result.accessToken;
};
