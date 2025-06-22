// server/src/seeders/python-basic-quiz.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Python Basic Level 1 Quiz Data
const pythonBasicQuiz = {
  title: 'Python Basics Level 1 - Introduction to Programming',
  description: 'Test your knowledge of Python fundamentals including variables, data types, basic operators, and simple input/output operations. Perfect for beginners!',
  timeLimit: 30, // 30 minutes for 10 questions
  isPublished: true,
  allowedAttempts: 3,
  showResults: true,
  randomizeQuestions: false,
  startDate: null, // Available immediately
  endDate: null, // No end date
  questions: [
    // Question 1: Multiple Choice - Python Basics
    {
      type: 'multiple-choice',
      title: 'Python Print Statement',
      content: '<p>Which of the following is the correct way to print "Hello, World!" in Python?</p>',
      options: [
        'print("Hello, World!")',
        'echo "Hello, World!"',
        'printf("Hello, World!")',
        'console.log("Hello, World!")'
      ],
      correctAnswer: 0,
      points: 1
    },

    // Question 2: Multiple Choice - Variables
    {
      type: 'multiple-choice',
      title: 'Variable Assignment',
      content: '<p>Which of the following is a valid variable name in Python?</p>',
      options: [
        '2myvar',
        'my-var',
        'my_var',
        'my var'
      ],
      correctAnswer: 2,
      points: 1
    },

    // Question 3: Code - Basic Print
    {
      type: 'code',
      title: 'Your First Python Program',
      content: '<p>Write a Python program that prints exactly: <strong>Welcome to Python!</strong></p><p>Note: The output should match exactly, including capitalization and punctuation.</p>',
      language: 'python',
      testCases: [
        {
          input: ' ',  // Space character for no input
          expectedOutput: 'Welcome to Python!',
          isHidden: false
        }
      ],
      starterCode: '# Write your code here\n',
      points: 2
    },

    // Question 4: Multiple Choice - Data Types
    {
      type: 'multiple-choice',
      title: 'Python Data Types',
      content: '<p>What is the data type of the value <code>42</code> in Python?</p>',
      options: [
        'str',
        'int',
        'float',
        'bool'
      ],
      correctAnswer: 1,
      points: 1
    },

    // Question 5: Multiple Choice - String Quotes
    {
      type: 'multiple-choice',
      title: 'String Declaration',
      content: '<p>Which of the following is NOT a valid way to create a string in Python?</p>',
      options: [
        'name = "Python"',
        "name = 'Python'",
        'name = """Python"""',
        'name = <Python>'
      ],
      correctAnswer: 3,
      points: 1
    },

    // Question 6: Code - Simple Variable
    {
      type: 'code',
      title: 'Working with Variables',
      content: '<p>Create a variable called <code>age</code> and assign it the value <code>25</code>. Then print the value of the variable.</p><p><strong>Expected output:</strong> 25</p>',
      language: 'python',
      testCases: [
        {
          input: ' ',  // Space character for no input
          expectedOutput: '25',
          isHidden: false
        }
      ],
      starterCode: '# Create a variable called age and print it\n',
      points: 2
    },

    // Question 7: Multiple Choice - Basic Math
    {
      type: 'multiple-choice',
      title: 'Basic Arithmetic',
      content: '<p>What will be the output of the following Python code?</p><pre><code>x = 10\ny = 3\nprint(x + y)</code></pre>',
      options: [
        '7',
        '13',
        '30',
        'Error'
      ],
      correctAnswer: 1,
      points: 1
    },

    // Question 8: Code - String Concatenation
    {
      type: 'code',
      title: 'String Concatenation',
      content: '<p>Write a Python program that creates two variables:</p><ul><li><code>first_name</code> with value "John"</li><li><code>last_name</code> with value "Doe"</li></ul><p>Then print them together with a space between them.</p><p><strong>Expected output:</strong> John Doe</p>',
      language: 'python',
      testCases: [
        {
          input: ' ',  // Space character for no input
          expectedOutput: 'John Doe',
          isHidden: false
        }
      ],
      starterCode: '# Create first_name and last_name variables\n# Print them together with a space\n',
      points: 3
    },

    // Question 9: Multiple Choice - Comments
    {
      type: 'multiple-choice',
      title: 'Python Comments',
      content: '<p>How do you write a single-line comment in Python?</p>',
      options: [
        '// This is a comment',
        '<!-- This is a comment -->',
        '# This is a comment',
        '/* This is a comment */'
      ],
      correctAnswer: 2,
      points: 1
    },

    // Question 10: Code - Simple Input/Output
    {
      type: 'code',
      title: 'Basic Input and Output',
      content: '<p>Write a Python program that:</p><ol><li>Reads a name from input</li><li>Prints: Hello, [name]!</li></ol><p><strong>Example:</strong><br>Input: Alice<br>Output: Hello, Alice!</p>',
      language: 'python',
      testCases: [
        {
          input: 'Alice',
          expectedOutput: 'Hello, Alice!',
          isHidden: false
        },
        {
          input: 'Bob',
          expectedOutput: 'Hello, Bob!',
          isHidden: false
        },
        {
          input: 'Python',
          expectedOutput: 'Hello, Python!',
          isHidden: true
        }
      ],
      starterCode: '# Read a name and print a greeting\n',
      points: 3
    }
  ]
};

