import { useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

function Tooltip({ children, content }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, height: 0 });

  const handleEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: rect.right, y: rect.top, height: rect.height });
    setVisible(true);
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={() => setVisible(false)}
      className="relative inline-flex"
    >
      {children}

      {visible &&
        createPortal(
          <div
            className="fixed z-[90] pointer-events-none flex items-center"
            style={{
              top: `${coords.y}px`,
              left: `${coords.x + 8}px`,
              height: `${coords.height}px`,
            }}
          >
            <div
              className="
                bg-slate-800/90 text-white text-sm 
                px-3 py-1.5 rounded-md shadow-lg border border-slate-700
                whitespace-nowrap flex items-center
              "
            >
              {content}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Tooltip;
