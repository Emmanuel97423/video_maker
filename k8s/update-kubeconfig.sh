#!/bin/bash

# Créer le répertoire .kube s'il n'existe pas
mkdir -p ~/.kube

# Sauvegarder l'ancienne configuration si elle existe
if [ -f ~/.kube/config ]; then
    echo "Sauvegarde de l'ancienne configuration..."
    cp ~/.kube/config ~/.kube/config.backup.$(date +%Y%m%d_%H%M%S)
    echo "Ancienne configuration sauvegardée dans ~/.kube/config.backup.*"
fi

# Copier la configuration K3s vers le répertoire .kube
echo "Copie de la nouvelle configuration K3s..."
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config

# Définir les permissions appropriées
sudo chown $USER:$USER ~/.kube/config
chmod 600 ~/.kube/config

# Vérifier que la configuration est correcte
echo "Configuration Kubernetes mise à jour. Vérification de la connexion..."
k3s kubectl get nodes

# Ajouter des alias utiles dans le shell s'ils n'existent pas déjà
echo "Vérification des alias Kubernetes..."
if ! grep -q 'alias k="k3s kubectl"' ~/.zshrc; then
    echo "Ajout des alias Kubernetes..."
    echo 'alias k="k3s kubectl"' >> ~/.zshrc
    echo 'alias kd="k3s kubectl describe"' >> ~/.zshrc
    echo 'alias kg="k3s kubectl get"' >> ~/.zshrc
    echo 'alias kl="k3s kubectl logs"' >> ~/.zshrc
    echo 'alias kx="k3s kubectl exec -it"' >> ~/.zshrc
    echo "Alias ajoutés avec succès."
else
    echo "Les alias sont déjà configurés."
fi

# Recharger le shell
source ~/.zshrc

echo "Configuration terminée ! Vous pouvez maintenant utiliser les commandes Kubernetes."
echo "Note : Si vous avez besoin de restaurer l'ancienne configuration, elle se trouve dans ~/.kube/config.backup.*" 