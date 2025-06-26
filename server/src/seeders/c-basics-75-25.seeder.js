// server/src/seeders/c-basics-75-25.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// C Basics Level 1 - 75% MCQ (18 questions) / 25% Code (6 questions)
const cBasicsQuiz = {
  title: 'C Programming Fundamentals Assessment - Level 1',
  description: 'Comprehensive C programming basics quiz with 75% multiple choice and 25% coding questions. Perfect for beginners learning C programming fundamentals.',
  timeLimit: 120, // 120 minutes for 24 questions
  isPublished: true,
  allowedAttempts: 3,
  showResults: true,
  randomizeQuestions: false,
  startDate: null,
  endDate: null,
  
  // Question pool configuration - instructors can enable this to select a subset
  questionPoolConfig: {
    enabled: true,
    multipleChoiceCount: 12, // Select 12 out of 18 MCQs
    codeCount: 4, // Select 4 out of 6 code questions
  },
  
  // Shuffle configuration for anti-cheating
  shuffleConfig: {
    shuffleQuestions: true,
    shuffleOptions: true,
  },
  
  questions: [
    // ========== MULTIPLE CHOICE QUESTIONS (18 questions - 75%) ==========
    
    // MCQ 1: C Basics
    {
      type: 'multiple-choice',
      title: 'C Program Structure',
      content: '<p>Which function is the entry point of every C program?</p>',
      options: [
        'start()',
        'main()',
        'begin()',
        'init()'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 2: Header Files
    {
      type: 'multiple-choice',
      title: 'Header Files',
      content: '<p>Which header file is required to use <code>printf()</code> function in C?</p>',
      options: [
        '#include <stdlib.h>',
        '#include <stdio.h>',
        '#include <string.h>',
        '#include <math.h>'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 3: Data Types
    {
      type: 'multiple-choice',
      title: 'Data Types',
      content: '<p>What is the typical size of an <code>int</code> data type in C (on most modern systems)?</p>',
      options: [
        '2 bytes',
        '4 bytes',
        '8 bytes',
        '1 byte'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 4: Variables
    {
      type: 'multiple-choice',
      title: 'Variable Declaration',
      content: '<p>Which of the following is a valid variable declaration in C?</p>',
      options: [
        'int 2var;',
        'int var-2;',
        'int var_2;',
        'int var 2;'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 5: Printf
    {
      type: 'multiple-choice',
      title: 'Printf Format Specifiers',
      content: '<p>What format specifier is used to print an integer in C?</p>',
      options: [
        '%s',
        '%d',
        '%f',
        '%c'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 6: Operators
    {
      type: 'multiple-choice',
      title: 'Arithmetic Operators',
      content: '<p>What is the result of <code>10 % 3</code> in C?</p>',
      options: [
        '3',
        '1',
        '0',
        '3.33'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 7: Comments
    {
      type: 'multiple-choice',
      title: 'Comments in C',
      content: '<p>Which of the following is the correct syntax for a single-line comment in C?</p>',
      options: [
        '# This is a comment',
        '// This is a comment',
        '/* This is a comment',
        '-- This is a comment'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 8: If Statement
    {
      type: 'multiple-choice',
      title: 'Conditional Statements',
      content: '<p>What is the correct syntax for an if statement in C?</p>',
      options: [
        'if x > 5 then',
        'if (x > 5)',
        'if x > 5:',
        'if (x > 5) then'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 9: Loops
    {
      type: 'multiple-choice',
      title: 'For Loop',
      content: '<p>What does the following for loop do?<br><code>for(int i = 0; i < 5; i++)</code></p>',
      options: [
        'Runs 4 times',
        'Runs 5 times',
        'Runs 6 times',
        'Infinite loop'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 10: Arrays
    {
      type: 'multiple-choice',
      title: 'Array Declaration',
      content: '<p>How do you declare an array of 10 integers in C?</p>',
      options: [
        'int array[10];',
        'int array(10);',
        'array int[10];',
        'int[10] array;'
      ],
      correctAnswer: 0,
      points: 2
    },

    // MCQ 11: Pointers
    {
      type: 'multiple-choice',
      title: 'Pointer Basics',
      content: '<p>Which operator is used to get the address of a variable in C?</p>',
      options: [
        '*',
        '&',
        '#',
        '@'
      ],
      correctAnswer: 1,
      points: 3
    },

    // MCQ 12: Functions
    {
      type: 'multiple-choice',
      title: 'Function Declaration',
      content: '<p>What is the correct way to declare a function that returns an integer and takes no parameters?</p>',
      options: [
        'int function();',
        'function int();',
        'int function(void);',
        'Both A and C'
      ],
      correctAnswer: 3,
      points: 3
    },

    // MCQ 13: Scanf
    {
      type: 'multiple-choice',
      title: 'Input Function',
      content: '<p>Which function is used to read input from the user in C?</p>',
      options: [
        'input()',
        'read()',
        'scanf()',
        'get()'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 14: Strings
    {
      type: 'multiple-choice',
      title: 'String Declaration',
      content: '<p>How do you declare a string in C?</p>',
      options: [
        'string str;',
        'char str[];',
        'text str;',
        'varchar str;'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 15: While Loop
    {
      type: 'multiple-choice',
      title: 'While Loop',
      content: '<p>What is the difference between <code>while</code> and <code>do-while</code> loops?</p>',
      options: [
        'No difference',
        'do-while executes at least once',
        'while is faster',
        'do-while cannot have conditions'
      ],
      correctAnswer: 1,
      points: 3
    },

    // MCQ 16: Constants
    {
      type: 'multiple-choice',
      title: 'Constants in C',
      content: '<p>Which keyword is used to declare a constant in C?</p>',
      options: [
        'constant',
        'final',
        'const',
        'static'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 17: Switch Statement
    {
      type: 'multiple-choice',
      title: 'Switch Statement',
      content: '<p>Which keyword is used to exit from a switch case in C?</p>',
      options: [
        'exit',
        'break',
        'continue',
        'return'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 18: Memory
    {
      type: 'multiple-choice',
      title: 'Memory Management',
      content: '<p>Which function is used to dynamically allocate memory in C?</p>',
      options: [
        'alloc()',
        'malloc()',
        'new()',
        'create()'
      ],
      correctAnswer: 1,
      points: 3
    },

    // ========== CODE QUESTIONS (6 questions - 25%) ==========
    
    // Code 1: Basic Output
    {
      type: 'code',
      title: 'Hello World Program',
      content: '<p>Write a C program that prints exactly:</p><p><strong>Hello, World!</strong></p><p>Note: Include necessary headers and use the main function.</p>',
      language: 'c',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Hello, World!',
          isHidden: false
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}',
      points: 5
    },

    // Code 2: Variables and Arithmetic
    {
      type: 'code',
      title: 'Simple Calculator',
      content: '<p>Write a C program that declares two integer variables <code>a = 15</code> and <code>b = 4</code>. Calculate and print their sum, difference, product, and division (integer division) on separate lines.</p><p><strong>Expected Output:</strong><br>19<br>11<br>60<br>3</p>',
      language: 'c',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: '19\n11\n60\n3',
          isHidden: false
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    // Declare variables a and b\n    // Calculate and print sum, difference, product, and division\n    \n    return 0;\n}',
      points: 6
    },

    // Code 3: User Input
    {
      type: 'code',
      title: 'Age Calculator',
      content: '<p>Write a C program that reads a person\'s age and prints how old they will be next year.</p><p><strong>Example:</strong><br>Input: 25<br>Output: Next year you will be 26 years old</p>',
      language: 'c',
      testCases: [
        {
          input: '25',
          expectedOutput: 'Next year you will be 26 years old',
          isHidden: false
        },
        {
          input: '18',
          expectedOutput: 'Next year you will be 19 years old',
          isHidden: false
        },
        {
          input: '0',
          expectedOutput: 'Next year you will be 1 years old',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int age;\n    // Read age and calculate next year\'s age\n    \n    return 0;\n}',
      points: 6
    },

    // Code 4: Conditional Logic
    {
      type: 'code',
      title: 'Number Comparison',
      content: '<p>Write a C program that reads two integers and prints which one is larger, or if they are equal.</p><p><strong>Example:</strong><br>Input: 10 5<br>Output: 10 is larger</p><p><strong>Example 2:</strong><br>Input: 7 7<br>Output: Both are equal</p>',
      language: 'c',
      testCases: [
        {
          input: '10 5',
          expectedOutput: '10 is larger',
          isHidden: false
        },
        {
          input: '3 8',
          expectedOutput: '8 is larger',
          isHidden: false
        },
        {
          input: '7 7',
          expectedOutput: 'Both are equal',
          isHidden: true
        },
        {
          input: '-5 -10',
          expectedOutput: '-5 is larger',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int num1, num2;\n    scanf("%d %d", &num1, &num2);\n    // Compare and print result\n    \n    return 0;\n}',
      points: 7
    },

    // Code 5: Loops
    {
      type: 'code',
      title: 'Multiplication Table',
      content: '<p>Write a C program that reads a positive integer N and prints the multiplication table of N from 1 to 5.</p><p><strong>Example:</strong><br>Input: 3<br>Output:<br>3 x 1 = 3<br>3 x 2 = 6<br>3 x 3 = 9<br>3 x 4 = 12<br>3 x 5 = 15</p>',
      language: 'c',
      testCases: [
        {
          input: '3',
          expectedOutput: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15',
          isHidden: false
        },
        {
          input: '7',
          expectedOutput: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35',
          isHidden: false
        },
        {
          input: '1',
          expectedOutput: '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Print multiplication table from 1 to 5\n    \n    return 0;\n}',
      points: 7
    },

    // Code 6: Arrays and Functions
    {
      type: 'code',
      title: 'Array Sum Function',
      content: '<p>Write a C program with a function called <code>arraySum</code> that takes an array of 5 integers and returns their sum. In main, read 5 integers, call the function, and print the result.</p><p><strong>Example:</strong><br>Input: 10 20 30 40 50<br>Output: Sum = 150</p>',
      language: 'c',
      testCases: [
        {
          input: '10 20 30 40 50',
          expectedOutput: 'Sum = 150',
          isHidden: false
        },
        {
          input: '1 2 3 4 5',
          expectedOutput: 'Sum = 15',
          isHidden: false
        },
        {
          input: '-5 -3 0 3 5',
          expectedOutput: 'Sum = 0',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\n// Function to calculate sum of array\nint arraySum(int arr[], int size) {\n    // Your code here\n}\n\nint main() {\n    int numbers[5];\n    // Read 5 numbers into array\n    // Call function and print result\n    \n    return 0;\n}',
      points: 8
    }
  ]
};

// Seeder function
async function seedCBasicsQuiz() {
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
    const existingQuiz = await Quiz.findOne({ title: cBasicsQuiz.title });
    
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
      ...cBasicsQuiz,
      quizCode,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ C Programming Basics Quiz (75/25 Split) created successfully!');
    console.log('\n' + '='.repeat(80));
    console.log('C PROGRAMMING FUNDAMENTALS ASSESSMENT');
    console.log('='.repeat(80));
    console.log(`📚 Title: ${quiz.title}`);
    console.log(`📝 Description: ${quiz.description}`);
    console.log(`🔑 Quiz Code: ${quiz.quizCode} (Share this with students!)`);
    console.log(`❓ Total Questions: ${quiz.questions.length}`);
    console.log(`⏱️  Time Limit: ${quiz.timeLimit} minutes`);
    console.log(`👤 Created by: ${instructor.name}`);
    console.log(`📊 Status: ${quiz.isPublished ? 'Published' : 'Draft'}`);
    console.log(`🔄 Allowed Attempts: ${quiz.allowedAttempts}`);
    
    console.log('\n📋 QUESTION BREAKDOWN:');
    console.log('-'.repeat(80));
    
    const mcqCount = quiz.questions.filter(q => q.type === 'multiple-choice').length;
    const codeCount = quiz.questions.filter(q => q.type === 'code').length;
    const totalMCQPoints = quiz.questions.filter(q => q.type === 'multiple-choice').reduce((sum, q) => sum + q.points, 0);
    const totalCodePoints = quiz.questions.filter(q => q.type === 'code').reduce((sum, q) => sum + q.points, 0);
    const totalPoints = totalMCQPoints + totalCodePoints;
    
    console.log(`📌 Multiple Choice Questions: ${mcqCount} (${Math.round(mcqCount/quiz.questions.length*100)}%)`);
    console.log(`   • Points per MCQ: 2-3 points`);
    console.log(`   • Total MCQ points: ${totalMCQPoints}`);
    console.log(`💻 Coding Questions: ${codeCount} (${Math.round(codeCount/quiz.questions.length*100)}%)`);
    console.log(`   • Points per Code: 5-8 points`);
    console.log(`   • Total Code points: ${totalCodePoints}`);
    console.log(`🎯 TOTAL POINTS: ${totalPoints}`);
    
    console.log('\n🎲 QUESTION POOL CONFIGURATION:');
    console.log('-'.repeat(80));
    console.log(`✅ Question Pool Enabled: ${quiz.questionPoolConfig.enabled ? 'Yes' : 'No'}`);
    if (quiz.questionPoolConfig.enabled) {
      console.log(`   • MCQs to select: ${quiz.questionPoolConfig.multipleChoiceCount} out of ${mcqCount}`);
      console.log(`   • Code questions to select: ${quiz.questionPoolConfig.codeCount} out of ${codeCount}`);
      console.log(`   • Students will get: ${quiz.questionPoolConfig.multipleChoiceCount + quiz.questionPoolConfig.codeCount} questions total`);
      const studentPoints = (quiz.questionPoolConfig.multipleChoiceCount * 2.5) + (quiz.questionPoolConfig.codeCount * 6.5); // Average points
      console.log(`   • Approximate points per student: ${Math.round(studentPoints)}`);
    }
    
    console.log('\n🔀 SHUFFLE CONFIGURATION:');
    console.log('-'.repeat(80));
    console.log(`✅ Shuffle Questions: ${quiz.shuffleConfig.shuffleQuestions ? 'Yes' : 'No'}`);
    console.log(`✅ Shuffle Options: ${quiz.shuffleConfig.shuffleOptions ? 'Yes' : 'No'}`);
    
    console.log('\n📑 QUESTIONS OVERVIEW:');
    console.log('-'.repeat(80));
    console.log('📌 MULTIPLE CHOICE TOPICS:');
    console.log('   • Program Structure & Main Function');
    console.log('   • Header Files & Libraries');
    console.log('   • Data Types & Variables');
    console.log('   • Input/Output Functions (printf, scanf)');
    console.log('   • Operators & Expressions');
    console.log('   • Conditional Statements');
    console.log('   • Loops (for, while, do-while)');
    console.log('   • Arrays & Declarations');
    console.log('   • Functions & Parameters');
    console.log('   • Pointers & Memory');
    console.log('   • Constants & Keywords');
    console.log('   • Switch Statements');
    
    console.log('\n💻 CODING QUESTION TOPICS:');
    console.log('   • Basic Output (Hello World)');
    console.log('   • Variables & Arithmetic Operations');
    console.log('   • User Input & Processing');
    console.log('   • Conditional Logic & Comparisons');
    console.log('   • Loop Implementation');
    console.log('   • Arrays & Functions');
    
    console.log('\n🎓 LEARNING OBJECTIVES:');
    console.log('-'.repeat(80));
    console.log('📊 This assessment evaluates:');
    console.log('   ✓ Understanding of C program structure');
    console.log('   ✓ Knowledge of basic data types and variables');
    console.log('   ✓ Proficiency with input/output operations');
    console.log('   ✓ Ability to use operators and expressions');
    console.log('   ✓ Implementation of control structures');
    console.log('   ✓ Basic array and function usage');
    console.log('   ✓ Understanding of pointers and memory concepts');
    console.log('   ✓ Problem-solving with C programming');
    
    console.log('\n🎯 RECOMMENDED USAGE:');
    console.log('-'.repeat(80));
    console.log('📝 Perfect for:');
    console.log('   • Introductory C programming courses');
    console.log('   • Mid-term assessments');
    console.log('   • Prerequisites testing for advanced courses');
    console.log('   • Programming bootcamp evaluations');
    console.log('   • Self-assessment for beginners');
    
    console.log('\n⚙️  TECHNICAL FEATURES:');
    console.log('-'.repeat(80));
    console.log('🔧 Anti-cheating measures:');
    console.log('   ✓ Question pool randomization');
    console.log('   ✓ Question shuffling');
    console.log('   ✓ Option shuffling');
    console.log('   ✓ Multiple test cases for coding questions');
    console.log('   ✓ Hidden test cases for thorough validation');
    console.log('   ✓ Limited attempts (3 maximum)');
    console.log('   ✓ Starter code provided for coding questions');
    
    console.log('\n📊 GRADING SCALE SUGGESTION:');
    console.log('-'.repeat(80));
    if (quiz.questionPoolConfig.enabled) {
      const avgStudentPoints = Math.round((quiz.questionPoolConfig.multipleChoiceCount * 2.5) + (quiz.questionPoolConfig.codeCount * 6.5));
      console.log(`Average Points per Student: ~${avgStudentPoints}`);
      console.log(`A: ${Math.round(avgStudentPoints * 0.9)}+ points (90%+)`);
      console.log(`B: ${Math.round(avgStudentPoints * 0.8)}-${Math.round(avgStudentPoints * 0.89)} points (80-89%)`);
      console.log(`C: ${Math.round(avgStudentPoints * 0.7)}-${Math.round(avgStudentPoints * 0.79)} points (70-79%)`);
      console.log(`D: ${Math.round(avgStudentPoints * 0.6)}-${Math.round(avgStudentPoints * 0.69)} points (60-69%)`);
      console.log(`F: Below ${Math.round(avgStudentPoints * 0.6)} points (Below 60%)`);
    } else {
      console.log(`Total Points: ${totalPoints}`);
      console.log(`A: ${Math.round(totalPoints * 0.9)}+ points (90%+)`);
      console.log(`B: ${Math.round(totalPoints * 0.8)}-${Math.round(totalPoints * 0.89)} points (80-89%)`);
      console.log(`C: ${Math.round(totalPoints * 0.7)}-${Math.round(totalPoints * 0.79)} points (70-79%)`);
      console.log(`D: ${Math.round(totalPoints * 0.6)}-${Math.round(totalPoints * 0.69)} points (60-69%)`);
      console.log(`F: Below ${Math.round(totalPoints * 0.6)} points (Below 60%)`);
    }
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('-'.repeat(80));
    console.log('1. Share the quiz code with your students: ' + quiz.quizCode);
    console.log('2. Monitor student progress in the instructor dashboard');
    console.log('3. Review detailed results and identify learning gaps');
    console.log('4. Provide targeted feedback based on performance');
    console.log('5. Export results for grade book integration');
    
    console.log('\n' + '='.repeat(80));
    console.log(`🎉 SUCCESS! C Programming Assessment is ready to use!`);
    console.log('='.repeat(80));

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
console.log('🔧 === C Programming Basics Quiz Seeder (75% MCQ / 25% Code) ===\n');
seedCBasicsQuiz();