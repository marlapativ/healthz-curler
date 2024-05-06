package executors

import "github.com/marlpativ/healthz-curler/internal/models"

type NotificationExecutor interface {
	Execute(notificationType string, notification models.Notification)
}
