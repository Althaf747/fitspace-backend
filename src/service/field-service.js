import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import fs from "fs";
import {fileURLToPath} from 'url';
import path from "path";
import {logger} from "../application/logging.js";

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

const createFieldSchedules = async (fieldId) => {
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

    return await Promise.all(schedulesThisWeek.map(schedule =>
        prismaClient.fieldSchedule.create({
            data: {
                field_id: fieldId,
                schedule_id: schedule.id,
                status: "Available"
            }
        })
    ));
}

const create = async (venue_id,files,req) => {
    logger.info("DATA: ", req.body);
    const data = JSON.parse(req.body.field);


    let gallery;
    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venue_id
        }
    })
    if (!venue) {
        throw new ResponseError(404,'venue not found');
    }
    if (venue.owner_id !== req.user.id) throw new ResponseError(403, "You are not the owner of this venue");

    const field = await prismaClient.field.create({
        data: {
            price: parseInt(data.price),
            type: data.type,
            venue_id: venue.id
        }
    });

    if (files.length !== 0) {
            gallery = await Promise.all(files.map(async (file) => {
            const fileName = saveFileLocally(file);
            return prismaClient.gallery.create({
                data: {
                    photoUrl: `/uploads/${fileName}`,
                    field_id: field.id
                }
            });
        }));
    }

    const field_schedules = await createFieldSchedules(field.id);

    return {field, gallery, field_schedules};

}

const get = async (id) => {
    const field = await prismaClient.field.findUnique({
        where: { id },
        select: {
            id: true,
            venue_id: true,
            price: true,
            type: true,
            gallery: {
              select: {
                  photoUrl: true
              }
            },
            field_schedules: {  // Include schedules
                select: {
                    status: true,
                    schedule: {
                        select: {
                            id: true,
                            date: true,
                            time_slot: true,

                        }
                    }
                }
            }
        }
    })
    if (!field) {
        throw new ResponseError(404,'field not found');
    }

    await createFieldSchedules(id)

    return field
}

const getAll = async (venue_id) => {
    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venue_id,
        }
    })
    if (!venue) {
        throw new ResponseError(404,'venue not found');
    }

    if (venue.fields && Array.isArray(venue.fields)) {
        venue.fields.map(async (field) => {
            await createFieldSchedules(field.id);
        });
    } else {
        console.error('venue.fields is undefined or not an array');
    }

    return prismaClient.field.findMany({
        where: { venue_id : venue_id },
        select: {
            id: true,
            venue_id: true,
            price: true,
            type: true,
            gallery: {
                select: {
                    photoUrl: true
                }
            },
            field_schedules: {
                select: {
                    status: true,
                    schedule: {
                        select: {
                            id: true,
                            date: true,
                            time_slot: true,
                        }
                    }
                }
            },
            reviews : {
                select: {
                    id: true,
                    field_id: true,
                    rating : true,
                    comment: true,
                    user : true,
                }
            }
        }
    })
}

const updateField = async (req, files, venue_id, field_id) => {
    const data = JSON.parse(req.body.field);
    const removedImages = data.removedImages;
    const user = req.user;

    // Verifikasi Venue
    const venue = await prismaClient.venue.findUnique({ where: { id: venue_id } });
    if (!venue) throw new ResponseError(404, "Venue not found");
    if (venue.owner_id !== user.id) {
        throw new ResponseError(403, "You are not the owner of this venue");
    }

    // Verifikasi Field
    const field = await prismaClient.field.findUnique({
        where: { id: field_id },
        select: { field_schedules: true }
    });
    if (!field) {
        throw new ResponseError(404, "Field not found");
    }

    const existingfield_schedules = field.field_schedules;

    // Update field_schedules
    if (data.field_schedules && data.field_schedules.length > 0) {
        // Update field_schedules satu per satu
        await Promise.all(data.field_schedules.map(async (scheduleData, index) => {
            const fieldSchedule = existingfield_schedules[index];
            await prismaClient.fieldSchedule.update({
                where: {
                    id: fieldSchedule.id,  // Pastikan untuk menggunakan ID yang benar
                },
                data: {
                    status: scheduleData.status,  // Mengupdate status
                }
            });
        }));
    }

    logger.info("HEREEEE");
    logger.info(`RF: ${removedImages}`);

    if (removedImages.length > 0) {
        const deleteFilePromises = removedImages.map(async (file) => {
            const filePath = path.join(__dirname, '../uploads', path.basename(file)); // Assuming uploads directory and filename
            const photo = await prismaClient.gallery.findFirst({ where: { photoUrl: file } });

            const deleteFromDbPromise = prismaClient.gallery.delete({
                where: { id: photo.id },
            });

            const deleteFromLocalPromise = new Promise((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file from local storage:', err);
                        reject(err);
                    } else {
                        console.log('File deleted from local storage:', filePath);
                        resolve();
                    }
                });
            });

            return Promise.all([deleteFromDbPromise, deleteFromLocalPromise]);
        });

        await Promise.all(deleteFilePromises);
    }

    // Logika untuk menyimpan gambar baru jika ada
    if (files && files.length > 0) {
        await Promise.all(files.map(async (file) => {
            const fileName = saveFileLocally(file);
            return prismaClient.gallery.create({
                data: {
                    photoUrl: `/uploads/${fileName}`,
                    field_id: field.id
                }
            });
        }));
    }

    // Update field (harga dan jenis) jika ada perubahan
    const fieldData = {
        price: data.price || field.price,
        type: data.type || field.type,
    };

    // Pastikan field_id disertakan untuk operasi update
    if (field_id) {
        await prismaClient.field.update({
            where: { id: field_id }, // Gunakan field_id yang valid
            data: fieldData,
        });
    } else {
        throw new ResponseError(400, "Field ID is missing");
    }

    return field;
};




const deleteField = async (id, venue_id, req) => {
    console.log(id)
    const field = await prismaClient.field.findUnique({
        where: { id },
        include: { gallery: true, field_schedules: true } // Include related data
    });

    if (!field) {
        throw new ResponseError(404, "field not found");
    }

    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venue_id
        }
    })
    if(req.user.id !== venue.owner_id) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    if (field.gallery && field.gallery.length > 0) {
        await prismaClient.gallery.deleteMany({
            where: { field_id: id }
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

    if (field.field_schedules && field.field_schedules.length > 0) {
        await prismaClient.fieldSchedule.deleteMany({
            where: { field_id: id }
        });
    }

    await prismaClient.field.delete({
        where: {
            id : id
        }
    })

}

export default { create,get, getAll, updateField, deleteField };