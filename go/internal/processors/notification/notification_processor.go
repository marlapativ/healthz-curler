package processor

import executors "github.com/marlpativ/healthz-curler/internal/executors/notification"

type NotificationProcessor interface {
	notify(notificationType string, notification interface{}) error
}

type notificationProcessor struct {
	notificationExecutors []executors.NotificationExecutor
}

func NewNotificationProcessor(notificationExecutors []executors.NotificationExecutor) NotificationProcessor {
	return &notificationProcessor{notificationExecutors: notificationExecutors}
}

func (n *notificationProcessor) notify(notificationType string, notification interface{}) error {
	for _, executor := range n.notificationExecutors {
		executor.Execute(notificationType, notification)
	}
	return nil
}
