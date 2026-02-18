# Tutorial 3: Database Integration

## Overview

Integrate your FreeLang application with a database using the `@freelang/orm` library.

**Time**: 35 minutes
**Difficulty**: Intermediate
**Skills**: ORM, migrations, queries, transactions

---

## Step 1: Setup

```bash
mkdir my-app-db
cd my-app-db
freelang build --init

# Install database library
kpm install @freelang/orm
```

---

## Step 2: Database Configuration

**`.env`**

```env
DATABASE_URL=postgres://user:password@localhost:5432/mydb
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=5000
```

**`src/config/database.free`**

```freelang
import orm from "@freelang/orm"

fn getDatabase() {
  const url = process.env.DATABASE_URL || "sqlite:./db.sqlite"
  const poolSize = parseInt(process.env.DATABASE_POOL_SIZE) || 5

  return orm.connect({
    url: url,
    pool: {
      max: poolSize,
      timeout: parseInt(process.env.DATABASE_TIMEOUT) || 5000
    },
    logging: process.env.NODE_ENV === "development"
  })
}

export { getDatabase }
```

---

## Step 3: Define Models

**`src/models/user.free`**

```freelang
import orm from "@freelang/orm"

struct User {
  id: number,
  email: string,
  name: string,
  age: number,
  created_at: string,
  updated_at: string
}

const UserModel = orm.define("users", {
  id: { type: "integer", primaryKey: true, autoIncrement: true },
  email: { type: "string", unique: true, notNull: true },
  name: { type: "string", notNull: true },
  age: { type: "integer" },
  created_at: { type: "timestamp", defaultValue: "now()" },
  updated_at: { type: "timestamp", defaultValue: "now()" }
})

export { UserModel }
```

**`src/models/post.free`**

```freelang
import orm from "@freelang/orm"
import { UserModel } from "./user.free"

struct Post {
  id: number,
  title: string,
  content: string,
  user_id: number,
  created_at: string
}

const PostModel = orm.define("posts", {
  id: { type: "integer", primaryKey: true, autoIncrement: true },
  title: { type: "string", notNull: true },
  content: { type: "text" },
  user_id: { type: "integer", notNull: true },
  created_at: { type: "timestamp", defaultValue: "now()" }
})

// Define relationship
PostModel.belongsTo(UserModel, { foreignKey: "user_id" })
UserModel.hasMany(PostModel, { foreignKey: "user_id" })

export { PostModel }
```

---

## Step 4: Migrations

**`src/migrations/001-initial-schema.free`**

```freelang
import orm from "@freelang/orm"

fn up(db) {
  // Create users table
  db.createTable("users", {
    id: { type: "integer", primaryKey: true, autoIncrement: true },
    email: { type: "string", unique: true, notNull: true },
    name: { type: "string", notNull: true },
    age: { type: "integer" },
    created_at: { type: "timestamp", defaultValue: "now()" },
    updated_at: { type: "timestamp", defaultValue: "now()" }
  })

  // Create posts table
  db.createTable("posts", {
    id: { type: "integer", primaryKey: true, autoIncrement: true },
    title: { type: "string", notNull: true },
    content: { type: "text" },
    user_id: { type: "integer", notNull: true },
    created_at: { type: "timestamp", defaultValue: "now()" }
  })

  // Create index on user_id
  db.addIndex("posts", ["user_id"])

  console.log("✓ Created users and posts tables")
}

fn down(db) {
  db.dropTable("posts")
  db.dropTable("users")
  console.log("✓ Dropped tables")
}

export { up, down }
```

---

## Step 5: Repository Pattern

**`src/repositories/user-repository.free`**

```freelang
import { UserModel } from "../models/user.free"

fn createUser(data) {
  return UserModel.create({
    email: data.email,
    name: data.name,
    age: data.age
  })
}

fn findUserById(id) {
  return UserModel.findByPk(id)
}

fn findUserByEmail(email) {
  return UserModel.findOne({ where: { email: email } })
}

fn getAllUsers() {
  return UserModel.findAll({
    order: [["created_at", "DESC"]]
  })
}

fn updateUser(id, data) {
  return UserModel.update(data, {
    where: { id: id }
  })
}

fn deleteUser(id) {
  return UserModel.destroy({
    where: { id: id }
  })
}

fn findUsersWithPosts() {
  return UserModel.findAll({
    include: ["posts"]
  })
}

export {
  createUser,
  findUserById,
  findUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
  findUsersWithPosts
}
```

