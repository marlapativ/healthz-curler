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
	StartTime time.Time `json:"startTime" query:"startTime"`
	EndTime   time.Time `json:"endTime" query:"endTime"`
	PageSize  int       `json:"pageSize" query:"pageSize"`
	Page      int       `json:"page" query:"page"`
}

type QueryableTimeSeriesData struct {
	TimeSeriesData
	QueryableTimeParams
}

type TimeSeriesDataSource interface {
	WritePoint(point TimeSeriesData)
	QueryData(query QueryableTimeSeriesData) ([]any, error)
}
