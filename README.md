# 🚀 gRPC Full Demo (Node.js)

A complete **gRPC tutorial project** using Node.js showing all four communication patterns:

- Unary RPC
- Server Streaming RPC
- Client Streaming RPC
- Bidirectional Streaming (Real-time Chat)

---

## 📦 Tech Stack

- Node.js
- gRPC (`@grpc/grpc-js`)
- Protocol Buffers (`@grpc/proto-loader`)

---

## 📁 Project Structure

```text
grpc-demo/
│── server.js
│── client.js
│── greeter.proto
│── package.json
│── README.md
```

---

## ⚙️ Installation

### 1. Clone repo
```bash
git clone <repo-url>
cd grpc-demo
```

### 2. Install dependencies
```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

---

## 🧠 Protocol Buffers

### `greeter.proto`

```proto
syntax = "proto3";

package greeter;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloResponse);
  rpc GetNumbers (NumberRequest) returns (stream NumberResponse);
  rpc SumNumbers (stream SumRequest) returns (SumResponse);
  rpc Chat (stream ChatMessage) returns (stream ChatMessage);
}

message HelloRequest {
  string name = 1;
}

message HelloResponse {
  string message = 1;
}

message NumberRequest {
  int32 count = 1;
}

message NumberResponse {
  int32 order = 1;
  int32 number = 2;
}

message SumRequest {
  int32 number = 1;
}

message SumResponse {
  int32 sum = 1;
}

message ChatMessage {
  string user = 1;
  string message = 2;
  string timestamp = 3;
}
```

---

## 🖥️ Run Server

```bash
node server.js
```

### Output:
```text
Server running on 5050
```

---

## 💻 Run Client

```bash
node client.js <username>
```

Example:
```bash
node client.js Vahid
```

---

# 🧪 Features

---

## 1️⃣ Unary RPC — SayHello

### Request
```js
client.SayHello({ name: "Vahid" })
```

### Response
```json
{
  "message": "Hello, Vahid"
}
```

---

## 2️⃣ Server Streaming — GetNumbers

### Request
```js
client.GetNumbers({ count: 5 })
```

### Response Stream
```text
{ order: 1, number: 100 }
{ order: 2, number: 200 }
{ order: 3, number: 300 }
{ order: 4, number: 400 }
{ order: 5, number: 500 }
```

---

## 3️⃣ Client Streaming — SumNumbers

### Request Stream
```js
call.write({ number: 5 });
call.write({ number: 10 });
call.write({ number: 15 });
call.end();
```

### Response
```json
{
  "sum": 30
}
```

---

## 4️⃣ Bidirectional Streaming — Chat 💬

### Start chat
```bash
node client.js Vahid
```

### Example chat

```
[Vahid]: Hello everyone
[Ali]: Hi!
[Sara]: Hey!
```

### Exit chat
```bash
/exit
```

---

# 🔥 gRPC Communication Types

| Type | Description |
|------|------------|
| Unary | 1 request → 1 response |
| Server Streaming | 1 request → stream of responses |
| Client Streaming | stream of requests → 1 response |
| Bidirectional | stream ↔ stream |

---

# 📡 How Chat Works

- Multiple clients connect
- Server stores active clients
- Messages are broadcast to all connected users
- Real-time communication using streams

---

# 🧠 Learning Goals

This project helps you understand:

- Protocol Buffers (.proto design)
- gRPC server setup in Node.js
- Client-server communication
- Streaming APIs
- Real-time chat architecture

---

# 🚀 Run Order

```bash
# Terminal 1
node server.js

# Terminal 2
node client.js Bob

# Terminal 3
node client.js Alice
```

