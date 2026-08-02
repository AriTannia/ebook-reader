<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/open-book--v1.png" alt="Ebook Reader Logo" width="80"/>
</p>

<h1 align="center">Ebook Reader</h1>

<p align="center">
  <b>A complete digital bookstore & reading platform — from browsing to checkout to reading.</b>
</p>

<p align="center">
  <a href="#-what-can-it-do"><strong>Features</strong></a> ·
  <a href="#-how-it-works"><strong>How it Works</strong></a> ·
  <a href="#-architecture"><strong>Architecture</strong></a> ·
  <a href="#-api-reference"><strong>API Docs</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk&logoColor=white" alt="Java 25"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 4.1"/>
  <img src="https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT"/>
</p>

---

## 💡 Why Ebook Reader?

The digital book market is booming — but building a full e-commerce + reading platform from scratch is complex. You need user authentication, a book catalog, a shopping cart, payment processing, digital rights management, and reading progress tracking — all working together seamlessly.

**Ebook Reader** solves this by providing a **production-ready backend API** that handles the entire user journey: from discovering a book, to purchasing it, to reading it — all through clean, well-documented REST APIs.

> Think of it as the **backend engine** for platforms like Google Play Books or Amazon Kindle — handling everything behind the scenes so the frontend can focus on delivering a great reading experience.

---

## ✨ What Can It Do?

### 📚 Book Catalog & Discovery

Manage a rich catalog of ebooks with authors, publishers, categories, and tags. Support advanced filtering and search so readers can find exactly what they're looking for.

- Browse books by category, author, publisher, or tag
- Multi-format support per book (EPUB, PDF, MOBI)
- Book badges (New, Bestseller, etc.) based on sales & ratings
- Detailed book pages with descriptions, covers, and metadata

### 🔐 User Accounts & Security

Secure, stateless authentication system that keeps user data safe while providing a smooth login experience.

- Sign up, sign in, and sign out with email & password
- JWT-based authentication delivered via secure HTTP-only cookies
- Role-based access control — separate **User** and **Admin** privileges
- Password reset via email with secure, time-limited tokens
- Automatic token refresh — users stay logged in seamlessly

### 🛒 Shopping Cart & Checkout

A familiar e-commerce experience — add books to a cart, proceed to checkout, and create an order.

- Add/remove books to a personal shopping cart
- One-click checkout that converts the cart into an order
- Price snapshots at order time (prices are locked in when you buy)
- Automatic order expiration — unpaid orders expire after 15 minutes

### 💳 Payment Processing

> ⚠️ **Note:** Payment integration is currently **simulated (mock)**. VNPay and MoMo flows implement the correct API contracts and webhook handling, but are **not connected to real payment systems**. This is intended for learning and demonstration purposes only.

| Provider | Status | Description |
|---|---|---|
| **VNPay** | 🧪 Mock | Vietnam's leading payment gateway |
| **MoMo** | 🧪 Mock | Popular Vietnamese e-wallet |

- Secure webhook handling (IPN) for asynchronous payment confirmation
- **Idempotent processing** — duplicate payment notifications are safely ignored
- Automatic redirect back to the frontend after payment

### 📖 Digital Library & Reading

After purchase, books appear in the user's **personal library** — ready to read on any device.

- Personal library showing all purchased books
- Favorite books for quick access
- Access control — revoke access for refunded orders
- **Reading progress tracking** — save position, percentage, and status
- Sync reading position across devices

### ⭐ Reviews & Ratings

Let readers share their opinions and help others discover great books.

- 1–5 star rating system with text reviews
- "Helpful" voting on reviews
- Aggregate statistics (average rating, rating distribution)
- Verified purchase enforcement — only buyers can review

### 📁 File & Media Management

Secure file handling for book covers, author avatars, and ebook files using cloud object storage.

- Pre-signed URL uploads — files go directly to cloud storage (never through the API server)
- Support for public assets (covers) and private assets (ebook files)
- Automatic cleanup of orphaned files via background processing

