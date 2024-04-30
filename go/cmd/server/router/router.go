package router

import (
	"github.com/marlpativ/healthz-curler/cmd/server/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(a *fiber.App) {
	a.Get("/healthz", controllers.GetHealthz)

	apiRoute := a.Group("/api/v1")
	apiRoute.Get("/config", controllers.GetConfig)
}
