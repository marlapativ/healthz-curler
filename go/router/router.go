package router

import (
	"server/controllers"

	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(a *fiber.App) {
	a.Get("/healthz", controllers.GetHealthz)

	apiRoute := a.Group("/api/v1")
	apiRoute.Get("/config", controllers.GetConfig)
}
