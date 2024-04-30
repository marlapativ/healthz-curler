package models

type ServerConfig struct {
	Port      string `json:"port"`
	Framework string `json:"framework"`
}

type WebsocketConfig struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Port string `json:"port"`
}

type Config struct {
	ID         string            `json:"id"`
	Runtime    string            `json:"runtime"`
	APIVersion string            `json:"apiVersion"`
	Server     ServerConfig      `json:"server"`
	Websocket  []WebsocketConfig `json:"websocket"`
}
