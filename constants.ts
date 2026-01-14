import { IPConfig, IspProvider } from './types';

export const MOCK_IPS: IPConfig[] = [
  {
    id: '1',
    ip: '122.160.22.15',
    provider: IspProvider.AIRTEL,
    location: 'Delhi, India',
    type: 'Fiber',
    latency: 24,
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: '2',
    ip: '122.170.11.45',
    provider: IspProvider.AIRTEL,
    location: 'Mumbai, India',
    type: 'Mobile 5G',
    latency: 45,
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: '3',
    ip: '49.32.112.55',
    provider: IspProvider.JIO,
    location: 'Bangalore, India',
    type: 'Mobile 5G',
    latency: 32,
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '4',
    ip: '49.35.201.12',
    provider: IspProvider.JIO,
    location: 'Hyderabad, India',
    type: 'Fiber',
    latency: 18,
    coordinates: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: '5',
    ip: '192.168.0.101',
    provider: IspProvider.TPLINK,
    location: 'Local Test Lab (Simulated)',
    type: 'Broadband',
    latency: 5,
    coordinates: { lat: 28.7041, lng: 77.1025 }
  },
  {
    id: '6',
    ip: '103.20.12.8',
    provider: IspProvider.ACT,
    location: 'Chennai, India',
    type: 'Fiber',
    latency: 15,
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: '7',
    ip: '14.139.22.88',
    provider: IspProvider.VODAFONE,
    location: 'Pune, India',
    type: 'Mobile 4G',
    latency: 68,
    coordinates: { lat: 18.5204, lng: 73.8567 }
  },
  // 5 New Broadband IPs
  {
    id: '8',
    ip: '117.201.10.45',
    provider: IspProvider.BSNL,
    location: 'Kolkata, India',
    type: 'Broadband',
    latency: 85,
    coordinates: { lat: 22.5726, lng: 88.3639 }
  },
  {
    id: '9',
    ip: '115.99.20.12',
    provider: IspProvider.HATHWAY,
    location: 'Mumbai, India',
    type: 'Broadband',
    latency: 35,
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: '10',
    ip: '202.191.10.5',
    provider: IspProvider.EXCITEL,
    location: 'Noida, India',
    type: 'Broadband',
    latency: 28,
    coordinates: { lat: 28.5355, lng: 77.3910 }
  },
  {
    id: '11',
    ip: '182.72.110.4',
    provider: IspProvider.SPECTRANET,
    location: 'Gurgaon, India',
    type: 'Broadband',
    latency: 12,
    coordinates: { lat: 28.4595, lng: 77.0266 }
  },
  {
    id: '12',
    ip: '103.195.10.99',
    provider: IspProvider.GTPL,
    location: 'Ahmedabad, India',
    type: 'Broadband',
    latency: 55,
    coordinates: { lat: 23.0225, lng: 72.5714 }
  }
];

export const DEFAULT_HEADERS = [
  { key: 'User-Agent', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { key: 'Accept', value: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8' },
  { key: 'Accept-Language', value: 'en-US,en;q=0.5' },
  { key: 'Connection', value: 'keep-alive' },
  { key: 'Upgrade-Insecure-Requests', value: '1' },
];