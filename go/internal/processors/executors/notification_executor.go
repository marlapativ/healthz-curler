package executors

type NotificationExecutor interface {
	Execute(notificationType string, notification interface{})
}
