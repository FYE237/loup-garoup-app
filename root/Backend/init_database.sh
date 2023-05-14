# backend=https://projetwebimags.osc-fr1.scalingo.io
backend=http://localhost:3000


# creation du compte avec le nom mehdi
curl -X POST -d 'data={"name":"mehdi","password":"hello"}' -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/users
echo ""

# login account mehdi
curl -X POST -d 'data={"name":"mehdi","password":"hello"}' \
  -H 'Content-Type: application/x-www-form-urlencoded' $backend/api/login
echo ""

# creation de partie pour avec l'utilisateur mehdi
game_start_in=20
curl -X POST -d 'data={"heure_debut":"'"$game_start_in"'","nb_participant":"5","hote_name":"mehdi","duree_jour":"12","duree_nuit":"12","proba_pouvoir_speciaux":"1","proportion_loup":"0.3"}' \
  -H 'Content-Type: application/x-www-form-urlencoded' -H 'x-access-token: eyJhbGciOiJIUzI1NiJ9.bWVoZGk.rOBx0jXHH9zQU9RIPHK_nuEjqilZsO5W2CKaNPfKSjw' $backend/api/parties > gametoken.txt

game_id=$(cat gametoken.txt | grep -oP '(?<="game_id":")[^"]*' | sed 's/\\//g')
echo "The game ID is: $game_id"

# Create account for user "samuel"
curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"name":"samuel","password":"hello"}' \
  $backend/api/users

echo ""

# Login as user "samuel"
curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"name":"samuel","password":"hello"}' \
  $backend/api/login

echo ""

# Join the game with user "samuel"
echo "The game ID is: $game_id"
curl -X POST \
  -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.c2FtdWVs.WFiakO3axo2D-NWbm-8RYA7ZTQwE0VonYlkR7cLf8lE" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"id_joueur":"samuel"}' \
  $backend/api/parties/$game_id

#creation du compte emmanuel
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' -d 'data={"name":"emmanuel","password":"hello"}' $backend/api/users
echo ""
#login du compte emmanuel
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' -d 'data={"name":"emmanuel","password":"hello"}' $backend/api/login
echo ""
#rejoindre la partie avec l'utilisateur emmanuel
echo "The game ID is: $game_id"
curl -X POST -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.ZW1tYW51ZWw.2yBE41Aa5v7e7k5vQJEF1HUFRBujYRj8TsdsYGqGwPU" \
   -H 'Content-Type: application/x-www-form-urlencoded'  \
   -d 'data={"id_joueur":"emmanuel"}' $backend/api/parties/$game_id

#creation du compte mouahe
curl -X POST -H 'Content-Type: application/x-www-form-urlencoded' -d 'data={"name":"mouahe","password":"hello"}' $backend/api/users
echo ""


#login du compte mouahe
curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"name": "mouahe", "password": "hello"}' \
  $backend/api/login
echo ""

#rejoindre la partie avec l'utilisateur mouahe
echo "The game ID is: $game_id"
curl -X POST \
  -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.bW91YWhl.Yps8Wl-l7QYHI5VJH4WTyny1xMdcYpdr4ZZvpNMJYUI" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"id_joueur": "mouahe"}' \
  $backend/api/parties/$game_id

#creation du compte jackson
curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"name": "jackson", "password": "hello"}' \
  $backend/api/users
echo ""

#login du compte jackson
curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"name": "jackson", "password": "hello"}' \
  $backend/api/login
echo ""

echo "The game ID is: $game_id"
curl -X POST \
  -H "x-access-token: eyJhbGciOiJIUzI1NiJ9.amFja3Nvbg.NWcL1UmzNoiuhX6Q8C14OevMICbNBbbDWqVPUiEEWtQ" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'data={"id_joueur": "jackson"}' \
  $backend/api/parties/$game_id
