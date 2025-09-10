<<<<<<< HEAD


## 🔐 Role-Based Authentication and Authorization

---

### 🔑 1. **Authentication**

**Authentication** is the process of **verifying who a user is**.

* Example: A user logs in with a username and password.
* If the credentials match, the system recognizes the user’s identity.

---

### 🛡️ 2. **Authorization**

**Authorization** determines **what a user is allowed to do** after they are authenticated.

* Based on the **user’s role**, access is granted or denied to specific parts of the system.
* Common roles:

  * `Admin`: Full access
  * `Editor`: Can modify content
  * `Viewer`: Read-only access

---

### 🔁 How It Works Together

1. **User logs in** → Authentication
2. System checks user's **role** (from DB or token)
3. User gets access **only to what their role allows** → Authorization

---

### 🧱 Example

```json
User: {
  "username": "jane_doe",
  "role": "editor"
}
```

In the system:

* `editor` can:

  * ✅ Edit posts
  * ❌ Delete users
  * ✅ View dashboard

---

### 🧩 Why Use RBAC?

* **Security**: Limits access to sensitive operations.
* **Scalability**: Easy to manage permissions across many users.
* **Maintainability**: Changes in access control only require role updates.

---


### 🛠 Common Technologies That Support RBAC

* **JWT (JSON Web Tokens)** → Store role claims
* **OAuth2** → Provide role/permission scopes
* **Frameworks**:
  * Node.js with Passport.js
=======
# Role_Based_Auth
Role-Based Authentication and Authorization (RBAC) is a security approach used in software systems to control access based on a user’s identity (authentication) and assigned role (authorization).
>>>>>>> 45c3b376e5af0abac267f42f9129633ea7906750
