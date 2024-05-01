package env

import (
	"log"
	"os"

	"github.com/spf13/viper"
)

func GetOrDefault(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func SetupEnv() {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath("configs")
	err := viper.ReadInConfig()
	if err != nil {
		log.Println(err)
		log.Fatal("Error loading .env file")
	}
}