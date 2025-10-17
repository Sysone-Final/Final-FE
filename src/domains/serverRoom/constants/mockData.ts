

import type { ServerRoom } from '../types';

export const MOCK_SERVER_ROOMS: ServerRoom[] = [
  { id: 'a1', name: 'IDC A-Zone, Floor 3', location: 'Seoul, South Korea', rackCount: 32, status: 'Normal' },
  { id: 'b2', name: 'IDC B-Zone, Floor 2', location: 'Tokyo, Japan', rackCount: 24, status: 'Warning' },
  { id: 'c3', name: 'IDC C-Zone, Floor 1', location: 'Singapore', rackCount: 48, status: 'Normal' },
  { id: 'd4', name: 'IDC D-Zone, Floor 4', location: 'Hong Kong', rackCount: 16, status: 'Critical' },
  { id: 'e5', name: 'IDC E-Zone, Floor 5', location: 'Mumbai, India', rackCount: 28, status: 'Normal' },
  { id: 'f6', name: 'IDC F-Zone, Floor 6', location: 'Sydney, Australia', rackCount: 20, status: 'Maintenance' },
];