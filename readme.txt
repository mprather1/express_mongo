curl -H "Content-Type: application/json" -X POST -d '{"name":"Kill Bill"}' http://127.0.0.1:8000/api/users

NODE_ENV=production node_modules/.bin/webpack -p
NODE_ENV=production node_modules/.bin/babel-node --presets 'es2015' server.js