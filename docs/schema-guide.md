# Ecommerce SaaS Platform - Schema Documentation

## Overview

This is a **multi-tenant SaaS platform** where each store is a separate tenant. Think of it like Shopify or Wix - one platform, many stores.

**Tenant Isolation**: All tenant data is isolated using `storeId`. Every table that belongs to a store has a `storeId` field.

---

## Core Entities

### 🏪 Store (Tenant)

The **Store** is the central entity. Every store is a independent business on the platform.

```
Store owns:
├── StoreSettings     → Branding, SEO, Contact info
├── StoreAppearance   → Theme, Layout, Fonts, CSS
├── StoreFeatureFlags → Enable/disable features
├── StoreConfig       → Custom key-value settings
├── Products          → What the store sells
├── Categories        → Product organization
├── Brands            → Brand names
├── Customers         → Store shoppers
├── Orders            → Customer purchases
├── Coupons           → Discount codes
└── CustomDomains     → Custom URLs
```

**Key Fields:**
- `name` - Store display name
- `slug` - Unique URL identifier (e.g., "my-store")
- `subdomain` - Platform subdomain (e.g., "my-store.platform.com")
- `status` - ACTIVE, SUSPENDED, TRIAL, EXPIRED

---

### 👤 User & Roles

**Users** are platform-wide accounts. One user can own multiple stores or be staff in multiple stores.

**Roles:**
| Role | Scope | Description |
|------|-------|-------------|
| SUPER_ADMIN | Platform | Manages entire platform, all stores |
| STORE_OWNER | Store | Owns and controls one store |
| STORE_ADMIN | Store | Manages store operations, no billing |
| STAFF | Store | Limited access (view only for most) |
| CUSTOMER | Store | End shoppers |

**How it works:**
- User → UserRole → Store (links user to store with a role)
- SUPER_ADMIN has `storeId = null` (platform-wide)
- Store staff have `storeId = actual store ID`

---

### 🏠 StoreOwner

Links a **User** to a **Store** as the owner.

```
User (1) ──── (1) StoreOwner ──── (1) Store
```

One user owns one store (current design). The owner has full control.

---

### 💳 Plans & Billing

**Plan** defines what a store can do:

| Plan | Price | Products | Orders | Features |
|------|-------|----------|--------|-----------|
| Free | $0/mo | 10 | 100 | Basic |
| Starter | $29/mo | 100 | 1,000 | + Analytics |
| Professional | $79/mo | 1,000 | 10,000 | + Abandoned Cart |
| Enterprise | $199/mo | Unlimited | Unlimited | + Multi-vendor |

**Billing Flow:**
```
Store (TRIAL) → Choose Plan → Payment → Subscription Active
                         ↓
              Trial ends → Upgrade or Cancel
```

---

## Store Configuration (Hybrid System)

We use a **hybrid approach** - structured tables + flexible key-value:

### 1. StoreSettings (Structured)
All critical settings in typed columns:
- **Identity**: siteName, siteTitle, tagline
- **Branding**: logoUrl, brandColor, coverImage
- **SEO**: metaTitle, metaDescription, metaKeywords
- **Contact**: email, phone, address
- **Localization**: currency, language, timezone
- **Social**: facebookUrl, twitterUrl, instagramUrl

### 2. StoreAppearance (Structured)
- `themeName` - Which theme
- `layoutType` - standard/compact/spacious
- `homepageLayout` - JSON config for sections
- `customCss` - Custom styling
- `fontConfig` - JSON font settings

### 3. StoreFeatureFlags (Boolean Toggles)
Granular feature control:
```json
{
  "enableWishlist": true,
  "enableReviews": true,
  "enableCoupons": true,
  "enableInventoryTracking": true,
  "enableMultiVendor": false,
  "enableGuestCheckout": true,
  ...
}
```

### 4. StoreConfig (Flexible Key-Value)
For plugins, dynamic settings, future features:
- Key: string identifier
- Value: JSON (any structure)

**Use Cases:**
- Plugin configuration
- A/B test settings
- Third-party integrations
- Feature rollouts

---

## Product System

### Product
The main item being sold.

```
Product
├── name, description
├── price, compareAtPrice (strike-through)
├── sku (Stock Keeping Unit)
├── quantity (stock count)
├── status (active/draft/archived)
└── Relations:
    ├── Category (1:many)
    ├── Brand (1:many)
    ├── ProductVariant (1:many)
    ├── ProductImage (1:many)
    └── Inventory (tracks stock)
```

### ProductVariant
Same product, different option. Example:
- Product: "T-Shirt"
- Variant 1: "Size S, Color Blue"
- Variant 2: "Size M, Color Red"
- Variant 3: "Size L, Color Blue"

Each variant can have:
- Own price (override parent)
- Own SKU
- Own inventory quantity
- Attributes (size, color, etc.)

