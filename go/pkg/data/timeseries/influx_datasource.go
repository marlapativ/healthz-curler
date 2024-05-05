package datasource

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/marlpativ/healthz-curler/pkg/data"
	"github.com/marlpativ/healthz-curler/pkg/env"
)

type influxDataSource struct {
	defaultTags map[string]string
	org         string
	bucket      string
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
		org:         org,
		bucket:      bucket,
		defaultTags: defaultTags,
		client:      client,
		writeAPI:    writeAPI,
		queryAPI:    queryAPI,
	}
}

func (r *influxDataSource) WritePoint(point data.TimeSeriesData) {
	if point.Timestamp.IsZero() {
		point.Timestamp = time.Now()
	}

	// Create a new point
	pointToWrite := influxdb2.NewPoint(point.Name, r.defaultTags, point.Properties, point.Timestamp)
	pointToWrite.AddTag("id", point.Id)
	pointToWrite.AddTag("type", point.Type)

	// Write the point
	r.writeAPI.WritePoint(pointToWrite)
}

func (r *influxDataSource) QueryData(query data.QueryableTimeSeriesData) ([]any, error) {
	// const page = request.page ? request.page : 1
	//   const pageSize = request.pageSize ? request.pageSize : 100
	//   const queryProperties = Object.keys(request.properties).map(
	//     (key) => `|> filter(fn: (r) => r["_field"] == "${key}")`
	//   )
	//   const query = `from(bucket: "${this.bucket}")
	//     |> range(start: ${request.startTime!.getTime()}, stop: ${request.endTime!.getTime()})
	//     |> filter(fn: (r) => r["implementation"] == "${this.implementation}")
	//     |> filter(fn: (r) => r["language"] == "js")
	//     |> filter(fn: (r) => r["_measurement"] == "${request.name}")
	//     |> filter(fn: (r) => r["id"] == "${request.id}")
	//     |> filter(fn: (r) => r["type"] == "${request.type}")
	//     ${queryProperties}
	//     |> sort(columns: ["_time"], desc: true)
	//     |> limit(n: ${pageSize}, offset: ${(page - 1) * pageSize})`
	//   const result = []
	//   for await (const { values, tableMeta } of this.queryApi.iterateRows(query)) {
	//     const record = tableMeta.toObject(values) as T
	//     result.push(record)
	//   }
	//   return result

	setDefaults(query)
	var propsQB strings.Builder
	for key := range query.Properties {
		propsQB.WriteString("|> filter(fn: (r) => r[\"_field\"] == \"" + key + "\")")
	}

	start := query.StartTime.UnixMilli()
	end := query.EndTime.UnixMilli()

	influxQuery := fmt.Sprintf(`from(bucket: "%s")
	    |> range(start: %d, stop: %d)
	    |> filter(fn: (r) => r["implementation"] == "go")
	    |> filter(fn: (r) => r["language"] == "go")
	    |> filter(fn: (r) => r["_measurement"] == "%s")
	    |> filter(fn: (r) => r["id"] == "%s")
	    |> filter(fn: (r) => r["type"] == "%s")
	    %s
	    |> sort(columns: ["_time"], desc: true)
	    |> limit(n: %d, offset: %d`,
		r.bucket,
		start,
		end,
		query.Name,
		query.Id,
		query.Type,
		propsQB.String(),
		query.PageSize,
		(query.Page-1)*query.PageSize,
	)

	result, err := r.queryAPI.Query(context.Background(), influxQuery)
	if err != nil || result.Err() != nil {
		log.Println("Error querying influxdb: ", err)
	}

	records := []any{}
	for result.Next() {
		records = append(records, result.Record().Values())
	}

	return records, nil
}

func setDefaults(query data.QueryableTimeSeriesData) {
	if query.Page == 0 {
		query.Page = 1
	}

	if query.PageSize == 0 {
		query.PageSize = 100
	}

	if query.Properties == nil {
		query.Properties = make(map[string]interface{})
	}
}
