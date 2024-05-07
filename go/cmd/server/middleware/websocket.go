package middleware

import (
	"encoding/json"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/marlpativ/healthz-curler/internal/models"
	"github.com/marlpativ/healthz-curler/internal/socket"
)

func SetupWebsocket(app *fiber.App, webSocketHandler socket.SocketMessageHandler) {
	app.Use("/ws", websocket.New(func(c *websocket.Conn) {
		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
					log.Println("Connection closed by client")
					unsub := models.WebSocketMessage{Type: models.Disconnect}
					webSocketHandler.HandleMessage(c, unsub)
				} else {
					log.Println("Error reading message:", err)
				}
				break
			}

			var message models.WebSocketMessage
			err = json.Unmarshal(msg, &message)
			if err != nil || message.Type == "" || message.Channel == "" {
				log.Println("Error unmarshalling/Invalid data passed: ", err)
				unsub := models.WebSocketMessage{Type: models.Disconnect}
				webSocketHandler.HandleMessage(c, unsub)
				break
			}

			webSocketHandler.HandleMessage(c, message)
		}
	}))
}
