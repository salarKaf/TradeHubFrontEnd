# 🛍️ Shopify-Style SaaS Platform for Selling Digital Products

A robust, scalable PostgreSQL database schema for a SaaS platform enabling creators and sellers to launch their own customizable storefronts for selling **digital products** (courses, files, videos, etc.) — with no need for admin intervention.

---

## 🚀 Overview

This platform is designed to empower **content creators**, especially those active on platforms like **Instagram** and **Telegram**, to seamlessly:

- Create a personal storefront
- Upload and manage digital products
- Accept online payments
- Deliver secure, time-limited download links to buyers
- Eliminate the need for manual DMs, admins, or custom websites

---

## 🧱 Key Features

✅ Multi-vendor store architecture (like Digikala)  
✅ Secure delivery of digital content (video, PDF, zip, etc.)  
✅ Time-based and tokenized download links  
✅ Built-in discount system per product  
✅ Categorization (global + per-store)  
✅ Review & rating system for verified buyers  
✅ Order management & archive system for scale  
✅ Seller/buyer authentication separation  
✅ Ready for FastAPI + Traefik microservices architecture

---

## 🗂️ Main Tables

| Table             | Description                                                  |
|------------------|--------------------------------------------------------------|
| `users`          | Sellers (store creators/managers)                            |
| `buyers`         | End-users/customers                                          |
| `categories`     | Global business categories                                   |
| `websites`       | Storefronts created by users                                 |
| `store_owners`   | Many-to-many link between users and websites (multi-vendor)  |
| `store_categories` | Per-store product categories                              |
| `items`          | Digital products (with secure delivery fields)               |
| `orders`         | Live purchase tracking                                       |
| `orders_archive` | Archived orders (performance optimization)                   |
| `reviews`        | Buyer reviews and ratings                                    |

---

## 🔐 Secure Download Support

The schema supports:
- `delivery_url`: direct or external download URL
- `download_token`: per-order token for secure access
- `delivery_expires_at`: expiration timestamp

This enables you to implement **JWT-based signed URLs**, **HMAC links**, or server-authenticated download routes in FastAPI.

---

## 💸 Discounts

Each product supports optional, manual discounts:
- `discount_price`
- `discount_active`
- `discount_expires_at`
