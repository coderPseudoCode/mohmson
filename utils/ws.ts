import WebSocket, { WebSocketServer } from "ws";

declare global {
  var webs: WebSocketServer | undefined;
}

async function CreateWebSocket() {
  const wbs = global.webs ?? new WebSocketServer({ port: 3001 });

  if (!global.webs) global.webs = wbs;

  wbs.on("connection", function (ws) {
    console.log(`Client: ${ws.binaryType} connected`);
  });
}

export default CreateWebSocket;
