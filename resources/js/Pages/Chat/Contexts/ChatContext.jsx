import React, { useEffect, useState } from "react";
import ChatContext from "../../context";

const provider = ({ socket, children }) => {
    const [messages, setMessages] = useState([]);   //active window messages
    const [chats, setChats] = useState({});     //chat lists on left panel
    const [activeChatId, setActiveChatId] = useState(null);
    const [activeContact, setActiveContact] = useState(null);

    const handleClickContact = (chatId) => {
        setActiveChatId(chatId);

        socket.emit('fetchMessages', chatId);
    }

    const handleSendMessage = (message) => {
        console.log("send message", message);
        socket.emit('sendMessage', {chatId: activeChatId, message: message});
        setTimeout(() => {
            socket.emit('fetchMessages', activeChatId);
        }, 500);
    }



    useEffect(()=> {

        function onAllChats(chats) {
            //console.log(chats);
            setChats(chats);
        }

        function onActiveWindowMsg({parse_messages, contact}) {
            console.log(contact);
            setActiveContact(contact);
            let messages = parse_messages;
            setMessages(messages);
        }

        function onMessage(message) {

            console.log(message, activeChatId);
            if(message.from == activeChatId || message.to == activeChatId) {
                setTimeout(() => {
                    socket.emit('fetchMessages', activeChatId);
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

    }, [activeChatId]);

    return (
        <ChatContext.Provider
            value={{
                messages: messages,
                chats: chats,
                handleClickContact: handleClickContact,
                handleSendMessage: handleSendMessage,
                //lastMessage: lastMessage,
                activeChatId: activeChatId,
                activeContact: activeContact,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default provider;
