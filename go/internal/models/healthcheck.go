package models

type HealthCheckExecutorType string

const (
	CURL    HealthCheckExecutorType = "curl"
	DEFAULT HealthCheckExecutorType = "default"
)

type HealthCheck struct {
	Id                   string                  `json:"id"`
	Name                 string                  `json:"name"`
	Description          string                  `json:"description,omitempty"`
	URL                  string                  `json:"url"`
	Interval             int                     `json:"interval"`
	Active               bool                    `json:"active"`
	Method               string                  `json:"method,omitempty"`
	ExpectedResponseCode int                     `json:"expectedResponseCode,omitempty"`
	Timeout              int                     `json:"timeout,omitempty"`
	Executor             HealthCheckExecutorType `json:"executor,omitempty"`
	Auth                 *struct {
		Username string `json:"username,omitempty"`
		Password string `json:"password,omitempty"`
		APIKey   string `json:"apiKey,omitempty"`
	} `json:"auth,omitempty"`
}
