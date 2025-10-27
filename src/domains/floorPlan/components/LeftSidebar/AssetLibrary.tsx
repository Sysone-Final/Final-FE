import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Asset } from '../../types';

// 라이브러리에 표시될 자산 템플릿 목록
const assetTemplates: Omit<Asset, 'id' | 'gridX' | 'gridY'>[] = [
  { type: 'rack', name: '42U 표준랙', widthInCells: 1, heightInCells: 2, customColor: '#dbe4ff' },
  // { type: 'wall', name: '벽', widthInCells: 10, heightInCells: 1, customColor: '#868e96' },
];

// 드래그 가능한 개별 자산 컴포넌트
const DraggableAsset = ({ template }: { template: typeof assetTemplates[0] }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${template.type}-${template.name}`,
    data: template, // 드래그 시 전달할 데이터
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000, // 드래그하는 동안 다른 요소 위에 보이도록
    cursor: 'grabbing',
  } : {
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-asset-item">
      <span className="asset-icon">▦</span>
      <span className="asset-name">{template.name}</span>
    </div>
  );
};

const AssetLibrary: React.FC = () => {
  return (
    <div>
      <h3 className="sidebar-subtitle">자산 라이브러리</h3>
      <div className="asset-category">
        <h4 className="category-title">랙 (Racks)</h4>
        {assetTemplates.map((template, index) => (
          <DraggableAsset key={index} template={template} />
        ))}
      </div>
    </div>
  );
};

export default AssetLibrary;

