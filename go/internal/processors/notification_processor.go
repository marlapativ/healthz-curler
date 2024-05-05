package processors

import "github.com/marlpativ/healthz-curler/internal/processors/executors"

type NotificationProcessor interface {
	Notify(notificationType string, notification interface{}) error
}

type notificationProcessor struct {
	notificationExecutors []executors.NotificationExecutor
}

func NewNotificationProcessor(notificationExecutors []executors.NotificationExecutor) NotificationProcessor {
	return &notificationProcessor{
		notificationExecutors: notificationExecutors,
	}
}

func (n *notificationProcessor) Notify(notificationType string, notification interface{}) error {
	for _, executor := range n.notificationExecutors {
		executor.Execute(notificationType, notification)
	}
	return nil
}
