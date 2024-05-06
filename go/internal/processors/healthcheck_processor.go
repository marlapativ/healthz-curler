package processors

import (
	"log"
	"time"

	"github.com/marlpativ/healthz-curler/cmd/server/models"
	"github.com/marlpativ/healthz-curler/pkg/data"
	"github.com/marlpativ/healthz-curler/pkg/util"
)

type HealthCheckProcessor interface {
	Init(healthChecks []models.HealthCheck)
	Add(healthCheck models.HealthCheck)
	Update(healthCheck models.HealthCheck)
	Delete(healthCheck models.HealthCheck)
}

type healthCheckProcessor struct {
	timeSeriesType        string
	timeouts              map[string]chan<- bool
	timeSeriesDataSource  data.TimeSeriesDataSource
	notificationProcessor NotificationProcessor
}

func NewHealthCheckProcessor(timeSeriesDataSource data.TimeSeriesDataSource, notificationProcessor NotificationProcessor) HealthCheckProcessor {
	return &healthCheckProcessor{
		timeSeriesType:        "HealthCheck",
		timeouts:              make(map[string]chan<- bool),
		timeSeriesDataSource:  timeSeriesDataSource,
		notificationProcessor: notificationProcessor,
	}
}

func (p *healthCheckProcessor) Init(healthChecks []models.HealthCheck) {
	for _, healthCheck := range healthChecks {
		p.Add(healthCheck)
	}
}

func (p *healthCheckProcessor) Add(healthCheck models.HealthCheck) {
	// TODO: Implement executor logic
	p.timeouts[healthCheck.Id] = util.SetInterval(func() {
		log.Printf("Executing HealthCheckProcessor: %s", healthCheck.Id)
		// const executionResult = await executor.execute()
		log.Printf("Execution complete HealthCheckProcessor: %s", healthCheck.Id)
	}, time.Duration(healthCheck.Interval*int(time.Millisecond)))
}

func (p *healthCheckProcessor) Update(healthCheck models.HealthCheck) {
	p.Delete(healthCheck)
	p.Add(healthCheck)
}

func (p *healthCheckProcessor) Delete(healthCheck models.HealthCheck) {
	if timeout, ok := p.timeouts[healthCheck.Id]; ok {
		timeout <- true
		close(timeout)
		delete(p.timeouts, healthCheck.Id)
	}
}
