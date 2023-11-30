import React, { useEffect, useState } from "react";
import ChatContext from "../../context";

const provider = ({ socket, children }) => {
    const [messages, setMessages] = useState([]);   //active window messages
    const [chats, setChats] = useState({});     //chat lists on left panel
    //const [activeChatId, setActiveChatId] = useState(null);
    //const [activeContact, setActiveContact] = useState(null);

    const [activeChat, setActiveChat] = useState({
        activeChatId: null,
        activeContact: null,
        activeName: null,
    });

    const handleClickContact = (chatId, chatName) => {
        if(chatId != activeChat.activeChatId) {

            //setActiveChatId(chatId);
            setActiveChat({ 
                ...activeChat, 
                activeChatId: chatId,
                activeName: chatName,
            });
            
            socket.emit('fetchMessages', chatId);
        }
    }

    const handleSendMessage = (message) => {
        console.log("send message", message);
        socket.emit('sendMessage', {chatId: activeChat.activeChatId, message: message});
        setTimeout(() => {
            socket.emit('fetchMessages', activeChat.activeChatId);
        }, 500);
    }



    useEffect(()=> {

        function onAllChats(chats) {
            //console.log(chats);
            setChats(chats);
        }

        function onActiveWindowMsg({parse_messages, contact, chatid}) {
            console.log(chatid, activeChat.activeChatId);
            if(chatid == activeChat.activeChatId) {

                console.log(parse_messages);
                //setActiveContact(contact);
                setActiveChat({ ...activeChat, activeContact: contact });
                let messages = parse_messages;
                setMessages(messages);
            }
        }

        function onMessage(message) {

            console.log(message, activeChat.activeChatId);
            if(message.from == activeChat.activeChatId || message.to == activeChat.activeChatId) {
                setTimeout(() => {
                    socket.emit('fetchMessages', activeChat.activeChatId);
                }, 500);
            }

            //setLastMessage(message);
        }

        console.log("use effect");
        socket.on('allChats', onAllChats);
        socket.on('activeWindowMsg', onActiveWindowMsg);
        socket.on('message', onMessage);

        return () => {
            socket.off('allChats');
            socket.off('activeWindowMsg');
            socket.off('message');
        }

    }, [activeChat.activeChatId]);

    return (
        <ChatContext.Provider
            value={{
                messages: messages,
                chats: chats,
                handleClickContact: handleClickContact,
                handleSendMessage: handleSendMessage,
                //lastMessage: lastMessage,
                //activeChatId: activeChat.activeChatId,
                //activeContact: activeChat.activeContact,
                activeChat: activeChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default provider;
