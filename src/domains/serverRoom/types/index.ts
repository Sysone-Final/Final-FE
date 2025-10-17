

export interface ServerRoom { 
  id: string;
  name: string;
  location: string;
  rackCount: number;
  status: 'Normal' | 'Warning' | 'Critical' | 'Maintenance';
}