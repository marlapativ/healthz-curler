package main

import (
	"fmt"
	"log"

	"github.com/marlpativ/healthz-curler/cmd/server/config"
	"github.com/marlpativ/healthz-curler/cmd/server/middleware"
	"github.com/marlpativ/healthz-curler/cmd/server/router"
	"github.com/marlpativ/healthz-curler/pkg/env"

	"github.com/gofiber/fiber/v3"
)

func main() {
	// Setup environment variables
	env.SetupEnv()

	// Create a new Fiber instance
	fiberConfig := config.FiberConfig()
	app := fiber.New(fiberConfig)

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
		log.Printf("Server failed to run. Reason: %v", err)
		panic(err)
	} else {
		log.Printf("Server is running on %s", url)
	}
}
