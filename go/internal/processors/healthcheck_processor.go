package processors

import (
	"github.com/marlpativ/healthz-curler/cmd/server/models"
	"github.com/marlpativ/healthz-curler/pkg/data"
)

type HealthCheckProcessor interface {
	init(healthChecks []models.HealthCheck)
	add(healthCheck models.HealthCheck)
	update(healthCheck models.HealthCheck)
	delete(healthCheck models.HealthCheck)
}

type healthCheckProcessor struct {
	timeSeriesType        string
	healthChecks          []models.HealthCheck
	timeSeriesDataSource  data.TimeSeriesDataSource
	notificationProcessor NotificationProcessor
}

func NewHealthCheckProcessor(timeSeriesDataSource data.TimeSeriesDataSource, notificationProcessor NotificationProcessor) HealthCheckProcessor {
	return &healthCheckProcessor{
		timeSeriesType:        "HealthCheck",
		timeSeriesDataSource:  timeSeriesDataSource,
		notificationProcessor: notificationProcessor,
	}
}

func (p *healthCheckProcessor) init(healthChecks []models.HealthCheck) {
	p.healthChecks = healthChecks
	// TODO: Implement init
}

func (p *healthCheckProcessor) add(healthCheck models.HealthCheck) {
	healthChecks := append([]models.HealthCheck{}, healthCheck)
	p.init(healthChecks)
}

func (p *healthCheckProcessor) update(healthCheck models.HealthCheck) {
	p.delete(healthCheck)
	p.add(healthCheck)
}

func (p *healthCheckProcessor) delete(healthCheck models.HealthCheck) {
	// TODO: Clear Interval
	for i, hc := range p.healthChecks {
		if hc.Id == healthCheck.Id {
			p.healthChecks = append(p.healthChecks[:i], p.healthChecks[i+1:]...)
			break
		}
	}
}
