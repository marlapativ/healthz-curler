package services

import (
	"encoding/json"

	"github.com/marlpativ/healthz-curler/cmd/server/models"
	"github.com/marlpativ/healthz-curler/pkg/data"
)

type HealthCheckService interface {
	Init()
	GetAll() ([]models.HealthCheck, error)
	Get(id string) (models.HealthCheck, error)
	Create(healthCheck models.HealthCheck) (models.HealthCheck, error)
	Update(id string, healthCheck models.HealthCheck) (models.HealthCheck, error)
	Delete(id string) (models.HealthCheck, error)
}

type healthCheckService struct {
	dataSource data.DataSource
	prefix     string
}

func NewHealthCheckService(dataSource data.DataSource) HealthCheckService {
	return &healthCheckService{
		dataSource: dataSource,
		prefix:     "healthcheck",
	}
}

func (s *healthCheckService) getKeyName(name string) string {
	return s.prefix + ":" + name
}

func (s *healthCheckService) Init() {}

func (s *healthCheckService) GetAll() ([]models.HealthCheck, error) {
	values, err := s.dataSource.GetAll(s.prefix)
	if err != nil {
		return nil, err
	}

	healthChecks := []models.HealthCheck{}
	for _, value := range values {
		healthCheck := models.HealthCheck{}
		if err := json.Unmarshal([]byte(value), &healthCheck); err != nil {
			return nil, err
		}
		healthChecks = append(healthChecks, healthCheck)
	}
	return healthChecks, nil
}

func (s *healthCheckService) Get(id string) (models.HealthCheck, error) {
	value, err := s.dataSource.Get(s.getKeyName(id))
	if err != nil {
		return models.HealthCheck{}, err
	}

	healthCheck := models.HealthCheck{}
	if err := json.Unmarshal([]byte(value), &healthCheck); err != nil {
		return models.HealthCheck{}, err
	}
	return healthCheck, nil
}

func (s *healthCheckService) Create(healthCheck models.HealthCheck) (models.HealthCheck, error) {
	value, err := json.Marshal(healthCheck)
	if err != nil {
		return models.HealthCheck{}, err
	}

	_, err = s.dataSource.Set(s.getKeyName(healthCheck.Name), value)
	if err != nil {
		return models.HealthCheck{}, err
	}
	return healthCheck, nil
}

func (s *healthCheckService) Update(id string, healthCheck models.HealthCheck) (models.HealthCheck, error) {
	value, err := json.Marshal(healthCheck)
	if err != nil {
		return models.HealthCheck{}, err
	}

	_, err = s.dataSource.Set(s.getKeyName(id), value)
	if err != nil {
		return models.HealthCheck{}, err
	}
	return healthCheck, nil
}

func (s *healthCheckService) Delete(id string) (models.HealthCheck, error) {
	value, err := s.dataSource.Delete(s.getKeyName(id))
	if err != nil {
		return models.HealthCheck{}, err
	}

	healthCheck := models.HealthCheck{}
	if err := json.Unmarshal([]byte(value), &healthCheck); err != nil {
		return models.HealthCheck{}, err
	}
	return healthCheck, nil
}
