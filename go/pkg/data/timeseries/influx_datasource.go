package datasource

import "github.com/marlpativ/healthz-curler/pkg/data"

type influxDataSource struct {
}

func NewInfluxDataSource() data.TimeSeriesDataSource {
	return &influxDataSource{}
}

func (r *influxDataSource) WritePoint(point data.TimeSeriesData) error {
	return nil
}

func (r *influxDataSource) QueryData(query data.QueryableTimeSeriesData) ([]any, error) {
	return nil, nil
}
