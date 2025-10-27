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
  `;

  return (
    <div className={panelClasses}>
      {/* 사이드바 패널 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg flex flex-col h-full w-full">
        <div className="p-4 border-b border-gray-200/80">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
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
