package container

import (
	"github.com/marlpativ/healthz-curler/internal/handlers"
	services "github.com/marlpativ/healthz-curler/internal/services/healthcheck"
	"github.com/marlpativ/healthz-curler/pkg/data"
)

type Container struct {
	DataSource         data.DataSource
	WebSocketHandler   handlers.WebSocketHandler
	HealthCheckService services.HealthCheckService
}

func NewContainer() *Container {
	dataSource := data.NewInMemoryDataSource()
	webSocketHandler := handlers.NewWebSocketHandler()
	healthCheckService := services.NewHealthCheckService(dataSource)

	return &Container{
		DataSource:         dataSource,
		WebSocketHandler:   webSocketHandler,
		HealthCheckService: healthCheckService,
	}
}
