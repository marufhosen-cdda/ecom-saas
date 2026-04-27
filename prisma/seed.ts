import { Prisma, PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
});

const userData: Prisma.UserCreateInput[] = [
    {
        name: "Alice",
        email: "alice@prisma.io",
        posts: {
            create: [
                {
                    title: "Join the Prisma Discord",
                    content: "https://pris.ly/discord",
                    published: true,
                },
                {
                    title: "Prisma on YouTube",
                    content: "https://pris.ly/youtube",
                },
            ],
        },
    },
    {
        name: "Bob",
        email: "bob@prisma.io",
        posts: {
            create: [
                {
                    title: "Follow Prisma on Twitter",
                    content: "https://www.twitter.com/prisma",
                    published: true,
                },
            ],
        },
    },
];

export async function main() {
    for (const u of userData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });