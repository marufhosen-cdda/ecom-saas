# User Onboarding & Store Creation Flow

## 1. User Registration & Authentication

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  User    │────▶│  Signup  │────▶│   Verify     │────▶│   Welcome    │────▶│ Dashboard│
│ Visits   │     │   Form   │     │   Email      │     │   Screen    │     │   Home   │
│ Platform │     │          │     │              │     │             │     │          │
└──────────┘     └──────────┘     └──────────────┘     └──────────────┘     └──────────┘
                       │                  │                    │
                       │                  ▼                    │
                       │           ┌──────────────┐            │
                       │           │  Link sent  │            │
                       │           │   to email   │            │
                       │           │   expires    │            │
                       │           │  in 24hrs    │            │
                       │           └──────────────┘            │
                       │                                     │
                       │      ┌──────────────────────────────┘
                       │      │
                       ▼      ▼
                ┌──────────────────┐
                │ If not verified  │
                │ Resend link?    │◀────────────────────┐
                └──────────────────┘                     │
                                                              │ No
                    ┌──────────────────┐                     │
                    │  Email verified  │─────────────────────┘
                    │   Proceed       │
                    └──────────────────┘
```

## 2. Super Admin vs Store User Distinction

```
                    ┌─────────────────────────────────────────┐
                    │           USER ROLE CHECK                │
                    └─────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
    ┌──────────────┐                                  ┌──────────────┐
    │ SUPER_ADMIN  │                                  │  REGULAR    │
    │   USER      │                                  │    USER     │
    └──────────────┘                                  └──────────────┘
           │                                                 │
           ▼                                                 ▼
    ┌──────────────┐                                  ┌──────────────┐
    │ Platform    │                                  │ Create Own  │
    │ Dashboard   │                                  │   Store     │
    │ - Manage    │                                  └──────────────┘
    │   Stores    │                                         │
    │ - Manage    │                                         ▼
    │   Plans     │                                  ┌──────────────┐
    │ - Platform  │                                  │  Create      │
    │   Settings  │                                  │  Store Flow │
    └──────────────┘                                  └──────────────┘
```

## 3. Store Creation Wizard

```
     ┌──────────────────────────────────────────────────────────────────────────────────────┐
     │                          STORE CREATION WIZARD                                         │
     └──────────────────────────────────────────────────────────────────────────────────────┘

     ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐        │
     │  STEP 1  │    │  STEP 2  │    │  STEP 3  │    │  STEP 4  │    │  STEP 5  │        │
     │  Store   │───▶│  Plan    │───▶│ Branding │───▶│  Staff   │───▶│ Complete │        │
     │  Basic   │    │  Select  │    │  Setup   │    │  Invite  │    │  Setup   │        │
     │  Info    │    │          │    │          │    │          │    │          │        │
     └───────────┘    └───────────┘    └───────────┘    └───────────┘    └───────────┘        │
           │               │               │               │               │                │
           ▼               ▼               ▼               ▼               ▼                │
     ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐        │
     │• Store    │   │• Select  │   │• Upload  │   │• Invite  │   │• Review  │        │
     │  Name     │   │  Plan    │   │  Logo    │   │  Email   │   │  Summary │        │
     │• Subdomain│   │  (Free,  │   │• Brand   │   │  Staff   │   │• Launch  │        │
     │• Store    │   │  Pro,    │   │  Color   │   │  Roles   │   │  Store   │        │
     │  Type     │   │  Ent.)   │   │• Cover   │   │          │   │          │        │
     │           │   │          │   │  Image   │   │          │   │          │        │
     └───────────┘   └───────────┘   └───────────┘   └───────────┘   └───────────┘        │
           │               │               │               │               │                │
           │               │               │               │               │                │
           ▼               ▼               ▼               ▼               ▼                │
     ┌────────────────────────────────────────────────────────────────────────────────────┐  │
     │  DATA CREATED:                                                                       │  │
     │  - Store (status: TRIAL)                                                             │  │
     │  - StoreOwner (links user ↔ store)                                                   │  │
     │  - UserRole (STORE_OWNER)                                                            │  │
     │  - StoreSettings (empty)                                                              │  │
     │  - StoreAppearance (defaults)                                                        │  │
     │  - StoreFeatureFlags (defaults)                                                      │  │
     │  - StoreSubscription (TRIAL)                                                         │  │
     └────────────────────────────────────────────────────────────────────────────────────┘  │
```

## 4. Store Owner Dashboard - Post Creation Setup

```
                         ┌─────────────────────────────────────┐
                         │         MAIN DASHBOARD              │
                         │   Welcome → Store Overview Stats     │
                         └─────────────────────────────────────┘
                                          │
              ┌─────────────────────────────┼─────────────────────────────┐
              │                             │                             │
              ▼                             ▼                             ▼
     ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
     │   Catalog    │              │   Orders     │              │   Store      │
     │   Manager    │              │   Manager    │              │   Settings   │
     └──────────────┘              └──────────────┘              └──────────────┘
              │                             │                             │
              │                             │                             │
     ┌────────┴────────┐           ┌─────────┴─────────┐         ┌────────┴────────┐
     │                │           │                  │         │                │
     ▼                ▼           ▼                  ▼         ▼                ▼
┌─────────┐     ┌─────────┐  ┌─────────┐       ┌─────────┐  ┌─────────┐     ┌─────────┐
│Products│     │Categories│ │Pending  │      │ Shipped  │  │General │     │Branding │
│        │     │         │  │Orders   │      │Orders   │  │Settings│     │Appearance│
└─────────┘     └─────────┘  └─────────┘       └─────────┘  └─────────┘     └─────────┘
     │                │           │                  │         │                │
     │                │           │                  │         │                │
     ▼                ▼           ▼                  ▼         ▼                ▼
┌─────────┐     ┌─────────┐  ┌─────────┐       ┌─────────┐  ┌─────────┐     ┌─────────┐
│Variants│     │Sub-Cat  │  │Order    │      │Tracking │  │Site Name│    │Logo/    │
│Inventory│   │Manage   │  │Details  │      │Update   │  │Contact  │    │Colors   │
└─────────┘     └─────────┘  └─────────┘       └─────────┘  └─────────┘     └─────────┘
```

## 5. Store Settings Modules

```
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │   GENERAL    │  │  BRANDING    │  │    SEO      │  │  LOCALIZATION│
     │   SETTINGS   │  │   CENTER     │  │   SETTINGS  │  │              │
     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
           │                 │                │                  │
           ▼                 ▼                ▼                  ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │• Site Name   │  │• Logo Upload │  │• Meta Title  │  │• Currency   │
     │• Site Title  │  │• Favicon    │  │• Meta Desc   │  │• Timezone   │
     │• Tagline     │  │• Cover Image│  │• Keywords    │  │• Language   │
     │• Description │  │• Brand Color│  │• OG Image    │  │• Units      │
     │• Logo        │  │• Secondary  │  │              │  │             │
     │• Contact Info│  │  Color      │  │              │  │             │
     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                                                                          
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │SOCIAL LINKS  │  │  SHIPPING    │  │   PAYMENTS   │  │NOTIFICATIONS │
     │              │  │   SETTINGS   │  │   SETTINGS   │  │   SETTINGS   │
     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
           │                 │                │                  │
           ▼                 ▼                ▼                  ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │• Facebook    │  │• Providers  │  │• Stripe     │  │• Email      │
     │• Twitter     │  │• Zones      │  │• PayPal    │  │• SMS        │
     │• Instagram   │  │• Rates      │  │• Razorpay  │  │• Templates  │
     │• YouTube     │  │• Free Ship  │  │            │  │             │
     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

## 6. Staff Invitation & RBAC Flow

```
     ┌─────────────────────────────────────────────────────────────────────────────────────┐
     │                         STAFF INVITATION FLOW                                        │
     └─────────────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │ Store Owner │────▶│  Send Invite │────▶│  Staff       │────▶│  Staff       │
     │ selects     │     │  via Email   │     │  receives    │     │  accepts &   │
     │ staff email │     │              │     │  invite      │     │  creates     │
     │ & role      │     │              │     │  link        │     │  account     │
     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                  │
                                                                  ▼
     ┌────────────────────────────────────────────────────────────────────────────────────┐
     │ STORE_ADMIN                                        STORE_ADMIN                     │
     │ - Full store access except billing               - Same as left                 │
     │ - Cannot delete store                           - Cannot manage billing         │
     │                                                   - Cannot delete store          │
     ├────────────────────────────────────────────────────────────────────────────────────┤
     │ STORE_ADMIN                                        STORE_ADMIN                   │
     │ - Manage products (create/edit)                  - Manage orders (update status)│
     │ - Manage customers                               - View analytics               │
     │ - Manage staff (view only)                       - Cannot delete products      │
     └────────────────────────────────────────────────────────────────────────────────────┘
```

