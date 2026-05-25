// ============================================================
//  avati-enterprise — Unified Data Hooks
//  useLeads, useCustomers, usePickups, useStorage, useItems, usePayments
//  All hooks: { data, loading, error, refetch } pattern.
//  Data source: googleSheets.ts (upgrades to Zoho CRM when oauth is configured)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  getLeads, updateLeadStatus,
  getCustomers, addCustomer, updateCustomer,
  getPickups, addPickup, updatePickup,
  getStorageList, addStorage,
  getStoredItems, addStoredItems, updateItemStatus,
  getPayments, addPayment,
  getDashboardStats,
  type Lead, type Customer, type Pickup, type Storage,
  type StoredItem, type Payment, type DashboardStats,
  type LeadStatus, type ItemStatus,
} from '../lib/googleSheets';

// ── Generic data hook factory ─────────────────────────────────
function useDataHook<T>(fetcher: () => Promise<T[]>, deps: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Data fetch error');
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run };
}

// ── Leads hook ───────────────────────────────────────────────
export function useLeads() {
  const hook = useDataHook<Lead>(getLeads);

  const updateStatus = async (id: string, status: LeadStatus, notes?: string) => {
    await updateLeadStatus(id, status, notes);
    hook.refetch();
  };

  return { ...hook, updateStatus };
}

// ── Customers hook ───────────────────────────────────────────
export function useCustomers() {
  const hook = useDataHook<Customer>(getCustomers);

  const add = async (data: Omit<Customer, 'id' | 'createdAt'>) => {
    const result = await addCustomer(data);
    if (result.success) hook.refetch();
    return result;
  };

  const update = async (data: Partial<Customer> & { id: string }) => {
    const success = await updateCustomer(data);
    if (success) hook.refetch();
    return success;
  };

  return { ...hook, add, update };
}

// ── Pickups hook ─────────────────────────────────────────────
export function usePickups() {
  const hook = useDataHook<Pickup>(getPickups);

  const add = async (data: Omit<Pickup, 'id' | 'createdAt'>) => {
    const result = await addPickup(data);
    if (result.success) hook.refetch();
    return result;
  };

  const update = async (data: Partial<Pickup> & { id: string }) => {
    const success = await updatePickup(data);
    if (success) hook.refetch();
    return success;
  };

  return { ...hook, add, update };
}

// ── Storage hook ─────────────────────────────────────────────
export function useStorage() {
  const hook = useDataHook<Storage>(getStorageList);

  const add = async (data: Omit<Storage, 'id' | 'createdAt'>) => {
    const result = await addStorage(data);
    if (result.success) hook.refetch();
    return result;
  };

  return { ...hook, add };
}

// ── Items hook ───────────────────────────────────────────────
export function useItems(storageId?: string) {
  const hook = useDataHook<StoredItem>(
    () => getStoredItems(storageId),
    [storageId],
  );

  const add = async (items: Omit<StoredItem, 'id' | 'addedAt'>[]) => {
    const result = await addStoredItems(items);
    if (result.success) hook.refetch();
    return result;
  };

  const updateStatus = async (id: string, status: ItemStatus) => {
    const success = await updateItemStatus(id, status);
    if (success) hook.refetch();
    return success;
  };

  return { ...hook, add, updateStatus };
}

// ── Payments hook ────────────────────────────────────────────
export function usePayments(customerId?: string) {
  const hook = useDataHook<Payment>(
    () => getPayments(customerId),
    [customerId],
  );

  const add = async (data: Omit<Payment, 'id' | 'createdAt'>) => {
    const result = await addPayment(data);
    if (result.success) hook.refetch();
    return result;
  };

  return { ...hook, add };
}

// ── Dashboard stats hook ──────────────────────────────────────
export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getDashboardStats();
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stats fetch error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

// ── Re-exports for convenience ────────────────────────────────
export type { Lead, Customer, Pickup, Storage, StoredItem, Payment, DashboardStats };
