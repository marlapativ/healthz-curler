package config

import (
	"server/env"

	"github.com/gofiber/fiber/v3"
)

func FiberConfig() fiber.Config {
	appName := env.GetOrDefault("APP_NAME", "Healthz-curler Go")

	return fiber.Config{
		AppName: appName,
	}
}
