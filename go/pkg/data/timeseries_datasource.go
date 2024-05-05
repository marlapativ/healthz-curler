package data

import "time"

type TimeSeriesData struct {
	Id         string                 `json:"id"`
	Name       string                 `json:"name"`
	Type       string                 `json:"type"`
	Timestamp  time.Time              `json:"timestamp"`
	Properties map[string]interface{} `json:"properties"`
}

type QueryableTimeParams struct {
	StartTime time.Time `json:"startTime"`
	EndTime   time.Time `json:"endTime"`
	PageSize  int       `json:"pageSize"`
	Page      int       `json:"page"`
}

type QueryableTimeSeriesData struct {
	TimeSeriesData
	QueryableTimeParams
}

type TimeSeriesDataSource interface {
	WritePoint(point TimeSeriesData)
	QueryData(query QueryableTimeSeriesData) ([]any, error)
}
