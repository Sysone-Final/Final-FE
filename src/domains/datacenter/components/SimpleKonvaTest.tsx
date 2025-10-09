import React from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';

const SimpleKonvaTest: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Konva 기본 테스트</h3>
      <Stage width={300} height={200}>
        <Layer>
          <Circle x={100} y={100} radius={50} fill="green" />
          <Text text="Konva Works!" x={15} y={15} fontSize={18} />
        </Layer>
      </Stage>
    </div>
  );
};

export default SimpleKonvaTest;