### Category (Hierarchical)
Self-referencing for nested categories:
```
Electronics
├── Smartphones
├── Laptops
└── Tablets

Clothing
├── T-Shirts
├── Jeans
└── Outerwear
```

### Brand
Simple brand/trademark reference. Products can belong to a Brand.

---

## Order System

### Order Lifecycle

```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
    ↓           ↓
CANCELLED    REFUNDED
```

### Key Concepts:

**OrderSnapshot**: OrderItems store the price/name at time of purchase (not live data)

**Two Addresses**:
- Billing address (where invoice goes)
- Shipping address (where goods ship)

**Fulfillment**:
- Order may have multiple Shipments (partial shipping)
- Each Shipment has tracking info

---

## Customer System

### Customer vs User

| Entity | Who | Purpose |
|--------|-----|---------|
| User | Store owners, staff | Login to admin |
| Customer | Shoppers | Buy products |

**Customer** is store-scoped (belongs to one store).

**Guest Checkout**: Customers can buy without an account. Their info is stored in the Order.

---

## Inventory System

```
Inventory
├── quantity    → Total stock
├── reserved    → Held in checkout
├── available   → quantity - reserved (computed)
└── history     → InventoryLog
```

**InventoryLog** tracks all changes:
- `adjustment` - Manual stock change
- `sale` - Sold (auto on order)
- `restock` - Restocked
- `reserve` - Added to cart
- `release` - Removed from cart

---

## Delivery System

### Shipment States
```
LABEL_CREATED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED
                                          ↓
                                       FAILED / RETURNED
```

**Tracking** stores the history from the carrier API.

---

## Coupon System

### Coupon Types:
- `percentage` - 10% off
- `fixed` - $10 off
- `free_shipping` - Free shipping

### Restrictions:
- `minOrderAmount` - Minimum cart value
- `maxDiscount` - Cap on discount
- `usageLimit` - Total uses allowed
- `perUserLimit` - Uses per customer
- `productIds` / `categoryIds` - Applicable items
- `newCustomersOnly` - First-time buyers only

---

## Notification System

### NotificationTemplate
Templates for emails, SMS, push notifications.

**Channels**: EMAIL, SMS, PUSH, IN_APP

**Triggers**: JSON config for when to send (e.g., order.created, shipment.delivered)

### NotificationLog
Tracks all sent notifications with status: PENDING → SENT → DELIVERED/FAILED

---

## Addon System

Platform extensibility via plugins/addons.

```
Addon (global registry)
├── code - Unique identifier
├── manifest - Installation instructions
└── isInstalled

StoreAddon (per-store installation)
├── status - active/disabled/error
├── config - Store-specific settings
└── version tracking
```

---

## Domain System

### CustomDomain
Stores can use their own domain (e.g., mystore.com).

**Verification Flow:**
```
PENDING → VERIFIED/FAILED
     ↓
  TXT/CNAME records added to DNS
```

**SSL Status**: PENDING → ACTIVE → EXPIRED

---

## Audit Logging

### ActivityLog
Platform-wide user actions.

### StoreLog
Store-scoped actions (who did what, when).

**Use Cases:**
- Security audits
- Debugging issues
- Compliance

---

## Quick Reference: Relationships

```
USER
├── UserRole ───→ STORE (storeId: null for SUPER_ADMIN)
├── StoreOwner ───→ STORE (1:1)
└── Address (personal addresses)

STORE
├── StoreSettings (1:1)
├── StoreAppearance (1:1)
├── StoreFeatureFlags (1:1)
├── StoreConfig (1:M)
├── StoreSubscription (1:M) ───→ PLAN
├── Product (1:M)
│   ├── ProductVariant (1:M)
│   ├── ProductImage (1:M)
│   └── Inventory (1:M)
├── Category (1:M, self-referencing)
├── Brand (1:M)
├── Customer (1:M)
│   ├── Order (1:M)
│   ├── Review (1:M)
│   └── Wishlist (1:M)
├── Coupon (1:M)
├── Shipment (1:M)
└── CustomDomain (1:M)

PRODUCT
├── ProductVariant (1:M)
├── Category (many:1)
├── Brand (many:1)
├── Inventory (1:M)
└── ProductImage (1:M)

ORDER
├── OrderItem (1:M)
├── Payment (1:M)
├── Shipment (1:M)
├── Customer (many:1)
└── Coupon (many:1)
```

---

## Indexes & Performance

**Tenant Isolation**: All tenant tables have `storeId` index for fast filtering.

**Common Indexes:**
- `storeId` - Tenant filtering
- `createdAt` - Sorting/querying by time
- `status` - Filtering active/inactive
- `email` - Lookups

**Unique Constraints:**
- `Store.slug` - Platform-wide unique
- `Store.subdomain` - Platform-wide unique
- `Product(storeId, sku)` - Store-wide unique SKU
- `Customer(storeId, email)` - Store-wide unique email
