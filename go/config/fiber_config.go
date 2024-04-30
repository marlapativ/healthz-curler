package config

import (
	"github.com/gofiber/fiber/v3"
)

func FiberConfig() fiber.Config {
	appName := GetEnv("APP_NAME", "Healthz-curler Go")

	return fiber.Config{
		AppName: appName,
	}
}
