import { useState, useContext } from "react"
import ChatContext from "../context";

export default function ChatInput() {
    const [text, setText] = useState("");

    const context = useContext(ChatContext);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          context.handleSendMessage(text);
          setText("");
        }
    }

    //console.log("render chatinput");

    return (
        context.activeChat.activeChatId &&
        <div className="chatbox-input">
            <i className="fa-regular fa-face-grin" />
            <i className="fa-sharp fa-solid fa-paperclip" />
            <input type="text" placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
            <i className="fa-solid fa-microphone" />
        </div>
    )
}
