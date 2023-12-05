const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { profile } = require('console');
require('dotenv').config();

const app = express();
const port = 3000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        //origin: ["http://localhost:8000", "http://192.168.2.123:8000"],
        origin: process.env.CORS_ORIGIN_ALLOWED.split(', '),
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


// send whatsapp message
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

// fetch message lists on active window chat
const WAFetchMessages = async (socket, chatid) => {
    try
    {
        if(socket != null) {
            const client = clientObject[clientId];
            const chat = await client.getChatById(chatid);
            const contact = {};

            const searchOptions = { limit: 100 };
            //const searchOptions = { };
            const messages = await chat.fetchMessages(searchOptions);
            //console.log(socket.id);

            const parse_messages = messages.map((message) => {
                if(message.hasMedia) {
                    return {...message, body: 'media'};
                } else {
                    return message;
                }
            });

            //console.log(parse_messages);
            socket.emit("activeWindowMsg", {parse_messages, contact, chatid});

            chat.getContact().then((contact) => {
                socket.emit("activeWindowMsg", {parse_messages, contact, chatid});
                contact.getProfilePicUrl().then((profilePicture) => {
                    contact.profilePic = profilePicture;
                    socket.emit("activeWindowMsg", {parse_messages, contact, chatid});
                });
            });
                            ;
            // const profilePicture = await contact.getProfilePicUrl();
            // contact.profilePic = profilePicture;

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

// get chat lists on left panel
const WAGetChats = async () => {
    try
    {
        const socket = socketObject;
        if(socket != null) {
            const client = clientObject[clientId];
            const chats = await client.getChats();
            const status = await client.getState();

            io.sockets.emit("allChats", chats);
            return true;
        }
    } catch (err)
    {
        console.log(err.message);
        return false;
    }
}

const updateContact = async (msg) => {
    let contact = await msg.getContact();
    let name = contact.pushname;
    let phone = contact.number;

    fetch(process.env.APP_URL + '/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'name': name,
            'phone': phone,
         })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error sending request:', error));
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
        updateContact(msg);
    });

    client.initialize();
}

createWhatsappSession();
