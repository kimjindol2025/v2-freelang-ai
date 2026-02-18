# Tutorial 5: Building a Real-Time Chat Application

## Overview

Create a real-time chat application using WebSockets with user authentication and message history.

**Time**: 40 minutes
**Difficulty**: Intermediate-Advanced
**Skills**: WebSockets, real-time messaging, session management, event handling

---

## Step 1: Project Setup

```bash
mkdir realtime-chat
cd realtime-chat
freelang build --init

mkdir -p src/{models,services,handlers,middleware}
mkdir -p client
```

---

## Step 2: Data Models

**`src/models/message.free`**

```freelang
struct Message {
  id: string,
  userId: number,
  username: string,
  content: string,
  timestamp: string,
  room: string
}

fn createMessage(userId, username, content, room) {
  return Message {
    id: generateId(),
    userId: userId,
    username: username,
    content: content,
    timestamp: now(),
    room: room
  }
}

fn generateId() {
  return "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

export { Message, createMessage }
```

**`src/models/user.free`**

```freelang
struct User {
  id: number,
  username: string,
  status: string,  // online, offline, away
  room: string
}

struct Session {
  userId: number,
  token: string,
  username: string,
  createdAt: string,
  lastActive: string
}

export { User, Session }
```

---

## Step 3: Message Storage Service

**`src/services/message-service.free`**

```freelang
import { createMessage } from "../models/message.free"

fn createMessageService() {
  const messageHistory = {}  // room -> messages[]
  const maxHistoryPerRoom = 100

  return {
    addMessage: fn(userId, username, content, room) {
      if (!messageHistory[room]) {
        messageHistory[room] = []
      }

      const message = createMessage(userId, username, content, room)
      messageHistory[room].push(message)

      // Keep only last 100 messages
      if (messageHistory[room].length > maxHistoryPerRoom) {
        messageHistory[room].shift()
      }

      return message
    },

    getHistory: fn(room, limit = 50) {
      const messages = messageHistory[room] || []
      return messages.slice(-limit)
    },

    getRoomMessages: fn(room) {
      return messageHistory[room] || []
    },

    clearRoom: fn(room) {
      delete messageHistory[room]
    }
  }
}

export { createMessageService }
```

---

## Step 4: Room Management

**`src/services/room-service.free`**

```freelang
fn createRoomService() {
  const rooms = {}

  return {
    createRoom: fn(name, description = "") {
      if (rooms[name]) {
        return { success: false, error: "Room already exists" }
      }

      rooms[name] = {
        name: name,
        description: description,
        users: [],
        createdAt: now()
      }

      return { success: true, room: rooms[name] }
    },

    getRooms: fn() {
      return Object.values(rooms)
    },

    getRoom: fn(name) {
      return rooms[name]
    },

    addUserToRoom: fn(roomName, userId, username) {
      const room = rooms[roomName]
      if (!room) {
        return { success: false, error: "Room not found" }
      }

      if (!room.users.find(u => u.id === userId)) {
        room.users.push({
          id: userId,
          username: username,
          joinedAt: now()
        })
      }

      return { success: true, userCount: room.users.length }
    },

    removeUserFromRoom: fn(roomName, userId) {
      const room = rooms[roomName]
      if (room) {
        room.users = room.users.filter(u => u.id !== userId)
      }
    },

    getUsersInRoom: fn(roomName) {
      const room = rooms[roomName]
      return room ? room.users : []
    }
  }
}

export { createRoomService }
```

---

## Step 5: WebSocket Handler

**`src/handlers/websocket-handler.free`**

