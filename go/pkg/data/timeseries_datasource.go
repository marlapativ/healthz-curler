package data

import "time"

type TimeSeriesData struct {
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
	TimeSeriesData
	QueryableTimeParams
}

type TimeSeriesDataSource interface {
	WritePoint(point TimeSeriesData) error
	QueryData(query QueryableTimeSeriesData) ([]any, error)
}
