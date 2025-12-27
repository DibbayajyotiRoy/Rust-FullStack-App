import { useState, useEffect, useRef, useCallback } from "react";
import type { Notification } from "@/types/notification";

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    error: string | null;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const WS_URL = `ws://${window.location.host}/ws/notifications`;
const RECONNECT_DELAY = 3000;

export function useNotifications(): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const connect = useCallback(() => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected to notifications");
                setIsConnected(true);
                setError(null);
            };

            ws.onmessage = (event) => {
                try {
                    const notification: Notification = JSON.parse(event.data);
                    setNotifications((prev) => {
                        // Check if notification already exists (useful for historical notes on reconnect)
                        if (prev.some((n) => n.id === notification.id)) return prev;
                        return [notification, ...prev].sort(
                            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        );
                    });
                } catch (err) {
                    console.error("Failed to parse notification:", err);
                }
            };

            ws.onerror = (event) => {
                console.error("WebSocket error:", event);
                setError("Connection error");
            };

            ws.onclose = () => {
                console.log("WebSocket disconnected");
                setIsConnected(false);
                wsRef.current = null;

                reconnectTimeoutRef.current = window.setTimeout(() => {
                    connect();
                }, RECONNECT_DELAY);
            };
        } catch (err) {
            console.error("Failed to create WebSocket:", err);
            setError("Failed to connect");
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}/read`, {
                method: "POST",
            });
            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
                );
            }
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch("/api/notifications/read-all", {
                method: "POST",
            });
            if (response.ok) {
                setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            }
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
        }
    };

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeoutRef.current) window.clearTimeout(reconnectTimeoutRef.current);
            if (wsRef.current) wsRef.current.close();
        };
    }, [connect]);

    return {
        notifications,
        unreadCount,
        isConnected,
        error,
        markAsRead,
        markAllAsRead,
    };
}