```freelang
import http from "@freelang/http"
import { createMessageService } from "../services/message-service.free"
import { createRoomService } from "../services/room-service.free"

fn setupWebSocketHandler(app) {
  const messageService = createMessageService()
  const roomService = createRoomService()
  const connections = {}  // userId -> socket

  app.ws("/chat", fn(ws, req) {
    console.log("WebSocket connection established")

    ws.on("message", fn(data) {
      handleMessage(data, ws)
    })

    ws.on("close", fn() {
      handleDisconnect(ws)
    })

    ws.on("error", fn(err) {
      console.error("WebSocket error:", err)
    })
  })

  fn handleMessage(data, ws) {
    try {
      const message = json.parse(data)

      switch (message.type) {
        case "auth":
          handleAuth(message, ws)
          break
        case "join":
          handleJoinRoom(message, ws)
          break
        case "message":
          handleChatMessage(message, ws)
          break
        case "typing":
          handleTyping(message, ws)
          break
        case "leave":
          handleLeaveRoom(message, ws)
          break
        default:
          ws.send(json.stringify({
            type: "error",
            error: "Unknown message type"
          }))
      }
    } catch (err) {
      console.error("Error handling message:", err)
      ws.send(json.stringify({
        type: "error",
        error: "Invalid message format"
      }))
    }
  }

  fn handleAuth(message, ws) {
    ws.userId = message.userId
    ws.username = message.username
    connections[message.userId] = ws

    ws.send(json.stringify({
      type: "auth",
      success: true,
      message: "Authenticated"
    }))
  }

  fn handleJoinRoom(message, ws) {
    const room = message.room
    ws.currentRoom = room

    roomService.addUserToRoom(room, ws.userId, ws.username)

    const users = roomService.getUsersInRoom(room)
    const history = messageService.getHistory(room, 50)

    // Send history to joining user
    ws.send(json.stringify({
      type: "history",
      messages: history
    }))

    // Notify all users in room
    broadcastToRoom(room, {
      type: "user_joined",
      user: ws.username,
      userCount: users.length
    })
  }

  fn handleChatMessage(message, ws) {
    const room = ws.currentRoom
    if (!room) {
      ws.send(json.stringify({
        type: "error",
        error: "Not in a room"
      }))
      return
    }

    const chatMessage = messageService.addMessage(
      ws.userId,
      ws.username,
      message.content,
      room
    )

    broadcastToRoom(room, {
      type: "message",
      message: chatMessage
    })
  }

  fn handleTyping(message, ws) {
    const room = ws.currentRoom
    broadcastToRoom(room, {
      type: "typing",
      user: ws.username
    })
  }

  fn handleLeaveRoom(message, ws) {
    const room = ws.currentRoom
    roomService.removeUserFromRoom(room, ws.userId)

    const users = roomService.getUsersInRoom(room)

    broadcastToRoom(room, {
      type: "user_left",
      user: ws.username,
      userCount: users.length
    })
  }

  fn handleDisconnect(ws) {
    if (ws.currentRoom) {
      roomService.removeUserFromRoom(ws.currentRoom, ws.userId)

      broadcastToRoom(ws.currentRoom, {
        type: "user_disconnected",
        user: ws.username
      })
    }

    delete connections[ws.userId]
    console.log(`User ${ws.username} disconnected`)
  }

  fn broadcastToRoom(room, message) {
    const users = roomService.getUsersInRoom(room)
    const payload = json.stringify(message)

    for (const user of users) {
      const socket = connections[user.id]
      if (socket) {
        socket.send(payload)
      }
    }
  }

  return {
    getConnections: fn() { return connections },
    getRooms: fn() { return roomService.getRooms() },
    getMessageService: fn() { return messageService }
  }
}

export { setupWebSocketHandler }
```

---

## Step 6: REST API Routes

**`src/routes/chat-routes.free`**

```freelang
import http from "@freelang/http"
import { setupWebSocketHandler } from "../handlers/websocket-handler.free"

fn setupChatRoutes(app) {
  const wsHandler = setupWebSocketHandler(app)

  // GET /api/chat/rooms
  app.get("/api/chat/rooms", fn(req, res) {
    const rooms = wsHandler.getRooms()
    res.json({
      success: true,
      rooms: rooms,
      count: rooms.length
    })
  })

  // GET /api/chat/rooms/:name/users
  app.get("/api/chat/rooms/:name/users", fn(req, res) {
    const roomService = wsHandler.getRooms()
    const room = roomService.find(r => r.name === req.params.name)

    if (!room) {
      return res.status(404).json({
        success: false,
        error: "Room not found"
      })
    }

    res.json({
      success: true,
      room: room.name,
      users: room.users,
      userCount: room.users.length
    })
  })

  // GET /api/chat/rooms/:name/history
  app.get("/api/chat/rooms/:name/history", fn(req, res) {
    const messageService = wsHandler.getMessageService()
    const messages = messageService.getHistory(req.params.name, 100)

    res.json({
      success: true,
      room: req.params.name,
      messages: messages,
      count: messages.length
    })
  })

  // POST /api/chat/rooms
  app.post("/api/chat/rooms", fn(req, res) {
    const name = req.body.name
    const description = req.body.description

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Room name required"
      })
    }

    const result = roomService.createRoom(name, description)

    if (!result.success) {
      return res.status(409).json({
        success: false,
        error: result.error
      })
    }

    res.status(201).json({
      success: true,
      room: result.room
    })
  })
}

export { setupChatRoutes }
```

