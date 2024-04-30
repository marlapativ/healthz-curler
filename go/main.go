package main

import (
	"fmt"
	"log"
	"server/config"
	"server/router"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func main() {
	// Create a new Fiber instance
	fiberConfig := config.FiberConfig()
	app := fiber.New(fiberConfig)

	// Setup middlewares
	app.Use(
		cors.New(),
		logger.New(),
	)

	// Setup routes
	router.SetupRoutes(app)

	// Start server
	var url = fmt.Sprintf("%s:%s", config.GetEnv("SERVER_HOST", ""), config.GetEnv("SERVER_PORT", "4225"))

	err := app.Listen(url)
	if err != nil {
		log.Printf("Server failed to run. Reason: %v", err)
		panic(err)
	} else {
		log.Printf("Server is running on %s", url)
	}
}
