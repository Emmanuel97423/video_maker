#!/bin/bash

# Se déplacer dans le répertoire racine du projet
cd ..

# Charger les variables d'environnement
export $(cat .env.local | grep -v '^#' | xargs)

# Créer les secrets Kubernetes
cat <<EOF | k3s kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: supabase-secrets
type: Opaque
data:
  url: $(echo -n "${NEXT_PUBLIC_SUPABASE_URL}" | base64 -w 0)
  anon-key: $(echo -n "${NEXT_PUBLIC_SUPABASE_ANON_KEY}" | base64 -w 0)
---
apiVersion: v1
kind: Secret
metadata:
  name: kling-secrets
type: Opaque
data:
  api-url: $(echo -n "${NEXT_PUBLIC_KLING_API_URL}" | base64 -w 0)
EOF 