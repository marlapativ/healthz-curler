package container

import (
	"github.com/marlpativ/healthz-curler/internal/processors"
	"github.com/marlpativ/healthz-curler/internal/processors/executors"
	notificationExecutors "github.com/marlpativ/healthz-curler/internal/processors/executors/notification"
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

func NewDataSource() data.DataSource {
	ds := datasource.NewInMemoryDataSource()
	return ds
}

func NewContainer(dataSource data.DataSource) *Container {

	timeSeriesDataSource := timeseriesdatasource.NewInfluxDataSource()

	socketService := socket.NewWebSocketService()
	publishers := []socket.SocketPublisher{socketService}

	socketNotificationExecutor := notificationExecutors.NewSocketNotificationExecutor(publishers)
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

func (c *Container) Init() {
	c.HealthCheckService.Init()
}
