const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const URI = 'mongodb://localhost:27017/authsyst';

        await mongoose.connect(URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;