package handlers

import "github.com/gofiber/contrib/websocket"

type Room interface {
	Subscribe(channel string, c *websocket.Conn)
	Unsubscribe(channel string, c *websocket.Conn)
	Publish(channel string, message []byte)
}

type WebSocketHandler struct {
	rooms map[string]map[*websocket.Conn]bool
}

func NewWebSocketHandler() *WebSocketHandler {
	return &WebSocketHandler{
		rooms: make(map[string]map[*websocket.Conn]bool),
	}
}

func (webSocketHandler *WebSocketHandler) Subscribe(channel string, c *websocket.Conn) {
	if webSocketHandler.rooms[channel] == nil {
		webSocketHandler.rooms[channel] = make(map[*websocket.Conn]bool)
	}
	webSocketHandler.rooms[channel][c] = true
}

func (webSocketHandler *WebSocketHandler) Unsubscribe(channel string, c *websocket.Conn) {
	if webSocketHandler.rooms[channel] == nil {
		return
	}
	delete(webSocketHandler.rooms[channel], c)
}

func (webSocketHandler *WebSocketHandler) Publish(channel string, message []byte) {
	if webSocketHandler.rooms[channel] == nil {
		return
	}
	for c := range webSocketHandler.rooms[channel] {
		c.WriteMessage(websocket.TextMessage, message)
	}
}
