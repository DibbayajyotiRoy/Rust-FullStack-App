export interface Notification {
    id: string;
    event_type: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

export interface NotificationWSMessage extends Notification { }
