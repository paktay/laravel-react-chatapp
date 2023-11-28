import { useContext } from "react";
import ChatBox from "./Components/ChatBox";
import ChatContext from "../context";

export default function ChatList ({chats}) {
    const context = useContext(ChatContext);

    function selectChat (chat) {
        context.handleClickContact(chat.id._serialized);
    }

    console.log("chat list rendered");

    return (
        // <ChatContext.Consumer>
        //     {context => (
            <div className="chat-list">
                {
                    context.chats.length > 0 &&
                        context.chats.map((chat, index) =>
                            <div className="chat-box" key={index} onClick={() => selectChat(chat)}>
                                <ChatBox chat={chat} key={index} />
                            </div>
                        )
                }
            </div>
        //     )}
        // </ChatContext.Consumer>
    )
}