// Seeder function
async function seedPythonBasicQuiz() {
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
    const existingQuiz = await Quiz.findOne({ title: pythonBasicQuiz.title });
    
    if (existingQuiz) {
      const response = await promptUser('A quiz with this title already exists. Do you want to replace it? (yes/no): ');
      
      if (response.toLowerCase() !== 'yes') {
        console.log('Seeding cancelled.');
        process.exit(0);
      }
      
      await Quiz.deleteOne({ _id: existingQuiz._id });
      console.log('Existing quiz deleted.');
    }

    // Generate unique quiz code
    const quizCode = await Quiz.generateUniqueCode();

    // Create the quiz with the generated code
    const quiz = new Quiz({
      ...pythonBasicQuiz,
      quizCode,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ Python Basic Level 1 Quiz created successfully!');
    console.log('\n' + '='.repeat(60));
    console.log('QUIZ DETAILS');
    console.log('='.repeat(60));
    console.log(`📚 Title: ${quiz.title}`);
    console.log(`📝 Description: ${quiz.description}`);
    console.log(`🔑 Quiz Code: ${quiz.quizCode} (Share this with students!)`);
    console.log(`❓ Questions: ${quiz.questions.length}`);
    console.log(`⏱️  Time Limit: ${quiz.timeLimit} minutes`);
    console.log(`👤 Created by: ${instructor.name}`);
    console.log(`📊 Status: ${quiz.isPublished ? 'Published' : 'Draft'}`);
    console.log(`🔄 Allowed Attempts: ${quiz.allowedAttempts}`);
    
    console.log('\n📋 QUESTION BREAKDOWN:');
    console.log('-'.repeat(60));
    
    const mcCount = quiz.questions.filter(q => q.type === 'multiple-choice').length;
    const codeCount = quiz.questions.filter(q => q.type === 'code').length;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    
    console.log(`📌 Multiple Choice Questions: ${mcCount}`);
    console.log(`💻 Coding Questions: ${codeCount}`);
    console.log(`🎯 Total Points: ${totalPoints}`);
    
    console.log('\n📑 QUESTIONS LIST:');
    console.log('-'.repeat(60));
    quiz.questions.forEach((q, index) => {
      const icon = q.type === 'code' ? '💻' : '📌';
      console.log(`${icon} ${index + 1}. ${q.title} (${q.points} points)`);
    });
    
    console.log('\n🎓 DIFFICULTY LEVEL: Beginner');
    console.log('📚 TOPICS COVERED:');
    console.log('   • Print statements and output');
    console.log('   • Variables and assignment');
    console.log('   • Basic data types (int, str)');
    console.log('   • String operations');
    console.log('   • Comments');
    console.log('   • Basic input/output');
    console.log('   • Simple arithmetic operations');
    
    console.log('\n' + '='.repeat(60));
    console.log('💡 INSTRUCTIONS FOR INSTRUCTORS:');
    console.log('='.repeat(60));
    console.log('1. Share the quiz code with your students: ' + quiz.quizCode);
    console.log('2. Students can enter this code to access the quiz');
    console.log('3. Quiz is immediately available (no start/end date restrictions)');
    console.log('4. Students have ' + quiz.allowedAttempts + ' attempts to complete the quiz');
    console.log('5. Results will be shown immediately after submission');
    console.log('='.repeat(60));

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
console.log('🐍 === Python Basic Level 1 Quiz Seeder ===\n');
seedPythonBasicQuiz();