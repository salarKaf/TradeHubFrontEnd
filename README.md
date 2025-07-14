# 🛍️ TradeHub – Digital Product Store Builder Platform

**TradeHub** is a scalable, cleanly architected microservice platform that enables users to launch and manage their own digital product storefronts with ease.  
Each user can create a website, manage digital products, track customer orders, offer discounts, and receive payments through secure gateways.

---

## 🚀 Features

✅ Build your own digital product storefront in minutes  
✅ OTP-based phone number authentication  
✅ Zarinpal payment gateway integration  
✅ Smart analytics dashboard (revenue, orders, customers)  
✅ Discount coupons and order management  
✅ Subscription-based plan system  
✅ Clean architecture & microservice pattern  
✅ JWT-based authentication

---

## 💼 Subscription Plans

| Plan   | Product Limit | Discount Support | Analytics Dashboard | Price (IRR)   |
|--------|----------------|------------------|----------------------|----------------|
| Basic  | 100 products   | ❌ No             | ❌ No                 | 500,000        |
| Pro    | 500 products   | ✅ Yes            | ✅ Yes                | 1,500,000      |

---

## 💳 Payments & Authentication

- 🔐 Secure payment integration via **Zarinpal**
- 📱 User login with **OTP-based SMS authentication**
- 🔑 Session & token management using **JWT**

---

## 📊 Seller Dashboard

- Recent orders preview
- Detailed buyer summaries (total purchases, order count)
- Advanced sorting: by latest, highest amount, or most orders
- Invoice-style order overview (order number, amount, date, buyer email)

---

## 🧠 Architecture

TradeHub is built with:

- **Microservice structure**
- **Clean Architecture principles**
- Easy-to-scale and testable components

## 🔐 Security
Scoped JWT tokens for all authenticated access

Each user is allowed to own exactly one website

OTP tokens stored securely (e.g., via Redis)

Clean handling of coupon usage and ownership

## 📈 Tech Stack
🌀 FastAPI + Pydantic

🧮 PostgreSQL + SQLAlchemy

🔐 Zarinpal for payments

☁️ Redis for OTP & caching

🌐 Jalali date handling for local Persian UX

🧱 Microservice-ready modular codebase

