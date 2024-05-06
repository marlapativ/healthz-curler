package util

import "time"

func SetInterval(callback func(), interval time.Duration) chan<- bool {
	clearInterval := make(chan bool)
	ticker := time.NewTicker(interval)
	go func() {
		for {
			select {
			case <-clearInterval:
				ticker.Stop()
				return
			case <-ticker.C:
				callback()
			}
		}
	}()
	return clearInterval
}
