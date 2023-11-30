import ChatContext from "../context";
import { timeConverter } from "./functions";
import { useRef, useEffect, useContext, useState } from "react";

export default function ChatContainer () {
    const context = useContext(ChatContext);
    const messagesEndRef = useRef(null);

    let origin_messages = context.messages;
    let filtered_messages = origin_messages.filter((msg)=>{
        return msg.type == 'chat' || msg.hasMedia;
    });

    useEffect(()=> {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });

    return (
        // <ChatContext.Consumer>
        //     { context => (
                <div className="chat-container">
                    {
                        //context.messages.length > 0 &&
                        //context.messages.map((message, index) =>
                        filtered_messages.map((message, index) =>
                            (<div className={"message-box break-words " + (message.fromMe ? 'my-message' : 'friend-message')} key={index}>
                            <p className="!text-left">
                                <span className="text-left inline">{message.author}</span>
                                {message.body}
                                <br />
                                <span className="text-right ">{timeConverter(message.timestamp)}</span>
                            </p>
                            </div>
                            )
                        )
                    }
                    {/* {
                        context.lastMessage.from == activeChatId &&
                        (<div className={"message-box break-words " + (context.lastMessage.fromMe ? 'my-message' : 'friend-message')} >
                            <p className="!text-left">
                                <span className="text-left inline">{context.lastMessage.author}</span>
                                {context.lastMessage.body}
                                <br />
                                <span className="text-right ">{timeConverter(context.lastMessage.timestamp)}</span>
                            </p>
                            </div>
                        )
                    } */}
                     <div ref={messagesEndRef} />
                </div>
        //     )}
        // </ChatContext.Consumer>
    )
}
