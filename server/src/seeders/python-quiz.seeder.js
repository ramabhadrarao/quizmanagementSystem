// server/src/seeders/python-quiz.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Python Programming Quiz Data - 5 Questions
const pythonQuiz = {
  title: 'Python Programming Fundamentals Quiz',
  description: 'Comprehensive assessment of Python programming skills covering syntax, data structures, control flow, and problem-solving techniques.',
  timeLimit: 35, // 35 minutes for 5 questions
  isPublished: true,
  allowedAttempts: 2,
  showResults: true,
  randomizeQuestions: false,
  questions: [
    // Question 1: Multiple Choice - Python Basics
    {
      type: 'multiple-choice',
      title: 'Python Data Types',
      content: '<p>Which of the following is a mutable data type in Python?</p>',
      options: [
        'tuple',
        'string',
        'list',
        'integer'
      ],
      correctAnswer: 2, // list
      points: 2
    },

    // Question 2: Code - Basic Python Program
    {
      type: 'code',
      title: 'Hello World in Python',
      content: '<p>Write a Python program that prints "Hello, Python!" to the console.</p><p><strong>Requirements:</strong></p><ul><li>Print exactly: Hello, Python!</li><li>Use the print() function</li></ul>',
      language: 'python',
      testCases: [
        {
          input: ' ',
          expectedOutput: 'Hello, Python!',
          isHidden: false
        }
      ],
      starterCode: '# Write your Python code here\n',
      points: 2
    },

    // Question 3: Multiple Choice - Python Lists
    {
      type: 'multiple-choice',
      title: 'List Operations in Python',
      content: '<p>What is the output of the following Python code?</p><pre><code>my_list = [1, 2, 3, 4, 5]\nprint(my_list[1:4])</code></pre>',
      options: [
        '[1, 2, 3]',
        '[2, 3, 4]',
        '[1, 2, 3, 4]',
        '[2, 3, 4, 5]'
      ],
      correctAnswer: 1, // [2, 3, 4]
      points: 3
    },

    // Question 4: Code - Function and Loop
    {
      type: 'code',
      title: 'Sum of Numbers Function',
      content: '<p>Write a Python function that takes a positive integer n as input and returns the sum of all numbers from 1 to n (inclusive).</p><p><strong>Function name:</strong> sum_numbers</p><p><strong>Input:</strong> A positive integer n</p><p><strong>Output:</strong> Sum of numbers from 1 to n</p><p><strong>Example:</strong><br>Input: 5<br>Output: 15 (because 1+2+3+4+5 = 15)</p>',
      language: 'python',
      testCases: [
        {
          input: '5',
          expectedOutput: '15',
          isHidden: false
        },
        {
          input: '1',
          expectedOutput: '1',
          isHidden: false
        },
        {
          input: '10',
          expectedOutput: '55',
          isHidden: true
        },
        {
          input: '3',
          expectedOutput: '6',
          isHidden: true
        }
      ],
      starterCode: 'def sum_numbers(n):\n    # Calculate sum from 1 to n\n    pass\n\n# Test your function\nn = int(input())\nresult = sum_numbers(n)\nprint(result)',
      points: 4
    },

    // Question 5: Code - List Processing
    {
      type: 'code',
      title: 'Find Maximum Element',
      content: '<p>Write a Python program that finds and prints the maximum element in a list of integers.</p><p><strong>Input Format:</strong><br>Line 1: Number of elements (n)<br>Line 2: n space-separated integers</p><p><strong>Output:</strong> The maximum element</p><p><strong>Example:</strong><br>Input:<br>5<br>10 25 3 40 15<br>Output: 40</p>',
      language: 'python',
      testCases: [
        {
          input: '5\n10 25 3 40 15',
          expectedOutput: '40',
          isHidden: false
        },
        {
          input: '3\n-5 -10 -1',
          expectedOutput: '-1',
          isHidden: false
        },
        {
          input: '4\n100 200 50 150',
          expectedOutput: '200',
          isHidden: true
        },
        {
          input: '1\n42',
          expectedOutput: '42',
          isHidden: true
        }
      ],
      starterCode: '# Read input\nn = int(input())\nnumbers = list(map(int, input().split()))\n\n# Find maximum element\n# Your code here',
      points: 5
    }
  ]
};

// Seeder function
async function seedPythonQuiz() {
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
    const existingQuiz = await Quiz.findOne({ title: pythonQuiz.title });
    
    if (existingQuiz) {
      const response = await promptUser('A Python Programming quiz already exists. Do you want to replace it? (yes/no): ');
      
      if (response.toLowerCase() !== 'yes') {
        console.log('Seeding cancelled.');
        process.exit(0);
      }
      
      await Quiz.deleteOne({ _id: existingQuiz._id });
      console.log('Existing Python quiz deleted.');
    }

    // Create the quiz
    const quiz = new Quiz({
      ...pythonQuiz,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ Python Programming Quiz created successfully!');
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
    
    console.log('\nTopic Coverage:');
    console.log('- Data Types and Variables');
    console.log('- List Operations and Slicing');
    console.log('- Functions and Control Flow');
    console.log('- Input/Output Operations');
    console.log('- Basic Algorithm Implementation');
    
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
console.log('=== Python Programming Quiz Seeder ===\n');
seedPythonQuiz();