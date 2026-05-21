// ============================================================
//  avati-enterprise — Activity + Notification Service
//  Real-time activity timeline and notification queue.
//  Currently uses polling; architecture is WebSocket-ready.
// ============================================================

// ── Activity log entry ────────────────────────────────────────
export type ActivityType =
  | 'lead_created' | 'lead_status_changed'
  | 'customer_onboarded' | 'pickup_scheduled' | 'pickup_completed'
  | 'storage_assigned' | 'retrieval_requested' | 'retrieval_completed'
  | 'payment_received' | 'payment_overdue'
  | 'invoice_generated' | 'document_uploaded';

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  entityId: string;
  entityType: 'lead' | 'customer' | 'pickup' | 'storage' | 'item' | 'payment';
  description: string;
  performedBy?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ── Notification ──────────────────────────────────────────────
export type NotificationLevel = 'info' | 'warning' | 'error' | 'success';

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: string;
}

// ── In-memory notification queue ─────────────────────────────
const _notifications: AppNotification[] = [];
const _subscribers: Array<(notifications: AppNotification[]) => void> = [];

function notifySubscribers() {
  _subscribers.forEach(fn => fn([..._notifications]));
}

export function addNotification(n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>): void {
  const notification: AppNotification = {
    ...n,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  _notifications.unshift(notification); // newest first
  // Keep max 100 notifications in memory
  if (_notifications.length > 100) _notifications.pop();
  notifySubscribers();
}

export function markNotificationRead(id: string): void {
  const n = _notifications.find(n => n.id === id);
  if (n) { n.read = true; notifySubscribers(); }
}

export function markAllRead(): void {
  _notifications.forEach(n => { n.read = true; });
  notifySubscribers();
}

export function subscribeToNotifications(fn: (notifications: AppNotification[]) => void): () => void {
  _subscribers.push(fn);
  // Immediately emit current state
  fn([..._notifications]);
  // Return unsubscribe function
  return () => {
    const idx = _subscribers.indexOf(fn);
    if (idx !== -1) _subscribers.splice(idx, 1);
  };
}

export function getUnreadCount(): number {
  return _notifications.filter(n => !n.read).length;
}

// ── Activity timeline (mock — connects to Zoho Flow webhook log) ─
const _activities: ActivityEntry[] = [
  {
    id: 'act-001',
    type: 'lead_created',
    entityId: 'AVT-LEAD-0001',
    entityType: 'lead',
    description: 'New lead: Arun Kumar (Whitefield, Household)',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-002',
    type: 'payment_received',
    entityId: 'AVT-PAY-0003',
    entityType: 'payment',
    description: 'Payment of ₹5,310 received from Rahul Mehta',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-003',
    type: 'pickup_scheduled',
    entityId: 'AVT-PKP-0002',
    entityType: 'pickup',
    description: 'Pickup scheduled for Priya Sharma — Feb 10',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getRecentActivities(limit: number = 20): ActivityEntry[] {
  return _activities.slice(0, limit);
}

export function logActivity(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): void {
  _activities.unshift({
    ...entry,
    id: `act-${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
  if (_activities.length > 200) _activities.pop();
}

// ── Seed some startup notifications ──────────────────────────
addNotification({
  level: 'warning',
  title: 'Payment Overdue',
  message: 'Rahul Mehta — ₹5,310 overdue since Feb 5. 18 days past due.',
  actionUrl: '/admin/payments',
  actionLabel: 'View Payment',
});
addNotification({
  level: 'info',
  title: 'New Lead',
  message: 'Arun Kumar from Whitefield submitted a quote request.',
  actionUrl: '/admin/leads',
  actionLabel: 'View Lead',
});
