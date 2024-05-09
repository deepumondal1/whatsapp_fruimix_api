/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";

import { get_messages } from "./src/helper.js";
import whatsapp_messages from "./src/whatsapp_messages.js";

// import { getUsers } from './src/firebase/firebase_test.js'
import { createUser, getUsers, getUserAddress, addUserAddress } from './src/firebase/controller/user.js'
import { getOffers } from './src/firebase/controller/offers.js'

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text
  console.log("Incoming message type", message?.type);

  try {
    // if (message?.type === "text" ||
    //     (message?.type === 'interactive' && message?.type?.interactive?.type === 'button_reply')
    //    ) {

    if (message) {
      // extract the business number to send the reply from it
      const business_phone_number_id =
        req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

      // let data = {
      //   messaging_product: "whatsapp",
      //   to: message.from,
      //   text: { body: "Echo: " + message.text.body },
      //   context: {
      //     message_id: message.id, // shows the message as a reply to the original user message
      //   },
      // }

      let data;
      data = whatsapp_messages(message);
      // console.log(business_phone_number_id, data);

      console.log(JSON.stringify(data,null));
      // return res.sendStatus(200);
      if (Array.isArray(data)) {
        for (const d of data) {
          await axios({
            method: "POST",
            url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
            headers: {
              Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: d,
          });
        }
        // data.forEach((d)=>console.log(d))
      } else {
        // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
        await axios({
          method: "POST",
          url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
          headers: {
            Authorization: `Bearer ${GRAPH_API_TOKEN}`,
          },
          data: data,
        });
      }

      // mark incoming message as read
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
    }
  } catch (err) {
    console.log("ERROR --> ", err);
    console.log("ERROR DETAILS --> ", err?.error_data?.details);
  }
  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  // try{
  //   // return res.send(get_messages('text', {to: '79839848383', body: 'Hi there!'}))
  //   return res.send(get_messages())
  // }catch(e){
  //   console.log(e)
  //   return res.status(404).send({"error":e.message})
  // }

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

// app.get("/", getUsers)

app.get("/", async (req, res) => {
  try{
    // console.log(await getUsers())
    // return res.send(get_messages('text', {to: '79839848383', body: 'Hi there!'}))
    // return res.send(get_messages("DEFAULT_INVALID_REQUEST",{to:'99'}))
    // return res.send(get_messages("TEXT",{to:'99',body: 'body text'}))
    
    // const user = await createUser('917982413192','Deepu','7982413102')
    // const user = await getUsers()
    // const user = await getUserAddress('917982413192')
    // const user = await addUserAddress('917982413192', {"latitude": 28.1943541,"longitude": 76.8644089})
    // const user = await addUserAddress('917982413192', 'Hno: 30, xyz appartment, Bhiwadi')
    const user = await getOffers()
    return res.send(user)
  }catch(e){
    console.log(e)
    return res.status(404).send({"error":e.message})
  }
  
  
  res.send(`<pre>Nothing to see here.
    Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});