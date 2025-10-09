// import React, { createContext, useContext, ReactNode, useState } from 'react';
// import type { Datacenter, DatacenterMetrics } from '../types';

// interface DatacenterContextType {
//   selectedDatacenter: Datacenter | null;
//   metrics: DatacenterMetrics | null;
//   setSelectedDatacenter: (datacenter: Datacenter | null) => void;
//   updateMetrics: (metrics: DatacenterMetrics) => void;
// }

// const DatacenterContext = createContext<DatacenterContextType | undefined>(undefined);

// export const useDatacenterContext = () => {
//   const context = useContext(DatacenterContext);
//   if (!context) {
//     throw new Error('useDatacenterContext must be used within a DatacenterProvider');
//   }
//   return context;
// };

// interface DatacenterProviderProps {
//   children: ReactNode;
// }

// export const DatacenterProvider: React.FC<DatacenterProviderProps> = ({ children }) => {
//   const [selectedDatacenter, setSelectedDatacenter] = useState<Datacenter | null>(null);
//   const [metrics, setMetrics] = useState<DatacenterMetrics | null>(null);

//   const updateMetrics = (newMetrics: DatacenterMetrics) => {
//     setMetrics(newMetrics);
//   };

//   return (
//     <DatacenterContext.Provider
//       value={{
//         selectedDatacenter,
//         metrics,
//         setSelectedDatacenter,
//         updateMetrics,
//       }}
//     >
//       {children}
//     </DatacenterContext.Provider>
//   );
// };