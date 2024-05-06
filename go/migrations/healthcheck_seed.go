package seed

import (
	"encoding/json"

	"github.com/marlpativ/healthz-curler/internal/models"
	"github.com/marlpativ/healthz-curler/pkg/data"
)

func Seed(dataSource data.DataSource) {
	healthCheck1 := models.HealthCheck{
		Id:          "b1c4a89e-4905-5e3c-b57f-dc92627d011e",
		Name:        "webapp-fetch",
		Description: "Webapp Fetch Health Check",
		URL:         "http://localhost:8080/healthz",
		Executor:    models.FETCH,
		Interval:    10000,
	}

	healthCheck2 := models.HealthCheck{
		Id:          "cdb63720-9628-5ef6-bbca-2e5ce6094f3c",
		Name:        "webapp-curl",
		Description: "Webapp Curl Health Check",
		URL:         "http://localhost:8080/healthz",
		Executor:    models.CURL,
		Interval:    10000,
	}

	// Seed the database
	if _, err := dataSource.Get("healthcheck:b1c4a89e-4905-5e3c-b57f-dc92627d011e"); err != nil {
		val, _ := json.Marshal(healthCheck1)
		dataSource.Set("healthcheck:b1c4a89e-4905-5e3c-b57f-dc92627d011e", val)
	}
	if _, err := dataSource.Get("healthcheck:cdb63720-9628-5ef6-bbca-2e5ce6094f3c"); err != nil {
		val, _ := json.Marshal(healthCheck2)
		dataSource.Set("healthcheck:cdb63720-9628-5ef6-bbca-2e5ce6094f3c", val)
	}
}
