import { useContext } from "react";
import ChatContext from "../context";

export default function ChatHeader() {
    const context = useContext(ChatContext);

    let displayContact = "Loading..";
    try {

        if(context.activeContact != null) {
            if(context.activeContact.isGroup) {
                displayContact = context.activeContact.pushname;
            } else if(context.activeContact.name != null) {
                displayContact = context.activeContact.name;
            } else {
                displayContact = context.activeContact.number +
                (context.activeContact.pushname ? " ~ " + context.activeContact.pushname : "");
            }
        }
    } catch (err) {
        console.log(err);
    }

    let profilePic = null;
    if(context.activeContact != null && context.activeContact.hasOwnProperty('profilePic')) {
        profilePic = context.activeContact.profilePic;
    }

    return (
        <div className="header">
            <div className="img-text">
            {profilePic != null &&
                <div className="user-img">
                    <img
                    className="dp"
                    src={profilePic}
                    alt=""
                    />
                </div>
            }

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
