package middleware

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func SetupMiddleware(a *fiber.App) {
	a.Use(
		cors.New(),
		logger.New(),
	)
}
