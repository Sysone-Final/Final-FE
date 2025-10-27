import React from 'react';
import { Group, Line, Text, Rect } from 'react-konva';

interface CanvasGridProps {
  gridSize: number;
  cols: number;
  rows: number;
}

const CanvasGrid: React.FC<CanvasGridProps> = ({ gridSize, cols, rows }) => {
  const lines = [];
  const headerPadding = 40; // 헤더를 위한 여백

  // --- 배경 ---
  // 위쪽 열 헤더 배경
  lines.push(
    <Rect
      key="top-header-bg"
      x={headerPadding}
      y={0}
      width={cols * gridSize}
      height={headerPadding}
      fill="#f8f9fa"
    />
  );
  // 왼쪽 행 헤더 배경
  lines.push(
    <Rect
      key="left-header-bg"
      x={0}
      y={headerPadding}
      width={headerPadding}
      height={rows * gridSize}
      fill="#f8f9fa"
    />
  );
  // [신규] 아래쪽 열 헤더 배경
  lines.push(
    <Rect
      key="bottom-header-bg"
      x={headerPadding}
      y={headerPadding + rows * gridSize}
      width={cols * gridSize}
      height={headerPadding}
      fill="#f8f9fa"
    />
  );
  // [신규] 오른쪽 행 헤더 배경
  lines.push(
    <Rect
      key="right-header-bg"
      x={headerPadding + cols * gridSize}
      y={headerPadding}
      width={headerPadding}
      height={rows * gridSize}
      fill="#f8f9fa"
    />
  );
  // 4개의 코너 배경
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const cornerPositions = [
    { x: 0, y: 0 },
    { x: headerPadding + cols * gridSize, y: 0 },
    { x: 0, y: headerPadding + rows * gridSize },
    { x: headerPadding + cols * gridSize, y: headerPadding + rows * gridSize },
  ];
  corners.forEach((key, i) => {
     lines.push(
      <Rect
        key={key}
        x={cornerPositions[i].x}
        y={cornerPositions[i].y}
        width={headerPadding}
        height={headerPadding}
        fill="#f1f3f5"
      />
    );
  });

  // --- 그리드 선 ---
  const gridWidth = cols * gridSize;
  const gridHeight = rows * gridSize;
  // 세로선
  for (let i = 0; i <= cols; i++) {
    const x = headerPadding + i * gridSize;
    lines.push(
      <Line key={`v-${i}`} points={[x, 0, x, gridHeight + headerPadding * 2]} stroke="#e9ecef" strokeWidth={1} />
    );
  }
  // 가로선
  for (let j = 0; j <= rows; j++) {
    const y = headerPadding + j * gridSize;
    lines.push(
      <Line key={`h-${j}`} points={[0, y, gridWidth + headerPadding * 2, y]} stroke="#e9ecef" strokeWidth={1} />
    );
  }

  // --- 헤더 텍스트 ---
  // 위쪽 & 아래쪽 열 헤더
  for (let i = 0; i < cols; i++) {
    const textProps = {
        x: headerPadding + i * gridSize,
        width: gridSize,
        text: `${String.fromCharCode(65 + i)} (${i + 1})`,
        align: 'center' as const,
        verticalAlign: 'middle' as const,
        fontSize: 10,
        fontStyle: 'bold',
        fill: '#868e96',
    };
    lines.push(<Text key={`top-col-header-${i}`} {...textProps} y={0} height={headerPadding} />);
    lines.push(<Text key={`bottom-col-header-${i}`} {...textProps} y={headerPadding + gridHeight} height={headerPadding} />);
  }
  // 왼쪽 & 오른쪽 행 헤더
  for (let j = 0; j < rows; j++) {
     const textProps = {
        y: headerPadding + j * gridSize,
        height: gridSize,
        text: `${j + 1} (${j + 1})`,
        align: 'center' as const,
        verticalAlign: 'middle' as const,
        fontSize: 10,
        fontStyle: 'bold',
        fill: '#868e96',
    };
    lines.push(<Text key={`left-row-header-${j}`} {...textProps} x={0} width={headerPadding} />);
    lines.push(<Text key={`right-row-header-${j}`} {...textProps} x={headerPadding + gridWidth} width={headerPadding} />);
  }

  return <Group>{lines}</Group>;
};

export default CanvasGrid;

