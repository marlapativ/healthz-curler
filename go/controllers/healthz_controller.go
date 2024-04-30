package controllers

import "github.com/gofiber/fiber/v3"

func GetHealthz(c fiber.Ctx) error {
	return c.Status(fiber.StatusOK).Send([]byte(""))
}
