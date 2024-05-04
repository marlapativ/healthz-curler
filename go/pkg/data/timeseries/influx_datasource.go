package datasource

import (
	"log"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/marlpativ/healthz-curler/pkg/data"
	"github.com/marlpativ/healthz-curler/pkg/env"
)

type influxDataSource struct {
	defaultTags map[string]string
	client      influxdb2.Client
	writeAPI    api.WriteAPI
	queryAPI    api.QueryAPI
}

func NewInfluxDataSource() data.TimeSeriesDataSource {
	url := env.GetOrDefault("INFLUX_URL", "http://localhost:8086")
	token := env.GetOrDefault("INFLUX_TOKEN", "")
	if token == "" {
		log.Fatalf("INFLUX_TOKEN environment variable is required")
	}
	client := influxdb2.NewClient(url, token)

	org := env.GetOrDefault("INFLUX_ORG", "healthz-curler")
	bucket := env.GetOrDefault("INFLUX_BUCKET", "healthz-curler")

	defaultTags := map[string]string{
		"implementation": "go",
		"language":       "go",
	}

	writeAPI := client.WriteAPI(org, bucket)
	queryAPI := client.QueryAPI(org)
	return &influxDataSource{
		defaultTags: defaultTags,
		client:      client,
		writeAPI:    writeAPI,
		queryAPI:    queryAPI,
	}
}

func (r *influxDataSource) WritePoint(point data.TimeSeriesData) error {
	return nil
}

func (r *influxDataSource) QueryData(query data.QueryableTimeSeriesData) ([]any, error) {
	return nil, nil
}