### 📧 Email Notifications

Transactional email system for critical user communications.

- Password reset emails with branded HTML templates
- Reliable delivery via **Outbox Pattern** — emails are never lost, even if the mail server is temporarily down
- Automatic retry with exponential backoff

---

## 🔄 How It Works

A user's typical journey through the platform:

1. **Discover** — Browse the book catalog, filter by category, author, publisher, or tag.
2. **Shop** — Add books to the cart. The price is locked in at the time of checkout.
3. **Pay** — Initiate a payment via VNPay or MoMo. The system handles redirects and webhook confirmation idempotently.
4. **Read** — After payment is confirmed, the book appears in the user's personal library, ready to open. Reading progress is saved and synced across devices.

---

## 🏗 Architecture

### System Overview

The backend follows a **layered architecture** with clear separation of concerns. Each feature is organized as a **vertical slice** — grouping its controller, service, repository, DTOs, and utilities together.

```mermaid
flowchart LR
    Client(["🖥️ Client Applications"])

    Client -- "HTTPS / REST API" --> Security

    subgraph app ["🍃 Spring Boot Application"]
        direction TB
        Security["🔒 Security\nJWT Filter"]
        Controllers["📡 Controllers"]
        Services["⚙️ Services\nBusiness Logic"]

        subgraph infra ["Infrastructure"]
            direction TB
            Repos["🗃️ Repositories\nJPA / SQL"]
            S3["☁️ S3 Storage"]
            Payment["💳 Payment Gateway\nVNPay · MoMo"]
            Scheduler["⏰ Background Jobs"]
            DB[("🐘 PostgreSQL")]
        end

        Security --> Controllers
        Controllers --> Services
        Services --> Repos
        Services --> S3
        Services --> Payment
        Repos --> Scheduler
        Repos --> DB
    end
```

### Feature Modules

Each feature is self-contained with its own controller, service, repository, DTOs, and utilities:

| Module | What It Does | Key Technique |
|---|---|---|
| **Auth** | User registration, login, password reset | JWT + HTTP-only cookies, BCrypt hashing |
| **Book** | Book catalog CRUD, search, filtering | JPA Specifications, MapStruct mapping |
| **Book Format** | Multi-format file management (EPUB, PDF) | S3 pre-signed URLs |
| **Author** | Author profiles & book associations | Many-to-Many relationships |
| **Publisher** | Publisher registry | One-to-Many with books |
| **Category** | Book categorization with slugs | Hierarchical categories, unique slugs |
| **Tag** | Flexible book labeling | UUID-based, Many-to-Many |
| **Review** | User reviews with ratings | Aggregate stats, helpful votes |
| **Cart** | Shopping cart management | Unique constraint per user-book |
| **Order** | Checkout & order lifecycle | Price snapshots, auto-expiration |
| **Payment** | Multi-provider payment processing | Factory pattern, idempotent webhooks |
| **Library** | Digital book ownership | Access status tracking (Active/Revoked/Refunded) |
| **Reading Progress** | Position & progress tracking | Locator-based, percentage tracking |
| **File** | Cloud file upload/delete | Pre-signed S3 URLs, deletion outbox |
| **User** | Profile management, admin CRUD | Role-based access (USER, ADMIN) |

### Engineering Patterns Used

| Pattern | Where It's Used | Why |
|---|---|---|
| **Outbox Pattern** | Email dispatch, File cleanup | Guarantees reliability — operations are never lost even if external services fail |
| **Factory Pattern** | Payment gateways, Book creation | Easy to add new payment providers without changing existing code |
| **Specification Pattern** | Book, Author, Category search | Composable, dynamic query filters without writing custom SQL |
| **Rate Limiting** | Book content access | Prevents abuse of ebook download endpoints (Bucket4j + Caffeine) |
| **Idempotency** | Payment webhooks | Safely handles duplicate notifications from payment providers |
| **DTO Pattern** | All API endpoints | Separates API contracts from database entities |
| **MapStruct** | Entity ↔ DTO conversion | Compile-time type-safe mapping, zero reflection overhead |

