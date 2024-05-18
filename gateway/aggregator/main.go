package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
)

const IS_DEV = false
const ENV_SERVER_PREFIX = "SERVER_"
const DEFAULT_TIMEOUT = 10 * time.Second

func main() {

	initEnv(IS_DEV)

	http.DefaultClient.Timeout = DEFAULT_TIMEOUT
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "2020"
	}

	http.HandleFunc("/", jsonAggregate)
	server := &http.Server{
		Addr: ":" + port,
	}

	log.Println("Starting server on port: ", port)

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func jsonAggregate(w http.ResponseWriter, r *http.Request) {
	urlPath := strings.TrimSuffix(r.URL.Path, "/")
	urlPath = strings.TrimSuffix(urlPath, "/aggregate")

	fmt.Println("Fetching from: ", urlPath)

	configs := fetchFromServers(urlPath)
	res, _ := json.Marshal(configs)
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func fetchFromServers(path string) map[string]any {
	servers := getServers(ENV_SERVER_PREFIX)

	wg := sync.WaitGroup{}
	response := make(map[string]any)

	for envKey, domain := range servers {
		key := strings.ToLower(strings.TrimPrefix(envKey, ENV_SERVER_PREFIX))
		wg.Add(1)
		go func(key string, domain string) {
			url := url.URL{
				Scheme: "http",
				Host:   domain,
				Path:   path,
			}

			fmt.Println("Fetching from: ", url.String())
			res, err := http.Get(url.String())

			if err != nil {
				fmt.Printf("%s : Error parsing body: %v", key, err)
				fmt.Println()
				wg.Done()
				return
			}

			defer res.Body.Close()
			body, err := parseBody(res.Body)
			if err != nil {
				fmt.Printf("%s : Error parsing body: %v", key, err)
				fmt.Println()
				wg.Done()
				return
			}

			response[key] = body
			wg.Done()
		}(key, domain)
	}

	wg.Wait()
	return response
}

func parseBody(body io.ReadCloser) (interface{}, error) {
	bodyBytes, err := io.ReadAll(body)
	if err != nil {
		return nil, err
	}

	var responseBody interface{}
	err = json.Unmarshal(bodyBytes, &responseBody)
	if err != nil {
		return nil, err
	}

	return responseBody, nil
}

func getServers(prefix string) map[string]string {
	m := make(map[string]string)

	for _, e := range os.Environ() {
		if strings.HasPrefix(e, prefix) {
			if i := strings.Index(e, "="); i >= 0 {
				m[e[:i]] = e[i+1:]
			}
		}
	}
	return m
}

func initEnv(isDev bool) {
	if isDev {
		os.Setenv("SERVER_BUN", "localhost:4205")
		os.Setenv("SERVER_NODE", "localhost:4215")
		os.Setenv("SERVER_GO", "localhost:4225")
	}
}
