package processors

import (
	"github.com/marlpativ/healthz-curler/internal/executors"
	"github.com/marlpativ/healthz-curler/internal/models"
)

type NotificationProcessor interface {
	Notify(notificationType string, notification models.Notification) error
}

type notificationProcessor struct {
	notificationExecutors []executors.NotificationExecutor
}

func NewNotificationProcessor(notificationExecutors []executors.NotificationExecutor) NotificationProcessor {
	return &notificationProcessor{
		notificationExecutors: notificationExecutors,
	}
}

func (n *notificationProcessor) Notify(notificationType string, notification models.Notification) error {
	for _, executor := range n.notificationExecutors {
		executor.Execute(notificationType, notification)
	}
	return nil
}
