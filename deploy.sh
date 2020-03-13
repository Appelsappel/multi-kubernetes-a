docker build -t appelsappel/multi-client-a:latest -t appelsappel/multi-client-a:$SHA -f ./client/Dockerfile .client
docker build -t appelsappel/multi-api-a:latest -t appelsappel/multi-api-a:$SHA -f ./api/Dockerfile .api
docker build -t appelsappel/multi-worker-a:latest -t appelsappel/multi-worker-a:$SHA -f ./worker/Dockerfile .worker

docker push appelsappel/multi-client-a:latest
docker push appelsappel/multi-api-a:latest
docker push appelsappel/multi-worker-a:latest

docker push appelsappel/multi-client-a:$SHA
docker push appelsappel/multi-api-a:$SHA
docker push appelsappel/multi-worker-a:$SHA

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=appelsappel/multi-client-a:$SHA
kubectl set image deployments/api-deployment api=appelsappel/multi-api-a:$SHA
kubectl set image deployments/worker-deployment worker=appelsappel/multi-worker-a:$SHA
