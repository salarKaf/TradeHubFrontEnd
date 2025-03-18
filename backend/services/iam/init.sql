CREATE DATABASE shopify;
\c shopify;

-- Enable UUID extension (if not enabled already)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (Sellers)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    can_reset_password = Column(Boolean, default=False)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buyers Table (Customers)
CREATE TABLE buyers (
    buyer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table (Predefined business categories)
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Websites Table (Stores sellers' business details)
CREATE TABLE websites (
    website_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    website_url VARCHAR(255) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    logo_url VARCHAR(255),
    banner_image VARCHAR(255),
    welcome_text TEXT,
    qa_page TEXT,
    guide_page TEXT,
    social_links JSONB,
    total_sales BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE store_owners ( 
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store Categories Table (Custom categories for products)
CREATE TABLE store_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items Table (Products & Services)
CREATE TABLE items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES store_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    discount_price DECIMAL(10,2) CHECK (discount_price >= 0),
    discount_active BOOLEAN DEFAULT FALSE,
    discount_expires_at TIMESTAMP,
    is_physical BOOLEAN NOT NULL,
    content_type VARCHAR(50) CHECK (content_type IN ('video', 'pdf', 'zip', 'external_link')) DEFAULT 'external_link',
    delivery_url VARCHAR(255),
    delivery_expires_at TIMESTAMP,
    download_token TEXT,
    stock INTEGER CHECK (stock >= 0),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table (Tracks purchases)
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Paid', 'Canceled')) NOT NULL DEFAULT 'Pending',
    total_price DECIMAL(10,2) CHECK (total_price >= 0) NOT NULL,
    tracking_number VARCHAR(255),
    shipping_status VARCHAR(20) CHECK (shipping_status IN ('Pending', 'Shipped', 'Delivered')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Archive Table (Old orders for performance optimization)
CREATE TABLE orders_archive (
    id UUID PRIMARY KEY,
    website_id UUID REFERENCES websites(website_id) ON DELETE SET NULL,
    item_id UUID REFERENCES items(item_id) ON DELETE SET NULL,
    buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE SET NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Paid', 'Canceled')) NOT NULL,
    total_price DECIMAL(10,2) CHECK (total_price >= 0) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('Basic', 'Pro', 'Premium')),
    monthly_price DECIMAL(10,2) NOT NULL CHECK (monthly_price >= 0),
    max_products INTEGER NOT NULL,
    commission_percent DECIMAL(4,2) NOT NULL,
    features JSONB, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(plan_id) ON DELETE RESTRICT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Add Indexes to Optimize Queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_buyers_email ON buyers(email);
CREATE INDEX idx_websites_owner_id ON websites(owner_id);
CREATE INDEX idx_orders_website_id ON orders(website_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_store_owners_website_id ON store_owners(website_id);
CREATE INDEX idx_store_owners_user_id ON store_owners(user_id);
