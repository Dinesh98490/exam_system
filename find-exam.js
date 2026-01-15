const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1:27017/exam-portal?directConnection=true";

console.log("Attempting to connect to:", uri);

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false
})
    .then(async () => {
        console.log("Successfully connected to MongoDB");
        const exams = await mongoose.connection.db.collection('exams').find().toArray();
        console.log("Found exams:", exams.length);
        if (exams.length > 0) {
            console.log("EXAM_ID:", exams[0]._id.toString());
        } else {
            // Check in lowercase collection just in case
            const exams2 = await mongoose.connection.db.collection('exam').find().toArray();
            if (exams2.length > 0) {
                console.log("EXAM_ID:", exams2[0]._id.toString());
            } else {
                console.log("No exams found in 'exams' or 'exam' collection");
            }
        }
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
