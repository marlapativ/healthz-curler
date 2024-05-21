#!/bin/bash

# This script takes inputs from the user to execute curl command to do a health check
# on a given URL. It will return the status code of the URL.

url=$1
method=$2
timeout=$3
auth_header=$4

if [ -z "$url" ]; then
  echo "Please provide a URL"
  exit 1
fi

if [ -z "$method" ]; then
  echo "Please provide a valid HTTP method (GET, POST, PUT, DELETE)"
  exit 1
fi

if [ -z "$timeout" ]; then
  echo "Please provide timeout value in seconds"
  exit 1
fi

echo "Checking the health of $url"
if [ -z "$auth_header" ]; then
  curl -s -o /dev/null -w "%{http_code}" -m "$timeout" --connect-timeout "$timeout" -X "$method" "$url"
else
  curl -s -o /dev/null -w "%{http_code}" -m "$timeout" --connect-timeout "$timeout" -X "$method" -H "Authorization: $auth_header" "$url"
fi

