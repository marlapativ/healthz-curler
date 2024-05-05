package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/marlpativ/healthz-curler/cmd/server/container"
	"github.com/marlpativ/healthz-curler/internal/services"
)

func getHealthCheckService(c *fiber.Ctx) services.HealthCheckService {
	// Get container from context
	ctr := c.Locals("container")
	return ctr.(*container.Container).HealthCheckService
}

func GetAllHealthChecks(c *fiber.Ctx) error {
	healthCheckService := getHealthCheckService(c)
	healthChecks, err := healthCheckService.GetAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(healthChecks)
}

func GetHealthCheck(c *fiber.Ctx) error {
	healthCheckService := getHealthCheckService(c)
	id := c.Params("id")
	healthCheck, err := healthCheckService.Get(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(healthCheck)
}

func createHealthCheck(c *fiber.Ctx) error {
	return c.SendString("OK")
}

func updateHealthCheck(c *fiber.Ctx) error {
	return c.SendString("OK")
}

func deleteHealthCheck(c *fiber.Ctx) error {
	return c.SendString("OK")
}

func SetupHealthCheckRoute(app fiber.Router) {
	healthCheckRouter := app.Group("/healthcheck")
	healthCheckRouter.Get("/:id", GetAllHealthChecks)
	healthCheckRouter.Put("/:id", updateHealthCheck)
	healthCheckRouter.Delete("/:id", deleteHealthCheck)
	healthCheckRouter.Post("/", createHealthCheck)
	healthCheckRouter.Get("/", GetAllHealthChecks)
}