---

## 🗄 Database Design

> 🚧 **Work in progress** — ER diagram and schema documentation are being finalized.

---

## 🛠 Built With

<table>
<tr><td align="center" width="120"><img src="https://img.icons8.com/color/48/java-coffee-cup-logo--v1.png" width="36"/><br/><b>Java 25</b></td>
<td align="center" width="120"><img src="https://img.icons8.com/color/48/spring-logo.png" width="36"/><br/><b>Spring Boot 4.1</b></td>
<td align="center" width="120"><img src="https://img.icons8.com/color/48/postgreesql.png" width="36"/><br/><b>PostgreSQL</b></td>
<td align="center" width="120"><img src="https://img.icons8.com/color/48/amazon-s3.png" width="36"/><br/><b>AWS S3</b></td></tr>
</table>

| Layer | Technology | Role |
|---|---|---|
| **Runtime** | Java 25, Spring Boot 4.1.0 | Application framework & runtime |
| **Security** | Spring Security, JWT (jjwt 0.12.7) | Authentication & authorization |
| **Data** | Spring Data JPA, Hibernate, Flyway 12.8 | ORM, database migrations |
| **Database** | PostgreSQL (via Supabase) | Primary data store |
| **Storage** | AWS S3 SDK 2.20 (Supabase Storage) | File & media storage |
| **Mapping** | MapStruct 1.6.3, Lombok 1.18 | Object mapping, boilerplate reduction |
| **Validation** | Spring Validation (Hibernate Validator) | Input validation |
| **Rate Limiting** | Bucket4j 8.10 + Caffeine Cache | API rate limiting |
| **Email** | Spring Mail + Thymeleaf | Transactional email templates |
| **API Docs** | SpringDoc OpenAPI 2.8.9 | Auto-generated Swagger documentation |
| **Build** | Maven 3.9 (wrapper included) | Dependency management & build |

---

## 📡 API Reference

All responses follow a consistent format:

```json
{
  "codeStatus": "Success",
  "codeNumber": 200,
  "message": "Books retrieved successfully",
  "data": { ... }
}
```

