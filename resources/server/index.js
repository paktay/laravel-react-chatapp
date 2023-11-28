const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:8000", "http://192.168.2.123:8000"],
        methods: ["GET", "POST"]
      }
 });
const clientId = "cs";
//const clientId = "client1";

const clientObject = {}

var socketObject;


io.on("connection", (socket) => {
  socketObject = socket;
  console.log('user connected', socket.id);
  socket.on("disconnect", (reason) => {
    console.log('user disconnected', reason);
  });

  // get chat lists
  socket.on("getChats", () => {
    WAGetChats();
  });

  // get chat messages
  socket.on("fetchMessages", (chatid) => {
    console.log("on fetchMessages received", chatid, socket.id);
    WAFetchMessages(socket, chatid);
  });

  socket.on("sendMessage", (msg) => {
    WASendMessage(socket, msg.chatId, msg.message);
  });

  WAGetChats().then(val => {
    if(!val) {
        setInterval(intervalFunc, 3000);
    }
  })
  //createWhatsappSession(socket);


});

httpServer.listen(port);

async function intervalFunc() {
    let isReady = false;
    isReady = await WAGetChats();

    if(isReady) {
        clearInterval(this);
    }
}

const WASendMessage = async (socket, chatId, text) => {
    try {
        const client = clientObject[clientId];
        let messageResponse = await client.sendMessage(chatId, text);
        io.sockets.emit("message", messageResponse);
        setTimeout(WAGetChats, 1000);
        //WAGetChats();
    } catch (err) {
        console.log(err);
    }
}

const WAFetchMessages = async (socket, chatid) => {
    try
    {
        if(socket != null) {
            const client = clientObject[clientId];
            const chat = await client.getChatById(chatid);

            const searchOptions = { limit: 100 };
            //const searchOptions = { };
            const messages = await chat.fetchMessages(searchOptions);
            console.log(socket.id);

            const parse_messages = messages.map((message) => {
                if(message.hasMedia) {
                    return {...message, body: 'media'};
                } else {
                    return message;
                }
            });

            console.log(parse_messages);
            socket.emit("activeWindowMsg", parse_messages);

            //set seen chat
            chat.sendSeen().then((val)=>{
                if(val) {
                    WAGetChats();
                }
            })
        }
    } catch (err)
    {
        console.log(err.message);
        return false;
    }
}

const WAGetChats = async () => {
    try
    {
        const socket = socketObject;
        if(socket != null) {
            const client = clientObject[clientId];
            const chats = await client.getChats();
            const status = await client.getState();

            // const newChats = await Promise.all(chats.map(async (chat) => {
            //     const contactId = chat.id;
            //     const profilePicUrl = await client.getProfilePicUrl(contactId);
            //     chat.profilePicUrl = profilePicUrl;
            //     return chat;
            //   }));

            // for (const chat of chats) {
            //     const contact = await chat.getContact();
            //     const profilePicUrl = await contact.getProfilePicUrl();
            //     //const profilePicUrl = await client.getProfilePicUrl(contactId);

            //     // Use the profile picture URL as needed
            //     console.log(profilePicUrl);
            //   }
            //  let chat = chats[0];
            // // let chatid = chat.id._serialized;
            // // let msg = await client.getChatById(chatid);
            // const searchOptions = { limit: 10 };
            // const messages = await chat.fetchMessages(searchOptions);
            // console.log(messages);
            console.log("status = ", status);
            io.sockets.emit("allChats", chats);
            return true;
        }
    } catch (err)
    {
        console.log(err.message);
        return false;
    }
}

const createWhatsappSession = () => {
    const socket = socketObject;
    const client = new Client({
        puppeteer: {
            headless: true,
        },
        authStrategy: new LocalAuth({
            clientId: clientId,
        })
    });

    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        //socket.emit('qr', qr);
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        io.sockets.emit("ready", "client is ready");
        clientObject[clientId] = client;
    });

    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
    });

    client.on('auth_failure', msg => {
        // Fired if session restore was unsuccessful
        console.error('AUTHENTICATION FAILURE', msg);
    });

    client.on('message', async msg => {
        io.sockets.emit("message", msg);
        WAGetChats();
    });

    client.initialize();
}

createWhatsappSession();
