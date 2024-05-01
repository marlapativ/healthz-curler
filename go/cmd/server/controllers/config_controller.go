package controllers

import (
	"github.com/marlpativ/healthz-curler/cmd/server/models"
	"github.com/marlpativ/healthz-curler/pkg/env"

	"github.com/gofiber/fiber/v2"
)

func GetConfig(c *fiber.Ctx) error {
	var port = env.GetOrDefault("SERVER_PORT", "4225")
	var config models.AppConfig = models.AppConfig{
		ID:         "go-fiber",
		Runtime:    "go",
		APIVersion: "v1",
		Server: models.ServerConfig{
			Port:      port,
			Framework: "fiber",
		},
		Websocket: []models.WebsocketConfig{
			{
				Name: "go",
				Path: "/ws",
				Port: port,
			},
		},
	}
	return c.Status(fiber.StatusOK).JSON(config)
}

func SetupConfigRoute(app fiber.Router) {
	configRouter := app.Group("/config")
	configRouter.Get("/", GetConfig)
}
