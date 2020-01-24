const { wait } = require("../utils")
const pubClient = require("../config/redisConnect").pubClient
const subClientFun = require("../config/redisConnect").subClient
const subClient = subClientFun()
const redisClient = require("../config/redisConnect").redisClient
let clients = {}

const listener = async (client) => {
    console.info("Listening for messages")
    client.on("message", (channel, message) => {
        console.log(`message ${message}, channel: ${channel}`)

        if (message == "DONE") {
            return rmListener(channel)
        }
        let msg = JSON.stringify({ originalChannel: channel, originalMessage: message })
        console.info(`published message on db_writer_channel`)
        pubClient.publishAsync(
            process.env.db_writer_channel,
            msg
        )
    })
}

const addDefaultListeners = async () => {
    console.info("Default Listeners started")
    let [err, data] = await wait(redisClient.smembersAsync, redisClient, 'listeners')
    if (err) {
        console.error("error in redis: ", err)
    }
    for(let i=0; i<data.length; i++) {
        addListener(data[i])
    }
}

listener()
addDefaultListeners()

/**
 * 
 * @param {*} channel: channel ID
 * 
 */
const addListener = async (channel) => {
    console.info(`Adding listener for channel: ${channel}`)
    clients[channel] = subClientFun()
    clients[channel].subscribe(channel);

    await new Promise((resolve) => {
        clients[channel].on("subscribe", function (chan, count) {
            if (channel == chan) {
                listener(clients[channel])
                return resolve([count]);
            }
        })
    })
}

const publishRmListener = async (channel) => {
    let [err, data] = await wait(pubClient.publishAsync, pubClient, channel, "DONE")
    console.log(err, data)
    return [err, data]
}

const rmListener = async (channel) => {
    console.info(`removing listener on channel ${channel}`)
    clients[channel].unsubscribe(channel);
    await new Promise((resolve) => {
        clients[channel].on("unsubscribe", function (chan, count) {
            if (channel == chan) {
                delete clients[channel]
                return resolve([count]);
            }
        })
    })
}

const addLisQueue = async (channel) => {
    console.info(`adding channel: ${channel} in queue`)
    let [err, data] = await wait(redisClient.saddAsync, redisClient, 'listeners', channel)
    if (err) {
        console.error("error in redis: ", err)
    }
    return data
}


const rmLisQueue = async (channel) => {
    let [err, data] = await wait(redisClient.sremAsync, redisClient, 'listeners', channel)
    if (err) {
        console.error("error in redis: ", err)
    }
    return data
}

const publishChannel = async (channel, message) => {
    pubClient.publish(
        channel,
        message
    )
}

module.exports = {
    addListener,
    publishRmListener,
    addLisQueue,
    publishChannel,
    rmLisQueue
}