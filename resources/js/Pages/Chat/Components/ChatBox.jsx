import { timeConverter } from "../functions";
import { Str } from '@supercharge/strings'

export default function ChatBox({chat}) {
    let lastMessage = "";
    if(chat.hasOwnProperty("archived") && chat.archived) {
        lastMessage = "archived";
    } else if(chat.hasOwnProperty("lastMessage")) {
        lastMessage = chat.lastMessage.body;
    }

    //console.log(chat.id._serialized, chat.name);
    return (
        <>
          {/* <div className="img-box">
            <img
              className="img-cover"
              src={chat.profilePicUrl}
              alt=""
            />
          </div> */}
          <div className="chat-details">
            <div className="text-head">
              <h4 className="text-xs">{chat.name}</h4>
              <p className={"time " + (chat.unreadCount > 0 && 'unread')}>{timeConverter(chat.timestamp)}</p>
            </div>
            <div className="text-message whitespace-nowrap">
              <p>{Str(lastMessage).limit(26, '...').get()}</p>
              { chat.unreadCount > 0 && (
                <b>{chat.unreadCount}</b>
              )}
            </div>
          </div>
        </>
    );
}
