import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
//const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
//const URL = 'http://localhost:3000';
//const URL = 'http://192.168.2.123:3000';
const URL = import.meta.env.VITE_WWEB_CLIENT;
//console.log(URL);

export const socket = io(URL);
