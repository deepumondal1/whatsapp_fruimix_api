import { get_messages, MSG_TYPE } from "./helper.js";

const MSG_KEYWORD = {
  HI: "hi",
  HI2: "hi2",
  OFFERS: "offers",
  ORDERS: "orders",

  ORDER1: "order 1",
  ORDER2: "order 2",
};

export default function whatsapp_messages(message) {
  // let data = {
  //   messaging_product: "whatsapp",
  //   to: message.from,
  //   text: { body: "Echo: " + message.text.body },
  //   context: {
  //     message_id: message.id, // shows the message as a reply to the original user message
  //   },
  // }

  let message_from = message.from;
  let message_text_body
  let message_id = message.id;
  
  switch(message.type){
    case 'text':
      message_text_body = message.text.body;
      break;
      
    case 'interactive':
      if(message.interactive.type === 'button_reply'){
        message_text_body = message.interactive.button_reply.title;
      
      }else if(message.interactive.type === 'list_reply'){
        message_text_body = message.interactive.list_reply.title;
      }
      break;
      
    default:
      message_text_body = 'any';
      
  }

  //   if (Object.values(MSG_KEYWORD).includes(message_text_body)){
  //     let data = get_messages(MSG_TYPE.TEXT, {to: message_from, body: 'Thanks for your response. We\'ll contact you soon.'})
  //     return data
  //   }else{
  //     return get_messages(MSG_TYPE.DEFAULT_INVALID_REQUEST)
  //   }

  let data = [];
  switch (message_text_body.toLowerCase()) {
    case MSG_KEYWORD.HI:
      
      data.push(
        get_messages(MSG_TYPE.TEXT, {
          to: message_from,
          body: "Welcome to *** ! I'm your virtual assistant.",
        }),
        get_messages(MSG_TYPE.INTERACTIVE_LIST, {
          to: message_from,
          body: "Select your preferred option.👇",
          header: '',
          actions: ['My App', 'Dashboard', 'Offers', 'Payments']
        })
      )
      
      return data;

    case MSG_KEYWORD.HI2:
      console.log('hi2 -> ', message_from, message_text_body, message_id)
      data.push(
        get_messages(MSG_TYPE.INTERACTIVE_BUTTON, {
          to: message_from,
          header: '',
          body: "Select your preferred option.👇",
          actions: ['Hi', 'Hi2']
        }),
      )
      return data;

    case MSG_KEYWORD.OFFERS:
      data.push(
        get_messages(MSG_TYPE.TEXT, {
          to: message_from,
          body: "Thanks for your response. We'll contact you soon.",
        })
      )
      return data;

    case MSG_KEYWORD.ORDER1:
      data = get_messages(MSG_TYPE.TEXT, {
        to: message_from,
        body: "Thanks for your response. We'll contact you soon.",
      });
      return data;

    case MSG_KEYWORD.ORDER2:
      data = get_messages(MSG_TYPE.TEXT, {
        to: message_from,
        body: "Thanks for your response. We'll contact you soon.",
      });
      return data;

    default:
      data = get_messages(MSG_TYPE.DEFAULT_INVALID_REQUEST, {
        to: message_from,
      })
      return data;
  }
}
