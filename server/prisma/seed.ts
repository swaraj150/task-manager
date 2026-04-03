import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';

let prisma:PrismaClient;

async function main() {
    prisma = new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
    })
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const alice = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@test.com',
            password: await bcrypt.hash('password123', 10),
        },
    });

    const bob = await prisma.user.create({
        data: {
            name: 'Bob',
            email: 'bob@test.com',
            password: await bcrypt.hash('password123', 10),
        },
    });

    await prisma.task.createMany({
        data: [
            {
                title: 'Buy groceries',
                description: 'Milk, eggs, bread',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: new Date('2025-12-01'),
                userId: alice.id,
            },
            {
                title: 'Finish NestJS project',
                description: 'Complete auth and tasks module',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: new Date('2025-11-01'),
                userId: alice.id,
            },
        ],
    });

    await prisma.task.create({
        data: {
            title: 'Read a book',
            status: 'TODO',
            priority: 'LOW',
            dueDate: new Date('2025-12-15'),
            userId: bob.id,
        },
    });

}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });