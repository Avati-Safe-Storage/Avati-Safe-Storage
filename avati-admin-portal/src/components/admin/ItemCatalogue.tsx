import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Package } from 'lucide-react';
import clsx from 'clsx';
import { BASE_ITEMS, ITEM_ROOMS } from '../../lib/inventoryData';
import type { ItemCondition } from '../../lib/googleSheets';

export interface CatalogueItem {
  instanceId: string;
  itemDefId?: string;
  name: string;
  category: string;
  description?: string;
  options: Record<string, string>;
  quantity: number;
  unit?: string;
  condition?: ItemCondition;
  price: number;       // monthly storage price per unit
  isExtra?: boolean;
  notes?: string;
}

interface Props {
  items: CatalogueItem[];
  onChange: (items: CatalogueItem[]) => void;
}

const CONDITIONS: ItemCondition[] = ['Excellent', 'Good', 'Fair', 'Damaged'];

function uid() { return Math.random().toString(36).slice(2, 9); }

function defaultOpts(def: typeof BASE_ITEMS[0]): Record<string, string> {
  const opts: Record<string, string> = {};
  if (def.options) {
    Object.entries(def.options).forEach(([k, v]) => {
      opts[k] = v.isCheckbox ? 'false' : (v.choices?.[0] || '');
    });
  }
  return opts;
}

