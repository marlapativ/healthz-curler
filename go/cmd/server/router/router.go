package router

import (
	"net/http"

	"github.com/marlpativ/healthz-curler/cmd/server/container"
	"github.com/marlpativ/healthz-curler/cmd/server/controllers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/swagger"
)

func setContext(a *fiber.App, container *container.Container) {
	// Set container in context
	a.Use(func(c *fiber.Ctx) error {
		c.Locals("container", container)
		return c.Next()
	})
}

func SetupRoutes(a *fiber.App, container *container.Container) {
	a.Get("/swagger.json", func(c *fiber.Ctx) error {
		err := filesystem.SendFile(c, http.Dir("."), "public/swagger.json")
		if err != nil {
			return c.Status(fiber.StatusNotFound).SendString("File not found")
		}

		return nil
	})
	a.Get("/swagger/*", swagger.New(swagger.Config{URL: "/swagger.json"}))
	a.Get("/healthz", controllers.GetHealthz)

	// Set container in context
	setContext(a, container)

	apiRoute := a.Group("/api/v1")
	controllers.SetupConfigRoute(apiRoute)
	controllers.SetupHealthCheckRoute(apiRoute)
	controllers.SetupHealthGraphRoute(apiRoute)
}