<details>
<summary><strong>🔐 Authentication</strong> — <code>/api/v1/auth</code> — Public</summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signin` | Sign in with email & password |
| `POST` | `/signup` | Create a new account |
| `POST` | `/signout` | Sign out (clears auth cookies) |
| `POST` | `/refresh-token` | Get a new access token |
| `GET` | `/me` | Get current user info |
| `PATCH` | `/change-password` | Change password (requires current password) |
| `POST` | `/forgot-password` | Request password reset email |
| `POST` | `/reset-password` | Reset password with email token |

</details>

<details>
<summary><strong>📚 Books</strong> — <code>/api/v1/books</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | Browse & filter books |
| `GET` | `/{bookId}` | User | Get book details |
| `POST` | `/admin` | Admin | Create a book |
| `PUT` | `/{bookId}/admin` | Admin | Update a book |
| `DELETE` | `/{bookId}/admin` | Admin | Delete a book |

</details>

<details>
<summary><strong>📖 Book Formats</strong> — <code>/api/v1/books/{bookId}/formats</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | List available formats (EPUB, PDF, etc.) |
| `POST` | `/admin` | Admin | Add a format |
| `PUT` | `/{formatId}/admin` | Admin | Update format info |
| `DELETE` | `/{formatId}/admin` | Admin | Remove a format |

</details>

<details>
<summary><strong>✍️ Authors</strong> — <code>/api/v1/authors</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | List authors |
| `GET` | `/{authorId}` | User | Get author profile |
| `GET` | `/admin` | Admin | Search/filter authors |
| `POST` | `/admin` | Admin | Batch create authors |
| `PUT` | `/{authorId}/admin` | Admin | Update author |
| `DELETE` | `/{authorId}/admin` | Admin | Delete author |

</details>

<details>
<summary><strong>🏷️ Categories</strong> — <code>/api/v1/categories</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | List all categories |
| `GET` | `/{categoryId}` | User | Get category details |
| `GET` | `/admin` | Admin | Search/filter categories |
| `POST` | `/admin` | Admin | Create a category |
| `PUT` | `/{categoryId}/admin` | Admin | Update a category |
| `DELETE` | `/{categoryId}/admin` | Admin | Delete a category |

</details>

<details>
<summary><strong>🏢 Publishers</strong> — <code>/api/v1/publishers</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | List all publishers |
| `GET` | `/{publisherId}` | User | Get publisher details |
| `GET` | `/admin` | Admin | Search/filter publishers |
| `POST` | `/admin` | Admin | Batch create publishers |
| `PUT` | `/{publisherId}/admin` | Admin | Update publisher |
| `DELETE` | `/{publisherId}/admin` | Admin | Delete publisher |

</details>

<details>
<summary><strong>🏷️ Tags</strong> — <code>/api/v1/tags</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | List all tags |
| `GET` | `/{tagId}` | User | Get tag details |
| `GET` | `/admin` | Admin | Search/filter tags |
| `POST` | `/admin` | Admin | Batch create tags |
| `PUT` | `/{tagId}/admin` | Admin | Update tag |
| `DELETE` | `/{tagId}/admin` | Admin | Delete tag |

</details>

<details>
<summary><strong>⭐ Reviews</strong> — <code>/api/v1/books/{bookId}/reviews</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | Paginated book reviews |
| `GET` | `/stats` | User | Rating breakdown & averages |
| `POST` | `/` | Admin | Create a review |
| `PUT` | `/{reviewId}` | Admin | Update a review |
| `PUT` | `/{reviewId}/helpful` | User | Mark review as helpful |
| `DELETE` | `/{reviewId}` | Admin | Delete a review |

</details>

<details>
<summary><strong>🛒 Cart</strong> — <code>/api/v1/cart</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | User | View cart contents |
| `POST` | `/items` | User | Add a book to cart |
| `DELETE` | `/items/{itemId}` | User | Remove item from cart |
| `DELETE` | `/` | User | Clear entire cart |

</details>

<details>
<summary><strong>📦 Orders</strong> — <code>/api/v1/orders</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | User | Checkout (create order from cart) |
| `GET` | `/me` | User | My order history |
| `GET` | `/me/{orderId}` | User | Order details |
| `PATCH` | `/me/{orderId}/cancel` | User | Cancel a pending order |
| `GET` | `/admin` | Admin | All orders (admin view) |
| `PATCH` | `/{orderId}/refund/admin` | Admin | Process a refund |

</details>

<details>
<summary><strong>💳 Payments</strong> — <code>/api/v1</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/orders/{orderId}/payments` | User | Start payment flow |
| `GET` | `/payments/vnpay/callback` | Public | VNPay return redirect |
| `POST` | `/payments/vnpay/ipn` | Public | VNPay webhook |
| `GET` | `/payments/momo/callback` | Public | MoMo return redirect |
| `POST` | `/payments/momo/ipn` | Public | MoMo webhook |
| `GET` | `/orders/me/{orderId}/payments` | User | Payment history |
| `GET` | `/admin/payments` | Admin | All payments (admin view) |

</details>

<details>
<summary><strong>📖 Library</strong> — <code>/api/v1/library</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/me` | User | My book library |
| `GET` | `/me/{bookId}` | User | Library book details |
| `PATCH` | `/me/{bookId}/favorite` | User | Toggle favorite |
| `GET` | `/me/{bookId}/access` | User | Check reading access |
| `PATCH` | `/{libraryId}/revoke/admin` | Admin | Revoke access |

</details>

<details>
<summary><strong>📊 Reading Progress</strong> — <code>/api/v1/reading-progress</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/me/{bookId}` | User | Get reading position |
| `PUT` | `/me/{bookId}` | User | Save reading position |

