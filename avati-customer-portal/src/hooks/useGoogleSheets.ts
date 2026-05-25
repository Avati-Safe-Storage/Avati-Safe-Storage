import { useState, useEffect, useCallback } from 'react';
import {
  getCustomers, addCustomer, updateCustomer, deleteCustomer,
  getStoredItems, addStoredItems, updateItemStatus,
  getDashboardStats, getSheetsConfig,
} from '../lib/googleSheets';
import type { Customer, StoredItem, DashboardStats } from '../lib/googleSheets';

// ─── Customers Hook ─────────────────────────────────────────
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const result = await addCustomer(customer);
    if (result.success) await refresh();
    return result;
  };

  const update = async (customer: Partial<Customer> & { id: string }) => {
    const ok = await updateCustomer(customer);
    if (ok) await refresh();
    return ok;
  };

  const remove = async (id: string) => {
    const ok = await deleteCustomer(id);
    if (ok) await refresh();
    return ok;
  };

  return { customers, loading, error, refresh, add, update, remove };
}

// ─── Stored Items Hook ───────────────────────────────────────
export function useStoredItems(storageId?: string) {
  const [items, setItems] = useState<StoredItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStoredItems(storageId);
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [storageId]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateStatus = async (id: string, status: StoredItem['status']) => {
    const ok = await updateItemStatus(id, status);
    if (ok) await refresh();
    return ok;
  };

  const add = async (item: Omit<StoredItem, 'id' | 'addedAt'>) => {
    const result = await addStoredItems([item]);
    if (result.success) await refresh();
    return result;
  };

  return { items, loading, error, refresh, updateStatus, add };
}

// ─── Dashboard Stats Hook ────────────────────────────────────
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(s => { setStats(s); setLoading(false); });
  }, []);

  return { stats, loading };
}

// ─── Config Status Hook ──────────────────────────────────────
export function useSheetsConfig() {
  return getSheetsConfig();
}
