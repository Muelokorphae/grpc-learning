const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { timeStamp } = require("console");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "greeter.proto"); // Make sure this matches your file name

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).greeter;

//Say hello
function sayHello(call, callback) {
  const reply = {
    message: `Hello, ${call.request.name}`,
  };

  callback(null, reply);
}

//Say getNumber
function getNumbers(call) {
  const count = call.request.count;
  let current = 1;
  const interval = setInterval(() => {
    if (current > count) {
      clearInterval(interval);
      call.end();
      return;
    }
    call.write({ order: current, number: current * 100 });
    current++;
  }, 1000);
}

//SumNumber
function sumNumbers(call, callback) {
  let sum = 0;
  call.on("data", (request) => {
    sum += request.number;
  });
  call.on("end", () => {
    callback(null, { sum });
  });
}

//Chat

const clients = [];

function chat(call) {
  clients.push(call);
  console.log("New client connected ...");
  call.on("data", (chatMessage) => {
    console.log(`${chatMessage.user}: ${chatMessage.message}`);
    clients.forEach((client) => {
      if (client != call)
        call.write({
          user: chatMessage.user,
          message: chatMessage.message,
          timestamp: chatMessage.timestamp,
        });
    });
  });
  call.on("end", () => {
    console.log("Client disconnected...");
    clients.splice(clients.indexOf(call), 1);
    call.end();
  });
}

function main() {
  const server = new grpc.Server();

  server.addService(proto.Greeter.service, {
    SayHello: sayHello,
    GetNumbers: getNumbers,
    sumNumbers: sumNumbers,
    Chat: chat,
  });

  server.bindAsync(
    "0.0.0.0:5050",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to bind:", err);
        return;
      }

      console.log(`Server is running on port ${port}...`);

      server.start(); // Required for older versions of @grpc/grpc-js
    },
  );
}

main();
