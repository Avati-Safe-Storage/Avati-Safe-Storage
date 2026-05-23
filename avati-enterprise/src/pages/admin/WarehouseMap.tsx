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
        <h1 className="text-2xl font-bold text-brand-text">Warehouse Interactive Map</h1>
        <p className="text-brand-muted mt-1">Visualize capacity and locate inventory across all zones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 vault-card rounded-xl p-6 border border-brand-border/10 flex flex-col min-h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-brand-text">Facility Overview</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-brand-muted"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> Full (&gt;90%)</div>
              <div className="flex items-center gap-2 text-brand-muted"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span> Moderate (50-90%)</div>
              <div className="flex items-center gap-2 text-brand-muted"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span> Available (&lt;50%)</div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="flex-1 bg-[#050505] rounded-xl border border-brand-border/25 relative p-4 grid grid-cols-2 grid-rows-2 gap-4">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={clsx(
                  "relative rounded-lg p-4 transition-all duration-300 hover:shadow-lg flex flex-col items-center justify-center text-center cursor-pointer",
                  activeZone === zone.id ? "ring-4 ring-brand-gold/40 border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]" : "",
                  zone.occupancy > 90 ? "bg-red-950/20 border border-red-800/40 hover:bg-red-950/30 text-red-400" :
                  zone.occupancy > 50 ? "bg-yellow-950/20 border border-yellow-800/40 hover:bg-yellow-950/30 text-yellow-400" :
                  "bg-green-950/20 border border-green-800/40 hover:bg-green-950/30 text-green-400"
                )}
              >
                <span className="text-2xl font-black text-brand-muted opacity-10 absolute top-4 left-4 font-mono">{zone.id}</span>
                <h4 className="font-bold text-brand-text z-10">{zone.name}</h4>
                <p className="text-xs text-brand-muted mt-1 z-10">{zone.type}</p>
                
                <div className="mt-4 w-full max-w-[120px] bg-brand-light rounded-full h-2 overflow-hidden z-10 border border-brand-border/10">
                  <div 
                    className={clsx(
                      "h-full",
                      zone.occupancy > 90 ? "bg-red-500" :
                      zone.occupancy > 50 ? "bg-yellow-500" : "bg-green-500"
                    )}
                    style={{ width: `${zone.occupancy}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold mt-2 z-10 opacity-90">{zone.occupancy}% Used</span>
              </button>
            ))}
          </div>
        </div>

        {/* Zone Details */}
        <div className="vault-card rounded-xl p-6 border border-brand-border/10">
          <h3 className="font-bold text-brand-text mb-6 border-b border-brand-border/10 pb-4">Zone {activeZone} Details</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-brand-muted mb-1">Zone Type</p>
              <p className="font-semibold text-brand-text">{zones.find(z => z.id === activeZone)?.type}</p>
            </div>
            
            <div>
              <p className="text-sm text-brand-muted mb-1">Total Capacity</p>
              <p className="font-semibold text-brand-text">{zones.find(z => z.id === activeZone)?.racks} Racks</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-brand-muted">Current Occupancy</span>
                <span className="font-bold text-brand-text">{zones.find(z => z.id === activeZone)?.occupancy}%</span>
              </div>
              <div className="w-full bg-brand-light rounded-full h-2.5 overflow-hidden border border-brand-border/15">
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

            <div className="pt-6 border-t border-brand-border/15">
              <h4 className="text-sm font-semibold text-brand-text mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-gold" />
                Find Rack/Bin
              </h4>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. A-12" 
                  className="flex-1 vault-input rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
                />
                <button className="bg-brand-gold text-brand-dark px-4 py-2 rounded-lg text-sm font-bold hover:brightness-105 transition-all shadow-md shadow-brand-gold/10 cursor-pointer">
                  Locate
                </button>
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-800/30 rounded-lg p-4 flex gap-3 mt-4">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-xs text-blue-300 leading-relaxed">
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
