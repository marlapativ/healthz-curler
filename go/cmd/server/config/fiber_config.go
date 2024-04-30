package config

import (
	"github.com/marlpativ/healthz-curler/pkg/env"

	"github.com/gofiber/fiber/v3"
)

func FiberConfig() fiber.Config {
	appName := env.GetOrDefault("APP_NAME", "Healthz-curler Go")

	return fiber.Config{
		AppName: appName,
	}
}
