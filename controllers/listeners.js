/**
 * follow swagger file for api definations
 */

const {
  OK,
  channelRequired,
  existingListenerErr,
  noListenerErr
} = require("../message");

const {
  addLisQueue,
  addListener, 
  rmLisQueue, 
  publishRmListener,
  publishChannel
} = require("./helpers")

/**
 * @param {*} req: request object
 * @param {*} res: responce object
 * @required req.body.channel
 * 
 */
const startListener = async (req, res) => {

  const {channel} = req.body;

  if (!channel || !channel.trim().length) {
    return res.status(channelRequired.status).send(channelRequired.response);
  }

  let listeners = await addLisQueue(channel)
  await addListener(channel)

  if (!listeners) {
    console.warn("Listener already listening")
    return res.status(existingListenerErr.status).send(existingListenerErr.response)
  }else {
    console.log(`started listening at channel: ${channel} count: ${listeners}`)
  }
  
  return res.status(OK.status).send(OK.listenerSuccessful)

};

const stopListener = async (req, res) => {
  let channel = req.params.channel
  console.info(`removing listener: ${channel}`)
  
  let [_, listeners]= await publishRmListener(channel)
  if (!listeners) {
    console.warn("Listener not present")
    return res.status(noListenerErr.status).send(noListenerErr.response)
  }else {
    console.log(`removed listening at channel: ${channel} count: ${listeners}`)
  }

  await rmLisQueue(channel)

  return res.status(OK.status).send(OK.listenerDelSuccessful)
}

/**
 * test function to check publish message 
 */
const publish = async (req, res) => {
  const {channel, message} = req.body;
  publishChannel(channel, message)
  return res.status(OK.status).send("OK")
}

module.exports = {
  startListener,
  stopListener, 
  publish
};
