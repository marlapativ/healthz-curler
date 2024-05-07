package services

import (
	"time"

	"github.com/marlpativ/healthz-curler/pkg/data"
)

type HealthGraphService interface {
	Get(healthCheckId string, queryTimeParams data.QueryableTimeParams) ([]any, error)
}

type healthGraphService struct {
	ds                 data.TimeSeriesDataSource
	healthCheckService HealthCheckService
}

func NewHealthGraphService(ds data.TimeSeriesDataSource, healthCheckService HealthCheckService) HealthGraphService {
	return &healthGraphService{
		ds:                 ds,
		healthCheckService: healthCheckService,
	}
}

func (s *healthGraphService) Get(healthCheckId string, queryTimeParams data.QueryableTimeParams) ([]any, error) {
	healthCheck, err := s.healthCheckService.Get(healthCheckId)
	if err != nil {
		return nil, err
	}

	if queryTimeParams.EndTime.IsZero() {
		queryTimeParams.EndTime = time.Now()
	}
	if queryTimeParams.StartTime.IsZero() {
		queryTimeParams.StartTime = time.Now().Add(-3 * time.Hour)
	}

	props := make(map[string]interface{})
	props["result"] = ""

	query := data.QueryableTimeSeriesData{}
	query.Id = healthCheck.Id
	query.Name = healthCheck.Name
	query.Type = "HealthCheck"
	query.StartTime = queryTimeParams.StartTime
	query.EndTime = queryTimeParams.EndTime
	query.Page = queryTimeParams.Page
	query.PageSize = queryTimeParams.PageSize
	query.Properties = props

	return s.ds.QueryData(query)
}
