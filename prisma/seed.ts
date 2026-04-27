import 'dotenv/config'
import { PrismaClient, StoreStatus, UserRoleType } from '../src/generated/prisma'
import { hashPassword } from '../src/utils/password'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
}

const prisma = new PrismaClient({ accelerateUrl: databaseUrl })

async function main() {
    console.log('🌱 Starting seed...')

    // =============================================================================
    // PERMISSIONS
    // =============================================================================
    console.log('Creating permissions...')

    const permissions = [
        // Store permissions
        { code: 'store:read', name: 'View Store', module: 'store' },
        { code: 'store:update', name: 'Update Store', module: 'store' },
        { code: 'store:delete', name: 'Delete Store', module: 'store' },

        // Product permissions
        { code: 'product:read', name: 'View Products', module: 'product' },
        { code: 'product:create', name: 'Create Products', module: 'product' },
        { code: 'product:update', name: 'Update Products', module: 'product' },
        { code: 'product:delete', name: 'Delete Products', module: 'product' },

        // Order permissions
        { code: 'order:read', name: 'View Orders', module: 'order' },
        { code: 'order:create', name: 'Create Orders', module: 'order' },
        { code: 'order:update', name: 'Update Orders', module: 'order' },
        { code: 'order:delete', name: 'Delete Orders', module: 'order' },

        // Customer permissions
        { code: 'customer:read', name: 'View Customers', module: 'customer' },
        { code: 'customer:create', name: 'Create Customers', module: 'customer' },
        { code: 'customer:update', name: 'Update Customers', module: 'customer' },
        { code: 'customer:delete', name: 'Delete Customers', module: 'customer' },

        // User/Staff permissions
        { code: 'user:read', name: 'View Users', module: 'user' },
        { code: 'user:create', name: 'Create Users', module: 'user' },
        { code: 'user:update', name: 'Update Users', module: 'user' },
        { code: 'user:delete', name: 'Delete Users', module: 'user' },

        // Billing permissions
        { code: 'billing:read', name: 'View Billing', module: 'billing' },
        { code: 'billing:manage', name: 'Manage Billing', module: 'billing' },

        // Analytics permissions
        { code: 'analytics:read', name: 'View Analytics', module: 'analytics' },

        // Settings permissions
        { code: 'settings:read', name: 'View Settings', module: 'settings' },
        { code: 'settings:update', name: 'Update Settings', module: 'settings' },
    ]

    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { code: perm.code },
            update: {},
            create: perm,
        })
    }

    // =============================================================================
    // ROLES
    // =============================================================================
    console.log('Creating roles...')

    const roleConfigs = [
        {
            name: UserRoleType.SUPER_ADMIN,
            description: 'Full platform access',
            permissions: permissions.map(p => p.code),
        },
        {
            name: UserRoleType.STORE_OWNER,
            description: 'Full store access',
            permissions: [
                'store:read', 'store:update',
                'product:read', 'product:create', 'product:update', 'product:delete',
                'order:read', 'order:update',
                'customer:read', 'customer:create', 'customer:update',
                'user:read', 'user:create', 'user:update',
                'billing:read', 'billing:manage',
                'analytics:read',
                'settings:read', 'settings:update',
            ],
        },
        {
            name: UserRoleType.STORE_ADMIN,
            description: 'Store administration access',
            permissions: [
                'store:read',
                'product:read', 'product:create', 'product:update',
                'order:read', 'order:update',
                'customer:read', 'customer:create', 'customer:update',
                'user:read',
                'analytics:read',
                'settings:read',
            ],
        },
        {
            name: UserRoleType.STAFF,
            description: 'Limited staff access',
            permissions: [
                'product:read',
                'order:read',
                'customer:read',
            ],
        },
        {
            name: UserRoleType.CUSTOMER,
            description: 'Customer access',
            permissions: [],
        },
    ]

    for (const config of roleConfigs) {
        const role = await prisma.role.upsert({
            where: { name: config.name },
            update: {},
            create: {
                name: config.name,
                description: config.description,
            },
        })

        // Assign permissions to role
        for (const permCode of config.permissions) {
            const permission = await prisma.permission.findUnique({ where: { code: permCode } })
            if (permission) {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: role.id,
                            permissionId: permission.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                })
            }
        }
    }

    // =============================================================================
    // PLANS
    // =============================================================================
    console.log('Creating plans...')

    const plans = [
        {
            name: 'Free',
            slug: 'free',
            description: 'Perfect for getting started',
            price: 0,
            interval: 'monthly',
            maxProducts: 10,
            maxOrders: 100,
            maxStorage: 100,
            maxStaff: 2,
            features: { wishlist: true, reviews: true, coupons: true },
            isActive: true,
            isFeatured: false,
        },
        {
            name: 'Starter',
            slug: 'starter',
            description: 'For growing businesses',
            price: 29,
            interval: 'monthly',
            maxProducts: 100,
            maxOrders: 1000,
            maxStorage: 1000,
            maxStaff: 5,
            features: { wishlist: true, reviews: true, coupons: true, analytics: true },
            isActive: true,
            isFeatured: false,
        },
        {
            name: 'Professional',
            slug: 'professional',
            description: 'For established businesses',
            price: 79,
            interval: 'monthly',
            maxProducts: 1000,
            maxOrders: 10000,
            maxStorage: 10000,
            maxStaff: 20,
            features: { wishlist: true, reviews: true, coupons: true, analytics: true, abandonedCart: true },
            isActive: true,
            isFeatured: true,
        },
        {
            name: 'Enterprise',
            slug: 'enterprise',
            description: 'For large scale operations',
            price: 199,
            interval: 'monthly',
            maxProducts: null,
            maxOrders: null,
            maxStorage: null,
            maxStaff: null,
            features: { wishlist: true, reviews: true, coupons: true, analytics: true, abandonedCart: true, multiVendor: true },
            isActive: true,
            isFeatured: false,
        },
    ]

    for (const plan of plans) {
        await prisma.plan.upsert({
            where: { slug: plan.slug },
            update: {},
            create: plan,
        })
    }

    // =============================================================================
    // SUPER ADMIN USER
    // =============================================================================
    console.log('Creating super admin user...')

    const defaultPasswordHash = await hashPassword('password123')

    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@platform.com' },
        update: {},
        create: {
            email: 'admin@platform.com',
            name: 'Platform Admin',
            passwordHash: defaultPasswordHash,
            emailVerified: true,
        },
    })

    // Assign SUPER_ADMIN role to super admin (storeId null = platform-wide)
    const superAdminRole = await prisma.role.findUnique({ where: { name: UserRoleType.SUPER_ADMIN } })
    if (superAdminRole) {
        const existing = await prisma.userRole.findFirst({
            where: {
                userId: superAdmin.id,
                roleId: superAdminRole.id,
                storeId: null,
            },
        })
        if (!existing) {
            await prisma.userRole.create({
                data: {
                    userId: superAdmin.id,
                    roleId: superAdminRole.id,
                    storeId: null,
                },
            })
        }
    }

    // =============================================================================
    // SAMPLE STORE
    // =============================================================================
    console.log('Creating sample store...')

    const store = await prisma.store.upsert({
        where: { slug: 'demo-store' },
        update: {},
        create: {
            name: 'Demo Store',
            slug: 'demo-store',
            subdomain: 'demo',
            status: StoreStatus.ACTIVE,
        },
    })

    const storeOwner = await prisma.user.upsert({
        where: { email: 'owner@demostore.com' },
        update: {},
        create: {
            email: 'owner@demostore.com',
            name: 'Store Owner',
            passwordHash: defaultPasswordHash,
            emailVerified: true,
        },
    })

    await prisma.storeOwner.upsert({
        where: { userId: storeOwner.id },
        update: {},
        create: {
            userId: storeOwner.id,
            storeId: store.id,
        },
    })

    // Assign STORE_OWNER role
    const storeOwnerRole = await prisma.role.findUnique({ where: { name: UserRoleType.STORE_OWNER } })
    if (storeOwnerRole) {
        await prisma.userRole.upsert({
            where: {
                userId_roleId_storeId: {
                    userId: storeOwner.id,
                    roleId: storeOwnerRole.id,
                    storeId: store.id,
                },
            },
            update: {},
            create: {
                userId: storeOwner.id,
                roleId: storeOwnerRole.id,
                storeId: store.id,
            },
        })
    }

    // =============================================================================
    // STORE SETTINGS
    // =============================================================================
    console.log('Creating store settings...')

    await prisma.storeSettings.upsert({
        where: { storeId: store.id },
        update: {},
        create: {
            storeId: store.id,
            siteName: 'Demo Store',
            siteTitle: 'Welcome to Demo Store',
            tagline: 'Your one-stop shop for everything',
            description: 'This is a demo store powered by our multi-tenant ecommerce platform.',
            brandColor: '#6366f1',
            secondaryColor: '#f8fafc',
            metaTitle: 'Demo Store - Best Products Online',
            metaDescription: 'Shop the best products at Demo Store',
            metaKeywords: 'ecommerce, shopping, store',
            ogImage: 'https://example.com/og-image.jpg',
            email: 'contact@demostore.com',
            phone: '+1-555-123-4567',
            address: '123 Commerce Street, New York, NY 10001',
            currency: 'USD',
            currencySymbol: '$',
            language: 'en',
            timezone: 'America/New_York',
            facebookUrl: 'https://facebook.com/demostore',
            twitterUrl: 'https://twitter.com/demostore',
            instagramUrl: 'https://instagram.com/demostore',
        },
    })

    // =============================================================================
    // STORE APPEARANCE
    // =============================================================================
    console.log('Creating store appearance...')

    await prisma.storeAppearance.upsert({
        where: { storeId: store.id },
        update: {},
        create: {
            storeId: store.id,
            themeName: 'default',
            layoutType: 'standard',
            homepageLayout: {
                sections: [
                    { type: 'hero', position: 0 },
                    { type: 'featured-products', position: 1 },
                    { type: 'categories', position: 2 },
                    { type: 'new-arrivals', position: 3 },
                    { type: 'footer', position: 4 },
                ],
            },
            fontConfig: {
                primary: 'Inter',
                secondary: 'Open Sans',
            },
        },
    })

    // =============================================================================
    // STORE FEATURE FLAGS
    // =============================================================================
    console.log('Creating store feature flags...')

    await prisma.storeFeatureFlags.upsert({
        where: { storeId: store.id },
        update: {},
        create: {
            storeId: store.id,
            enableWishlist: true,
            enableReviews: true,
            enableRatings: true,
            enableCoupons: true,
            enableDiscountCodes: true,
            enableInventoryTracking: true,
            enableLowStockAlert: true,
            enableOutOfStock: true,
            enableMultiVendor: false,
            enableVendorDashboard: false,
            enableSocialLogin: true,
            enableSocialShare: true,
            enableAdvancedAnalytics: false,
            enableAbandonedCart: false,
            enableGuestCheckout: true,
            enableQuickView: true,
            enableCompareProducts: false,
            enableShippingCalculator: true,
            enableLocalPickup: true,
            enableInternationalShipping: true,
            enableEmailNotifications: true,
            enableSmsNotifications: false,
        },
    })

    // =============================================================================
    // CATEGORIES
    // =============================================================================
    console.log('Creating categories...')

    const categories = [
        { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
        { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
        { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' },
        { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear' },
    ]

    const createdCategories: { id: number; slug: string }[] = []
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { storeId_slug: { storeId: store.id, slug: cat.slug } },
            update: {},
            create: {
                storeId: store.id,
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                isActive: true,
                showInMenu: true,
                position: createdCategories.length,
            },
        })
        createdCategories.push(category)
    }

    // Sub-categories for Electronics
    const electronicsCategory = createdCategories.find(c => c.slug === 'electronics')
    if (electronicsCategory) {
        await prisma.category.upsert({
            where: { storeId_slug: { storeId: store.id, slug: 'smartphones' } },
            update: {},
            create: {
                storeId: store.id,
                parentId: electronicsCategory.id,
                name: 'Smartphones',
                slug: 'smartphones',
                description: 'Mobile phones and accessories',
                isActive: true,
                showInMenu: true,
                position: 0,
            },
        })

        await prisma.category.upsert({
            where: { storeId_slug: { storeId: store.id, slug: 'laptops' } },
            update: {},
            create: {
                storeId: store.id,
                parentId: electronicsCategory.id,
                name: 'Laptops',
                slug: 'laptops',
                description: 'Laptops and computers',
                isActive: true,
                showInMenu: true,
                position: 1,
            },
        })
    }

    // =============================================================================
    // BRANDS
    // =============================================================================
    console.log('Creating brands...')

    const brands = [
        { name: 'Apple', slug: 'apple', website: 'https://apple.com' },
        { name: 'Samsung', slug: 'samsung', website: 'https://samsung.com' },
        { name: 'Nike', slug: 'nike', website: 'https://nike.com' },
        { name: 'Adidas', slug: 'adidas', website: 'https://adidas.com' },
    ]

    for (const brand of brands) {
        await prisma.brand.upsert({
            where: { storeId_slug: { storeId: store.id, slug: brand.slug } },
            update: {},
            create: {
                storeId: store.id,
                name: brand.name,
                slug: brand.slug,
                website: brand.website,
                isActive: true,
            },
        })
    }

    // =============================================================================
    // PRODUCTS
    // =============================================================================
    console.log('Creating products...')

    const products = [
        {
            name: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            description: 'The latest iPhone with A17 Pro chip',
            price: 999.00,
            compareAtPrice: 1099.00,
            sku: 'IPH15PRO',
            quantity: 100,
            isFeatured: true,
            isPublished: true,
            categorySlug: 'smartphones',
            brandSlug: 'apple',
            metaKeywords: ['iphone', 'apple', 'smartphone', 'mobile'],
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            slug: 'samsung-galaxy-s24-ultra',
            description: 'Samsung flagship with AI features',
            price: 1199.00,
            compareAtPrice: 1299.00,
            sku: 'SGALS24U',
            quantity: 75,
            isFeatured: true,
            isPublished: true,
            categorySlug: 'smartphones',
            brandSlug: 'samsung',
            metaKeywords: ['samsung', 'galaxy', 'smartphone', 'android'],
        },
        {
            name: 'MacBook Pro 14"',
            slug: 'macbook-pro-14',
            description: 'Powerful laptop with M3 Pro chip',
            price: 1999.00,
            compareAtPrice: null,
            sku: 'MBP14M3',
            quantity: 50,
            isFeatured: true,
            isPublished: true,
            categorySlug: 'laptops',
            brandSlug: 'apple',
            metaKeywords: ['macbook', 'apple', 'laptop', 'computer'],
        },
        {
            name: 'Nike Air Max 90',
            slug: 'nike-air-max-90',
            description: 'Classic sneakers with Air cushioning',
            price: 130.00,
            compareAtPrice: 150.00,
            sku: 'NAM90',
            quantity: 200,
            isFeatured: false,
            isPublished: true,
            categorySlug: 'clothing',
            brandSlug: 'nike',
            metaKeywords: ['nike', 'sneakers', 'shoes', 'air max'],
        },
        {
            name: 'Adidas Ultraboost 22',
            slug: 'adidas-ultraboost-22',
            description: 'Running shoes with Boost technology',
            price: 190.00,
            compareAtPrice: null,
            sku: 'ADUB22',
            quantity: 150,
            isFeatured: false,
            isPublished: true,
            categorySlug: 'clothing',
            brandSlug: 'adidas',
            metaKeywords: ['adidas', 'running', 'shoes', 'ultraboost'],
        },
    ]

    for (const prod of products) {
        const category = createdCategories.find(c => c.slug === prod.categorySlug)
        const brand = await prisma.brand.findUnique({
            where: { storeId_slug: { storeId: store.id, slug: prod.brandSlug } },
        })

        await prisma.product.upsert({
            where: { storeId_slug: { storeId: store.id, slug: prod.slug } },
            update: {},
            create: {
                storeId: store.id,
                name: prod.name,
                slug: prod.slug,
                description: prod.description,
                price: prod.price,
                compareAtPrice: prod.compareAtPrice,
                sku: prod.sku,
                quantity: prod.quantity,
                trackInventory: true,
                isFeatured: prod.isFeatured,
                isPublished: prod.isPublished,
                status: 'active',
                categoryId: category?.id,
                brandId: brand?.id,
                metaKeywords: prod.metaKeywords,
            },
        })
    }

    // =============================================================================
    // COUPONS
    // =============================================================================
    console.log('Creating coupons...')

    await prisma.coupon.upsert({
        where: { storeId_code: { storeId: store.id, code: 'WELCOME10' } },
        update: {},
        create: {
            storeId: store.id,
            code: 'WELCOME10',
            type: 'percentage',
            value: 10,
            minOrderAmount: 50,
            maxDiscount: 100,
            usageLimit: 1000,
            perUserLimit: 1,
            productIds: [],
            categoryIds: [],
            customerIds: [],
            newCustomersOnly: true,
            isActive: true,
            description: '10% off for new customers',
        },
    })

    await prisma.coupon.upsert({
        where: { storeId_code: { storeId: store.id, code: 'FREESHIP' } },
        update: {},
        create: {
            storeId: store.id,
            code: 'FREESHIP',
            type: 'free_shipping',
            value: 0,
            minOrderAmount: 100,
            usageLimit: 500,
            perUserLimit: 3,
            productIds: [],
            categoryIds: [],
            customerIds: [],
            newCustomersOnly: false,
            isActive: true,
            description: 'Free shipping on orders over $100',
        },
    })

    // =============================================================================
    // SAMPLE CUSTOMER
    // =============================================================================
    console.log('Creating sample customer...')

    const customer = await prisma.customer.upsert({
        where: { storeId_email: { storeId: store.id, email: 'john.doe@example.com' } },
        update: {},
        create: {
            storeId: store.id,
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1-555-987-6543',
            emailVerified: true,
            totalOrders: 0,
            totalSpent: 0,
        },
    })

    // Customer address
    await prisma.address.upsert({
        where: { id: 1 },
        update: {},
        create: {
            customerId: customer.id,
            type: 'shipping',
            firstName: 'John',
            lastName: 'Doe',
            address1: '456 Customer Ave',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'USA',
            phone: '+1-555-987-6543',
            isDefault: true,
        },
    })

    console.log('✅ Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
