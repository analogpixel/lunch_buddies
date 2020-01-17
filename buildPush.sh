#!/bin/bash

export PROJECT_ID="$(gcloud config get-value project -q)"

docker build -t gcr.io/${PROJECT_ID}/lunch-buddies-app .
docker push gcr.io/${PROJECT_ID}/lunch-buddies-app

kubectl delete deployment lunch-buddies
kubectl delete service lunch-buddies

kubectl create -f deploy.yml
kubectl create -f service.yml
