import React from 'react';

/**
 * Canvas: 중앙에 위치하여 2D 평면도가 렌더링될 핵심 작업 공간의 기본 틀입니다.
 */
const Canvas: React.FC = () => {
  return (
    <main className="bg-gray-50 rounded-lg shadow-inner flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-600">Canvas Area</h2>
        <p className="text-gray-400 mt-2">Konva.js Stage가 여기에 렌더링됩니다.</p>
      </div>
    </main>
  );
};

export default Canvas;

