package data

import "time"

type TimeseriesData struct {
	Id         string
	Name       string
	Type       string
	Timestamp  time.Time
	Properties map[string]interface{}
}

type QueryableTimeParams struct {
	StartTime time.Time
	EndTime   time.Time
	PageSize  int
	Page      int
}

type QueryableTimeSeriesData struct {
	TimeseriesData
	QueryableTimeParams
}

type TimeseriesDatasource interface {
	QueryData(query QueryableTimeSeriesData) ([]any, error)
	WritePoint(point TimeseriesData) error
}
