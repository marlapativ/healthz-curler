package executors

type HealthCheckExecutionResult struct {
	Result       bool
	ErrorMessage string
	Timestamp    string
}

type HealthCheckExecutor interface {
	Execute() (HealthCheckExecutionResult, error)
}

func NewHealthCheckExecutors() []HealthCheckExecutor {
	return []HealthCheckExecutor{
		&curlExecutor{},
		&fetchExecutor{},
	}
}

type curlExecutor struct {
}

func (e *curlExecutor) Execute() (HealthCheckExecutionResult, error) {
	return HealthCheckExecutionResult{
		Result:       true,
		ErrorMessage: "",
		Timestamp:    "",
	}, nil
}

type fetchExecutor struct {
}

func (e *fetchExecutor) Execute() (HealthCheckExecutionResult, error) {
	return HealthCheckExecutionResult{
		Result:       true,
		ErrorMessage: "",
		Timestamp:    "",
	}, nil
}
