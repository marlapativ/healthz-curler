package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/marlpativ/healthz-curler/cmd/server/container"
	"github.com/marlpativ/healthz-curler/internal/services"
	"github.com/marlpativ/healthz-curler/pkg/data"
)

func getHealthGraphService(c *fiber.Ctx) services.HealthGraphService {
	ctr := c.Locals("container")
	return ctr.(*container.Container).HealthGraphService
}

func getQueryableTimeParams(c *fiber.Ctx) data.QueryableTimeParams {
	params := data.QueryableTimeParams{}
	if err := c.QueryParser(&params); err != nil {
		params.Page = 1
		params.PageSize = 100
	}
	return params
}

func GetById(c *fiber.Ctx) error {
	healthCheckId := c.Params("id")

	queryTimeParams := getQueryableTimeParams(c)
	service := getHealthGraphService(c)
	data, err := service.Get(healthCheckId, queryTimeParams)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(data)
}

func SetupHealthGraphRoute(app fiber.Router) {
	healthCheckRouter := app.Group("/healthgraph")
	healthCheckRouter.Get("/:id", GetById)
}