---

## Step 6: Use in API Routes

**`src/routes/users.free`**

```freelang
import http from "@freelang/http"
import {
  createUser,
  findUserById,
  findUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser
} from "../repositories/user-repository.free"

fn setupUserRoutes(app, db) {
  // GET /api/users
  app.get("/api/users", fn(req, res) {
    try {
      const users = getAllUsers()
      res.json({
        success: true,
        data: users,
        count: users.length
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      })
    }
  })

  // GET /api/users/:id
  app.get("/api/users/:id", fn(req, res) {
    try {
      const user = findUserById(req.params.id)
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        })
      }
      res.json({ success: true, data: user })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // POST /api/users
  app.post("/api/users", fn(req, res) {
    try {
      const { email, name, age } = req.body

      // Validate
      if (!email || !name) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields"
        })
      }

      // Check if email exists
      const existing = findUserByEmail(email)
      if (existing) {
        return res.status(409).json({
          success: false,
          error: "Email already exists"
        })
      }

      const user = createUser({ email, name, age })
      res.status(201).json({
        success: true,
        data: user
      })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // PUT /api/users/:id
  app.put("/api/users/:id", fn(req, res) {
    try {
      const id = req.params.id
      const user = findUserById(id)

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        })
      }

      updateUser(id, req.body)
      res.json({ success: true, message: "User updated" })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // DELETE /api/users/:id
  app.delete("/api/users/:id", fn(req, res) {
    try {
      const id = req.params.id
      deleteUser(id)
      res.json({ success: true, message: "User deleted" })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  })
}

export { setupUserRoutes }
```

---

## Step 7: Transactions

**`src/services/user-service.free`**

```freelang
import { getDatabase } from "../config/database.free"

fn transferUserData(fromUserId, toUserId) {
  const db = getDatabase()

  return db.transaction(fn(trx) {
    // Move all posts from one user to another
    const posts = PostModel.findAll({
      where: { user_id: fromUserId }
    })

    for (const post of posts) {
      post.user_id = toUserId
      post.save()
    }

    // Delete original user
    UserModel.destroy({
      where: { id: fromUserId }
    })

    return {
      success: true,
      postsTransferred: posts.length
    }
  })
}

export { transferUserData }
```

---

## Step 8: Testing Database Operations

**`src/tests/user.test.free`**

```freelang
import { test, expect, beforeEach, afterEach } from "@freelang/test"
import { getDatabase } from "../config/database.free"
import { createUser, findUserById, deleteUser } from "../repositories/user-repository.free"

let db

beforeEach(fn() {
  db = getDatabase()
  db.sync({ force: true })  // Reset for testing
})

afterEach(fn() {
  db.close()
})

test("Should create a user", fn() {
  const user = createUser({
    email: "test@example.com",
    name: "Test User",
    age: 25
  })

  expect(user.id).toBeDefined()
  expect(user.email).toBe("test@example.com")
  expect(user.name).toBe("Test User")
})

test("Should find user by id", fn() {
  const created = createUser({
    email: "find@example.com",
    name: "Find User"
  })

  const found = findUserById(created.id)
  expect(found.id).toBe(created.id)
  expect(found.email).toBe("find@example.com")
})

test("Should delete user", fn() {
  const user = createUser({
    email: "delete@example.com",
    name: "Delete User"
  })

  deleteUser(user.id)
  const found = findUserById(user.id)
  expect(found).toBeNull()
})
```

---

## Step 9: Run Migrations and Test

```bash
# Build
freelang build

# Run migrations
freelang run src/migrations/001-initial-schema.free

# Run tests
freelang test

# Start server
PORT=3000 freelang run src/main.free
```

---

## Summary

You've integrated a database with:
- ✅ ORM models and relationships
- ✅ Migrations
- ✅ Repository pattern
- ✅ API routes with database operations
- ✅ Transaction support
- ✅ Comprehensive testing

**Next Steps:**
- Add caching layer
- Implement pagination
- Add query filtering
- Set up backup strategies

