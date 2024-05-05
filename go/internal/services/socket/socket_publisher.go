package services

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/marlpativ/healthz-curler/cmd/server/models"
)

type SocketPublisher interface {
	Publish(channel string, message interface{}) error
}

type SocketMessageHandler interface {
	HandleMessage(ws websocket.Conn, message models.WebSocketMessage)
}

type SocketService interface {
	SocketPublisher
	SocketMessageHandler
}

type websocketPublisher struct {
	rooms map[string]map[*websocket.Conn]bool
}

func NewWebSocketService() SocketService {
	return &websocketPublisher{
		rooms: make(map[string]map[*websocket.Conn]bool),
	}
}

func (w *websocketPublisher) getRoom(channel string) map[*websocket.Conn]bool {
	if w.rooms[channel] == nil {
		w.rooms[channel] = make(map[*websocket.Conn]bool)
	}

	return w.rooms[channel]
}

func (w *websocketPublisher) Publish(channel string, message interface{}) error {
	subscribers := w.getRoom(channel)
	for conn := range subscribers {
		err := conn.WriteJSON(message)
		if err != nil {
			return err
		}
	}
	return nil
}

func (w *websocketPublisher) HandleMessage(ws websocket.Conn, message models.WebSocketMessage) {
	switch message.Type {
	case models.Subscribe:
		w.getRoom(message.Channel)[&ws] = true
	case models.Unsubscribe:
		delete(w.getRoom(message.Channel), &ws)
	}
}
