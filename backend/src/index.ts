import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
    console.log("hiited");
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    if (message.type === 'sender') {
        console.log("sender type")
      senderSocket = ws;
    } else if (message.type === 'receiver') {
        console.log("Receiver Tyep")
      receiverSocket = ws;
    } else if (message.type === 'createOffer') {
      if (ws !== senderSocket) {
        return;
      }
      console.log("offer created")
      receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
    } else if (message.type === 'createAnswer') {
        if (ws !== receiverSocket) {
          return;
        }
        console.log("answer created")
        senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
    } else if (message.type === 'iceCandidate') {
      if (ws === senderSocket) {
          console.log("ice candidate sender")
        receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      } else if (ws === receiverSocket) {
        console.log("ice candiate reciver")
        senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      }
    }
  });
});