## 7. Product Creation Flow

```
     ┌─────────────────────────────────────────────────────────────────────────────────────┐
     │                       PRODUCT CREATION FLOW                                          │
     └─────────────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │   Select    │────▶│  Enter Basic │────▶│   Pricing    │────▶│  Inventory  │
     │   Category  │     │   Details    │     │   & SKU      │     │   Setup     │
     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                        │                  │
                                                        │                  ▼
     ┌──────────────┐     ┌──────────────┐              │          ┌──────────────┐
     │  Publish    │◀────│   Media     │◀──────────────┘          │   Stock     │
     │  Product    │     │   Upload    │                          │   Alerts    │
     └──────────────┘     └──────────────┘                          └──────────────┘
           │                    │
           │                    ▼
     ┌──────────────┐     ┌──────────────┐
     │  Product    │     │  Gallery /   │
     │  Published  │     │  Hero Image  │
     │  & Live     │     │  Upload     │
     └──────────────┘     └──────────────┘
```

## 8. Customer Acquisition Flow

```
     ┌─────────────────────────────────────────────────────────────────────────────────────┐
     │                       CUSTOMER ONBOARDING                                           │
     └─────────────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │  Customer   │────▶│   Browse     │────▶│  Add to     │────▶│  Checkout    │
     │  Visits     │     │  Products   │     │  Cart/Wish  │     │  Cart        │
     │  Store      │     │             │     │             │     │              │
     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                      │
           ┌──────────────────────────────────────────────────────────┘
           │
           ▼
     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │  Account    │────▶│   Shipping  │────▶│  Payment    │────▶│  Order       │
     │  Creation   │     │   Address   │     │  Process    │     │  Confirmed   │
     │  (Optional) │     │             │     │             │     │              │
     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                          │
           ┌──────────────────────────────────────────────────────────────┘
           │
           ▼
     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │  Order       │────▶│  Order       │────▶│  Shipment    │────▶│  Delivered   │
     │  Processing  │     │  Shipped     │     │  Tracking    │     │              │
     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## 9. Subscription / Billing Flow

```
     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │   Store     │────▶│  Plan        │────▶│  Checkout    │────▶│ Subscription │
     │  Created    │     │  Selection   │     │  & Payment   │     │  Active      │
     │  (TRIAL)    │     │              │     │              │     │              │
     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
           │                                                                    │
           │                         ┌───────────────────────────────────────────┘
           ▼                         ▼
     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
     │  Trial      │────▶│  Trial       │────▶│  Upgrade     │────▶│  Plan        │
     │  Expires    │     │  Converted   │     │  Prompt      │     │  Downgraded  │
     │  14 days    │     │  or Canceled │     │              │     │              │
     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## 10. Key Data Relationships

