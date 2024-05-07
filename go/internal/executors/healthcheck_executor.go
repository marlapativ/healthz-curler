package executors

import (
	"time"

	"github.com/marlpativ/healthz-curler/internal/models"
)

type HealthCheckExecutionResult struct {
	Result       bool
	ErrorMessage string
	Timestamp    time.Time
}

func (r HealthCheckExecutionResult) ToMap() map[string]interface{} {
	return map[string]interface{}{
		"result":       r.Result,
		"errorMessage": r.ErrorMessage,
		"timestamp":    r.Timestamp,
	}
}

type HealthCheckExecutor interface {
	Execute() (HealthCheckExecutionResult, error)
}

func NewHealthCheckExecutor(executorType models.HealthCheckExecutorType) HealthCheckExecutor {
	switch executorType {
	case models.CURL:
		return &curlExecutor{}
	case models.DEFAULT:
		return &defaultExecutor{}
	default:
		return &defaultExecutor{}
	}
}

type curlExecutor struct {
}

func (e *curlExecutor) Execute() (HealthCheckExecutionResult, error) {
	return HealthCheckExecutionResult{
		Result:       true,
		ErrorMessage: "",
		Timestamp:    time.Now(),
	}, nil
}

type defaultExecutor struct {
}

func (e *defaultExecutor) Execute() (HealthCheckExecutionResult, error) {
	return HealthCheckExecutionResult{
		Result:       true,
		ErrorMessage: "",
		Timestamp:    time.Now(),
	}, nil
}
