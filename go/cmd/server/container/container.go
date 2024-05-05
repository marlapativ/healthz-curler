package container

import (
	"github.com/marlpativ/healthz-curler/internal/handlers"
	"github.com/marlpativ/healthz-curler/internal/processors"
	"github.com/marlpativ/healthz-curler/internal/services"
	"github.com/marlpativ/healthz-curler/pkg/data"
	"github.com/marlpativ/healthz-curler/pkg/data/datasource"
	timeseriesdatasource "github.com/marlpativ/healthz-curler/pkg/data/timeseries"
)

type Container struct {
	DataSource         data.DataSource
	WebSocketHandler   handlers.WebSocketHandler
	HealthCheckService services.HealthCheckService
}

func NewContainer() *Container {
	dataSource := datasource.NewInMemoryDataSource()
	timeSeriesDataSource := timeseriesdatasource.NewInfluxDataSource()

	// TODO: Fix this
	notificationProcessor := processors.NewNotificationProcessor(nil)
	webSocketHandler := handlers.NewWebSocketHandler()
	healthCheckProcessor := processors.NewHealthCheckProcessor(timeSeriesDataSource, notificationProcessor)
	healthCheckService := services.NewHealthCheckService(dataSource, healthCheckProcessor)

	return &Container{
		DataSource:         dataSource,
		WebSocketHandler:   webSocketHandler,
		HealthCheckService: healthCheckService,
	}
}
