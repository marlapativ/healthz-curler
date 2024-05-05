package executors

type NotificationExecutor interface {
	Execute(noticiationType string, notification interface{})
}
