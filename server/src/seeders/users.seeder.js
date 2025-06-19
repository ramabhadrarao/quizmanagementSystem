import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Default users data
const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@quizmaster.pro',
    password: 'Admin@123',
    role: 'admin',
    isActive: true,
  },
  {
    name: 'John Instructor',
    email: 'instructor@quizmaster.pro',
    password: 'Instructor@123',
    role: 'instructor',
    isActive: true,
  },
  {
    name: 'Jane Student',
    email: 'student@quizmaster.pro',
    password: 'Student@123',
    role: 'student',
    isActive: true,
  },
  // Additional test users
  {
    name: 'Sarah Teacher',
    email: 'sarah.teacher@quizmaster.pro',
    password: 'Teacher@123',
    role: 'instructor',
    isActive: true,
  },
  {
    name: 'Mike Learner',
    email: 'mike.learner@quizmaster.pro',
    password: 'Learner@123',
    role: 'student',
    isActive: true,
  },
  {
    name: 'Emily Scholar',
    email: 'emily.scholar@quizmaster.pro',
    password: 'Scholar@123',
    role: 'student',
    isActive: true,
  },
];

// Seeder function
async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-system', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if users already exist
    const existingUsersCount = await User.countDocuments();
    
    if (existingUsersCount > 0) {
      console.log(`Database already contains ${existingUsersCount} users.`);
      
      const response = await promptUser('Do you want to delete existing users and reseed? (yes/no): ');
      
      if (response.toLowerCase() !== 'yes') {
        console.log('Seeding cancelled.');
        process.exit(0);
      }
      
      // Delete existing users
      await User.deleteMany({});
      console.log('Existing users deleted.');
    }

    // Create users
    console.log('Creating default users...');
    
    for (const userData of defaultUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`User with email ${userData.email} already exists. Skipping...`);
          continue;
        }

        // Create new user (password will be hashed by the pre-save hook)
        const user = new User(userData);
        await user.save();
        
        console.log(`✓ Created user: ${userData.name} (${userData.email}) - Role: ${userData.role}`);
      } catch (error) {
        console.error(`✗ Failed to create user ${userData.email}:`, error.message);
      }
    }

    console.log('\n=== Seeding completed successfully! ===');
    console.log('\nDefault login credentials:');
    console.log('-------------------------');
    defaultUsers.forEach(user => {
      console.log(`${user.role.padEnd(10)} | Email: ${user.email.padEnd(30)} | Password: ${user.password}`);
    });
    console.log('-------------------------\n');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

// Helper function to prompt user input
function promptUser(question) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run seeder
console.log('=== QuizMaster Pro - User Seeder ===\n');
seedUsers();