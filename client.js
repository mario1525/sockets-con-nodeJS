const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const connect = (host, port) => {
  console.log(`conecctin to ${host}:${port}`);
  const END = "END";

  const socket = new Socket();
  socket.connect({ host, port });
  socket.setEncoding("utf-8");

  socket.on("connect", () => {
    console.log("connected");

    readline.question("choose your username:", (usermane) => {
      socket.write(usermane);
      console.log(`Type any message to gend it, type ${END} to finish `);
    });
    readline.on("line", (mensage) => {
      socket.write(mensage);
      if (mensage === END) {
        console.log("disconected");
        socket.end();
        process.exit(0);
      }
    });
    socket.on("data", (data) => {
      console.log(data);    
    });
  });

  socket.on("error", (err) => error(err.message));
};

const main = () => {
  if (process.argv.length !== 4) {
    error(`usage: node ${__filename} port host `);
  }

  let [, , host, port] = process.argv;
  if (isNaN(port)) {
    error(`ìnvalid port ${port}`);
  }
  port = Number(port);
  console.log(`${host}:${port}`);
  connect(host, port);
};

if (require.main === module) {
  main();
}
