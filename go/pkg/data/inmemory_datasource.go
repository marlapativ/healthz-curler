package data

import "errors"

type inmemoryDataSource struct {
	store map[string]string
}

func NewInMemoryDataSource() DataSource {
	return &inmemoryDataSource{
		store: make(map[string]string),
	}
}

func (r *inmemoryDataSource) Init() {}

func (r *inmemoryDataSource) Has(key string) (bool, error) {
	_, ok := r.store[key]
	return ok, nil
}

func (r *inmemoryDataSource) Get(key string) (string, error) {
	value, ok := r.store[key]
	if !ok {
		return "", errors.New("key not found")
	}
	return value, nil
}

func (r *inmemoryDataSource) GetAll(prefix string) ([]string, error) {
	values := []string{}
	for key, value := range r.store {
		if key[:len(prefix)] == prefix {
			values = append(values, value)
		}
	}
	return values, nil
}

func (r *inmemoryDataSource) Set(key string, value string) (string, error) {
	r.store[key] = value
	return value, nil
}

func (r *inmemoryDataSource) Delete(key string) (string, error) {
	value, ok := r.store[key]
	if !ok {
		return "", errors.New("key not found")
	}
	delete(r.store, key)
	return value, nil
}
