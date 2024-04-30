package middleware

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func FiberMiddleware(a *fiber.App) {
	a.Use(
		cors.New(),
		logger.New(),
	)
}
