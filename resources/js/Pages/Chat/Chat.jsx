import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatContainer from "./ChatContainer";
import Provider from "./Contexts/ChatContext";
import { Head } from "@inertiajs/react";
import ChatInput from "./ChatInput";


export default function Chat() {

    return (
        <Provider>
            <Head>
                <title>Whatsapp Clone</title>
            </Head>
            <div className="background-green" />

            <div className="main-container">
                <div className="left-container">
                {/*header */}
                <div className="header">
                    <div className="user-img">
                    <img
                        className="dp"
                        src="https://www.codewithfaraz.com/InstaPic.png"
                        alt=""
                    />
                    </div>
                    <div className="nav-icons">
                    <li>
                        <i className="fa-solid fa-users" />
                    </li>
                    <li>
                        <i className="fa-solid fa-message"></i>
                    </li>
                    <li>
                        <i className="fa-solid fa-ellipsis-vertical" />
                    </li>
                    </div>
                </div>
                {/*notification */}
                <div className="notif-box">
                    <i className="fa-solid fa-bell-slash" />
                    <div className="notif-text">
                    <p>Get Notified of New Messages</p>
                    <a href="#">Turn on Desktop Notifications ›</a>
                    </div>
                    <i className="fa-solid fa-xmark" />
                </div>
                {/*search-container */}
                <div className="search-container">
                    <div className="input">
                    <i className="fa-solid fa-magnifying-glass" />
                    <input type="text" placeholder="Search or start new chat   " />
                    </div>
                    <i className="fa-sharp fa-solid fa-bars-filter" />
                </div>
                {/*chats */}
                <ChatList />
                </div>
                <div className="right-container">
                {/*header */}
                <div className="header">
                    <div className="img-text">
                    <div className="user-img">
                        <img
                        className="dp"
                        src="https://images.pexels.com/photos/2474307/pexels-photo-2474307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt=""
                        />
                    </div>
                    <h4>
                        Leo
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
                {/*chat-container */}
                <ChatContainer />
                {/*input-bottom */}
                <ChatInput />
                </div>
            </div>
        </Provider>

    )
}
