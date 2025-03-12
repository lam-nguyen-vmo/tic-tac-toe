## Simple Tic Tac Toe game using NestJS & ReactJS
## Required tools
- Docker
- Docker Compose
## Deploy the project
```bash
# build images and run containers
$ docker-compose up -d

# remove all unused images
$ docker image prune -f
```

It's done.

## Redeploy the project
```bash
# stop all containers
$ docker-compose down

# pull the latest code from git
$ git pull origin <remote_branch>

# rebuild images and run containers
$ docker-compose up --build -d

# remove all unused images
$ docker image prune -f
```

## Join the game
- Frontend url: http://localhost:3000
- Backend API endpoint: http://localhost:3001
- Backend API document: http://localhost:3001/api/docs


