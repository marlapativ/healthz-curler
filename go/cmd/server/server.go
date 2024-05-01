package server

import (
	"fmt"
	"log"

	"github.com/marlpativ/healthz-curler/cmd/server/middleware"
	"github.com/marlpativ/healthz-curler/cmd/server/router"
	"github.com/marlpativ/healthz-curler/internal/handlers"
	"github.com/marlpativ/healthz-curler/pkg/env"

	"github.com/gofiber/fiber/v2"
)

func Run() {
	// Setup environment variables
	env.SetupEnv()

	// Setup Fiber config
	appName := env.GetOrDefault("APP_NAME", "Healthz-curler Go")
	fiberConfig := fiber.Config{AppName: appName}

	// Create a new Fiber instance
	app := fiber.New(fiberConfig)

	// Setup Websocket
	webSocketHandler := handlers.NewWebSocketHandler()
	middleware.SetupWebsocket(app, webSocketHandler)

	// Setup middlewares
	middleware.SetupMiddleware(app)

	// Setup routes
	router.SetupRoutes(app)

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
