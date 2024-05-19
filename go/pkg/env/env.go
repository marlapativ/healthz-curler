package env

import (
	"log"

	"github.com/spf13/viper"
)

func GetOrDefault(key string, defaultValue string) string {
	if viper.IsSet(key) {
		return viper.GetString(key)
	}
	return defaultValue
}

func SetupEnv(configFile string) {
	if configFile == "" {
		viper.AutomaticEnv()
	} else {
		viper.SetConfigFile(configFile)
		viper.SetConfigType("env")
		err := viper.ReadInConfig()
		if err != nil {
			log.Println(err)
			log.Fatal("Error loading .env file")
		}
	}
	log.Print("Environment Variables Loaded")
}
