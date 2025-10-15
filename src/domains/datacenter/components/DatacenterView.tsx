import { Stage, Layer } from 'react-konva';
import ServerRack from './ServerRack';
import DatacenterFloor from './DatacenterFloor';
import { createDatacenterEquipmentLayout } from '../data/equipmentLayouts';
import { DATACENTER_CONFIG } from '../constants/config';

function DatacenterView() {
  // 설정값 가져오기
  const {
    STAGE_WIDTH: stageWidth,
    STAGE_HEIGHT: stageHeight,
    GRID_SIZE: gridSize,
    ROOM_WIDTH: roomWidth,
    ROOM_HEIGHT: roomHeight,
    CUBE_SIZE: cubeSize,
    VIEW_OFFSET_X,
    VIEW_OFFSET_Y,
  } = DATACENTER_CONFIG;
  
  // 장비 데이터 가져오기 (정적 데이터)
  const datacenterEquipment = createDatacenterEquipmentLayout(gridSize, cubeSize);

  try {

    return (
      <div className="isometric-datacenter">
        <div>
          <Stage
            width={stageWidth}
            height={stageHeight}
            scaleX={1}
            scaleY={1}
            x={stageWidth / VIEW_OFFSET_X}
            y={VIEW_OFFSET_Y}
          >
            <Layer>
              {/* 바닥과 격자 */}
              <DatacenterFloor 
                width={roomWidth} 
                height={roomHeight} 
                gridSize={gridSize} 
              />
              
              {/* 장비들 렌더링 */}
              {datacenterEquipment.map((equipment, index) => (
                <ServerRack
                  key={index}
                  x={equipment.x}
                  y={equipment.y}
                  z={equipment.z}
                  width={equipment.width}
                  depth={equipment.depth}
                  height={equipment.height}
                  type={equipment.type}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px' }}>

        <p> {String(error)}</p>
      </div>
    );
  }
}

export default DatacenterView;