```
                              ┌──────────────────────────────────────┐
                              │            PLATFORM                 │
                              │         (Super Admin)                │
                              └──────────────────────────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
          ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
          │      Plan        │      │    Permission    │      │     Role         │
          │  (Free/Pro/Ent) │      │  (product:*)     │      │ (STORE_OWNER,    │
          │                  │      │                  │      │  STORE_ADMIN,    │
          │                  │      │                  │      │  STAFF)          │
          └──────────────────┘      └──────────────────┘      └──────────────────┘
                    │                         │                         │
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              │
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   STORE LEVEL                                                │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                              │
      ┌───────────────────────────────────────┼───────────────────────────────────────────┐
      │                                       │                                           │
      ▼                                       ▼                                           ▼
┌──────────────────┐              ┌──────────────────┐                     ┌──────────────────┐
│      User         │              │    StoreOwner    │                     │    Store         │
│                  │◀─────────────▶│                  │◀────────────────────│                  │
│  email           │              │  userId          │                     │  name            │
│  passwordHash    │              │  storeId         │                     │  slug            │
│                  │              │                  │                     │  status          │
└──────────────────┘              └──────────────────┘                     │  planId          │
      │                                                                    └──────────────────┘
      │                                                                             │
      │                                                                             │
      │                    ┌──────────────────────────────────────────────────────────┐
      │                    │                                                           │
      │                    ▼                                                           ▼
      │          ┌──────────────────┐                              ┌──────────────────┐
      │          │    UserRole       │                              │   StoreSettings  │
      │          │                  │                              │                   │
      │          │  userId          │                              │  siteName        │
      │          │  roleId          │                              │  brandColor      │
      │          │  storeId         │                              │  metaTitle       │
      │          │                  │                              │  currency        │
      │          └──────────────────┘                              │  ...             │
      │                                                                 └──────────────────┘
      │                                                                             │
      │                                                                             ▼
      │                                                                      ┌──────────────────┐
      │                                                                      │ StoreAppearance  │
      │                                                                      │                   │
      │                                                                      │ themeName        │
      │                                                                      │ customCss        │
      │                                                                      │ homepageLayout   │
      │                                                                      └──────────────────┘
      │
      │
      │                    ┌──────────────────────────────────────────────────────────┐
      │                    │                                                           │
      │                    ▼                                                           ▼
      │          ┌──────────────────┐                              ┌──────────────────┐
      │          │ StoreFeatureFlags │                              │  StoreSubscription│
      │          │                   │                              │                   │
      │          │ enableWishlist    │                              │  planId          │
      │          │ enableReviews     │                              │  status          │
      │          │ enableCoupons     │                              │  trialEndsAt     │
      │          │ ...               │                              │  ...             │
      │          └──────────────────┘                              └──────────────────┘
      │
      ▼
┌──────────────────┐
│     Customer     │
│                  │
│  email           │
│  firstName       │
│  lastName        │
│  storeId         │
│                  │
│  ────────────────│
│  has many Orders │
│  has many Reviews│
│  has Wishlists   │
└──────────────────┘
          │
          │
          ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│     Order        │      │     Product       │      │    Review        │
│                  │◀────│                   │      │                  │
│  orderNumber     │      │  name             │      │  rating          │
│  status          │      │  price            │      │  content         │
│  customerId      │      │  storeId          │      │  customerId      │
│  total           │      │  categoryId       │      │  productId       │
│                  │      │  brandId          │      │                  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
        │
        │                        │
        │                        ▼
        │                ┌──────────────────┐
        │                │ ProductVariant   │
        │                │                  │
        │                │  sku             │
        │                │  price           │
        │                │  attributes      │
        │                │  quantity        │
        │                └──────────────────┘
        │
        ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   OrderItem      │      │   Inventory      │      │     Coupon        │
│                  │      │                  │      │                  │
│  productId       │      │  quantity        │      │  code             │
│  variantId       │      │  reserved        │      │  type             │
│  price           │      │  lowStockThresh  │      │  value            │
│  quantity        │      └──────────────────┘      │  usageLimit       │
└──────────────────┘                                └──────────────────┘
```

## 11. Key Relationships Summary

```
  User ──────────▶ StoreOwner ──────────▶ Store
  │                      │
  │                      └──────────────────▶ StoreSubscription
  │                                             │
  │◀──────────────────── UserRole ◀────────────┘
  │
  └──▶ UserRole (storeId: null) = SUPER_ADMIN
  └──▶ UserRole (storeId: 123) = STORE_OWNER/STORE_ADMIN/STAFF for store 123

  Store ─────────▶ StoreSettings (1:1)
        │
        ├──────────▶ StoreAppearance (1:1)
        │
        ├──────────▶ StoreFeatureFlags (1:1)
        │
        ├──────────▶ StoreConfig (1:M) - flexible key-value
        │
        ├──────────▶ StoreSubscription (1:M)
        │
        ├──────────▶ Product (1:M)
        │           │
        │           └────────▶ ProductVariant (1:M)
        │           │
        │           └────────▶ ProductImage (1:M)
        │
        ├──────────▶ Category (1:M) - self-referencing hierarchy
        │
        ├──────────▶ Brand (1:M)
        │
        ├──────────▶ Customer (1:M)
        │           │
        │           ├────────▶ Order (1:M)
        │           ├────────▶ Review (1:M)
        │           └────────▶ Wishlist (1:M)
        │
        ├──────────▶ Coupon (1:M)
        │
        ├──────────▶ Shipment (1:M)
        │
        └──────────▶ CustomDomain (1:M)
```
