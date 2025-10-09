// export interface Server {
//   id: string;
//   name: string;
//   status: 'running' | 'stopped' | 'maintenance';
//   ipAddress: string;
//   cpu: number;
//   memory: number;
//   storage: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Datacenter {
//   id: string;
//   name: string;
//   location: string;
//   capacity: number;
//   servers: Server[];
//   status: 'active' | 'inactive' | 'maintenance';
// }

// export interface DatacenterMetrics {
//   totalServers: number;
//   runningServers: number;
//   cpuUsage: number;
//   memoryUsage: number;
//   storageUsage: number;
// }