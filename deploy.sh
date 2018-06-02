gulp build --no-watch --env production
ssh oceanstar "mkdir -p ~/node/cornhole"
ssh oceanstar "mkdir -p ~/node/cornhole/build"
ssh oceanstar "mkdir -p ~/node/cornhole/client"
ssh oceanstar "mkdir -p ~/node/cornhole/server"
scp -r ./build/* oceanstar:~/node/cornhole/build
scp -r ./client/* oceanstar:~/node/cornhole/client
scp -r ./server/* oceanstar:~/node/cornhole/server
scp -r ./package.json oceanstar:~/node/cornhole
scp -r ./.babelrc oceanstar:~/node/cornhole

ssh oceanstar "cd ~/node/cornhole && npm install"
ssh oceanstar "forever stop ~/node/cornhole/server/server.js"
ssh oceanstar "forever start -c ~/node/cornhole/node_modules/.bin/babel-node ~/node/cornhole/server/server.js"
