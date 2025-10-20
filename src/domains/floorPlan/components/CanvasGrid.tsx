import React from 'react';
import { Group, Line, Text } from 'react-konva';

// [수정] 사용하지 않는 width와 height를 props 타입에서 제거합니다.
interface CanvasGridProps {
  gridSize: number;
  cols: number;
  rows: number;
}

// [수정] props 목록에서 width와 height를 제거합니다.
const CanvasGrid: React.FC<CanvasGridProps> = ({ gridSize, cols, rows }) => {
  const lines = [];
  const headerPadding = 30; // 헤더 텍스트를 위한 여백

  // 세로선
  for (let i = 0; i <= cols; i++) {
    const x = headerPadding + i * gridSize;
    lines.push(
      <Line key={`v-${i}`} points={[x, headerPadding, x, headerPadding + rows * gridSize]} stroke="#e0e0e0" strokeWidth={1} />
    );
  }

  // 가로선
  for (let j = 0; j <= rows; j++) {
    const y = headerPadding + j * gridSize;
    lines.push(
      <Line key={`h-${j}`} points={[headerPadding, y, headerPadding + cols * gridSize, y]} stroke="#e0e0e0" strokeWidth={1} />
    );
  }

  // 열 헤더 (A, B, C...)
  for (let i = 0; i < cols; i++) {
    lines.push(
      <Text
        key={`col-header-${i}`}
        x={headerPadding + i * gridSize}
        y={10}
        width={gridSize}
        text={String.fromCharCode(65 + i)}
        align="center"
        fontStyle="bold"
        fill="#a0a0a0"
      />
    );
  }

  // 행 헤더 (1, 2, 3...)
  for (let j = 0; j < rows; j++) {
    lines.push(
      <Text
        key={`row-header-${j}`}
        x={5}
        y={headerPadding + j * gridSize}
        height={gridSize}
        text={`${j + 1}`}
        align="center"
        verticalAlign="middle"
        fontStyle="bold"
        fill="#a0a0a0"
      />
    );
  }

  return <Group>{lines}</Group>;
};

export default CanvasGrid;

