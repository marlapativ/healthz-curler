package executors

import (
	"github.com/marlpativ/healthz-curler/internal/models"
	"github.com/marlpativ/healthz-curler/internal/socket"
)

type NotificationExecutor interface {
	Execute(notificationType string, notification models.Notification)
}

type socketNotificationExecutor struct {
	publishers []socket.SocketPublisher
}

func NewSocketNotificationExecutor(publishers []socket.SocketPublisher) NotificationExecutor {
	return &socketNotificationExecutor{
		publishers: publishers,
	}
}

func (s *socketNotificationExecutor) Execute(notificationType string, notification models.Notification) {
	channel := notificationType + ":" + notification.Id
	for _, publisher := range s.publishers {
		publisher.Publish(channel, notification)
	}
}
