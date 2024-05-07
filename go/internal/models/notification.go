package models

type Notification struct {
	Id      string      `json:"id"`
	Message interface{} `json:"message"`
}