export default function ItemCatalogue({ items, onChange }: Props) {
  const [activeRoom, setActiveRoom] = useState<typeof ITEM_ROOMS[number]>(ITEM_ROOMS[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [extraName, setExtraName] = useState('');
  const [extraPrice, setExtraPrice] = useState(0);
  const [extraCategory] = useState('Extra Items');

  const addFromCatalogue = (defId: string) => {
    const def = BASE_ITEMS.find(d => d.id === defId)!;
    const opts = defaultOpts(def);
    const inst: CatalogueItem = {
      instanceId: uid(), itemDefId: def.id, name: def.name, category: def.room,
      options: opts, quantity: 1, condition: 'Good',
      price: def.calculatePrice(opts), isExtra: false,
    };
    onChange([...items, inst]);
    setExpandedId(inst.instanceId);
  };

  const addExtra = () => {
    if (!extraName.trim()) return;
    const inst: CatalogueItem = {
      instanceId: uid(), name: extraName.trim(), category: extraCategory,
      options: {}, quantity: 1, condition: 'Good',
      price: extraPrice, isExtra: true,
    };
    onChange([...items, inst]);
    setExtraName(''); setExtraPrice(0);
    setExpandedId(inst.instanceId);
  };

  const update = (id: string, patch: Partial<CatalogueItem>) => {
    onChange(items.map(it => {
      if (it.instanceId !== id) return it;
      const updated = { ...it, ...patch };
      // recalculate price when options change
      if (patch.options !== undefined && updated.itemDefId) {
        const def = BASE_ITEMS.find(d => d.id === updated.itemDefId);
        if (def) updated.price = def.calculatePrice(updated.options);
      }
      return updated;
    }));
  };

  const remove = (id: string) => onChange(items.filter(it => it.instanceId !== id));

  const roomItems = BASE_ITEMS.filter(d => d.room === activeRoom);

  return (
    <div className="space-y-4">
      {/* Room tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 hide-scrollbar">
        {ITEM_ROOMS.filter(r => r !== 'Extra Items').map(r => (
          <button key={r} onClick={() => setActiveRoom(r)}
            className={clsx('px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all flex-shrink-0 border cursor-pointer',
              activeRoom === r ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.08)]' : 'bg-white/5 border-white/5 text-brand-muted hover:bg-white/10 hover:text-brand-text')}>
            {r}
          </button>
        ))}
        <button onClick={() => setActiveRoom('Extra Items')}
          className={clsx('px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all flex-shrink-0 border cursor-pointer',
            activeRoom === 'Extra Items' ? 'bg-brand-gold text-brand-dark border-brand-gold font-extrabold' : 'bg-amber-950/20 border-amber-500/20 text-amber-300 hover:bg-amber-950/40')}>
          + Extra Items
        </button>
      </div>

      {/* Catalogue grid */}
      {activeRoom !== 'Extra Items' ? (
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {roomItems.map(def => {
            const count = items.filter(i => i.itemDefId === def.id).length;
            return (
              <button key={def.id} onClick={() => addFromCatalogue(def.id)}
                className={clsx('p-3 rounded-xl border text-left transition-all text-sm cursor-pointer',
                  count > 0 ? 'border-brand-gold bg-brand-gold/5 shadow-[0_0_10px_rgba(212,175,55,0.05)]' : 'border-white/5 bg-white/5 hover:border-brand-gold/30 hover:bg-white/10')}>
                <div className="flex justify-between items-start gap-1.5">
                  <span className={clsx("font-bold leading-tight transition-colors", count > 0 ? "text-brand-gold" : "text-brand-text")}>{def.name}</span>
                  {count > 0 && <span className="text-[10px] bg-brand-gold text-brand-dark rounded-full w-4.5 h-4.5 flex items-center justify-center font-black flex-shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.3)]">{count}</span>}
                </div>
                <span className="text-[11px] text-brand-muted/60 mt-1 block">from ₹{def.calculatePrice({})}/mo</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-amber-300">Add any item not in the standard catalogue</p>
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3.5 py-2.5 vault-input rounded-xl text-sm placeholder:text-brand-muted/30 focus:outline-none w-full"
              placeholder="Item name" value={extraName} onChange={e => setExtraName(e.target.value)} />
            <input className="px-3.5 py-2.5 vault-input rounded-xl text-sm placeholder:text-brand-muted/30 focus:outline-none w-full"
              placeholder="Monthly price ₹" type="number" value={extraPrice || ''}
              onChange={e => setExtraPrice(Number(e.target.value))} />
          </div>
          <button onClick={addExtra} disabled={!extraName.trim()}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-white/5 disabled:text-brand-muted/30 disabled:border-white/5 disabled:opacity-40 text-brand-dark rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Plus className="w-4 h-4" /> Add Extra Item
          </button>
        </div>
      )}

      {/* Added items list */}
      {items.length > 0 && (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
          <div className="bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-gold border-b border-white/10">
            Added Items ({items.length}) · {items.reduce((s, i) => s + i.quantity, 0)} total units
          </div>
          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
            {items.map((it, idx) => {
              const def = it.itemDefId ? BASE_ITEMS.find(d => d.id === it.itemDefId) : null;
              const expanded = expandedId === it.instanceId;
              return (
                <div key={it.instanceId} className="transition-colors hover:bg-white/[0.01]">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="text-[10px] font-mono text-brand-muted/40 w-16 flex-shrink-0">
                      ITEM-{String(idx + 1).padStart(4, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-text truncate">
                        {it.name} {it.isExtra && <span className="text-xs text-amber-400 font-bold ml-1">(extra)</span>}
                      </p>
                      <p className="text-xs text-brand-muted">{it.category} · ₹{it.price}/mo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-lg px-1.5 py-0.5">
                        <button onClick={() => update(it.instanceId, { quantity: Math.max(1, it.quantity - 1) })}
                          className="text-brand-muted hover:text-brand-gold w-5 h-5 flex items-center justify-center font-bold text-base cursor-pointer">−</button>
                        <span className="text-sm font-extrabold w-6 text-center text-brand-text">{it.quantity}</span>
                        <button onClick={() => update(it.instanceId, { quantity: it.quantity + 1 })}
                          className="text-brand-muted hover:text-brand-gold w-5 h-5 flex items-center justify-center font-bold text-base cursor-pointer">+</button>
                      </div>
                      <button onClick={() => setExpandedId(expanded ? null : it.instanceId)}
                        className="p-1.5 text-brand-muted hover:text-brand-gold transition-colors cursor-pointer">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button onClick={() => remove(it.instanceId)} className="p-1.5 text-brand-muted hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded options */}
                  {expanded && (
                    <div className="bg-white/5 border-t border-white/5 px-4 pb-4 pt-2.5 space-y-3.5">
                      {def?.options && Object.entries(def.options).map(([key, cfg]) => (
                        <div key={key}>
                          <p className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-1.5">{cfg.label}</p>
                          {cfg.isCheckbox ? (
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" className="accent-brand-gold w-4 h-4 cursor-pointer"
                                checked={it.options[key] === 'true'}
                                onChange={e => update(it.instanceId, { options: { ...it.options, [key]: String(e.target.checked) } })} />
                              <span className="text-sm text-brand-text group-hover:text-brand-gold transition-colors">{cfg.label}</span>
                            </label>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {cfg.choices?.map(c => (
                                <button key={c} onClick={() => update(it.instanceId, { options: { ...it.options, [key]: c } })}
                                  className={clsx('px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border',
                                    it.options[key] === c 
                                      ? 'bg-brand-gold border-brand-gold text-brand-dark' 
                                      : 'bg-white/5 border-white/5 text-brand-muted hover:border-white/10 hover:text-brand-text'
                                  )}>
                                  {c}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-1.5">Condition</p>
                          <select className="w-full px-2 py-1.5 border border-white/10 rounded-lg text-xs bg-brand-dark text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                            value={it.condition} onChange={e => update(it.instanceId, { condition: e.target.value as ItemCondition })}>
                            {CONDITIONS.map(c => <option key={c} className="bg-brand-dark text-brand-text">{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-1.5">Notes</p>
                          <input className="w-full px-2 py-1.5 border border-white/10 rounded-lg text-xs bg-brand-dark text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                            placeholder="Optional notes" value={it.notes || ''}
                            onChange={e => update(it.instanceId, { notes: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-brand-muted bg-white/5 rounded-xl border border-dashed border-white/10">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-30 text-brand-gold animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted/70">Click items above to add them to storage</p>
        </div>
      )}
    </div>
  );
}
