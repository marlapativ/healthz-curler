package controllers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/marlpativ/healthz-curler/cmd/server/container"
	"github.com/marlpativ/healthz-curler/internal/models"
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

func validateHealthCheckRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return errors.New("id is required")
	}
	return nil
}

func GetHealthCheck(c *fiber.Ctx) error {
	if err := validateHealthCheckRequest(c); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	healthCheckService := getHealthCheckService(c)
	id := c.Params("id")
	healthCheck, err := healthCheckService.Get(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(healthCheck)
}

func createHealthCheck(c *fiber.Ctx) error {
	healthCheckService := getHealthCheckService(c)
	healthCheck := new(models.HealthCheck)
	if err := c.BodyParser(healthCheck); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	res, err := healthCheckService.Create(*healthCheck)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func updateHealthCheck(c *fiber.Ctx) error {
	if err := validateHealthCheckRequest(c); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	healthCheckService := getHealthCheckService(c)
	healthCheck := new(models.HealthCheck)
	if err := c.BodyParser(healthCheck); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	id := c.Params("id")
	res, err := healthCheckService.Update(id, *healthCheck)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func deleteHealthCheck(c *fiber.Ctx) error {
	if err := validateHealthCheckRequest(c); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	healthCheckService := getHealthCheckService(c)
	id := c.Params("id")
	res, err := healthCheckService.Delete(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(res)
}

func SetupHealthCheckRoute(app fiber.Router) {
	healthCheckRouter := app.Group("/healthcheck")
	healthCheckRouter.Get("/:id", GetAllHealthChecks)
	healthCheckRouter.Put("/:id", updateHealthCheck)
	healthCheckRouter.Delete("/:id", deleteHealthCheck)
	healthCheckRouter.Post("/", createHealthCheck)
	healthCheckRouter.Get("/", GetAllHealthChecks)
}
