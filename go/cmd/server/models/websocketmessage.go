package models

type WebSocketMessageType string

const (
	Subscribe   WebSocketMessageType = "subscribe"
	Unsubscribe WebSocketMessageType = "unsubscribe"
)

type WebSocketMessage struct {
	Type    WebSocketMessageType `json:"type"`
	Channel string               `json:"channel"`
}
