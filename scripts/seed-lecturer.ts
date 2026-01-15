import User from '../models/User';
import { hashPassword } from '../lib/auth/password';
import dbConnect from '../lib/mongoose';

async function seedLecturer() {
    await dbConnect();

    console.log('Seeding lecturer account...');

    const email = 'dkunwar857@gmail.com';
    const password = 'Lecturer100';
    const name = 'Dinesh Kunwar';

    const passwordHash = await hashPassword(password);

    // Update if exists, or create new
    await User.findOneAndUpdate(
        { email },
        {
            name,
            email,
            passwordHash,
            role: 'LECTURER',
            isLocked: false,
            failedLoginAttempts: 0,
            updatedAt: new Date()
        },
        { upsert: true, new: true }
    );

    console.log(`Lecturer account ${email} seeded successfully.`);
    process.exit(0);
}

seedLecturer().catch((err) => {
    console.error('Error seeding lecturer:', err);
    process.exit(1);
});
