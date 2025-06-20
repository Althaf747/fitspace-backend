import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import {prismaClient} from "../src/application/database.js";
import {logger} from "../src/application/logging.js";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('Test1234*', 10); // Ensure password is hashed before using it
    const adminPassword = await bcrypt.hash('Admin1234*', 10);

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

    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            first_name: 'admin',
            last_name: '1234',
            password: adminPassword,  // Use the hashed password here
            role: 'admin',
            otp: 123450,
            otp_expired_at: new Date('2025-06-01 00:00:00'),
        },
    });

    // Create 5 dummy users
    const users = await Promise.all(
        Array.from({ length: 12 }).map((_, index) =>
            prisma.user.create({
                data: {
                    email: `john.doe${index + 1}@example.com`,
                    first_name: 'John',
                    last_name: `Doe${index + 1}`,
                    password: 'hashed_password_123',
                    role: 'user',
                    otp: 123453 + index,
                    otp_expired_at: new Date('2025-06-01 00:00:00'),
                    created_at: new Date('2025-06-01 00:00:00'),
                },
            })
        )
    );

    const jakartaLat = -6.2088;
    const jakartaLon = 106.8456;
    const bandungLat = -6.9147;
    const bandungLon = 107.6098;

    const venues = await Promise.all(
        users.map((user, index) =>
            prisma.venue.create({
                data: {
                    owner_id: user.id,
                    name: `Progresif Sport Center ${index + 1}`,
                    phone_number: `123-456-789${index}`,
                    street: `Jl. Progresif No. ${index + 1}`,
                    district: `District ${index + 1}`,
                    city_or_regency: ["Kota Bandung", "Kabupaten Bandung", "Kabupaten Bandung Barat"][Math.floor(Math.random() * 3)],
                    province: `Jawa Barat`,
                    postal_code: `1234${index}`,
                    latitude:
                        Math.random() < 0.5
                            ? jakartaLat + Math.random() * 0.05 // Small variation within Jakarta
                            : bandungLat + Math.random() * 0.05, // Small variation within Bandung
                    longitude:
                        Math.random() < 0.5
                            ? jakartaLon + Math.random() * 0.05 // Small variation within Jakarta
                            : bandungLon + Math.random() * 0.05, // Small variation within Bandung
                    rating: 4.5,
                },
            })
        )
    );


    // Create 10 dummy fields for each venue
    const promiseFields = await Promise.all(
        venues.map((venue, index) =>
            Promise.all([
                prisma.field.create({
                    data: {
                        venue_id: venue.id,
                        price: 500000 + index * 100000,
                        type: ["Futsal", "Basketball", "Badminton", "Volleyball"][Math.floor(Math.random() * 4)],  // Memastikan 4 tipe (index 0-3)
                    },
                }),
                prisma.field.create({
                    data: {
                        venue_id: venue.id,
                        price: 500000 + index * 100000 + 50000, // Harga berbeda untuk field kedua
                        type: ["Futsal", "Basketball", "Badminton", "Volleyball"][Math.floor(Math.random() * 4)],
                    },
                })
            ])
        )
    );


    // Insert 10 dummy gallery photos for each field
    await Promise.all(
        promiseFields.map((fields) => Promise.all(
            fields.map((field, index) => Promise.all([
                logger.info(`FIELD ${JSON.stringify(field.id)}`),
                prisma.gallery.create({
                    data: {
                        field_id: field.id,
                        photoUrl: [`/uploads/1749347070653-6y4os2mr81u91.png`, '/uploads/1749347322258-153ba53016b838cc927598957958.jpg', '/uploads/1749378953872-wyndon_stadium__galar_league__by_willdinomaster55_ddq2l5d-pre.jpg'][Math.floor(Math.random() * 3)],
                        description: `Main football field ${index + 1}`,
                    },
                }),
                prisma.gallery.create({
                    data: {
                        field_id: field.id,
                        photoUrl: [`/uploads/1749347070653-6y4os2mr81u91.png`, '/uploads/1749347322258-153ba53016b838cc927598957958.jpg', '/uploads/1749378953872-wyndon_stadium__galar_league__by_willdinomaster55_ddq2l5d-pre.jpg'][Math.floor(Math.random() * 3)],
                        description: `Main football field ${index + 1}`,
                    },
                }),
            ]))
        ))
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

    startOfWeek.setDate(today.getDate() - adjustedDay);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

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
        promiseFields.map((fields) => Promise.all(
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
        ))
    );

    await Promise.all(
        promiseFields.map((fields) => Promise.all(
            fields.map((field, index) =>
                prisma.review.create({
                    data: {
                        field_id: field.id,
                        user_id: users[index].id,
                        rating: Math.floor(Math.random() * 6),
                        comment: `Great field ${index + 1}, very spacious and well-maintained!`,
                    },
                })
            )
        ))
    );

    await Promise.all(
        promiseFields.map((fields) => Promise.all(
            fields.map((field, index) =>
                prisma.booking.create({
                    data: {
                        status: 'ongoing',
                        customer_id: users[index].id,
                        schedule_id: schedulesThisWeek[index].id,
                        field_id: field.id,
                    },
                })
            )
        ))
    );

    await Promise.all(
        promiseFields.map((fields) => Promise.all(
            fields.map((field, index) =>
                prisma.booking.create({
                    data: {
                        status: 'ongoing',
                        customer_id: user.id,
                        schedule_id: schedulesThisWeek[index].id,
                        field_id: field.id,
                    },
                })
            )
        ))
    );
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
