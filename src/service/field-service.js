
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

const saveFileLocally = (file) => {
    if (!file || !file.originalname) {
        throw new Error("Invalid file object");
    }

    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    return fileName;
};

const createScheduleIfNotExist = async () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set to Monday
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
        const timeSlots = [
            "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00",
            "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
            "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00",
            "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00",
            "22:00 - 23:00", "23:00 - 00:00"
        ];

        for (let i = 0; i < 7; i++) {
            const scheduleDate = new Date(startOfWeek);
            scheduleDate.setDate(startOfWeek.getDate() + i);

            const newSchedules = timeSlots.map(timeSlot => ({
                date: scheduleDate,
                timeSlot,
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            await prismaClient.schedule.createMany({ data: newSchedules });
        }
    }
};

const create = async (venueId,files,req) => {
    const data = req.body
    let gallery;
    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venueId
        }
    })
    if (!venue) {
        throw new ResponseError(404,'venue not found');
    }
    if (venue.ownerId !== req.user.id) throw new ResponseError(403, "You are not the owner of this venue");

    const field = await prismaClient.field.create({
        data: {
            price: parseInt(data.price),
            type: data.type,
            venueId: venue.id
        }
    });

    if (files.length !== 0) {
            gallery = await Promise.all(files.map(async (file) => {
            const fileName = saveFileLocally(file);
            return prismaClient.gallery.create({
                data: {
                    galleryUrl: `/uploads/${fileName}`,
                    fieldId: field.id
                }
            });
        }));
    }

    let schedulesThisWeek = await prismaClient.schedule.findMany({
        where: {
            date: {
                gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)),
                lte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 7))
            }
        }
    });

    if (schedulesThisWeek.length === 0) {
        await createScheduleIfNotExist();
        schedulesThisWeek = await prismaClient.schedule.findMany({
            where: {
                date: {
                    gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)),
                    lte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 7))
                }
            }
        });
    }

    const fieldSchedules = await Promise.all(schedulesThisWeek.map(schedule =>
        prismaClient.fieldSchedule.create({
            data: {
                fieldId: field.id,
                scheduleId: schedule.id,
                status: "Available"
            }
        })
    ));

    return {field, gallery, fieldSchedules};

}

const get = async (id, req) => {
    const field = await prismaClient.field.findUnique({
        where: { id },
        select: {
            id: true,
            venueId: true,
            price: true,
            type: true,
            fieldSchedules: {  // Include schedules
                select: {
                    schedule: {
                        select: {
                            id: true,
                            date: true,
                            timeSlot: true
                        }
                    }
                }
            }
        }
    })
    if (!field) {
        throw new ResponseError(404,'field not found');
    }

    return field
}

const getAll = async (venueId) => {
    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venueId,
        }
    })
    if (!venue) {
        throw new ResponseError(404,'venue not found');
    }
    return prismaClient.field.findMany({
        where: { venueId : venueId },
        select: {
            id: true,
            venueId: true,
            price: true,
            type: true,
            fieldSchedules: {  // Include schedules
                select: {
                    schedule: {
                        select: {
                            id: true,
                            date: true,
                            timeSlot: true
                        }
                    }
                }
            }
        }
    })
}

const updateField = async (req,files, venueId, fieldId) => {
    const user = req.user;
    const venue = await prismaClient.venue.findUnique({ where: {
        id: venueId }
    });
    if (!venue) throw new ResponseError(404, "Venue not found");
    if (venue.ownerId !== user.id) {
        throw new ResponseError(403, "You are not the owner of this venue");
    }

    const field = await prismaClient.field.findUnique({ where: {
        id: fieldId }
    });
    if (!field) {
        throw new ResponseError(404, "Field not found");
    }

    const existingFieldSchedules = field.fieldSchedules;
    if (req.fieldSchedules && req.fieldSchedules.length > 0) {
        for (let i = 0; i < existingFieldSchedules.length; i++) {
            const fieldSchedule = existingFieldSchedules[i];
            const newStatus = req.fieldSchedules[i].status;
            if (newStatus) {
                fieldSchedule.status = newStatus;
            }
        }
        await prismaClient.fieldSchedule.updateMany({
            data: existingFieldSchedules
        });
    }

    // kode buat hapus poto

    if (files && files.length > 0) {
        const newgallerys = await Promise.all(files.map(async (file) => {
            const fileName = saveFileLocally(file);
            const gallery = await prismaClient.gallery.create({
                data: {
                    photoUrl: `/uploads/${fileName}`,
                    fieldId: field.id
                }
            });
            return gallery;
        }));
    }

    if (req.price) {
        field.price = req.price;
    }

    if (req.type) {
        field.type = req.type;
    }

    await prismaClient.field.update({
        where: { id: field.id },
        data: field
    });

    return field;
};

const deleteField = async (id, venueId, req) => {
    console.log(id)
    const field = await prismaClient.field.findUnique({
        where: { id },
        include: { gallery: true, fieldSchedules: true } // Include related data
    });

    if (!field) {
        throw new ResponseError(404, "field not found");
    }

    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venueId
        }
    })
    if(req.user.id !== venue.ownerId) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    if (field.gallery && field.gallery.length > 0) {
        await prismaClient.gallery.deleteMany({
            where: { fieldId: id }
        });


        field.gallery.forEach(photo => {
            const filePath = path.join(uploadDir, photo.photoUrl.replace("/uploads/", ""));
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted file: ${filePath}`);
                }
            } catch (error) {
                console.error(`Failed to delete file: ${filePath}`, error);
            }
        });
    }

    if (field.fieldSchedules && field.fieldSchedules.length > 0) {
        await prismaClient.fieldSchedule.deleteMany({
            where: { fieldId: id }
        });
    }

    await prismaClient.field.delete({
        where: {
            id : id
        }
    })

}

export default { create,get, getAll, updateField, deleteField };