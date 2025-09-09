require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const seedUsers = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin',
        address: '123 Main St',
        phone: '123-456-7890',
        age: 30,
        gender: 'Male',
        province: 'Hanoi'
    },
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'User',
        address: '456 Oak Ave',
        phone: '098-765-4321',
        age: 25,
        gender: 'Male',
        province: 'Ho Chi Minh'
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        role: 'User',
        address: '789 Pine Ln',
        phone: '555-555-5555',
        age: 28,
        gender: 'Female',
        province: 'Da Nang'
    },
    {
        name: 'Peter Jones',
        email: 'peter.jones@example.com',
        password: 'password123',
        role: 'User',
        address: '101 Maple Dr',
        phone: '111-222-3333',
        age: 42,
        gender: 'Male',
        province: 'Hanoi'
    },
    {
        name: 'Mary Williams',
        email: 'mary.williams@example.com',
        password: 'password123',
        role: 'User',
        address: '212 Birch Rd',
        phone: '444-555-6666',
        age: 35,
        gender: 'Female',
        province: 'Can Tho'
    },
    {
        name: 'David Brown',
        email: 'david.brown@example.com',
        password: 'password123',
        role: 'User',
        address: '333 Cedar St',
        phone: '777-888-9999',
        age: 45,
        gender: 'Male',
        province: 'Hai Phong'
    },
    {
        name: 'Linda Davis',
        email: 'linda.davis@example.com',
        password: 'password123',
        role: 'User',
        address: '444 Elm St',
        phone: '123-123-1234',
        age: 29,
        gender: 'Female',
        province: 'Ho Chi Minh'
    },
    {
        name: 'Michael Miller',
        email: 'michael.miller@example.com',
        password: 'password123',
        role: 'Admin',
        address: '555 Pine St',
        phone: '456-456-4567',
        age: 38,
        gender: 'Male',
        province: 'Dong Nai'
    },
    {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        password: 'password123',
        role: 'User',
        address: '666 Oak St',
        phone: '789-789-7890',
        age: 31,
        gender: 'Female',
        province: 'Da Nang'
    },
    {
        name: 'James Moore',
        email: 'james.moore@example.com',
        password: 'password123',
        role: 'User',
        address: '777 Maple St',
        phone: '111-222-3334',
        age: 50,
        gender: 'Male',
        province: 'Hanoi'
    },
    {
        name: 'Jennifer Taylor',
        email: 'jennifer.taylor@example.com',
        password: 'password123',
        role: 'User',
        address: '888 Birch St',
        phone: '444-555-6667',
        age: 22,
        gender: 'Female',
        province: 'Can Tho'
    },
    {
        name: 'Robert Anderson',
        email: 'robert.anderson@example.com',
        password: 'password123',
        role: 'User',
        address: '999 Cedar St',
        phone: '777-888-9991',
        age: 33,
        gender: 'Male',
        province: 'Hai Phong'
    },
    {
        name: 'Patricia Thomas',
        email: 'patricia.thomas@example.com',
        password: 'password123',
        role: 'User',
        address: '111 Elm St',
        phone: '123-123-1235',
        age: 41,
        gender: 'Female',
        province: 'Kien Giang'
    },
    {
        name: 'Charles Jackson',
        email: 'charles.jackson@example.com',
        password: 'password123',
        role: 'User',
        address: '222 Pine St',
        phone: '456-456-4568',
        age: 27,
        gender: 'Male',
        province: 'Ca Mau'
    },
    {
        name: 'Barbara White',
        email: 'barbara.white@example.com',
        password: 'password123',
        role: 'User',
        address: '333 Oak St',
        phone: '789-789-7891',
        age: 36,
        gender: 'Female',
        province: 'Soc Trang'
    },
    {
        name: 'Thomas Harris',
        email: 'thomas.harris@example.com',
        password: 'password123',
        role: 'User',
        address: '444 Maple St',
        phone: '111-222-3335',
        age: 48,
        gender: 'Male',
        province: 'Bac Lieu'
    },
    {
        name: 'Nancy Martin',
        email: 'nancy.martin@example.com',
        password: 'password123',
        role: 'User',
        address: '555 Birch St',
        phone: '444-555-6668',
        age: 24,
        gender: 'Female',
        province: 'Tra Vinh'
    },
    {
        name: 'Daniel Thompson',
        email: 'daniel.thompson@example.com',
        password: 'password123',
        role: 'User',
        address: '666 Cedar St',
        phone: '777-888-9992',
        age: 39,
        gender: 'Male',
        province: 'Vinh Long'
    },
    {
        name: 'Betty Garcia',
        email: 'betty.garcia@example.com',
        password: 'password123',
        role: 'User',
        address: '777 Elm St',
        phone: '123-123-1236',
        age: 32,
        gender: 'Female',
        province: 'Dong Thap'
    },
    {
        name: 'Paul Martinez',
        email: 'paul.martinez@example.com',
        password: 'password123',
        role: 'User',
        address: '888 Pine St',
        phone: '456-456-4569',
        age: 46,
        gender: 'Male',
        province: 'Hau Giang'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to database");

        await User.deleteMany({});
        console.log("Deleted all users");

        await User.insertMany(seedUsers);
        console.log("Seeded users");

    } catch (error) {
        console.log(">>> Error seeding DB: ", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();