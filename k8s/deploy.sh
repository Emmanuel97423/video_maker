#!/bin/bash

# Se déplacer dans le répertoire racine du projet
cd ..

# Charger les variables d'environnement
source .env.local

# Construire l'image Docker avec les variables d'environnement
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  --build-arg NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY="${NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}" \
  --build-arg NEXT_PUBLIC_HUGGINGFACE_API_KEY="${NEXT_PUBLIC_HUGGINGFACE_API_KEY}" \
  --build-arg NEXT_PUBLIC_MINIMAXI_API_KEY="${NEXT_PUBLIC_MINIMAXI_API_KEY}" \
  --build-arg NEXT_PUBLIC_MINIMAXI_GROUP_ID="${NEXT_PUBLIC_MINIMAXI_GROUP_ID}" \
  --build-arg NEXT_PUBLIC_KLING_ACCESS_KEY="${NEXT_PUBLIC_KLING_ACCESS_KEY}" \
  --build-arg NEXT_PUBLIC_KLING_SECRET_KEY="${NEXT_PUBLIC_KLING_SECRET_KEY}" \
  --build-arg NEXT_PUBLIC_KLING_API_URL="${NEXT_PUBLIC_KLING_API_URL}" \
  -t video-maker:latest .

# Importer l'image dans k3s
sudo k3s ctr images import $(docker save video-maker:latest -)

# Se déplacer dans le répertoire k8s
cd k8s

# Supprimer l'ancien déploiement s'il existe
k3s kubectl delete -f deployment.yaml --ignore-not-found

# Appliquer les manifestes Kubernetes
k3s kubectl apply -f deployment.yaml
k3s kubectl apply -f service.yaml

# Attendre que le déploiement soit prêt
k3s kubectl wait --for=condition=available --timeout=300s deployment/video-maker

# Afficher le statut du déploiement
k3s kubectl get pods
k3s kubectl get services 