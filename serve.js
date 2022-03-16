const { Server } = require("net");

const host = "0.0.0.0";
const END = "END";

const connections = new Map();

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const sendMessage = (message, origin) => {
  // mandar a todos menos a origin el message
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message);
    }
  }
};

const listen = (port) => {
  const server = new Server();
  server.on("connection", (socket) => {
    const remotesocket = `${socket.remoteAddress}:${socket.remotePort}`;

    console.log(`new connection from ${remotesocket}`);
    socket.setEncoding("utf-8");

    socket.on("data", (message) => {
      if (!connections.has(socket)) {
        console.log(`username ${message} set for connections ${remotesocket}`);
        connections.set(socket, message);
      } else if (message === END) {
        console.log(`conecction whit ${remotesocket}closed`);
        connections.delete(socket);
        socket.end();
      } else {
        // enviar el mensage a los clientes
        const fullMessage = `[${connections.get(socket)}]:${message}`;
        console.log(`${remotesocket} -> ${fullMessage}`);
        sendMessage(fullMessage, socket);
      }
    });

    socket.on("error", (err) => error(err.message));
  });

  server.listen({ port, host }, () => {
    console.log(`listening on port ${port}`);
  });
  server.on("error", (err) => error(err.message));
};

const main = () => {
  if (process.argv.length !== 3) {
    error(`usage: node ${__filename} port `);
  }
  let port = process.argv[2];
  if (isNaN(port)) {
    error(`invalid port ${port}`);
  }
  port = Number(port);

  listen(port);
};
if (require.main === module) {
  main();
}
