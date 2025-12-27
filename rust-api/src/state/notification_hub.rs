use tokio::sync::broadcast;
use crate::events::notification_event::NotificationEvent;

#[derive(Clone)]

pub struct NotificationHub {
    sender: broadcast::Sender<NotificationEvent>,
}

impl NotificationHub {
    pub fn new() -> Self{
        let (sender, _) = broadcast::channel(1000);
        Self { sender }
    }

    pub fn subscribe(&self) -> broadcast::Receiver<NotificationEvent> {
        self.sender.subscribe()
    }

    pub fn publish(&self, event:NotificationEvent) {
        let _ = self.sender.send(event);
    }
}