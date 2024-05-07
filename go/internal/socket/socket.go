package socket

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/marlpativ/healthz-curler/internal/models"
)

type SocketPublisher interface {
	Publish(channel string, message interface{}) error
}

type SocketMessageHandler interface {
	HandleMessage(ws *websocket.Conn, message models.WebSocketMessage)
}

type SocketService interface {
	SocketPublisher
	SocketMessageHandler
}

type websocketService struct {
	rooms map[string]map[*websocket.Conn]bool
}

func NewWebSocketService() SocketService {
	return &websocketService{
		rooms: make(map[string]map[*websocket.Conn]bool),
	}
}

func (w *websocketService) getRoom(channel string) map[*websocket.Conn]bool {
	if w.rooms[channel] == nil {
		w.rooms[channel] = make(map[*websocket.Conn]bool)
	}

	return w.rooms[channel]
}

func (w *websocketService) Publish(channel string, message interface{}) error {
	subscribers := w.getRoom(channel)
	for conn := range subscribers {
		err := conn.WriteJSON(message)
		if err != nil {
			return err
		}
	}
	return nil
}

func (w *websocketService) HandleMessage(ws *websocket.Conn, message models.WebSocketMessage) {
	switch message.Type {
	case models.Subscribe:
		w.subscribe(message.Channel, ws)
	case models.Unsubscribe:
		w.unsubscribe(message.Channel, ws)
	case models.Disconnect:
		w.disconnect(ws)
	}
}

func (webSocketService *websocketService) subscribe(channel string, c *websocket.Conn) {
	if webSocketService.rooms[channel] == nil {
		webSocketService.rooms[channel] = make(map[*websocket.Conn]bool)
	}
	webSocketService.rooms[channel][c] = true
}

func (webSocketService *websocketService) unsubscribe(channel string, c *websocket.Conn) {
	if webSocketService.rooms[channel] == nil {
		return
	}
	delete(webSocketService.rooms[channel], c)
}

func (webSocketService *websocketService) disconnect(c *websocket.Conn) {
	for _, room := range webSocketService.rooms {
		delete(room, c)
	}
}
