package main

import (
	"os"

	"github.com/marlpativ/healthz-curler/cmd/server"
)

func main() {
	var configFile = ""
	if len(os.Args) > 1 {
		configFile = os.Args[1]
	}
	server.Run(configFile)
}