---

## Step 7: Server Setup

**`src/server.free`**

```freelang
import http from "@freelang/http"
import { setupChatRoutes } from "./routes/chat-routes.free"

fn createChatServer(port) {
  const app = http.createServer()

  // Middleware
  app.use(fn(req, res, next) {
    console.log(`${req.method} ${req.path}`)
    next()
  })

  // CORS
  app.use(fn(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
  })

  // Routes
  setupChatRoutes(app)

  // Health check
  app.get("/health", fn(req, res) {
    res.json({
      status: "ok",
      service: "chat-server",
      timestamp: now()
    })
  })

  // Serve frontend
  app.use(express.static("client"))

  app.listen(port, fn() {
    console.log(`Chat server running on http://localhost:${port}`)
  })

  return app
}

export { createChatServer }
```

---

## Step 8: Frontend (HTML/JavaScript)

**`client/index.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <title>FreeLang Chat</title>
  <style>
    body { font-family: Arial; margin: 0; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .chat-area { display: flex; height: 500px; gap: 20px; }
    .sidebar { width: 200px; background: white; padding: 15px; border-radius: 8px; }
    .messages { flex: 1; background: white; padding: 15px; border-radius: 8px; overflow-y: auto; }
    .input-area { flex: 1; background: white; padding: 15px; border-radius: 8px; }
    .message { margin: 10px 0; padding: 8px; background: #f0f0f0; border-radius: 4px; }
    .message.mine { background: #007bff; color: white; }
    input { width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <div class="container">
    <h1>FreeLang Chat</h1>
    <div class="chat-area">
      <div class="sidebar">
        <h3>Rooms</h3>
        <div id="rooms"></div>
        <h3>Users</h3>
        <div id="users"></div>
      </div>
      <div class="messages" id="messages"></div>
      <div class="input-area">
        <input id="message-input" type="text" placeholder="Type message..." />
        <button onclick="sendMessage()">Send</button>
      </div>
    </div>
  </div>

  <script>
    const ws = new WebSocket("ws://localhost:3000/chat");
    let userId = 1;
    let username = "User" + userId;
    let currentRoom = "general";

    ws.onopen = () => {
      console.log("Connected");
      ws.send(JSON.stringify({
        type: "auth",
        userId: userId,
        username: username
      }));
      joinRoom("general");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    };

    function joinRoom(room) {
      currentRoom = room;
      ws.send(JSON.stringify({
        type: "join",
        room: room
      }));
    }

    function sendMessage() {
      const input = document.getElementById("message-input");
      if (input.value.trim()) {
        ws.send(JSON.stringify({
          type: "message",
          content: input.value
        }));
        input.value = "";
      }
    }

    function handleMessage(msg) {
      if (msg.type === "message") {
        const messagesDiv = document.getElementById("messages");
        const div = document.createElement("div");
        div.className = "message" + (msg.message.userId === userId ? " mine" : "");
        div.textContent = msg.message.username + ": " + msg.message.content;
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }
  </script>
</body>
</html>
```

---

## Step 9: Run the Application

```bash
# Build
freelang build

# Start server
PORT=3000 freelang run src/main.free

# Open browser
# Navigate to http://localhost:3000
```

---

## Summary

You've built a real-time chat application with:
- ✅ WebSocket connections
- ✅ Room management
- ✅ Message history
- ✅ User presence
- ✅ Real-time notifications
- ✅ REST API
- ✅ Frontend UI

**Next Steps:**
- Add persistent storage
- Implement user authentication
- Add emoji support
- Build mobile app
- Add video chat

