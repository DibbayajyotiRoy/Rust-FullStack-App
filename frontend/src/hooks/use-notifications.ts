import { useState, useEffect, useRef, useCallback } from "react";
import type { Notification, NotificationWSMessage } from "@/types/notification";

interface UseNotificationsReturn {
    notifications: Notification[];
    isConnected: boolean;
    error: string | null;
}

const WS_URL = `ws://${window.location.host}/ws/notifications`;
const RECONNECT_DELAY = 3000;

export function useNotifications(): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    const connect = useCallback(() => {
        try {
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected to notifications");
                setIsConnected(true);
                setError(null);
            };

            ws.onmessage = (event) => {
                try {
                    const notification: NotificationWSMessage = JSON.parse(event.data);

                    // Prepend new notification to the list
                    setNotifications((prev) => [notification, ...prev]);
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

                // Attempt to reconnect after delay
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    console.log("Attempting to reconnect...");
                    connect();
                }, RECONNECT_DELAY);
            };
        } catch (err) {
            console.error("Failed to create WebSocket:", err);
            setError("Failed to connect");
        }
    }, []);

    useEffect(() => {
        connect();

        // Cleanup on unmount
        return () => {
            if (reconnectTimeoutRef.current) {
                window.clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    return {
        notifications,
        isConnected,
        error,
    };
}
