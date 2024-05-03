package server

import (
	"fmt"
	"log"

	"github.com/marlpativ/healthz-curler/cmd/server/container"
	"github.com/marlpativ/healthz-curler/cmd/server/middleware"
	"github.com/marlpativ/healthz-curler/cmd/server/router"
	seed "github.com/marlpativ/healthz-curler/migrations"
	"github.com/marlpativ/healthz-curler/pkg/env"

	"github.com/gofiber/fiber/v2"
)

func Run(envFile string) {

	// Setup environment variables
	if envFile == "" {
		envFile = "configs/.env"
	}
	env.SetupEnv(envFile)

	// Setup Fiber config
	appName := env.GetOrDefault("APP_NAME", "Healthz-curler Go")
	fiberConfig := fiber.Config{AppName: appName}

	// Setup Container
	container := container.NewContainer()

	// Seed the database
	seed.Seed(container.DataSource)

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
