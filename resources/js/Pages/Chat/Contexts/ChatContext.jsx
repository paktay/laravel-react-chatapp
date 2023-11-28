import React, { useEffect, useState } from "react";
import ChatContext from "../../context";
import { socket } from '../socket';

const provider = ({children}) => {
    const [messages, setMessages] = useState([]);   //active window messages
    const [chats, setChats] = useState({});     //chat lists on left panel
    const [lastMessage, setLastMessage] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);

    useEffect(()=> {
        function onAllChats(chats) {
            console.log(chats);
            setChats(chats);
        }

        function onActiveWindowMsg(messages) {
            console.log(messages);
            setMessages(messages);
        }

        function onMessage(message) {

            console.log(message, activeChatId);
            if(message.from == activeChatId || message.to == activeChatId) {
                setTimeout(() => {
                    socket.emit('fetchMessages', activeChatId);
                }, 500);
            }

            setLastMessage(message);
        }

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
                handleClickContact: (chatId) => {
                    setActiveChatId(chatId);

                    socket.emit('fetchMessages', chatId);
                },
                handleSendMessage: (message) => {
                    console.log("send message", message);
                    socket.emit('sendMessage', {chatId: activeChatId, message: message});
                },
                lastMessage: lastMessage,
                activeChatId: activeChatId,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default provider;
