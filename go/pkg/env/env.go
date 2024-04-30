package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetOrDefault(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func SetupEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		panic(err)
	}
}
