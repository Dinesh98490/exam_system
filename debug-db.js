const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1:27017/exam-portal?directConnection=true";

console.log("Attempting to connect to:", uri);

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false
})
    .then(() => {
        console.log("Successfully connected to MongoDB");
        return mongoose.connection.db.admin().listDatabases();
    })
    .then(dbs => {
        console.log("Databases:", dbs.databases.map(db => db.name));
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
