"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// name should be the logged-in user's own name (works for employees and
// admins alike now — the endpoint isn't admin-only anymore). Employees will
// get broadcasts (new_ticket/claimed) mixed in with their own targeted
// resolved/closed notifications — filter client-side on
// `recipientName !== null` if you only want their personal ones.
export function useNotifications(name) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!name) return;
    setLoading(true);
    const data = await apiFetch(`/api/notifications/?name=${encodeURIComponent(name)}`);
    setNotifications(data.notifications ?? []);
    setLoading(false);
  }, [name]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { notifications, loading, refresh };
}
