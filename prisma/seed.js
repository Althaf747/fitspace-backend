import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import {prismaClient} from "../src/application/database.js";
import {logger} from "../src/application/logging.js";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('Test1234*', 10); // Ensure password is hashed before using it

    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            first_name: 'test',
            last_name: '1234',
            password: password,  // Use the hashed password here
            role: 'user',
            otp: 123452,
            otp_expired_at: new Date('2025-06-01 00:00:00'),
        },
    });

    // Create 5 dummy users
    const users = await Promise.all(
        Array.from({ length: 5 }).map((_, index) =>
            prisma.user.create({
                data: {
                    email: `john.doe${index + 1}@example.com`,
                    first_name: 'John',
                    last_name: `Doe${index + 1}`,
                    password: 'hashed_password_123',
                    role: 'user',
                    otp: 123453 + index,
                    otp_expired_at: new Date('2025-06-01 00:00:00'),
                },
            })
        )
    );

    // Create 5 dummy venues for each user
    const venues = await Promise.all(
        users.map((user, index) =>
            prisma.venue.create({
                data: {
                    owner_id: user.id,
                    name: `Progresif Sport Center ${index + 1}`,
                    phone_number: `123-456-789${index}`,
                    street: `Jl. Progresif No. ${index + 1}`,
                    district: `District ${index + 1}`,
                    city_or_regency: `City ${index + 1}`,
                    province: `Province ${index + 1}`,
                    postal_code: `1234${index}`,
                    latitude: 40.7128 + index * 0.01,
                    longitude: -74.0060 - index * 0.01,
                    rating: 4.5,
                },
            })
        )
    );

    // Create 5 dummy fields for each venue
    const fields = await Promise.all(
        venues.map((venue, index) =>
            prisma.field.create({
                data: {
                    venue_id: venue.id,
                    price: 500000 + index * 100000,
                    type: ["Futsal", "Basketball", "Badminton", "Volleyball"][Math.floor(Math.random() * 3)],
                },
            })
        )
    );

    // Insert 5 dummy gallery photos for each field
    await Promise.all(
        fields.map((field, index) =>
            prisma.gallery.create({
                data: {
                    field_id: field.id,
                    photoUrl: `/uploads/1749347070653-6y4os2mr81u91.png`,
                    description: `Main football field ${index + 1}`,
                },
            })
        )
    );

    const createScheduleIfNotExist = async () => {
        const today = new Date();
        const startOfWeek = new Date(today);

        let dayOfWeek = today.getDay();
        let adjustedDay = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

        startOfWeek.setDate(today.getDate() - adjustedDay);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const schedulesThisWeek = await prismaClient.schedule.findMany({
            where: {
                date: {
                    gte: startOfWeek,
                    lte: endOfWeek
                }
            }
        });

        if (schedulesThisWeek.length === 0) {
            const time_slots = [
                "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00",
                "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
                "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00",
                "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00",
                "22:00 - 23:00", "23:00 - 00:00"
            ];

            for (let i = 0; i < 7; i++) {
                const scheduleDate = new Date(startOfWeek);
                scheduleDate.setDate(startOfWeek.getDate() + i);

                const newSchedules = time_slots.map(time_slot => ({
                    date: scheduleDate,
                    time_slot,
                    created_at: new Date(),
                    updated_at: new Date()
                }));

                await prismaClient.schedule.createMany({ data: newSchedules });
            }
        }
    };

    const today = new Date();
    const startOfWeek = new Date(today);

    let dayOfWeek = today.getDay();
    let adjustedDay = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

    startOfWeek.setDate(today.getDate() - adjustedDay - 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    let schedulesThisWeek = await prismaClient.schedule.findMany({
        where: {
            date: {
                gte: startOfWeek,
                lte: endOfWeek
            }
        }
    });

    if (schedulesThisWeek.length === 0) {
        await createScheduleIfNotExist();
        schedulesThisWeek = await prismaClient.schedule.findMany({
            where: {
                date: {
                    gte: startOfWeek,
                    lte: endOfWeek
                }
            }
        });
    }

    logger.info(`SCHW: ${schedulesThisWeek.length}` );

    await Promise.all(
        fields.map((field, index) =>
            Promise.all(schedulesThisWeek.map(schedule => {
                    logger.info(`INDEX: ${index}`)
                    return prismaClient.fieldSchedule.create({
                        data: {
                            field_id: field.id,
                            schedule_id: schedule.id,
                            status: "Available"
                        }
                    })
                }
            ))
        )
    );

    // Insert 5 dummy reviews for the fields
    await Promise.all(
        fields.map((field, index) =>
            prisma.review.create({
                data: {
                    field_id: field.id,
                    user_id: users[index].id,
                    rating: 1 + index,
                    comment: `Great field ${index + 1}, very spacious and well-maintained!`,
                },
            })
        )
    );

    // Insert 5 dummy bookings for the fields
    await Promise.all(
        fields.map((field, index) =>
            prisma.booking.create({
                data: {
                    status: 'confirmed',
                    customer_id: users[index].id,
                    schedule_id: schedulesThisWeek[index].id,
                    field_id: field.id,
                },
            })
        )
    );

    console.log('5 sets of dummy data seeded successfully!');
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
