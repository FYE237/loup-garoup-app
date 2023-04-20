#creation du compte avec le nom mehdi
curl -X POST -d 'data=%7B%22name%22%3A%22mehdi%22%2C%22email%22%3A%22emailmehdi%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' http://localhost:3000/api/users
echo ""
#login account mehdi
curl -X POST -d 'data=%7B%22name%22%3A%22mehdi%22%2C%22email%22%3A%22emailmehdi%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' http://localhost:3000/api/login
echo ""
#creation de partie pour avec l'utilisateur mehdi
curl -X POST -d 'data=%7B%22heure_debut%22%3A%2215%22%2C%22nb_participant%22%3A%225%22%2C%22hote_name%22%3A%22mehdi%22%2C%22duree_jour%22%3A%2210%22%2C%22duree_nuit%22%3A%2215%22%2C%22statut%22%3A%22en%20attente%22%2C%22proba_pouvoir_speciaux%22%3A%220.3%22%2C%22proportion_loup%22%3A%220.3%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' -H 'x-access-token: eyJhbGciOiJIUzI1NiJ9.bWVoZGk.rOBx0jXHH9zQU9RIPHK_nuEjqilZsO5W2CKaNPfKSjw' http://localhost:3000/api/parties > gametoken.txt
game_id=$(cat gametoken.txt | grep -oP '(?<="game_id":")[^"]*' | sed 's/\\//g')
echo "The game ID is: $game_id"
#creation du compte samuel
curl -X POST -d 'data=%7B%22name%22%3A%22samuel%22%2C%22email%22%3A%22emailsamuel%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' http://localhost:3000/api/users
echo ""
#login du compte samuel
curl -X POST -d 'data=%7B%22name%22%3A%22samuel%22%2C%22email%22%3A%22emailsamuel%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' http://localhost:3000/api/login
echo ""
#rejoindre la partie avec l'utilisateur samuel
curl -X POST \
  -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.c2FtdWVs.WFiakO3axo2D-NWbm-8RYA7ZTQwE0VonYlkR7cLf8lE" \
  -d 'data={"id_joueur":"samuel"}' \
  http://localhost:3000/api/parties/$game_id

