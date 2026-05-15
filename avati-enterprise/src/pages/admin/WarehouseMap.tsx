import { useState } from 'react';
import { Search, Info } from 'lucide-react';
import clsx from 'clsx';

const zones = [
  { id: 'A', name: 'Zone A', type: 'General Storage', occupancy: 85, racks: 40 },
  { id: 'B', name: 'Zone B', type: 'Climate Controlled', occupancy: 40, racks: 25 },
  { id: 'C', name: 'Zone C', type: 'High Value', occupancy: 90, racks: 15 },
  { id: 'D', name: 'Zone D', type: 'Bulk Items', occupancy: 20, racks: 30 },
];

export default function WarehouseMap() {
  const [activeZone, setActiveZone] = useState('A');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Interactive Map</h1>
        <p className="text-gray-500 mt-1">Visualize capacity and locate inventory across all zones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Facility Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Full (&gt;90%)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Moderate (50-90%)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Available (&lt;50%)</div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="flex-1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 relative p-4 grid grid-cols-2 grid-rows-2 gap-4">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={clsx(
                  "relative rounded-lg p-4 transition-all hover:shadow-md flex flex-col items-center justify-center text-center",
                  activeZone === zone.id ? "ring-4 ring-brand-gold ring-opacity-50" : "",
                  zone.occupancy > 90 ? "bg-red-50 border border-red-200" :
                  zone.occupancy > 50 ? "bg-yellow-50 border border-yellow-200" :
                  "bg-green-50 border border-green-200"
                )}
              >
                <span className="text-2xl font-black text-gray-900 opacity-20 absolute top-4 left-4">{zone.id}</span>
                <h4 className="font-bold text-gray-900 z-10">{zone.name}</h4>
                <p className="text-sm text-gray-600 mt-1 z-10">{zone.type}</p>
                
                <div className="mt-4 w-full max-w-[120px] bg-white rounded-full h-2 overflow-hidden z-10 border border-gray-200">
                  <div 
                    className={clsx(
                      "h-full",
                      zone.occupancy > 90 ? "bg-red-500" :
                      zone.occupancy > 50 ? "bg-yellow-500" : "bg-green-500"
                    )}
                    style={{ width: `${zone.occupancy}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold mt-2 z-10">{zone.occupancy}% Used</span>
              </button>
            ))}
          </div>
        </div>

        {/* Zone Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Zone {activeZone} Details</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Zone Type</p>
              <p className="font-semibold">{zones.find(z => z.id === activeZone)?.type}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Capacity</p>
              <p className="font-semibold">{zones.find(z => z.id === activeZone)?.racks} Racks</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Current Occupancy</span>
                <span className="font-bold">{zones.find(z => z.id === activeZone)?.occupancy}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={clsx(
                    "h-full rounded-full transition-all duration-500",
                    (zones.find(z => z.id === activeZone)?.occupancy || 0) > 90 ? "bg-red-500" :
                    (zones.find(z => z.id === activeZone)?.occupancy || 0) > 50 ? "bg-yellow-500" : "bg-green-500"
                  )}
                  style={{ width: `${zones.find(z => z.id === activeZone)?.occupancy}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                Find Rack/Bin
              </h4>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. A-12" 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold outline-none"
                />
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Locate
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 mt-4">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Zone {activeZone} is optimized for {zones.find(z => z.id === activeZone)?.type.toLowerCase()}. 
                {(zones.find(z => z.id === activeZone)?.occupancy || 0) > 80 ? ' Space is limited, consider routing new items to another zone.' : ' Adequate space available for new incoming items.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
