// server/src/seeders/c-quiz.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// C Programming Quiz Data - 5 Questions
const cQuiz = {
  title: 'C Programming Essentials Quiz',
  description: 'Test your knowledge of C programming fundamentals including syntax, data types, control structures, and basic problem-solving skills.',
  timeLimit: 30, // 30 minutes for 5 questions
  isPublished: true,
  allowedAttempts: 2,
  showResults: true,
  randomizeQuestions: false,
  questions: [
    // Question 1: Multiple Choice - Data Types
    {
      type: 'multiple-choice',
      title: 'C Data Types and Memory',
      content: '<p>What is the typical size of an <code>int</code> data type in C on a 32-bit system?</p>',
      options: [
        '2 bytes',
        '4 bytes',
        '8 bytes',
        '1 byte'
      ],
      correctAnswer: 1, // 4 bytes
      points: 2
    },

    // Question 2: Code - Hello World
    {
      type: 'code',
      title: 'Basic C Program Structure',
      content: '<p>Write a complete C program that prints "Hello, World!" to the console.</p><p><strong>Requirements:</strong></p><ul><li>Include necessary header files</li><li>Use the main() function</li><li>Print exactly: Hello, World!</li></ul>',
      language: 'c',
      testCases: [
        {
          input: ' ',
          expectedOutput: 'Hello, World!',
          isHidden: false
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}',
      points: 3
    },

    // Question 3: Multiple Choice - Operators
    {
      type: 'multiple-choice',
      title: 'Operator Precedence in C',
      content: '<p>What is the output of the following C code?</p><pre><code>int a = 5, b = 2, c = 3;\nint result = a + b * c;\nprintf("%d", result);</code></pre>',
      options: [
        '21',
        '11',
        '35',
        '30'
      ],
      correctAnswer: 1, // 11 (5 + 2*3 = 5 + 6 = 11)
      points: 2
    },

    // Question 4: Code - Sum of Two Numbers
    {
      type: 'code',
      title: 'Input and Arithmetic Operations',
      content: '<p>Write a C program that reads two integers from input and prints their sum.</p><p><strong>Input Format:</strong> Two space-separated integers</p><p><strong>Output Format:</strong> Sum of the two numbers</p><p><strong>Example:</strong><br>Input: 5 3<br>Output: 8</p>',
      language: 'c',
      testCases: [
        {
          input: '5 3',
          expectedOutput: '8',
          isHidden: false
        },
        {
          input: '10 20',
          expectedOutput: '30',
          isHidden: false
        },
        {
          input: '-5 15',
          expectedOutput: '10',
          isHidden: true
        },
        {
          input: '0 0',
          expectedOutput: '0',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    // Read two integers and print their sum\n    \n    return 0;\n}',
      points: 4
    },

    // Question 5: Code - Factorial Calculation
    {
      type: 'code',
      title: 'Loops and Mathematical Calculation',
      content: '<p>Write a C program to calculate the factorial of a given number using a loop.</p><p><strong>Input:</strong> A single positive integer n (0 ≤ n ≤ 10)</p><p><strong>Output:</strong> Factorial of n</p><p><strong>Note:</strong> Factorial of 0 is 1</p><p><strong>Example:</strong><br>Input: 5<br>Output: 120</p>',
      language: 'c',
      testCases: [
        {
          input: '5',
          expectedOutput: '120',
          isHidden: false
        },
        {
          input: '0',
          expectedOutput: '1',
          isHidden: false
        },
        {
          input: '1',
          expectedOutput: '1',
          isHidden: false
        },
        {
          input: '4',
          expectedOutput: '24',
          isHidden: true
        },
        {
          input: '6',
          expectedOutput: '720',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    \n    // Calculate factorial using loop\n    \n    return 0;\n}',
      points: 5
    }
  ]
};

// Seeder function
async function seedCQuiz() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-system');

    console.log('Connected to MongoDB');

    // Find an instructor or admin user to be the creator
    const instructor = await User.findOne({ 
      role: { $in: ['instructor', 'admin'] },
      isActive: true 
    });

    if (!instructor) {
      console.error('No instructor or admin user found. Please run the user seeder first.');
      process.exit(1);
    }

    console.log(`Using ${instructor.name} (${instructor.role}) as quiz creator`);

    // Check if a similar quiz already exists
    const existingQuiz = await Quiz.findOne({ title: cQuiz.title });
    
    if (existingQuiz) {
      const response = await promptUser('A C Programming quiz already exists. Do you want to replace it? (yes/no): ');
      
      if (response.toLowerCase() !== 'yes') {
        console.log('Seeding cancelled.');
        process.exit(0);
      }
      
      await Quiz.deleteOne({ _id: existingQuiz._id });
      console.log('Existing C quiz deleted.');
    }

    // Create the quiz
    const quiz = new Quiz({
      ...cQuiz,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ C Programming Quiz created successfully!');
    console.log('\nQuiz Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Title: ${quiz.title}`);
    console.log(`Questions: ${quiz.questions.length}`);
    console.log(`Time Limit: ${quiz.timeLimit} minutes`);
    console.log(`Created by: ${instructor.name}`);
    console.log(`Published: ${quiz.isPublished ? 'Yes' : 'No'}`);
    
    console.log('\nQuestion Breakdown:');
    const mcCount = quiz.questions.filter(q => q.type === 'multiple-choice').length;
    const codeCount = quiz.questions.filter(q => q.type === 'code').length;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    
    console.log(`- Multiple Choice Questions: ${mcCount}`);
    console.log(`- Code Challenge Questions: ${codeCount}`);
    console.log(`- Total Points: ${totalPoints}`);
    
    console.log('\nQuestions:');
    quiz.questions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.title} (${q.type}) - ${q.points} points`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
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
console.log('=== C Programming Quiz Seeder ===\n');
seedCQuiz();