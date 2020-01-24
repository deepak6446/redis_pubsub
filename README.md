# What is this?

It contains API's for redis pubsub.

# Why docker?

Docker enables developers to easily pack, ship, and run any application as a lightweight, portable, self-sufficient container, which can run virtually anywhere.

# How to use it?
1. [Install docker](https://docs.docker.com/install/) 
2. [Install docker-compose](https://docs.docker.com/compose/install/)
2. Move into root directory and run command<br>
   docker-compose up
3. Done!

# API's

1.  Start listener

    ### /api/v1/start-listening

    - Start listening on channel

    ```javascript
    { 
        "channel": "channel-1" 
    }
    ```

2)  Delete listener

    ### /api/v1/stopt-listening/:channel-id

    - Deletes the listner from service