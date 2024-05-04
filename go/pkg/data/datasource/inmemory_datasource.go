package datasource

import (
	"errors"

	"github.com/marlpativ/healthz-curler/pkg/data"
)

type inmemoryDataSource struct {
	store map[string][]byte
}

func NewInMemoryDataSource() data.DataSource {
	return &inmemoryDataSource{
		store: make(map[string][]byte),
	}
}

func (r *inmemoryDataSource) Init() {}

func (r *inmemoryDataSource) Has(key string) (bool, error) {
	_, ok := r.store[key]
	return ok, nil
}

func (r *inmemoryDataSource) Get(key string) ([]byte, error) {
	value, ok := r.store[key]
	if !ok {
		return nil, errors.New("key not found")
	}
	return value, nil
}

func (r *inmemoryDataSource) GetAll(prefix string) ([][]byte, error) {
	values := [][]byte{}
	for key, value := range r.store {
		if key[:len(prefix)] == prefix {
			values = append(values, value)
		}
	}
	return values, nil
}

func (r *inmemoryDataSource) Set(key string, value []byte) ([]byte, error) {
	r.store[key] = value
	return value, nil
}

func (r *inmemoryDataSource) Delete(key string) ([]byte, error) {
	value, ok := r.store[key]
	if !ok {
		return nil, errors.New("key not found")
	}
	delete(r.store, key)
	return value, nil
}
