package services

import (
	"encoding/json"
	"errors"

	"github.com/marlpativ/healthz-curler/internal/models"
	"github.com/marlpativ/healthz-curler/internal/processors"
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
	prefix               string
	dataSource           data.DataSource
	healthCheckProcessor processors.HealthCheckProcessor
}

func NewHealthCheckService(dataSource data.DataSource, healthCheckProcessor processors.HealthCheckProcessor) HealthCheckService {
	return &healthCheckService{
		prefix:               "healthcheck",
		dataSource:           dataSource,
		healthCheckProcessor: healthCheckProcessor,
	}
}

func (s *healthCheckService) getKeyName(name string) string {
	return s.prefix + ":" + name
}

func (s *healthCheckService) Init() {
	healthChecks, err := s.GetAll()
	if err != nil {
		return
	}

	s.healthCheckProcessor.Init(healthChecks)
}

func (s *healthCheckService) validate(healthCheck models.HealthCheck, isCreate bool) error {
	if isCreate {
		if healthCheck.Id != "" {
			return errors.New("id is not allowed")
		}
	} else {
		if healthCheck.Id == "" {
			return errors.New("id is required")
		}
	}
	if healthCheck.Name == "" {
		return errors.New("name is required")
	}
	if healthCheck.URL == "" {
		return errors.New("url is required")
	}
	if healthCheck.Interval == 0 {
		return errors.New("interval is required")
	}
	if healthCheck.Interval < 250 {
		return errors.New("interval must be at least 250ms")
	}
	return nil
}

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
	if err := s.validate(healthCheck, true); err != nil {
		return models.HealthCheck{}, err
	}

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
	if err := s.validate(healthCheck, false); err != nil {
		return models.HealthCheck{}, err
	}

	_, err := s.dataSource.Has(s.getKeyName(id))
	if err != nil {
		return models.HealthCheck{}, err
	}

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
