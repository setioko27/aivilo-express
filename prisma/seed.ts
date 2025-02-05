import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seed = async () => {
    try {
        // Seed roles
        await prisma.role.createMany({
            data: [
                {
                    name: "Super Admin",
                    permissions: JSON.stringify([
                        "read user",
                        "write user",
                        "read role",
                        "write role",
                    ]),
                },
                { name: "Guest", permissions: JSON.stringify(["read user"]) },
                { name: "No Access", permissions: "" },
            ],
        });

        // Seed users
        await prisma.user.create({
            data: {
                name: "Admin User",
                email: "admin@example.com",
                password: bcrypt.hashSync("admin123", 10), // bcrypt hash (gantilah ini dengan hasil hash bcrypt)
                role_id: 1,
            },
        });

        console.log("✅ Database seeding complete.");
    } catch (error) {
        console.error("❌ Seeding error:", error);
    } finally {
        await prisma.$disconnect();
    }
};

seed();
