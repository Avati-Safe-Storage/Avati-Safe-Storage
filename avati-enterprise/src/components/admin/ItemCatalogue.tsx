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
      <div className="flex gap-2 overflow-x-auto pb-1">
        {ITEM_ROOMS.filter(r => r !== 'Extra Items').map(r => (
          <button key={r} onClick={() => setActiveRoom(r)}
            className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0',
              activeRoom === r ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            {r}
          </button>
        ))}
        <button onClick={() => setActiveRoom('Extra Items')}
          className={clsx('px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0',
            activeRoom === 'Extra Items' ? 'bg-brand-gold text-brand-dark' : 'bg-amber-50 text-amber-700 hover:bg-amber-100')}>
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
                className={clsx('p-3 rounded-xl border-2 text-left transition-all text-sm',
                  count > 0 ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-200 hover:border-gray-300')}>
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-900 leading-tight">{def.name}</span>
                  {count > 0 && <span className="text-xs bg-brand-gold text-brand-dark rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">{count}</span>}
                </div>
                <span className="text-xs text-gray-500">from ₹{def.calculatePrice({})}/mo</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-amber-800">Add any item not in the standard catalogue</p>
          <div className="grid grid-cols-2 gap-3">
            <input className="px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Item name" value={extraName} onChange={e => setExtraName(e.target.value)} />
            <input className="px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Monthly price ₹" type="number" value={extraPrice || ''}
              onChange={e => setExtraPrice(Number(e.target.value))} />
          </div>
          <button onClick={addExtra} disabled={!extraName.trim()}
            className="w-full py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Extra Item
          </button>
        </div>
      )}

      {/* Added items list */}
      {items.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200">
            Added Items ({items.length}) · {items.reduce((s, i) => s + i.quantity, 0)} total units
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {items.map((it, idx) => {
              const def = it.itemDefId ? BASE_ITEMS.find(d => d.id === it.itemDefId) : null;
              const expanded = expandedId === it.instanceId;
              return (
                <div key={it.instanceId}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xs font-mono text-gray-400 w-16 flex-shrink-0">
                      ITEM-{String(idx + 1).padStart(4, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {it.name} {it.isExtra && <span className="text-xs text-amber-600">(extra)</span>}
                      </p>
                      <p className="text-xs text-gray-500">{it.category} · ₹{it.price}/mo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                        <button onClick={() => update(it.instanceId, { quantity: Math.max(1, it.quantity - 1) })}
                          className="text-gray-500 hover:text-gray-900 w-5 h-5 flex items-center justify-center">−</button>
                        <span className="text-sm font-bold w-6 text-center">{it.quantity}</span>
                        <button onClick={() => update(it.instanceId, { quantity: it.quantity + 1 })}
                          className="text-gray-500 hover:text-gray-900 w-5 h-5 flex items-center justify-center">+</button>
                      </div>
                      <button onClick={() => setExpandedId(expanded ? null : it.instanceId)}
                        className="p-1 text-gray-400 hover:text-gray-700">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button onClick={() => remove(it.instanceId)} className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded options */}
                  {expanded && (
                    <div className="bg-gray-50 px-4 pb-4 pt-2 space-y-3">
                      {def?.options && Object.entries(def.options).map(([key, cfg]) => (
                        <div key={key}>
                          <p className="text-xs font-medium text-gray-500 mb-1">{cfg.label}</p>
                          {cfg.isCheckbox ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="accent-brand-gold"
                                checked={it.options[key] === 'true'}
                                onChange={e => update(it.instanceId, { options: { ...it.options, [key]: String(e.target.checked) } })} />
                              <span className="text-sm text-gray-700">{cfg.label}</span>
                            </label>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {cfg.choices?.map(c => (
                                <button key={c} onClick={() => update(it.instanceId, { options: { ...it.options, [key]: c } })}
                                  className={clsx('px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                                    it.options[key] === c ? 'bg-brand-gold text-brand-dark' : 'bg-white border border-gray-200 text-gray-600')}>
                                  {c}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Condition</p>
                          <select className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
                            value={it.condition} onChange={e => update(it.instanceId, { condition: e.target.value as ItemCondition })}>
                            {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                          <input className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white"
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
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Click items above to add them to storage</p>
        </div>
      )}
    </div>
  );
}