</details>

<details>
<summary><strong>👤 User Management</strong> — <code>/api/v1/users</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `PATCH` | `/{userId}/profile` | User | Update my profile |
| `PATCH` | `/{userId}/avatar` | User | Update my avatar |
| `GET` | `/admin` | Admin | List all users |
| `GET` | `/{userId}/admin` | Admin | Get user details |
| `POST` | `/admin` | Admin | Create a user |
| `DELETE` | `/{userId}/admin` | Admin | Delete a user |
| `PATCH` | `/{userId}/admin` | Admin | Update user roles |

</details>

<details>
<summary><strong>📁 File Management</strong> — <code>/api/v1/files</code></summary>

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/presigned-url` | Admin | Get upload URL for S3 |
| `DELETE` | `/` | Admin | Delete a file from storage |

</details>

> 📘 **Interactive API documentation** is available at `/swagger-ui.html` when the server is running.

---

## ⚙️ Background Jobs

These scheduled tasks run automatically to keep the system healthy:

| Job | Runs Every | What It Does |
|---|---|---|
| 📧 **Email Dispatcher** | 10 seconds | Picks up pending emails from the outbox and sends them |
| 🗑️ **File Cleanup** | 5 minutes | Deletes orphaned files from S3 storage |
| 🧹 **Outbox Cleanup** | 10 seconds | Removes completed/expired outbox records |
| ⏰ **Order Expiration** | 1 minute | Cancels unpaid orders older than 15 minutes |

---

## 📂 Project Structure

```
ebook-reader/
├── src/main/java/com/aritan/ebook_reader/
│   ├── common/               # Shared across all features
│   │   ├── advice/           #   Global exception handlers
│   │   ├── constants/        #   Messages, rules, table names
│   │   ├── enums/            #   Status codes, types
│   │   ├── exception/        #   Custom exceptions
│   │   ├── models/           #   JPA entities (User, Book, Order, etc.)
│   │   └── validation/       #   Custom validators
│   │
│   ├── config/               # Infrastructure & cross-cutting concerns
│   │   ├── mvc/              #   MVC config, parameter converters
│   │   ├── outbox/           #   Abstract outbox processor
│   │   ├── payment/          #   Payment gateway implementations
│   │   ├── s3/               #   AWS S3 client config
│   │   ├── scheduler/        #   Background job definitions
│   │   ├── security/         #   JWT filter, Spring Security config
│   │   └── smpt/             #   Email service & templates
│   │
│   ├── features/             # Business feature modules
│   │   ├── auth/             #   Sign in, Sign up, Password reset
│   │   ├── author/           #   Author management
│   │   ├── book/             #   Book catalog + formats
│   │   ├── cart/             #   Shopping cart
│   │   ├── category/         #   Category management
│   │   ├── file/             #   File upload/delete
│   │   ├── library/          #   User library + reading progress
│   │   ├── order/            #   Order lifecycle
│   │   ├── payment/          #   Payment processing
│   │   ├── publisher/        #   Publisher management
│   │   ├── review/           #   Reviews & ratings
│   │   ├── tag/              #   Tag management
│   │   └── user/             #   User profiles & admin
│   │
│   └── EbookReaderApplication.java
│
├── src/main/resources/
│   ├── application.properties    # App configuration
│   ├── db/migration/             # 19 Flyway migration scripts
│   ├── flyway.conf               # Flyway settings
│   └── templates/email/          # HTML email templates
│
├── Dockerfile                    # Multi-stage Docker build
├── pom.xml                       # Maven dependencies
└── .env                          # Environment variables (git-ignored)
```

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 📬 Contact

**Ari Tan** — [hnminh.tan.2004@gmail.com](mailto:hnminh.tan.2004@gmail.com)

---

<p align="center">
  <sub>If you found this project useful, consider giving it a ⭐</sub>
</p>
