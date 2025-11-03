import { handlers as resourceManageHandlers } from "../domains/resourceManage/mocks/handlers";
import { handlers as floorPlanHandlers } from '../domains/serverView/floorPlan/mocks/handlers'; 
export const handlers = [
  ...resourceManageHandlers,
  ...floorPlanHandlers,
];
