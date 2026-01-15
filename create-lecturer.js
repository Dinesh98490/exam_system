const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const uri = "mongodb://127.0.0.1:27017/exam-portal?directConnection=true";
const email = "dkunwar857@gmail.com";
const password = "Lecturer100";
const name = "Dinesh Kunwar";

async function updateLecturer() {
    console.log("Attempting to connect to:", uri);
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false
        });
        console.log("Successfully connected to MongoDB");

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Hash password
        console.log("Hashing password...");
        const passwordHash = await bcrypt.hash(password, 12);

        // Update user (or create if somehow deleted in between)
        const result = await usersCollection.updateOne(
            { email },
            {
                $set: {
                    passwordHash: passwordHash,
                    role: "LECTURER",
                    name: name,
                    updatedAt: new Date(),
                    isLocked: false,
                    failedLoginAttempts: 0
                }
            },
            { upsert: true }
        );

        if (result.matchedCount > 0) {
            console.log("Lecturer account updated successfully!");
        } else if (result.upsertedCount > 0) {
            console.log("Lecturer account created via upsert!");
        }

        process.exit(0);
    } catch (err) {
        console.error("Error updating lecturer account:", err);
        process.exit(1);
    }
}

updateLecturer();
