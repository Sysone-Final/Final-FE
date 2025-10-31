import React, { useMemo, useState } from 'react'; 
import { useFloorPlanStore, zoomToAsset } from '../store/floorPlanStore';
import { AlertTriangle, Cpu, Thermometer, ChevronDown, ChevronUp } from 'lucide-react'; 
import type { Asset } from '../types';

const getAssetScore = (asset: Asset) => {
 let score = 0;
 let reason = '';
 
 const cpu = asset.data?.cpuUsage ?? 0;
 const temp = asset.data?.temperature ?? 0;

 if (cpu > 75) {
  score = cpu;
  reason = `CPU ${cpu}%`;
 }

 if (temp > 30) {
  const tempScore = (temp - 25) * 10;
  if (tempScore > score) {
   score = tempScore;
   reason = `온도 ${temp}°C`;
  }
 }
 
 return { asset, score, reason };
};

const TopNWidget: React.FC = () => {
 const { assets } = useFloorPlanStore();
 const [isOpen, setIsOpen] = useState(true); // [3] 'isOpen' 상태 추가 (기본값: 열림)

 const top5Assets = useMemo(() => {
  return assets
   .filter(asset => asset.assetType === 'rack' && asset.data)
   .map(getAssetScore)
   .filter(item => item.score > 75)
   .sort((a, b) => b.score - a.score)
   .slice(0, 5);
 }, [assets]);

 const handleToggleOpen = () => setIsOpen(prev => !prev); // [4] 토글 핸들러
 
 const handleItemClick = (assetId: string) => {
  zoomToAsset(assetId);
 };

 if (top5Assets.length === 0) {
  return null; // 문제가 없으면 위젯을 숨김
 }
 
 return (
  <div className="absolute top-20 right-4 z-10 w-64 max-w-xs">
   <div className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg border border-gray-700 overflow-hidden">
    
    {/* [5] 헤더를 토글 버튼으로 변경 */}
    <button
     onClick={handleToggleOpen}
     className="w-full flex items-center justify-between p-3 border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
    >
     <div className="flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-red-500" />
      <h3 className="text-sm font-bold text-red-400">실시간 문제 리포트</h3>
     </div>
     {/* [6] 토글 아이콘 추가 */}
     {isOpen ? (
      <ChevronUp className="w-5 h-5 text-gray-400" />
     ) : (
      <ChevronDown className="w-5 h-5 text-gray-400" />
     )}
    </button>
    
    {/* [7] isOpen이 true일 때만 본문 렌더링 */}
    {isOpen && (
     <div className="flex flex-col">
      {top5Assets.map(({ asset, reason }) => (
       <button
        key={asset.id}
        onClick={() => handleItemClick(asset.id)}
        className="px-3 py-2 text-left hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-b-0"
t      >
        <p className="text-sm font-semibold text-white truncate">{asset.name}</p>
        <p className="text-xs text-red-400">{reason}</p>
       </button>
      ))}
     </div>
    )}
   </div>
  </div>
 );
};

export default TopNWidget;