package container

import (
	"github.com/marlpativ/healthz-curler/internal/processors"
	"github.com/marlpativ/healthz-curler/internal/processors/executors"
	"github.com/marlpativ/healthz-curler/internal/services"
	"github.com/marlpativ/healthz-curler/internal/socket"
	"github.com/marlpativ/healthz-curler/pkg/data"
	"github.com/marlpativ/healthz-curler/pkg/data/datasource"
	timeseriesdatasource "github.com/marlpativ/healthz-curler/pkg/data/timeseries"
)

type Container struct {
	DataSource         data.DataSource
	WebSocketHandler   socket.SocketMessageHandler
	HealthCheckService services.HealthCheckService
}

func NewContainer() *Container {
	dataSource := datasource.NewInMemoryDataSource()
	timeSeriesDataSource := timeseriesdatasource.NewInfluxDataSource()

	socketService := socket.NewWebSocketService()
	publishers := []socket.SocketPublisher{socketService}

	socketNotificationExecutor := executors.NewSocketNotificationExecutor(publishers)
	notificationExecutors := []executors.NotificationExecutor{socketNotificationExecutor}

	notificationProcessor := processors.NewNotificationProcessor(notificationExecutors)

	healthCheckProcessor := processors.NewHealthCheckProcessor(timeSeriesDataSource, notificationProcessor)
	healthCheckService := services.NewHealthCheckService(dataSource, healthCheckProcessor)

	return &Container{
		DataSource:         dataSource,
		WebSocketHandler:   socketService,
		HealthCheckService: healthCheckService,
	}
}
