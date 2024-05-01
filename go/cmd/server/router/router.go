package router

import (
	"github.com/marlpativ/healthz-curler/cmd/server/container"
	"github.com/marlpativ/healthz-curler/cmd/server/controllers"

	"github.com/gofiber/fiber/v2"
)

func setContext(a *fiber.App, container *container.Container) {
	// Set container in context
	a.Use(func(c *fiber.Ctx) error {
		c.Locals("container", container)
		return c.Next()
	})
}

func SetupRoutes(a *fiber.App, container *container.Container) {
	a.Get("/healthz", controllers.GetHealthz)

	// Set container in context
	setContext(a, container)

	apiRoute := a.Group("/api/v1")
	apiRoute.Get("/config", controllers.GetConfig)
}
