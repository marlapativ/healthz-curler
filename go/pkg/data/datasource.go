package data

type DataSource interface {
	Init()
	Has(key string) (bool, error)
	Get(key string) ([]byte, error)
	GetAll(prefix string) ([][]byte, error)
	Set(key string, value []byte) ([]byte, error)
	Delete(key string) ([]byte, error)
}
