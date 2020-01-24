# pull a node image from docker hub
FROM node:12.14.0 

# set the working dir to /app
WORKDIR /app 

# copy package.json to the container
COPY package.json package.json 

# install package.json modules in container
RUN npm install -g

# copy everything to container /app
COPY . . 

# expose port 3000 to mount it to another port in local machine
EXPOSE 3000  

# install nodemon for changes on the fly
RUN npm install -g nodemon 

# start server inside container 
CMD ["nodemon", " -L", "index.js" ] 