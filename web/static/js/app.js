// import { Socket } from "phoenix";

// let socket = new Socket("/ws")
// socket.connect()
// let chan = socket.chan("topic:subtopic", {})
// chan.join().receive("ok", chan => {
//   console.log("Success!")
// })

let message = "This is coming from webpack!";
console.info(message);

import { logTestImport } from 'testing';
logTestImport();
