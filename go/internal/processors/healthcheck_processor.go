package processors

import (
	"log"
	"time"

	"github.com/marlpativ/healthz-curler/internal/executors"
	"github.com/marlpativ/healthz-curler/internal/models"
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
	notificationType      string
	timeouts              map[string]chan<- bool
	timeSeriesDataSource  data.TimeSeriesDataSource
	notificationProcessor NotificationProcessor
}

func NewHealthCheckProcessor(timeSeriesDataSource data.TimeSeriesDataSource, notificationProcessor NotificationProcessor) HealthCheckProcessor {
	return &healthCheckProcessor{
		notificationType:      "HealthCheck",
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
	p.timeouts[healthCheck.Id] = util.SetInterval(func() {
		log.Printf("Executing HealthCheckProcessor: %s", healthCheck.Id)
		executor := executors.NewHealthCheckExecutor(healthCheck.Executor)
		result, err := executor.Execute()

		if err != nil {
			result = executors.HealthCheckExecutionResult{
				Result:       false,
				ErrorMessage: err.Error(),
				Timestamp:    time.Now(),
			}
		}

		point := data.TimeSeriesData{
			Id:         healthCheck.Id,
			Name:       healthCheck.Name,
			Type:       p.notificationType,
			Timestamp:  result.Timestamp,
			Properties: result.ToMap(),
		}

		p.timeSeriesDataSource.WritePoint(point)

		var notification models.Notification = models.Notification{
			Id:      healthCheck.Id,
			Message: result,
		}
		p.notificationProcessor.Notify(p.notificationType, notification)
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
