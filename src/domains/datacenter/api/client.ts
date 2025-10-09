import axios from 'axios';

const datacenterApiClient = axios.create({
  baseURL: '/api/datacenter',
  timeout: 10000,
});

export default datacenterApiClient;