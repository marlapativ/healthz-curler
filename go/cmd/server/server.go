package server

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/marlpativ/healthz-curler/cmd/server/container"
	"github.com/marlpativ/healthz-curler/cmd/server/middleware"
	"github.com/marlpativ/healthz-curler/cmd/server/router"
	seed "github.com/marlpativ/healthz-curler/migrations"
	"github.com/marlpativ/healthz-curler/pkg/env"

	"github.com/gofiber/fiber/v2"
)

func Run(envFile string) {
	if envFile == "" {
		log.Printf("No Config Passed. Loading environment variables.")
		env.SetupEnv("")
	} else if _, err := os.Stat(envFile); !errors.Is(err, os.ErrNotExist) {
		log.Printf("Loading environment variables from %s", envFile)
		env.SetupEnv(envFile)
	}

	// Setup Fiber config
	appName := env.GetOrDefault("APP_NAME", "Healthz-curler Go")
	fiberConfig := fiber.Config{AppName: appName}

	// Setup database
	dataSource := container.NewDataSource()

	// Seed the database
	seed.Seed(dataSource)

	// Setup Container
	container := container.NewContainer(dataSource)
	container.Init()

	// Create a new Fiber instance
	app := fiber.New(fiberConfig)

	// Setup Websocket
	middleware.SetupWebsocket(app, container.WebSocketHandler)

	// Setup middlewares
	middleware.SetupMiddleware(app)

	// Setup routes
	router.SetupRoutes(app, container)

	// Start server
	var host = env.GetOrDefault("SERVER_HOST", "")
	var port = env.GetOrDefault("SERVER_PORT", "4225")
	var url = fmt.Sprintf("%s:%s", host, port)

	err := app.Listen(url)
	if err != nil {
		log.Fatalf("Server failed to run. Reason: %v", err)
	} else {
		log.Printf("Server is running on %s", url)
	}
}
