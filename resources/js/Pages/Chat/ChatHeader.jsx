import { useContext } from "react";
import ChatContext from "../context";

export default function ChatHeader() {
    const context = useContext(ChatContext);

    let displayContact = context.activeChat.activeName;
    // let displayContact = "Loading..";
    try {
        //console.log("activecontact", context.activeContact);
        if(context.activeChat.activeContact != null && Object.keys(context.activeChat.activeContact).length > 1) {
            if(context.activeChat.activeContact.isGroup) {
                //displayContact = context.activeContact?.pushname;
                displayContact = context.activeChat.activeContact?.name;
            } else if(context.activeChat.activeContact?.name != null) {
                displayContact = context.activeChat.activeContact?.name;
            } else {
                displayContact = context.activeChat.activeContact?.number +
                (context.activeChat.activeContact?.pushname ? " ~ " + context.activeChat.activeContact?.pushname : "");
            }
        }
    } catch (err) {
        console.log(err);
    }

    let profilePic = null;
    if(context.activeChat.activeContact != null && context.activeChat.activeContact.hasOwnProperty('profilePic')) {
        profilePic = context.activeChat.activeContact.profilePic;
    }

    return (
        <div className="header">
            <div className="img-text">
            {/* {profilePic != null && */}
                <div className="user-img">
                    <img
                    className="dp"
                    src={profilePic}
                    alt=""
                    />
                </div>
            {/* } */}

            <h4>
                { displayContact }
                <br />
                <span>Online</span>
            </h4>
            </div>
            <div className="nav-icons">
            <li>
                <i className="fa-solid fa-magnifying-glass" />
            </li>
            <li>
                <i className="fa-solid fa-ellipsis-vertical" />
            </li>
            </div>
        </div>
    );
}
