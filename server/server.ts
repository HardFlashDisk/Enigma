import WebSocket from "ws";

const CLIENT_CONNECTED_IN_SAME_TIME = 2
const clients: WebSocket[] = []

const wss = new WebSocket.Server({ port: 8000 });

wss.on('listening', () => {
  console.log('listening')
})

wss.on('connection', (ws: WebSocket) => {
  if(clients.length === CLIENT_CONNECTED_IN_SAME_TIME) {
    ws.close(1000, 'Clients limit reached')
    return
  }

  clients.push(ws)
  console.log('New client connected');

  ws.on('message', (message: any) => {
    const clientToTransfer = clients.find(c => c !== ws)
    clientToTransfer?.send(message.toString())
  });

  ws.on('close', (ws: WebSocket) => {
    console.log('Client disconnected');
    const index = clients.indexOf(ws);
    if (index !== -1) clients.splice(index, 1);
  });
});