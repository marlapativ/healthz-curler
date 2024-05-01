package data

type DataSource interface {
	Init()
	Has(key string) (bool, error)
	Get(key string) (string, error)
	GetAll(prefix string) ([]string, error)
	Set(key string, value string) (string, error)
	Delete(key string) (string, error)
}
