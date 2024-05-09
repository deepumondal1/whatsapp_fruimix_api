export const MSG_TYPE = {
  DEFAULT_INVALID_REQUEST: "DEFAULT_INVALID_REQUEST",
  TEXT: "TEXT",
  TEMPLATE: "TEMPLATE",
  INTERACTIVE_BUTTON: "INTERACTIVE_BUTTON",
  INTERACTIVE_LIST: "INTERACTIVE_LIST",
};

export function get_messages(type, params = {}) {
  if (!type) {
    throw Error(`required 'type' and must be in [${Object.values(MSG_TYPE)}]`);
  }
  switch (type.toUpperCase()) {
    case "DEFAULT_INVALID_REQUEST":
      let to = params?.to;
      if (!to) {
        throw Error('DEFAULT_INVALID_REQUEST Error - "to" not present as params');
      }
      return get_interactive_messages({
        to: params?.to,
        type:'button',
        // body: 'Sorry to understand your query. You may try to get more options to say *"Hi"*',
        body: 'Sorry we can\'t understand your request. You say *_"Hi"_* to get more options. Thank you.',
        actions: ['Hi']
      });

    case "TEXT":
      return get_text_messages({ to: params?.to, body: params?.body });

    case "TEMPLATE":
      return get_templates_messages(params?.to, params?.template);

    case "INTERACTIVE_BUTTON":
      // return get_interactive_messages({
      //   to: params?.to,
      //   type: "button",
      //   actions: params?.actions,
      // });
      return get_interactive_messages({type:'button',...params})

    case "INTERACTIVE_LIST":
      return get_interactive_messages({type:'list', ...params});

    default:
      throw Error("Invalid request 'type'. It must be ['TEXT']");
  }
}

function get_text_messages({ to, body }) {
  if (!to){
    // throw Error("Missing parameter 'to' or 'body' in {}")
    throw Error(JSON.stringify({"to": "MISSING_ARGS", "body": body ?? "MISSING_ARGS"}))
  }else if (!body){
    throw Error(JSON.stringify({"to": to ?? "MISSING_ARGS", "body": "MISSING_ARGS"}))
  }
  
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "text",
    text: {
      body: body,
    },
  };
}

function get_templates_messages(to, template) {
  // if (!to || !template){
  //   throw Error("Missing parameter 'to' or 'template' in {}")
  // }
  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "template",
    template: {
      name: template,
      language: { code: "en_US" },
    },
  };
}

function get_interactive_messages({
  to,
  type = "list" | "button",
  header = "", // Header
  body = "Body Content",
  list_text = "Options",
  actions = [],
}) {
  console.log("get_interactive_messages");
  console.log(to ,"|", type, "|", header, "|", body, "|", actions);

  if (!to || !type) {
    throw Error('"to" and "type" must be defined.');
  }
  switch (type) {
    case "button":
      return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "text",
            text: header,
          },
          body: {
            text: body,
          },
          // footer: {},
          action: {
            buttons: actions.map((data, i) => {
              return {
                type: "reply",
                reply: {
                  id: i,
                  title: data,
                },
              };
            }),
            // buttons: [
            //   {
            //     type: "reply",
            //     reply: {
            //       id: "button_1",
            //       title: "Ok",
            //     },
            //   },
            //   {
            //     type: "reply",
            //     reply: {
            //       id: "button_2",
            //       title: "Cancel",
            //     },
            //   },
            //   {
            //     type: "reply",
            //     reply: {
            //       id: "button_3",
            //       title: "Reply Later",
            //     },
            //   },
            // ],
          },
        },
      };

    case "list":
      return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
          type: "list",
          // header: {
          //   type: 'text',
          //   text: header
          // },
          body: {
            text: body,
          },
          // footer: {},
          action: {
            button: list_text,
            sections: [
              {
                title: "",
                rows: actions.map((data, i) => {
                  return {
                    id: i.toString(),
                    title: data,
                  };
                })
                // {
                //   id: "1",
                //   title: "<SECTION_1_ROW_1_TITLE>",
                // },
                // {
                //   id: "1",
                //   title: "<SECTION_1_ROW_2_TITLE>",
                // },
                // ],
              },
            ],
          },
        },
      };
  }
}
