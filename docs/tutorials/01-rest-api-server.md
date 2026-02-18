# Tutorial 1: Building a REST API Server

## Overview

Learn how to build a production-ready REST API server using FreeLang and the `@freelang/http` library.

**Time**: 30 minutes
**Difficulty**: Beginner
**Skills**: HTTP routing, JSON responses, error handling

---

## Prerequisites

```bash
# Install FreeLang
npm install -g @freelang/cli

# Create project
mkdir my-api
cd my-api
freelang build --init
```

---

## Step 1: Create Project Structure

```bash
mkdir -p src/{routes,middleware,utils,models}
touch src/main.free
touch src/server.free
touch freelang.config.json
```

---

## Step 2: Define Models

**`src/models/user.free`**

```freelang
struct User {
  id: number,
  name: string,
  email: string,
  created_at: string
}

fn newUser(id, name, email) {
  User {
    id: id,
    name: name,
    email: email,
    created_at: now()
  }
}
```

---

## Step 3: Create Middleware

**`src/middleware/auth.free`**

```freelang
fn authenticateToken(req) {
  const auth = req.headers["authorization"]
  if (!auth) {
    return { ok: false, error: "Missing token" }
  }

  const token = auth.split(" ")[1]
  if (!token) {
    return { ok: false, error: "Invalid token format" }
  }

  // In production: verify JWT
  return { ok: true, token: token }
}

fn requireAuth(req, res) {
  const auth = authenticateToken(req)
  if (!auth.ok) {
    return res.status(401).json({ error: auth.error })
  }
  return { ok: true }
}
```

**`src/middleware/logger.free`**

```freelang
fn logRequest(req, res) {
  console.log(`${req.method} ${req.path} - ${now()}`)
}
```

---

## Step 4: Create Routes

**`src/routes/users.free`**

```freelang
fn getUsersRoute(http) {
  // GET /api/users
  http.get("/api/users", fn(req, res) {
    const users = [
      newUser(1, "Alice", "alice@example.com"),
      newUser(2, "Bob", "bob@example.com"),
      newUser(3, "Charlie", "charlie@example.com")
    ]

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    })
  })

  // GET /api/users/:id
  http.get("/api/users/:id", fn(req, res) {
    const id = parseInt(req.params.id)

    if (id < 1 || id > 3) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      })
    }

    const user = newUser(id, `User${id}`, `user${id}@example.com`)
    res.status(200).json({
      success: true,
      data: user
    })
  })

  // POST /api/users
  http.post("/api/users", fn(req, res) {
    const body = req.body

    if (!body.name || !body.email) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email"
      })
    }

    const user = newUser(4, body.name, body.email)
    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully"
    })
  })

  // DELETE /api/users/:id
  http.delete("/api/users/:id", fn(req, res) {
    const id = parseInt(req.params.id)
    res.status(200).json({
      success: true,
      message: `User ${id} deleted`,
      id: id
    })
  })
}
```

---

## Step 5: Build Server

**`src/server.free`**

```freelang
import http from "@freelang/http"

fn createServer(port) {
  const app = http.createServer()

  // Middleware
  app.use(fn(req, res) {
    logRequest(req, res)
  })

  // Auth middleware for protected routes
  app.use("/api/admin", fn(req, res) {
    const auth = requireAuth(req, res)
    if (!auth.ok) return
  })

  // Routes
  getUsersRoute(app)

  // Health check
  app.get("/health", fn(req, res) {
    res.status(200).json({
      status: "ok",
      timestamp: now(),
      uptime: process.uptime()
    })
  })

  // Error handler
  app.use(fn(err, req, res) {
    console.error(`Error: ${err}`)
    res.status(500).json({
      success: false,
      error: "Internal server error"
    })
  })

  app.listen(port, fn() {
    console.log(`Server running on port ${port}`)
  })

  return app
}

export { createServer }
```

---

## Step 6: Main Entry Point

**`src/main.free`**

```freelang
import { createServer } from "./server.free"

fn main() {
  const port = parseInt(process.env.PORT) || 3000
  const server = createServer(port)

  console.log(`API Server started on http://localhost:${port}`)
  console.log(`Swagger UI: http://localhost:${port}/api/docs`)
  console.log(`Health: http://localhost:${port}/health`)
}

main()
```

---

## Step 7: Configuration

**`freelang.config.json`**

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "description": "REST API Server",
  "main": "src/main.free",
  "scripts": {
    "start": "freelang run src/main.free",
    "build": "freelang build",
    "test": "freelang test",
    "dev": "freelang build --watch"
  },
  "dependencies": {
    "@freelang/http": "^1.0.0",
    "@freelang/security": "^1.0.0"
  },
  "devDependencies": {
    "@freelang/test": "^1.0.0"
  },
  "compiler": {
    "optimize": 1,
    "typeCheck": true
  }
}
```

---

## Step 8: Testing

**`src/main.test.free`**

```freelang
import { test, expect } from "@freelang/test"
import { createServer } from "./server.free"

test("GET /health returns 200", fn() {
  const server = createServer(3001)
  const response = http.get("http://localhost:3001/health")
  expect(response.status).toBe(200)
})

test("GET /api/users returns users", fn() {
  const response = http.get("http://localhost:3001/api/users")
  expect(response.status).toBe(200)
  expect(response.body.success).toBe(true)
  expect(response.body.count).toBeGreaterThan(0)
})

test("POST /api/users creates user", fn() {
  const response = http.post("http://localhost:3001/api/users", {
    name: "David",
    email: "david@example.com"
  })
  expect(response.status).toBe(201)
  expect(response.body.data.name).toBe("David")
})

test("GET /api/users/999 returns 404", fn() {
  const response = http.get("http://localhost:3001/api/users/999")
  expect(response.status).toBe(404)
})
```

---

## Step 9: Run the Server

```bash
# Build
freelang build

# Start
PORT=3000 freelang run src/main.free

# In another terminal, test
curl http://localhost:3000/health
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Eve","email":"eve@example.com"}'
```

---

## Step 10: Production Deployment

**`ecosystem.config.js`**

```javascript
module.exports = {
  apps: [{
    name: 'api',
    script: './dist/main.free',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

```bash
# Build for production
freelang build --production

# Deploy with PM2
pm2 start ecosystem.config.js
```

---

## Summary

You've successfully built a REST API server with:
- ✅ HTTP routing (GET, POST, DELETE)
- ✅ JSON request/response handling
- ✅ Error handling
- ✅ Authentication middleware
- ✅ Comprehensive testing
- ✅ Production deployment

**Next Steps:**
- Add database integration (Tutorial 3)
- Implement authentication with JWT
- Add request validation
- Scale with load balancing

---

## Resources

- [HTTP API Reference](../api/code-generator.md)
- [Quick Reference](../QUICK-REFERENCE.md)
- [API Workflow Guide](../getting-started/api-workflow.md)

