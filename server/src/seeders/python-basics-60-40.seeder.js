// server/src/seeders/python-basics-60-40.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Python Basics Level 1 - 60% MCQ (15 questions) / 40% Code (10 questions)
const pythonBasicsQuiz = {
  title: 'Python Fundamentals Assessment - Level 1',
  description: 'Comprehensive Python basics quiz with 60% multiple choice and 40% coding questions. Perfect for beginners learning Python programming fundamentals.',
  timeLimit: 90, // 90 minutes for 25 questions
  isPublished: true,
  allowedAttempts: 3,
  showResults: true,
  randomizeQuestions: false,
  startDate: null,
  endDate: null,
  
  // Question pool configuration - instructors can enable this to select a subset
  questionPoolConfig: {
    enabled: true,
    multipleChoiceCount: 10, // Select 10 out of 15 MCQs
    codeCount: 5, // Select 5 out of 10 code questions
  },
  
  // Shuffle configuration for anti-cheating
  shuffleConfig: {
    shuffleQuestions: true,
    shuffleOptions: true,
  },
  
  questions: [
    // ========== MULTIPLE CHOICE QUESTIONS (15 questions - 60%) ==========
    
    // MCQ 1: Python Basics
    {
      type: 'multiple-choice',
      title: 'Python Print Function',
      content: '<p>Which of the following is the correct syntax to print "Hello, World!" in Python?</p>',
      options: [
        'print("Hello, World!")',
        'printf("Hello, World!")',
        'echo "Hello, World!"',
        'console.log("Hello, World!")'
      ],
      correctAnswer: 0,
      points: 2
    },

    // MCQ 2: Variables
    {
      type: 'multiple-choice',
      title: 'Variable Naming Rules',
      content: '<p>Which of the following is a valid variable name in Python?</p>',
      options: [
        '2myVar',
        'my-var',
        'my_var',
        'my var'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 3: Data Types
    {
      type: 'multiple-choice',
      title: 'Python Data Types',
      content: '<p>What is the data type of <code>x = 3.14</code> in Python?</p>',
      options: [
        'int',
        'float',
        'str',
        'bool'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 4: String Operations
    {
      type: 'multiple-choice',
      title: 'String Concatenation',
      content: '<p>What is the output of the following code?</p><pre><code>x = "Hello"\ny = "World"\nprint(x + " " + y)</code></pre>',
      options: [
        'HelloWorld',
        'Hello World',
        'Hello + World',
        'Error'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 5: Lists
    {
      type: 'multiple-choice',
      title: 'List Indexing',
      content: '<p>What is the output of the following code?</p><pre><code>numbers = [10, 20, 30, 40, 50]\nprint(numbers[2])</code></pre>',
      options: [
        '10',
        '20',
        '30',
        '40'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 6: Boolean Operations
    {
      type: 'multiple-choice',
      title: 'Boolean Operators',
      content: '<p>What is the output of <code>True and False</code>?</p>',
      options: [
        'True',
        'False',
        'None',
        'Error'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 7: If Statements
    {
      type: 'multiple-choice',
      title: 'Conditional Statements',
      content: '<p>What is the correct syntax for an if statement in Python?</p>',
      options: [
        'if (x > 5) then:',
        'if x > 5:',
        'if x > 5 then',
        'if (x > 5):'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 8: Loops
    {
      type: 'multiple-choice',
      title: 'For Loop Range',
      content: '<p>What does <code>range(5)</code> generate?</p>',
      options: [
        '1, 2, 3, 4, 5',
        '0, 1, 2, 3, 4',
        '0, 1, 2, 3, 4, 5',
        '1, 2, 3, 4'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 9: Functions
    {
      type: 'multiple-choice',
      title: 'Function Definition',
      content: '<p>Which keyword is used to define a function in Python?</p>',
      options: [
        'function',
        'def',
        'func',
        'define'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 10: String Methods
    {
      type: 'multiple-choice',
      title: 'String Methods',
      content: '<p>What is the output of <code>"hello".upper()</code>?</p>',
      options: [
        'hello',
        'HELLO',
        'Hello',
        'hELLO'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 11: List Methods
    {
      type: 'multiple-choice',
      title: 'List Append',
      content: '<p>What does the following code do?</p><pre><code>fruits = ["apple", "banana"]\nfruits.append("orange")</code></pre>',
      options: [
        'Replaces "banana" with "orange"',
        'Adds "orange" to the beginning of the list',
        'Adds "orange" to the end of the list',
        'Creates a new list with "orange"'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 12: Type Conversion
    {
      type: 'multiple-choice',
      title: 'Type Conversion',
      content: '<p>What is the output of <code>str(123)</code>?</p>',
      options: [
        '123 (as integer)',
        '"123" (as string)',
        'Error',
        'None'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 13: Dictionary Basics
    {
      type: 'multiple-choice',
      title: 'Dictionary Access',
      content: '<p>How do you access the value associated with key "name" in a dictionary called person?</p>',
      options: [
        'person.name',
        'person["name"]',
        'person{"name"}',
        'person(name)'
      ],
      correctAnswer: 1,
      points: 3
    },

    // MCQ 14: Comments
    {
      type: 'multiple-choice',
      title: 'Python Comments',
      content: '<p>How do you write a single-line comment in Python?</p>',
      options: [
        '// This is a comment',
        '/* This is a comment */',
        '# This is a comment',
        '<!-- This is a comment -->'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 15: Operators
    {
      type: 'multiple-choice',
      title: 'Arithmetic Operators',
      content: '<p>What is the result of <code>10 // 3</code> in Python?</p>',
      options: [
        '3.333...',
        '3',
        '4',
        '1'
      ],
      correctAnswer: 1,
      points: 3
    },

    // ========== CODE QUESTIONS (10 questions - 40%) ==========
    
    // Code 1: Basic Output
    {
      type: 'code',
      title: 'Your First Python Program',
      content: '<p>Write a Python program that prints exactly:</p><p><strong>Hello, Python!</strong></p><p>Note: The output should match exactly, including capitalization and punctuation.</p>',
      language: 'python',
      testCases: [
        {
          input: ' ',  // Space character for no input
          expectedOutput: 'Hello, Python!',
          isHidden: false
        }
      ],
      starterCode: '# Write your code here\n',
      points: 3
    },

    // Code 2: Variables and Math
    {
      type: 'code',
      title: 'Simple Calculator',
      content: '<p>Create two variables <code>a = 10</code> and <code>b = 5</code>. Calculate and print their sum, difference, and product on separate lines.</p><p><strong>Expected Output:</strong><br>15<br>5<br>50</p>',
      language: 'python',
      testCases: [
        {
          input: ' ',  // Space character for no input
          expectedOutput: '15\n5\n50',
          isHidden: false
        }
      ],
      starterCode: '# Create variables a and b\n# Calculate and print sum, difference, and product\n',
      points: 4
    },

    // Code 3: User Input
    {
      type: 'code',
      title: 'Greeting Program',
      content: '<p>Write a program that asks for the user\'s name and prints a greeting.</p><p><strong>Example:</strong><br>Input: Alice<br>Output: Hello, Alice!</p>',
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
      starterCode: '# Read user name and print greeting\nname = input()\n# Your code here\n',
      points: 4
    },

    // Code 4: Conditional Logic
    {
      type: 'code',
      title: 'Even or Odd',
      content: '<p>Write a program that reads an integer and prints whether it is "Even" or "Odd".</p><p><strong>Example:</strong><br>Input: 4<br>Output: Even</p>',
      language: 'python',
      testCases: [
        {
          input: '4',
          expectedOutput: 'Even',
          isHidden: false
        },
        {
          input: '7',
          expectedOutput: 'Odd',
          isHidden: false
        },
        {
          input: '0',
          expectedOutput: 'Even',
          isHidden: true
        },
        {
          input: '-3',
          expectedOutput: 'Odd',
          isHidden: true
        }
      ],
      starterCode: '# Read a number and check if it\'s even or odd\nnum = int(input())\n# Your code here\n',
      points: 5
    },

    // Code 5: Loops
    {
      type: 'code',
      title: 'Count to N',
      content: '<p>Write a program that reads a positive integer N and prints all numbers from 1 to N on separate lines.</p><p><strong>Example:</strong><br>Input: 5<br>Output:<br>1<br>2<br>3<br>4<br>5</p>',
      language: 'python',
      testCases: [
        {
          input: '5',
          expectedOutput: '1\n2\n3\n4\n5',
          isHidden: false
        },
        {
          input: '3',
          expectedOutput: '1\n2\n3',
          isHidden: false
        },
        {
          input: '1',
          expectedOutput: '1',
          isHidden: true
        }
      ],
      starterCode: '# Read N and print numbers from 1 to N\nn = int(input())\n# Your code here\n',
      points: 5
    },

    // Code 6: String Manipulation
    {
      type: 'code',
      title: 'String Length Counter',
      content: '<p>Write a program that reads a string and prints its length.</p><p><strong>Example:</strong><br>Input: Hello<br>Output: 5</p>',
      language: 'python',
      testCases: [
        {
          input: 'Hello',
          expectedOutput: '5',
          isHidden: false
        },
        {
          input: 'Python Programming',
          expectedOutput: '18',
          isHidden: false
        },
        {
          input: 'AI',
          expectedOutput: '2',
          isHidden: true
        },
        {
          input: ' ',  // Space character for no input
          expectedOutput: '0',
          isHidden: true
        }
      ],
      starterCode: '# Read a string and print its length\ntext = input()\n# Your code here\n',
      points: 4
    },

    // Code 7: Lists
    {
      type: 'code',
      title: 'Sum of List Elements',
      content: '<p>Write a program that reads 5 integers (one per line) and prints their sum.</p><p><strong>Example:</strong><br>Input:<br>10<br>20<br>30<br>40<br>50<br>Output: 150</p>',
      language: 'python',
      testCases: [
        {
          input: '10\n20\n30\n40\n50',
          expectedOutput: '150',
          isHidden: false
        },
        {
          input: '1\n2\n3\n4\n5',
          expectedOutput: '15',
          isHidden: false
        },
        {
          input: '-5\n-3\n0\n3\n5',
          expectedOutput: '0',
          isHidden: true
        }
      ],
      starterCode: '# Read 5 numbers and print their sum\nnumbers = []\nfor i in range(5):\n    num = int(input())\n    numbers.append(num)\n# Calculate and print sum\n',
      points: 6
    },

    // Code 8: Functions
    {
      type: 'code',
      title: 'Square Function',
      content: '<p>Write a function called <code>square</code> that takes a number and returns its square. Then read a number, call the function, and print the result.</p><p><strong>Example:</strong><br>Input: 5<br>Output: 25</p>',
      language: 'python',
      testCases: [
        {
          input: '5',
          expectedOutput: '25',
          isHidden: false
        },
        {
          input: '10',
          expectedOutput: '100',
          isHidden: false
        },
        {
          input: '-3',
          expectedOutput: '9',
          isHidden: true
        },
        {
          input: '0',
          expectedOutput: '0',
          isHidden: true
        }
      ],
      starterCode: '# Define the square function\ndef square(n):\n    # Your code here\n    pass\n\n# Read input and use the function\nnum = int(input())\n# Call function and print result\n',
      points: 6
    },

    // Code 9: String Methods
    {
      type: 'code',
      title: 'Case Converter',
      content: '<p>Write a program that reads a string and prints it in three formats:</p><ol><li>All uppercase</li><li>All lowercase</li><li>Title case (first letter of each word capitalized)</li></ol><p><strong>Example:</strong><br>Input: hello world<br>Output:<br>HELLO WORLD<br>hello world<br>Hello World</p>',
      language: 'python',
      testCases: [
        {
          input: 'hello world',
          expectedOutput: 'HELLO WORLD\nhello world\nHello World',
          isHidden: false
        },
        {
          input: 'Python Programming',
          expectedOutput: 'PYTHON PROGRAMMING\npython programming\nPython Programming',
          isHidden: false
        },
        {
          input: 'TEST case',
          expectedOutput: 'TEST CASE\ntest case\nTest Case',
          isHidden: true
        }
      ],
      starterCode: '# Read a string and print in different cases\ntext = input()\n# Your code here\n',
      points: 5
    },

    // Code 10: Problem Solving
    {
      type: 'code',
      title: 'Find Maximum',
      content: '<p>Write a program that reads three integers and prints the largest one.</p><p><strong>Example:</strong><br>Input:<br>10<br>25<br>15<br>Output: 25</p>',
      language: 'python',
      testCases: [
        {
          input: '10\n25\n15',
          expectedOutput: '25',
          isHidden: false
        },
        {
          input: '5\n3\n8',
          expectedOutput: '8',
          isHidden: false
        },
        {
          input: '-5\n-10\n-3',
          expectedOutput: '-3',
          isHidden: true
        },
        {
          input: '7\n7\n7',
          expectedOutput: '7',
          isHidden: true
        }
      ],
      starterCode: '# Read three numbers and find the maximum\na = int(input())\nb = int(input())\nc = int(input())\n# Find and print the maximum\n',
      points: 6
    }
  ]
};

// Seeder function
async function seedPythonBasicsQuiz() {
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
    const existingQuiz = await Quiz.findOne({ title: pythonBasicsQuiz.title });
    
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
      ...pythonBasicsQuiz,
      quizCode,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ Python Basics Quiz (60/40 Split) created successfully!');
    console.log('\n' + '='.repeat(70));
    console.log('QUIZ DETAILS');
    console.log('='.repeat(70));
    console.log(`📚 Title: ${quiz.title}`);
    console.log(`📝 Description: ${quiz.description}`);
    console.log(`🔑 Quiz Code: ${quiz.quizCode} (Share this with students!)`);
    console.log(`❓ Total Questions: ${quiz.questions.length}`);
    console.log(`⏱️  Time Limit: ${quiz.timeLimit} minutes`);
    console.log(`👤 Created by: ${instructor.name}`);
    console.log(`📊 Status: ${quiz.isPublished ? 'Published' : 'Draft'}`);
    console.log(`🔄 Allowed Attempts: ${quiz.allowedAttempts}`);
    
    console.log('\n📋 QUESTION BREAKDOWN:');
    console.log('-'.repeat(70));
    
    const mcqCount = quiz.questions.filter(q => q.type === 'multiple-choice').length;
    const codeCount = quiz.questions.filter(q => q.type === 'code').length;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    
    console.log(`📌 Multiple Choice Questions: ${mcqCount} (${Math.round(mcqCount/quiz.questions.length*100)}%)`);
    console.log(`💻 Coding Questions: ${codeCount} (${Math.round(codeCount/quiz.questions.length*100)}%)`);
    console.log(`🎯 Total Points: ${totalPoints}`);
    
    console.log('\n🎲 QUESTION POOL CONFIGURATION:');
    console.log('-'.repeat(70));
    console.log(`✅ Question Pool Enabled: ${quiz.questionPoolConfig.enabled ? 'Yes' : 'No'}`);
    if (quiz.questionPoolConfig.enabled) {
      console.log(`   • MCQs to select: ${quiz.questionPoolConfig.multipleChoiceCount} out of ${mcqCount}`);
      console.log(`   • Code questions to select: ${quiz.questionPoolConfig.codeCount} out of ${codeCount}`);
    }
    
    console.log('\n🔀 SHUFFLE CONFIGURATION:');
    console.log('-'.repeat(70));
    console.log(`✅ Shuffle Questions: ${quiz.shuffleConfig.shuffleQuestions ? 'Yes' : 'No'}`);
    console.log(`✅ Shuffle Options: ${quiz.shuffleConfig.shuffleOptions ? 'Yes' : 'No'}`);
    
    console.log('\n📑 QUESTIONS LIST:');
    console.log('-'.repeat(70));
    quiz.questions.forEach((q, index) => {
      const icon = q.type === 'code' ? '💻' : '📌';
      console.log(`${icon} ${index + 1}. ${q.title} (${q.points} points)`);
    });
    
    console.log('\n🎓 DIFFICULTY LEVEL: Beginner');
    console.log('📚 TOPICS COVERED:');
    console.log('   • Print statements and output');
    console.log('   • Variables and data types');
    console.log('   • String operations and methods');
    console.log('   • Lists and basic operations');
    console.log('   • Conditional statements (if/else)');
    console.log('   • Loops (for loops)');
    console.log('   • Functions');
    console.log('   • Input/output operations');
    console.log('   • Basic problem solving');
    
    console.log('\n' + '='.repeat(70));
    console.log('💡 INSTRUCTIONS FOR INSTRUCTORS:');
    console.log('='.repeat(70));
    console.log('1. Share the quiz code with your students: ' + quiz.quizCode);
    console.log('2. Students can enter this code to access the quiz');
    console.log('3. Question pool is enabled - each student gets 10 MCQs and 5 code questions');
    console.log('4. Questions and options will be shuffled for each student');
    console.log('5. Students have ' + quiz.allowedAttempts + ' attempts to complete the quiz');
    console.log('6. Results will be shown immediately after submission');
    console.log('='.repeat(70));

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
console.log('🐍 === Python Basics Quiz Seeder (60% MCQ / 40% Code) ===\n');
seedPythonBasicsQuiz();