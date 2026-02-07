###################################################
# Stage: base
# 
# This base stage ensures all other stages are using the same base image
# and provides common configuration for all stages, such as the working dir.
###################################################
FROM node:22-alpine AS base
WORKDIR /usr/local/app




################## CLIENT STAGES ##################

###################################################
# Stage: client-base
#
# This stage is used as the base for the client-dev and client-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS client-base
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client ./

###################################################
# Stage: client-dev
# 
# This stage is used for development of the client application. It sets 
# the default command to start the Vite development server.
###################################################
FROM client-base AS client-dev
CMD ["npm", "run", "dev"]








################## SERVER STAGES ##################

###################################################
# Stage: server-base
#
# This stage is used as the base for the server-dev and server-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS server-base
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server ./


###################################################
# Stage: server-dev
# 
# This stage is used for development of the server application. It sets 
# the default command to start the Node development server.
###################################################
FROM server-base AS server-dev
CMD ["npm", "run", "dev"]









################## MICROSERVICES STAGES ##################

###################################################
# Stage: todoread-base
#
# This stage is used as the base for the todoread-dev and todoread-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS todoread-base
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server ./


###################################################
# Stage: todoread-dev
# 
# This stage is used for development of the todoread application. It sets 
# the default command to start the Node development server.
###################################################
FROM todoread-base AS todoread-dev
CMD ["node", "microservices/read-todo.js", "todoread"]




###################################################
# Stage: todocreate-base
#
# This stage is used as the base for the todocreate-dev and todocreate-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS todocreate-base
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server ./


###################################################
# Stage: todocreate-dev
# 
# This stage is used for development of the todocreate application. It sets 
# the default command to start the Node development server.
###################################################
FROM todocreate-base AS todocreate-dev
CMD ["node", "microservices/create-todo.js", "todocreate"]




###################################################
# Stage: todoupdate-base
#
# This stage is used as the base for the todoupdate-dev and todoupdate-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS todoupdate-base
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server ./


###################################################
# Stage: todoupdate-dev
# 
# This stage is used for development of the todoupdate application. It sets 
# the default command to start the Node development server.
###################################################
FROM todoupdate-base AS todoupdate-dev
CMD ["node", "microservices/update-todo.js" , "todoupdate"]




###################################################
# Stage: tododelete-base
#
# This stage is used as the base for the tododelete-dev and tododelete-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS tododelete-base
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server ./


###################################################
# Stage: tododelete-dev
# 
# This stage is used for development of the tododelete application. It sets 
# the default command to start the Node development server.
###################################################
FROM tododelete-base AS tododelete-dev
CMD ["node", "microservices/delete-todo.js", "tododelete"]