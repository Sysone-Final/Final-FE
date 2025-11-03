import { http, HttpResponse, delay } from "msw";
import type {
  Resource,
  ResourceStatus,
  EquipmentType,
  PositionType,
  Datacenter,
  Rack,
} from "../types/resource.types";

// Datacenter 목 데이터 (API 3.1 기준) ---
const MOCK_DATACENTERS: Datacenter[] = [
  {
    id: "dc1",
    name: "서울 데이터센터",
    code: "DC-SEL-001",
    location: "서울시 강남구",
    status: "ACTIVE",
    rackCount: 50,
    managerName: "김철수",
  },
  {
    id: "dc2",
    name: "부산 데이터센터",
    code: "DC-BUS-001",
    location: "부산시 해운대구",
    status: "ACTIVE",
    rackCount: 30,
    managerName: "이영희",
  },
];

// --- Rack 목 데이터 (API 5.1 기준) ---
const MOCK_RACKS: Rack[] = [
  {
    id: "rack1",
    rackName: "RACK-A01",
    groupNumber: "A-Zone",
    rackLocation: "Row 1 Col 1",
    totalUnits: 42,
    usedUnits: 30,
    availableUnits: 12,
    status: "ACTIVE",
    usageRate: 71.43,
    powerUsageRate: 65.5,
    currentPowerUsage: 3275.0,
    maxPowerCapacity: 5000.0,
    department: "IT팀",
    managerId: "1",
    datacenterId: "dc1", // MSW 필터링을 위한 편의용 필드
  },
  {
    id: "rack2",
    rackName: "RACK-A02",
    groupNumber: "A-Zone",
    rackLocation: "Row 1 Col 2",
    totalUnits: 48,
    usedUnits: 20,
    availableUnits: 28,
    status: "ACTIVE",
    usageRate: 41.67,
    powerUsageRate: 50.0,
    currentPowerUsage: 2500.0,
    maxPowerCapacity: 5000.0,
    department: "IT팀",
    managerId: "1",
    datacenterId: "dc1",
  },
  {
    id: "rack3",
    rackName: "RACK-B01",
    groupNumber: "B-Zone",
    rackLocation: "Row 1 Col 1",
    totalUnits: 42,
    usedUnits: 40,
    availableUnits: 2,
    status: "ACTIVE",
    usageRate: 95.24,
    powerUsageRate: 85.0,
    currentPowerUsage: 4250.0,
    maxPowerCapacity: 5000.0,
    department: "운영팀",
    managerId: "2",
    datacenterId: "dc2",
  },
];

