package executors

import services "github.com/marlpativ/healthz-curler/internal/services/socket"

type socketNotificationExecutor struct {
	publishers []services.SocketPublisher
}

func NewSocketNotificationExecutor(publishers []services.SocketPublisher) NotificationExecutor {
	return &socketNotificationExecutor{
		publishers: publishers,
	}
}

func (s *socketNotificationExecutor) Execute(notificationType string, notification interface{}) {
	for _, publisher := range s.publishers {
		publisher.Publish(notificationType, notification)
	}
}
