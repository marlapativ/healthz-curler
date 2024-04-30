package controllers

import (
	"server/env"
	"server/models"

	"github.com/gofiber/fiber/v3"
)

func GetConfig(c fiber.Ctx) error {
	var port = env.GetEnv("SERVER_PORT", "4225")
	var config models.Config = models.Config{
		ID:         "go-fiber",
		Runtime:    "go",
		APIVersion: "v1",
		Server: models.ServerConfig{
			Port:      port,
			Framework: "fiber",
		},
		Websocket: []models.WebsocketConfig{
			{
				Name: "websocket",
				Path: "/ws",
				Port: port,
			},
		},
	}
	return c.Status(fiber.StatusOK).JSON(config)
}