// --- [수정됨] 상세 필드를 포함한 20개의 MOCK_DATA ---
let MOCK_DATA: Resource[] = [
  // --- 1. Dell Server (NORMAL, dc1/rack1) ---
  {
    id: "1",
    equipmentName: "DB-Server-01",
    status: "NORMAL",
    ipAddress: "192.168.1.101",
    modelName: "Dell PowerEdge R740",
    location: "DC-SEL / RACK-A01 / 22U",
    manufacturer: "Dell",
    equipmentType: "SERVER",
    unitSize: 2,
    datacenterId: "dc1",
    rackId: "rack1",
    startUnit: 22,
    positionType: "FRONT",
    serialNumber: "DELL-SN-1001",
    os: "CentOS 7.9",
    cpuSpec: "Intel Xeon Silver 4210 @ 2.2GHz 2CPU",
    memorySpec: "128GB (8x 16GB) DDR4",
    diskSpec: "2TB NVMe SSD x 2, 4TB SAS HDD x 4",
    macAddress: "00:1A:2B:3C:4D:01",
    managerId: "admin_kim",
    installationDate: "2023-01-10",
    notes: "Main DB server for production.",
    monitoringEnabled: true,
    cpuThresholdWarning: 80,
    cpuThresholdCritical: 95,
    memoryThresholdWarning: 80,
    memoryThresholdCritical: 95,
    diskThresholdWarning: 70,
    diskThresholdCritical: 90,
    imageUrlFront: "https://i.imgur.com/gA2ANEV.png", // 예시 이미지
    imageUrlRear: "https://i.imgur.com/v4o6nVL.png", // 예시 이미지
  },
  // --- 2. HP Server (MAINTENANCE, dc1/rack2) ---
  {
    id: "2",
    equipmentName: "Web-Server-02",
    status: "MAINTENANCE",
    ipAddress: "192.168.1.102",
    modelName: "HP ProLiant DL380 Gen10",
    location: "DC-SEL / RACK-A02 / 15U",
    manufacturer: "HP",
    equipmentType: "SERVER",
    unitSize: 2,
    datacenterId: "dc1",
    rackId: "rack2",
    startUnit: 15,
    positionType: "FRONT",
    serialNumber: "HP-SN-2002",
    os: "Ubuntu 22.04 LTS",
    cpuSpec: "AMD EPYC 7402P 24-Core",
    memorySpec: "256GB (8x 32GB) DDR4",
    diskSpec: "1TB NVMe SSD x 4",
    macAddress: "00:1A:2B:3C:4D:02",
    managerId: "admin_lee",
    installationDate: "2023-03-15",
    notes: "Web server cluster node 2. Scheduled maintenance.",
    monitoringEnabled: true,
    cpuThresholdWarning: 75,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 75,
    memoryThresholdCritical: 90,
    diskThresholdWarning: 80,
    diskThresholdCritical: 95,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 3. Cisco Switch (NORMAL, dc2/rack3) ---
  {
    id: "3",
    equipmentName: "Switch-Core-01",
    status: "NORMAL",
    ipAddress: "10.0.1.1",
    modelName: "Cisco Catalyst 9300",
    location: "DC-BUS / RACK-B01 / 42U",
    manufacturer: "Cisco",
    equipmentType: "SWITCH",
    unitSize: 1,
    datacenterId: "dc2",
    rackId: "rack3",
    startUnit: 42,
    positionType: "FRONT",
    serialNumber: "CSCO-SN-3003",
    os: "IOS-XE",
    cpuSpec: "N/A",
    memorySpec: "8GB",
    diskSpec: "16GB Flash",
    macAddress: "00:1A:2B:3C:4D:03",
    managerId: "net_admin",
    installationDate: "2022-11-20",
    notes: "Busan DC Core Switch (Top of Rack)",
    monitoringEnabled: true,
    cpuThresholdWarning: 70,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 70,
    memoryThresholdCritical: 90,
    diskThresholdWarning: null, // 모니터링 안 함
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 4. NetApp Storage (INACTIVE, Unassigned) ---
  {
    id: "4",
    equipmentName: "Storage-Array-01",
    status: "INACTIVE",
    ipAddress: null, // 미할당
    modelName: "NetApp FAS8200",
    location: "미지정 (재고)",
    manufacturer: "NetApp",
    equipmentType: "SERVER", // (스토리지지만 타입은 SERVER로 예시)
    unitSize: 4,
    datacenterId: null,
    rackId: null,
    startUnit: null,
    positionType: null,
    serialNumber: "NTAP-SN-4004",
    os: "ONTAP 9",
    cpuSpec: "Intel Xeon",
    memorySpec: "128GB",
    diskSpec: "10TB SAS x 12",
    macAddress: null,
    managerId: "sys_admin",
    installationDate: null,
    notes: "Stock, awaiting deployment.",
    monitoringEnabled: false,
    cpuThresholdWarning: 70,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 70,
    memoryThresholdCritical: 90,
    diskThresholdWarning: 70,
    diskThresholdCritical: 90,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 5. Cisco Router (NORMAL, dc1/rack1) ---
  {
    id: "5",
    equipmentName: "Router-Edge-01",
    status: "NORMAL",
    ipAddress: "192.168.1.1",
    modelName: "Cisco ASR 1001-X",
    location: "DC-SEL / RACK-A01 / 40U",
    manufacturer: "Cisco",
    equipmentType: "ROUTER",
    unitSize: 1,
    datacenterId: "dc1",
    rackId: "rack1",
    startUnit: 40,
    positionType: "FRONT",
    serialNumber: "CSCO-SN-5005",
    os: "IOS-XE",
    cpuSpec: "N/A",
    memorySpec: "8GB",
    diskSpec: "8GB Flash",
    macAddress: "00:1A:2B:3C:4D:05",
    managerId: "net_admin",
    installationDate: "2023-01-05",
    notes: "Seoul DC Edge Router.",
    monitoringEnabled: true,
    cpuThresholdWarning: 60,
    cpuThresholdCritical: 80,
    memoryThresholdWarning: 60,
    memoryThresholdCritical: 80,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 6. APC PDU (NORMAL, dc1/rack1) ---
  {
    id: "6",
    equipmentName: "PDU-A01-L",
    status: "NORMAL",
    ipAddress: "192.168.1.250",
    modelName: "APC AP8853",
    location: "DC-SEL / RACK-A01 / 1U", // (PDU는 0U일 수 있으나 예시로 1U)
    manufacturer: "APC",
    equipmentType: "PDU",
    unitSize: 1, // (0U PDU도 있지만, 폼 검증을 위해 1U로 가정)
    datacenterId: "dc1",
    rackId: "rack1",
    startUnit: 1, // (랙 하단)
    positionType: "REAR", // (PDU는 보통 후면)
    serialNumber: "APC-SN-6006",
    os: null,
    cpuSpec: null,
    memorySpec: null,
    diskSpec: null,
    macAddress: "00:1A:2B:3C:4D:06",
    managerId: "infra_team",
    installationDate: "2023-01-05",
    notes: "Rack A01 Left PDU.",
    monitoringEnabled: false, // (PDU는 모니터링 안 함 예시)
    cpuThresholdWarning: null,
    cpuThresholdCritical: null,
    memoryThresholdWarning: null,
    memoryThresholdCritical: null,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 7. Eaton UPS (NORMAL, dc1/rack2) ---
  {
    id: "7",
    equipmentName: "UPS-A-Zone",
    status: "NORMAL",
    ipAddress: "192.168.1.254",
    modelName: "Eaton 9PX",
    location: "DC-SEL / RACK-A02 / 1U",
    manufacturer: "Eaton",
    equipmentType: "UPS",
    unitSize: 2,
    datacenterId: "dc1",
    rackId: "rack2",
    startUnit: 1,
    positionType: "FRONT",
    serialNumber: "EATN-SN-7007",
    os: null,
    cpuSpec: null,
    memorySpec: null,
    diskSpec: null,
    macAddress: "00:1A:2B:3C:4D:07",
    managerId: "infra_team",
    installationDate: "2023-01-05",
    notes: "A-Zone UPS.",
    monitoringEnabled: false,
    cpuThresholdWarning: null,
    cpuThresholdCritical: null,
    memoryThresholdWarning: null,
    memoryThresholdCritical: null,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 8. Juniper Switch (NORMAL, dc2/rack3) ---
  {
    id: "8",
    equipmentName: "Switch-Access-B01",
    status: "NORMAL",
    ipAddress: "10.0.1.2",
    modelName: "Juniper EX4300",
    location: "DC-BUS / RACK-B01 / 41U",
    manufacturer: "Juniper",
    equipmentType: "SWITCH",
    unitSize: 1,
    datacenterId: "dc2",
    rackId: "rack3",
    startUnit: 41,
    positionType: "FRONT",
    serialNumber: "JNPR-SN-8008",
    os: "Junos",
    cpuSpec: "N/A",
    memorySpec: "4GB",
    diskSpec: "8GB Flash",
    macAddress: "00:1A:2B:3C:4D:08",
    managerId: "net_admin",
    installationDate: "2022-11-20",
    notes: "Busan DC Access Switch.",
    monitoringEnabled: true,
    cpuThresholdWarning: 70,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 70,
    memoryThresholdCritical: 90,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 9. Lenovo Server (NORMAL, dc1/rack2) ---
  {
    id: "9",
    equipmentName: "K8S-Worker-01",
    status: "NORMAL",
    ipAddress: "192.168.1.110",
    modelName: "Lenovo ThinkSystem SR650",
    location: "DC-SEL / RACK-A02 / 20U",
    manufacturer: "Lenovo",
    equipmentType: "SERVER",
    unitSize: 2,
    datacenterId: "dc1",
    rackId: "rack2",
    startUnit: 20,
    positionType: "FRONT",
    serialNumber: "LENO-SN-9009",
    os: "RHEL 8",
    cpuSpec: "Intel Xeon Gold 5218 @ 2.3GHz 2CPU",
    memorySpec: "512GB (16x 32GB) DDR4",
    diskSpec: "2TB NVMe SSD x 4",
    macAddress: "00:1A:2B:3C:4D:09",
    managerId: "devops_team",
    installationDate: "2023-08-01",
    notes: "Kubernetes Worker Node 01.",
    monitoringEnabled: true,
    cpuThresholdWarning: 85,
    cpuThresholdCritical: 95,
    memoryThresholdWarning: 85,
    memoryThresholdCritical: 95,
    diskThresholdWarning: 80,
    diskThresholdCritical: 90,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 10. Supermicro Server (DISPOSED, Unassigned) ---
  {
    id: "10",
    equipmentName: "Old-Backup-Server",
    status: "DISPOSED",
    ipAddress: null,
    modelName: "Supermicro SuperServer 5018D",
    location: "폐기됨",
    manufacturer: "Supermicro",
    equipmentType: "SERVER",
    unitSize: 1,
    datacenterId: null,
    rackId: null,
    startUnit: null,
    positionType: null,
    serialNumber: "SM-SN-1010",
    os: null,
    cpuSpec: "Intel Xeon D-1541",
    memorySpec: "32GB DDR4",
    diskSpec: "1TB SATA HDD x 2",
    macAddress: null,
    managerId: "sys_admin",
    installationDate: "2018-05-15",
    notes: "Disposed on 2023-10-01.",
    monitoringEnabled: false,
    cpuThresholdWarning: 70,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 70,
    memoryThresholdCritical: 90,
    diskThresholdWarning: 70,
    diskThresholdCritical: 90,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 11. Arista Switch (NORMAL, dc1/rack1) ---
  {
    id: "11",
    equipmentName: "Switch-Leaf-A01",
    status: "NORMAL",
    ipAddress: "192.168.1.10",
    modelName: "Arista 7050SX-64",
    location: "DC-SEL / RACK-A01 / 39U",
    manufacturer: "Arista",
    equipmentType: "SWITCH",
    unitSize: 1,
    datacenterId: "dc1",
    rackId: "rack1",
    startUnit: 39,
    positionType: "FRONT",
    serialNumber: "ARI-SN-1111",
    os: "EOS",
    cpuSpec: "N/A",
    memorySpec: "4GB",
    diskSpec: "4GB Flash",
    macAddress: "00:1A:2B:3C:4D:11",
    managerId: "net_admin",
    installationDate: "2023-01-05",
    notes: "Leaf switch for Rack A01.",
    monitoringEnabled: true,
    cpuThresholdWarning: 70,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 70,
    memoryThresholdCritical: 90,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 12. Dell Server (NORMAL, dc2/rack3) ---
  {
    id: "12",
    equipmentName: "Analytics-Server-01",
    status: "NORMAL",
    ipAddress: "10.0.1.101",
    modelName: "Dell PowerEdge R750",
    location: "DC-BUS / RACK-B01 / 10U",
    manufacturer: "Dell",
    equipmentType: "SERVER",
    unitSize: 2,
    datacenterId: "dc2",
    rackId: "rack3",
    startUnit: 10,
    positionType: "FRONT",
    serialNumber: "DELL-SN-1212",
    os: "RHEL 8",
    cpuSpec: "Intel Xeon Gold 6338 @ 2.0GHz 2CPU",
    memorySpec: "1TB (16x 64GB) DDR4",
    diskSpec: "4TB NVMe SSD x 8",
    macAddress: "00:1A:2B:3C:4D:12",
    managerId: "data_team",
    installationDate: "2023-09-15",
    notes: "BigData Analytics server.",
    monitoringEnabled: true,
    cpuThresholdWarning: 90,
    cpuThresholdCritical: 98,
    memoryThresholdWarning: 90,
    memoryThresholdCritical: 98,
    diskThresholdWarning: 85,
    diskThresholdCritical: 95,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 13. HP Server (NORMAL, dc1/rack1) ---
  {
    id: "13",
    equipmentName: "Web-Server-01",
    status: "NORMAL",
    ipAddress: "192.168.1.100",
    modelName: "HP ProLiant DL360 Gen10",
    location: "DC-SEL / RACK-A01 / 20U",
    manufacturer: "HP",
    equipmentType: "SERVER",
    unitSize: 1,
    datacenterId: "dc1",
    rackId: "rack1",
    startUnit: 20,
    positionType: "FRONT",
    serialNumber: "HP-SN-1313",
    os: "Ubuntu 22.04 LTS",
    cpuSpec: "Intel Xeon Silver 4214 @ 2.2GHz 2CPU",
    memorySpec: "128GB (4x 32GB) DDR4",
    diskSpec: "1TB NVMe SSD x 2",
    macAddress: "00:1A:2B:3C:4D:13",
    managerId: "admin_lee",
    installationDate: "2023-03-15",
    notes: "Web server cluster node 1.",
    monitoringEnabled: true,
    cpuThresholdWarning: 75,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 75,
    memoryThresholdCritical: 90,
    diskThresholdWarning: 80,
    diskThresholdCritical: 95,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 14. APC PDU (NORMAL, dc2/rack3) ---
  {
    id: "14",
    equipmentName: "PDU-B01-R",
    status: "NORMAL",
    ipAddress: "10.0.1.251",
    modelName: "APC AP8861",
    location: "DC-BUS / RACK-B01 / 1U",
    manufacturer: "APC",
    equipmentType: "PDU",
    unitSize: 1, // (0U PDU도 있지만, 1U로 가정)
    datacenterId: "dc2",
    rackId: "rack3",
    startUnit: 1,
    positionType: "REAR",
    serialNumber: "APC-SN-1414",
    os: null,
    cpuSpec: null,
    memorySpec: null,
    diskSpec: null,
    macAddress: "00:1A:2B:3C:4D:14",
    managerId: "infra_team",
    installationDate: "2022-11-20",
    notes: "Rack B01 Right PDU.",
    monitoringEnabled: false,
    cpuThresholdWarning: null,
    cpuThresholdCritical: null,
    memoryThresholdWarning: null,
    memoryThresholdCritical: null,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 15. Lenovo Server (INACTIVE, Unassigned) ---
  {
    id: "15",
    equipmentName: "K8S-Worker-Spare-01",
    status: "INACTIVE",
    ipAddress: null,
    modelName: "Lenovo ThinkSystem SR650",
    location: "미지정 (재고)",
    manufacturer: "Lenovo",
    equipmentType: "SERVER",
    unitSize: 2,
    datacenterId: null,
    rackId: null,
    startUnit: null,
    positionType: null,
    serialNumber: "LENO-SN-1515",
    os: null,
    cpuSpec: "Intel Xeon Gold 5218 @ 2.3GHz 2CPU",
    memorySpec: "512GB (16x 32GB) DDR4",
    diskSpec: "2TB NVMe SSD x 4",
    macAddress: null,
    managerId: "devops_team",
    installationDate: null,
    notes: "Spare node for K8S cluster.",
    monitoringEnabled: false,
    cpuThresholdWarning: 85,
    cpuThresholdCritical: 95,
    memoryThresholdWarning: 85,
    memoryThresholdCritical: 95,
    diskThresholdWarning: 80,
    diskThresholdCritical: 90,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 16. Cisco Router (MAINTENANCE, dc2/rack3) ---
  {
    id: "16",
    equipmentName: "Router-Edge-02",
    status: "MAINTENANCE",
    ipAddress: "10.0.1.253",
    modelName: "Cisco ISR 4331",
    location: "DC-BUS / RACK-B01 / 40U",
    manufacturer: "Cisco",
    equipmentType: "ROUTER",
    unitSize: 2,
    datacenterId: "dc2",
    rackId: "rack3",
    startUnit: 38, // 2U 크기 (38, 39)
    positionType: "FRONT",
    serialNumber: "CSCO-SN-1616",
    os: "IOS-XE",
    cpuSpec: "N/A",
    memorySpec: "4GB",
    diskSpec: "8GB Flash",
    macAddress: "00:1A:2B:3C:4D:16",
    managerId: "net_admin",
    installationDate: "2022-11-20",
    notes: "Busan DC Edge Router 2. FW upgrade pending.",
    monitoringEnabled: true,
    cpuThresholdWarning: 60,
    cpuThresholdCritical: 80,
    memoryThresholdWarning: 60,
    memoryThresholdCritical: 80,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 17. Dell Server (NORMAL, dc1/rack2) ---
  {
    id: "17",
    equipmentName: "VM-Host-01",
    status: "NORMAL",
    ipAddress: "192.168.1.120",
    modelName: "Dell PowerEdge R640",
    location: "DC-SEL / RACK-A02 / 30U",
    manufacturer: "Dell",
    equipmentType: "SERVER",
    unitSize: 1,
    datacenterId: "dc1",
    rackId: "rack2",
    startUnit: 30,
    positionType: "FRONT",
    serialNumber: "DELL-SN-1717",
    os: "VMware ESXi 7.0",
    cpuSpec: "Intel Xeon Gold 6248 @ 2.5GHz 2CPU",
    memorySpec: "768GB (12x 64GB) DDR4",
    diskSpec: "1TB SSD x 2 (Boot), 4TB NVMe x 4 (Datastore)",
    macAddress: "00:1A:2B:3C:4D:17",
    managerId: "sys_admin",
    installationDate: "2023-02-25",
    notes: "Virtualization Host 01.",
    monitoringEnabled: true,
    cpuThresholdWarning: 80,
    cpuThresholdCritical: 95,
    memoryThresholdWarning: 85,
    memoryThresholdCritical: 95,
    diskThresholdWarning: 70,
    diskThresholdCritical: 90,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 18. HP Server (NORMAL, dc1/rack2) ---
  {
    id: "18",
    equipmentName: "VM-Host-02",
    status: "NORMAL",
    ipAddress: "192.168.1.121",
    modelName: "HP ProLiant DL360 Gen10",
    location: "DC-SEL / RACK-A02 / 31U",
    manufacturer: "HP",
    equipmentType: "SERVER",
    unitSize: 1,
    datacenterId: "dc1",
    rackId: "rack2",
    startUnit: 31,
    positionType: "FRONT",
    serialNumber: "HP-SN-1818",
    os: "VMware ESXi 7.0",
    cpuSpec: "Intel Xeon Gold 6248 @ 2.5GHz 2CPU",
    memorySpec: "768GB (12x 64GB) DDR4",
    diskSpec: "1TB SSD x 2 (Boot), 4TB NVMe x 4 (Datastore)",
    macAddress: "00:1A:2B:3C:4D:18",
    managerId: "sys_admin",
    installationDate: "2023-02-25",
    notes: "Virtualization Host 02.",
    monitoringEnabled: true,
    cpuThresholdWarning: 80,
    cpuThresholdCritical: 95,
    memoryThresholdWarning: 85,
    memoryThresholdCritical: 95,
    diskThresholdWarning: 70,
    diskThresholdCritical: 90,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 19. Juniper Switch (NORMAL, dc1/rack2) ---
  {
    id: "19",
    equipmentName: "Switch-Leaf-A02",
    status: "NORMAL",
    ipAddress: "192.168.1.11",
    modelName: "Juniper QFX5100",
    location: "DC-SEL / RACK-A02 / 39U",
    manufacturer: "Juniper",
    equipmentType: "SWITCH",
    unitSize: 1,
    datacenterId: "dc1",
    rackId: "rack2",
    startUnit: 39,
    positionType: "FRONT",
    serialNumber: "JNPR-SN-1919",
    os: "Junos",
    cpuSpec: "N/A",
    memorySpec: "8GB",
    diskSpec: "32GB SSD",
    macAddress: "00:1A:2B:3C:4D:19",
    managerId: "net_admin",
    installationDate: "2023-01-05",
    notes: "Leaf switch for Rack A02.",
    monitoringEnabled: true,
    cpuThresholdWarning: 70,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 70,
    memoryThresholdCritical: 90,
    diskThresholdWarning: null,
    diskThresholdCritical: null,
    imageUrlFront: null,
    imageUrlRear: null,
  },
  // --- 20. Dell Server (NORMAL, dc2/rack3) ---
  {
    id: "20",
    equipmentName: "Logging-Server-01",
    status: "NORMAL",
    ipAddress: "10.0.1.102",
    modelName: "Dell PowerEdge R540",
    location: "DC-BUS / RACK-B01 / 20U",
    manufacturer: "Dell",
    equipmentType: "SERVER",
    unitSize: 2,
    datacenterId: "dc2",
    rackId: "rack3",
    startUnit: 20,
    positionType: "FRONT",
    serialNumber: "DELL-SN-2020",
    os: "Ubuntu 20.04 LTS",
    cpuSpec: "Intel Xeon Silver 4208 @ 2.1GHz 2CPU",
    memorySpec: "128GB (8x 16GB) DDR4",
    diskSpec: "512GB SSD (OS), 10TB HDD x 8 (Logs)",
    macAddress: "00:1A:2B:3C:4D:20",
    managerId: "devops_team",
    installationDate: "2022-12-10",
    notes: "Central logging server (ELK Stack).",
    monitoringEnabled: true,
    cpuThresholdWarning: 70,
    cpuThresholdCritical: 90,
    memoryThresholdWarning: 80,
    memoryThresholdCritical: 95,
    diskThresholdWarning: 90,
    diskThresholdCritical: 98,
    imageUrlFront: null,
    imageUrlRear: null,
  },
];

const API_BASE_URL = "https://api.serverway.shop/api";

export const handlers = [
  // --- GET /datacenters ---
  http.get(`${API_BASE_URL}/datacenters`, async () => {
    await delay(300);
    // API 3.1의 응답 형식(result 키)에 맞게 수정
    return HttpResponse.json({
      status_code: 200,
      status_message: "전산실 목록 조회 완료",
      result: MOCK_DATACENTERS,
    });
  }),

  // --- GET /racks/datacenter/:datacenterId ---
  http.get(
    `${API_BASE_URL}/racks/datacenter/:datacenterId`,
    async ({ params }) => {
      await delay(400);
      const { datacenterId } = params;
      const filteredRacks = MOCK_RACKS.filter(
        (r) => r.datacenterId === datacenterId,
      );
      // API 5.1의 응답 형식(result 키)에 맞게 수정
      return HttpResponse.json({
        status_code: 200,
        status_message: "랙 목록 조회 완료",
        result: filteredRacks,
      });
    },
  ),

  // --- GET /resourceManage (목록 조회) ---
  http.get(`${API_BASE_URL}/resourceManage`, async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const size = parseInt(url.searchParams.get("size") || "10");
    const searchTerm = url.searchParams.get("searchTerm") || "";
    const status = url.searchParams.get("status") || "";
    // const type = url.searchParams.get('type') || '';
    // const location = url.searchParams.get('location') || '';

    let filteredData = MOCK_DATA;

    if (searchTerm) {
      filteredData = filteredData.filter(
        (r) =>
          // 필드명 변경
          r.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.modelName &&
            r.modelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (r.ipAddress && r.ipAddress.includes(searchTerm)),
      );
    }
    if (status) {
      filteredData = filteredData.filter((r) => r.status === status);
    }

    const start = page * size;
    const end = start + size;
    const paginatedContent = filteredData.slice(start, end);

    return HttpResponse.json({
      content: paginatedContent,
      totalElements: filteredData.length,
      totalPages: Math.ceil(filteredData.length / size),
      last: end >= filteredData.length,
      size: size,
      number: page,
    });
  }),

  // --- [추가/수정됨] GET /resourceManage/:id (자원 상세 조회) ---
  http.get(`${API_BASE_URL}/resourceManage/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    // MOCK_DATA에서 id로 해당 자원을 찾습니다.
    const resource = MOCK_DATA.find((r) => r.id === id);

    if (resource) {
      // MOCK_DATA에 상세 필드가 모두 포함되어 있으므로, 찾은 객체를 그대로 반환합니다.
      return HttpResponse.json(resource);
    } else {
      // 일치하는 자원이 없으면 404 Not Found 응답을 보냅니다.
      return new HttpResponse(null, { status: 404 });
    }
  }),

  // --- DELETE /resourceManage/:id ---
  http.delete(`${API_BASE_URL}/resourceManage/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const initialLength = MOCK_DATA.length;
    MOCK_DATA = MOCK_DATA.filter((r) => r.id !== id);
    console.log(`[MSW] 자원 삭제됨 (ID: ${id})`);
    if (MOCK_DATA.length < initialLength) {
      return new HttpResponse(null, { status: 204 });
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  }),

  // --- POST /resourceManage (새 자원 등록) ---
  http.post(`${API_BASE_URL}/resourceManage`, async ({ request }) => {
    await delay(500);
    const formData = await request.formData();

    // 3단계 폼의 모든 필드를 받도록 수정
    // 폼 데이터가 null일 경우를 대비해 기본값을 확실히 지정합니다.
    const newResource: Resource = {
      id: `new-${Date.now()}`,
      // 1단계 (필수 항목은 '||' 연산자로 기본값 보장)
      equipmentName:
        (formData.get("equipmentName") as string) || "이름 없는 장비",
      equipmentType:
        (formData.get("equipmentType") as EquipmentType) || "SERVER",
      unitSize: Number(formData.get("unitSize")) || 1,
      status: (formData.get("status") as ResourceStatus) || "INACTIVE",

      // 1단계 (선택 항목)
      manufacturer: (formData.get("manufacturer") as string) || null,
      modelName: (formData.get("modelName") as string) || null,
      serialNumber: (formData.get("serialNumber") as string) || null,
      equipmentCode: (formData.get("equipmentCode") as string) || null,
      imageUrlFront: formData.get("imageFrontFile")
        ? `https://via.placeholder.com/150?text=Front`
        : null,
      imageUrlRear: formData.get("imageRearFile")
        ? `https://via.placeholder.com/150?text=Rear`
        : null,

      // 2단계 (선택 항목 - Number 변환 및 null 처리)
      datacenterId: (formData.get("datacenterId") as string) || null,
      rackId: (formData.get("rackId") as string) || null,
      startUnit: formData.get("startUnit")
        ? Number(formData.get("startUnit"))
        : null,
      positionType: (formData.get("positionType") as PositionType) || null,
      os: (formData.get("os") as string) || null,
      cpuSpec: (formData.get("cpuSpec") as string) || null,
      memorySpec: (formData.get("memorySpec") as string) || null,
      diskSpec: (formData.get("diskSpec") as string) || null,
      ipAddress: (formData.get("ipAddress") as string) || null,
      macAddress: (formData.get("macAddress") as string) || null,

      // 3단계 (선택 항목)
      managerId: (formData.get("managerId") as string) || null,
      installationDate: (formData.get("installationDate") as string) || null,
      notes: (formData.get("notes") as string) || null,
      monitoringEnabled: formData.get("monitoringEnabled") === "true",

      // 3단계 (모니터링 - Number 변환 및 null 처리)
      cpuThresholdWarning: formData.get("cpuThresholdWarning")
        ? Number(formData.get("cpuThresholdWarning"))
        : null,
      cpuThresholdCritical: formData.get("cpuThresholdCritical")
        ? Number(formData.get("cpuThresholdCritical"))
        : null,
      memoryThresholdWarning: formData.get("memoryThresholdWarning")
        ? Number(formData.get("memoryThresholdWarning"))
        : null,
      memoryThresholdCritical: formData.get("memoryThresholdCritical")
        ? Number(formData.get("memoryThresholdCritical"))
        : null,
      diskThresholdWarning: formData.get("diskThresholdWarning")
        ? Number(formData.get("diskThresholdWarning"))
        : null,
      diskThresholdCritical: formData.get("diskThresholdCritical")
        ? Number(formData.get("diskThresholdCritical"))
        : null,

      location: "미지정 (생성됨)", // (임시)
    };
    MOCK_DATA.unshift(newResource);
    console.log("[MSW] 자원 생성됨:", newResource);
    return HttpResponse.json(newResource, { status: 201 });
  }),

  // --- PUT /resourceManage/:id (자원 수정) ---
  http.put(
    `${API_BASE_URL}/resourceManage/:id`,
    async ({ params, request }) => {
      await delay(500);
      const { id } = params;
      const formData = await request.formData();
      const index = MOCK_DATA.findIndex((r) => r.id === id);

      if (index > -1) {
        const existingResource = MOCK_DATA[index];

        // 폼에서 넘어온 모든 키-값을 처리합니다.
        // const updatedData: Partial<Resource> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedData: any = {};

        formData.forEach((value, key) => {
          // 'null' 또는 'undefined' 문자열로 오는 경우, 실제 null 값으로 변환
          if (value === "null" || value === "undefined") {
            // updatedData[key as keyof Resource] = null;
            updatedData[key] = null;
            return;
          }

          // 숫자형 필드 변환
          if (
            [
              "unitSize",
              "startUnit",
              "cpuThresholdWarning",
              "cpuThresholdCritical",
              "memoryThresholdWarning",
              "memoryThresholdCritical",
              "diskThresholdWarning",
              "diskThresholdCritical",
            ].includes(key) &&
            value !== ""
          ) {
            // updatedData[key as keyof Resource] = Number(value);
            updatedData[key] = Number(value);
            return;
          }

          // boolean 필드 변환
          if (key === "monitoringEnabled") {
            updatedData[key] = value === "true";
            return;
          }

          // 빈 문자열을 null로 처리해야 할 수 있는 선택적 필드
          if (
            [
              "positionType",
              "datacenterId",
              "rackId",
              /* ...기타 빈 문자열 대신 null이 되어야 하는 필드... */
            ].includes(key) &&
            value === ""
          ) {
            // updatedData[key as keyof Resource] = null;
            updatedData[key] = null;
            return;
          }

          // 나머지 문자열 필드
          //  updatedData[key as keyof Resource] = value as string;
          updatedData[key] = value as string;
        });

        const updatedResource: Resource = {
          ...existingResource,
          ...updatedData, // 폼에서 받은 값으로 덮어쓰기
          // 이미지 파일 처리
          imageUrlFront: formData.get("imageFrontFile")
            ? `https://via.placeholder.com/150?text=Front-Upd`
            : existingResource.imageUrlFront,
          imageUrlRear: formData.get("imageRearFile")
            ? `https://via.placeholder.com/150?text=Rear-Upd`
            : existingResource.imageUrlRear,
          // (임시) 위치 정보 업데이트
          location: `${updatedData.datacenterId || "N/A"} / ${updatedData.rackId || "N/A"} / ${updatedData.startUnit || "N/A"}U`,
        };

        MOCK_DATA[index] = updatedResource;
        console.log("[MSW] 자원 수정됨:", updatedResource);
        return HttpResponse.json(updatedResource);
      } else {
        console.error(`[MSW] 수정할 자원 없음 (ID: ${id})`);
        return new HttpResponse(null, { status: 404 });
      }
    },
  ),

  // --- DELETE /resourceManage (Batch) ---
  http.delete(`${API_BASE_URL}/resourceManage`, async ({ request }) => {
    await delay(400);
    const { ids } = (await request.json()) as { ids?: string[] };
    if (!ids || ids.length === 0) {
      return new HttpResponse("삭제할 ID 목록이 없습니다.", { status: 400 });
    }
    const initialLength = MOCK_DATA.length;
    MOCK_DATA = MOCK_DATA.filter((r) => !ids.includes(r.id));
    const deletedCount = initialLength - MOCK_DATA.length;
    console.log(
      `[MSW] 자원 ${deletedCount}개 대량 삭제됨 (요청 IDs: ${ids.join(", ")})`,
    );
    return new HttpResponse(null, { status: 204 });
  }),
];
