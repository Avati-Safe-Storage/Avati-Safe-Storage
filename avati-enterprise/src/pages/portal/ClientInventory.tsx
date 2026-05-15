import { useState } from 'react';
import { Search, Filter, Truck } from 'lucide-react';

const clientItems = [
  { id: 'INV-1001', name: 'Office Chairs (10x)', category: 'Furniture', dateStored: '2023-10-15', status: 'Stored' },
  { id: 'INV-1002', name: 'Desktops (Dell) (5x)', category: 'Electronics', dateStored: '2023-10-15', status: 'Stored' },
  { id: 'INV-1008', name: 'Archived Documents 2022', category: 'Documents', dateStored: '2024-01-10', status: 'Stored' },
  { id: 'INV-1015', name: 'Conference Table', category: 'Furniture', dateStored: '2024-02-20', status: 'Retrieval Pending' },
];

export default function ClientInventory() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Inventory</h1>
          <p className="text-gray-500 mt-1">View and manage your stored items.</p>
        </div>
        <button className="bg-brand-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/90 transition-colors shadow-sm flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Request Retrieval
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-6 py-4 font-semibold w-12">
                  <input type="checkbox" className="rounded text-brand-gold focus:ring-brand-gold border-gray-300" />
                </th>
                <th className="px-6 py-4 font-semibold">Item Name</th>
                <th className="px-6 py-4 font-semibold">Item ID</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Date Stored</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded text-brand-gold focus:ring-brand-gold border-gray-300" />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.dateStored}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.status === 'Stored' ? 'bg-blue-100 text-blue-800' : 
                        'bg-orange-100 text-orange-800'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
