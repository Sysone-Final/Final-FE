import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FloatingSidebarPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  position: 'left' | 'right';
  title: string;
  children: React.ReactNode;
}

const FloatingSidebarPanel: React.FC<FloatingSidebarPanelProps> = ({
  isOpen,
  onToggle,
  position,
  title,
  children,
}) => {
  const panelClasses = `
    floating-sidebar 
    ${position === 'left' ? 'left-4' : 'right-4'}
    ${isOpen ? 'translate-x-0' : (position === 'left' ? '-translate-x-[calc(100%+2rem)]' : 'translate-x-[calc(100%+2rem)]')}
  `;

  const buttonClasses = `
    sidebar-toggle-button
    ${position === 'left' ? '-right-8' : '-left-8'}
    /* 반투명 다크 버튼 스타일 추가 */
    @apply absolute top-1/2 -translate-y-1/2 p-2 rounded-full
    bg-gray-700/80 text-gray-50 backdrop-blur-sm
    hover:bg-gray-600 transition-colors;
  `;

return (
    <div className={panelClasses}>
      {/* 사이드바 패널 (반투명 다크 스타일 적용) */}
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg flex flex-col h-full w-full border border-gray-700">
        <div className="p-4 border-b border-gray-600/80">
          <h2 className="text-subtitle">{title}</h2>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          {children}
        </div>
      </div>
      {/* 열기/닫기 토글 버튼 */}
      <button onClick={onToggle} className={buttonClasses}>
        {position === 'left' ? (isOpen ? <ChevronLeft /> : <ChevronRight />) : (isOpen ? <ChevronRight /> : <ChevronLeft />)}
      </button>
    </div>
  );
};

export default FloatingSidebarPanel;
