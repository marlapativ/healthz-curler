package handlers

import "github.com/gofiber/contrib/websocket"

type WebSocketHandler interface {
	Subscribe(channel string, c *websocket.Conn)
	Unsubscribe(channel string, c *websocket.Conn)
	Publish(channel string, message []byte)
}

type webSocketHandler struct {
	rooms map[string]map[*websocket.Conn]bool
}

func NewWebSocketHandler() WebSocketHandler {
	return &webSocketHandler{
		rooms: make(map[string]map[*websocket.Conn]bool),
	}
}

func (webSocketHandler *webSocketHandler) Subscribe(channel string, c *websocket.Conn) {
	if webSocketHandler.rooms[channel] == nil {
		webSocketHandler.rooms[channel] = make(map[*websocket.Conn]bool)
	}
	webSocketHandler.rooms[channel][c] = true
}

func (webSocketHandler *webSocketHandler) Unsubscribe(channel string, c *websocket.Conn) {
	if webSocketHandler.rooms[channel] == nil {
		return
	}
	delete(webSocketHandler.rooms[channel], c)
}

func (webSocketHandler *webSocketHandler) Publish(channel string, message []byte) {
	if webSocketHandler.rooms[channel] == nil {
		return
	}
	for c := range webSocketHandler.rooms[channel] {
		c.WriteMessage(websocket.TextMessage, message)
	}
}
