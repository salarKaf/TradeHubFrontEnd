CREATE DATABASE shopify;
\c shopify;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Sellers)
CREATE TABLE users (
user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password TEXT NOT NULL,
can_reset_password BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Buyers Table (Customers)
CREATE TABLE buyers (
  buyer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  phone_number VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  can_reset_password BOOLEAN DEFAULT FALSE,
  UNIQUE (website_id, email)  
);



-- 4. Websites Table
CREATE TABLE websites (
website_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
business_name VARCHAR(255) NOT NULL,
website_url VARCHAR(255) UNIQUE NOT NULL,
custom_domain VARCHAR(255) UNIQUE,
logo_url VARCHAR(255),
banner_image VARCHAR(255),
welcome_text TEXT,
faqs JSONB,
guide_page TEXT,
store_policy TEXT,
store_slogan VARCHAR(255),
about_us TEXT,
social_links JSONB,
total_sales BIGINT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. website Owners
CREATE TABLE website_owners (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. website Categories
CREATE TABLE website_categories (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. website Subcategories
CREATE TABLE website_subcategories (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
parent_category_id UUID NOT NULL REFERENCES website_categories(id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Items Table
CREATE TABLE items (
item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
category_id UUID NOT NULL REFERENCES website_categories(id) ON DELETE CASCADE,
subcategory_id UUID REFERENCES website_subcategories(id) ON DELETE SET NULL,
name VARCHAR(255) NOT NULL,
description TEXT,
price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
discount_price DECIMAL(10,2) CHECK (discount_price >= 0),
discount_active BOOLEAN DEFAULT FALSE,
discount_expires_at TIMESTAMP,
delivery_url VARCHAR(255),
delivery_expires_at TIMESTAMP,
download_token TEXT,
post_purchase_note TEXT,
stock INTEGER CHECK (stock >= 0),
image_url VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Product Attributes
CREATE TABLE item_attributes (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
item_id UUID NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
key VARCHAR(100) NOT NULL,
value TEXT NOT NULL,
type VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Orders
CREATE TABLE orders (
order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
item_id UUID NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
buyer_id UUID NOT NULL REFERENCES buyers(buyer_id) ON DELETE CASCADE,
status VARCHAR(20) CHECK (status IN ('Pending', 'Paid', 'Canceled')) NOT NULL DEFAULT 'Pending',
total_price DECIMAL(10,2) CHECK (total_price >= 0) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Orders Archive
CREATE TABLE orders_archive (
id UUID PRIMARY KEY,
website_id UUID REFERENCES websites(website_id) ON DELETE SET NULL,
item_id UUID REFERENCES items(item_id) ON DELETE SET NULL,
buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE SET NULL,
status VARCHAR(20) CHECK (status IN ('Pending', 'Paid', 'Canceled')) NOT NULL,
total_price DECIMAL(10,2) CHECK (total_price >= 0) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Reviews
CREATE TABLE reviews (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
item_id UUID NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE SET NULL,
rating INTEGER CHECK (rating >= 1 AND rating <= 5),
comment TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Subscription Plans
CREATE TABLE subscription_plans (
  plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  item_limit INTEGER NOT NULL,
  allow_discount BOOLEAN DEFAULT FALSE,
  allow_cart_save BOOLEAN DEFAULT FALSE,
  allow_file_upload BOOLEAN DEFAULT FALSE,
  allow_analytics BOOLEAN DEFAULT FALSE
);


-- 14. Website plans
CREATE TABLE website_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES websites(website_id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);


-- 15. Product Questions
CREATE TABLE item_questions (
question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
item_id UUID NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
buyer_id UUID REFERENCES buyers(buyer_id) ON DELETE SET NULL,
question TEXT NOT NULL,
answer TEXT,
is_visible BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
answered_at TIMESTAMP
);

-- ✅ Indexes
CREATE UNIQUE INDEX idx_buyers_website_email ON buyers (website_id, email);
CREATE INDEX idx_buyers_email ON buyers(email);
CREATE INDEX idx_websites_owner_id ON websites(category_id);
CREATE INDEX idx_orders_website_id ON orders(website_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_website_owners_website_id ON website_owners(website_id);
CREATE INDEX idx_website_owners_user_id ON website_owners(user_id);