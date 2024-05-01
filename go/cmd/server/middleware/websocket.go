package middleware

import (
	"encoding/json"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/marlpativ/healthz-curler/cmd/server/models"
	"github.com/marlpativ/healthz-curler/internal/handlers"
)

func SetupWebsocket(app *fiber.App, webSocketHandler *handlers.WebSocketHandler) {
	app.Use("/ws", websocket.New(func(c *websocket.Conn) {
		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Error reading message:", err)
				break
			}

			var message models.WebSocketMessage
			err = json.Unmarshal(msg, &message)
			if err != nil || message.Type == "" || message.Channel == "" {
				log.Println("Error unmarshalling/Invalid data passed: ", err)
				break
			}

			switch message.Type {
			case models.Subscribe:
				webSocketHandler.Subscribe(message.Channel, c)
			case models.Unsubscribe:
				webSocketHandler.Unsubscribe(message.Channel, c)
			}
		}
	}))
}
