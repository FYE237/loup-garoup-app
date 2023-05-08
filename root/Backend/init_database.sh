# backend=https://projetwebimags.osc-fr1.scalingo.io
backend=http://localhost:3000
#creation du compte avec le nom mehdi
curl -X POST -d 'data=%7B%22name%22%3A%22mehdi%22%2C%22email%22%3A%22emailmehdi%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/users
echo ""
#login account mehdi
curl -X POST -d 'data=%7B%22name%22%3A%22mehdi%22%2C%22email%22%3A%22emailmehdi%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/login
echo ""
#creation de partie pour avec l'utilisateur mehdi
game_start_in=20
curl -X POST -d "data=%7B%22heure_debut%22%3A%22$game_start_in%22%2C%22nb_participant%22%3A%225%22%2C%22hote_name%22%3A%22mehdi%22%2C%22duree_jour%22%3A%2210%22%2C%22duree_nuit%22%3A%2215%22%2C%22proba_pouvoir_speciaux%22%3A%221%22%2C%22proportion_loup%22%3A%220.3%22%7D" -H 'Content-Type: application/x-www-form-urlencoded' -H 'x-access-token: eyJhbGciOiJIUzI1NiJ9.bWVoZGk.rOBx0jXHH9zQU9RIPHK_nuEjqilZsO5W2CKaNPfKSjw' $backend/api/parties > gametoken.txt
game_id=$(cat gametoken.txt | grep -oP '(?<="game_id":")[^"]*' | sed 's/\\//g')
echo "The game ID is: $game_id"
#creation du compte samuel
curl -X POST -d 'data=%7B%22name%22%3A%22samuel%22%2C%22email%22%3A%22emailsamuel%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/users
echo ""
#login du compte samuel
curl -X POST -d 'data=%7B%22name%22%3A%22samuel%22%2C%22email%22%3A%22emailsamuel%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/login
echo ""
# curl -X POST -d 'data={"name":"emanuel","email":"blabla@gmail.com","password":"hello"}' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/login

#rejoindre la partie avec l'utilisateur samuel
echo "The game ID is: $game_id"
curl -X POST \
  -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.c2FtdWVs.WFiakO3axo2D-NWbm-8RYA7ZTQwE0VonYlkR7cLf8lE" \
  -d 'data={"id_joueur":"samuel"}' \
  $backend/api/parties/$game_id

# #creation du compte emmanuel
# curl -X POST -d 'data=%7B%22name%22%3A%22emmanuel%22%2C%22email%22%3A%22emailemmanuel%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/users
# echo ""
# #login du compte emmanuel
# curl -X POST -d 'data=%7B%22name%22%3A%22emmanuel%22%2C%22email%22%3A%22emailemmanuel%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/login
# echo ""
# #rejoindre la partie avec l'utilisateur emmanuel
# echo "The game ID is: $game_id"
# curl -X POST \
  # -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.ZW1tYW51ZWw.2yBE41Aa5v7e7k5vQJEF1HUFRBujYRj8TsdsYGqGwPU" \
  # -d 'data={"id_joueur":"emmanuel"}' \
  # $backend/api/parties/$game_id
# #creation du compte mouahe
# curl -X POST -d 'data=%7B%22name%22%3A%22mouahe%22%2C%22email%22%3A%22emailmouahe%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/users
# echo ""
# #login du compte mouahe
# curl -X POST -d 'data=%7B%22name%22%3A%22mouahe%22%2C%22email%22%3A%22emailmouahe%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/login
# echo ""
# #rejoindre la partie avec l'utilisateur moouahe
# echo "The game ID is: $game_id"
# curl -X POST \
  # -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.bW91YWhl.Yps8Wl-l7QYHI5VJH4WTyny1xMdcYpdr4ZZvpNMJYUI" \
  # -d 'data={"id_joueur":"mouahe"}' \
  # $backend/api/parties/$game_id
# #creation du compte jackson
# curl -X POST -d 'data=%7B%22name%22%3A%22jackson%22%2C%22email%22%3A%22emailjackson%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/users
# echo ""
# #login du compte jackson
# curl -X POST -d 'data=%7B%22name%22%3A%22jackson%22%2C%22email%22%3A%22emailjackson%40gmail.com%22%2C%22password%22%3A%22hello%22%7D' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/login
# echo ""
# echo "The game ID is: $game_id"
# curl -X POST \
  # -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.amFja3Nvbg.NWcL1UmzNoiuhX6Q8C14OevMICbNBbbDWqVPUiEEWtQ" \
  # -d 'data={"id_joueur":"jackson"}' \
  # $backend/api/parties/$game_id
