// server/src/seeders/c-level1-set2-75-25.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// C Level 1 Set 2 - 75% MCQ (18 questions) / 25% Code (6 questions)
const cLevel1Set2Quiz = {
  title: 'C Programming Fundamentals Assessment - Level 1 (Set 2)',
  description: 'Alternative comprehensive C programming basics quiz with 75% multiple choice and 25% coding questions. Fresh question set covering the same fundamental topics for varied assessment or retakes.',
  timeLimit: 120, // 120 minutes for 24 questions
  isPublished: true,
  allowedAttempts: 3,
  showResults: true,
  randomizeQuestions: false,
  startDate: null,
  endDate: null,
  
  // Question pool configuration
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
    
    // Basic C Concepts (6 questions)
    {
      type: 'multiple-choice',
      title: 'C Language History',
      content: '<p>Who developed the C programming language?</p>',
      options: [
        'Bjarne Stroustrup',
        'Dennis Ritchie',
        'James Gosling',
        'Guido van Rossum'
      ],
      correctAnswer: 1,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'C File Extension',
      content: '<p>What is the standard file extension for C source code files?</p>',
      options: [
        '.cpp',
        '.c',
        '.cc',
        '.ch'
      ],
      correctAnswer: 1,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Compilation Process',
      content: '<p>What is the first step in the C compilation process?</p>',
      options: [
        'Linking',
        'Assembly',
        'Preprocessing',
        'Loading'
      ],
      correctAnswer: 2,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Case Sensitivity',
      content: '<p>Is C programming language case-sensitive?</p>',
      options: [
        'Yes',
        'No',
        'Only for variables',
        'Only for functions'
      ],
      correctAnswer: 0,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Standard Library',
      content: '<p>Which header file contains mathematical functions like sqrt() and pow()?</p>',
      options: [
        '#include <stdio.h>',
        '#include <stdlib.h>',
        '#include <math.h>',
        '#include <string.h>'
      ],
      correctAnswer: 2,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Return Statement',
      content: '<p>What does <code>return 0;</code> indicate in the main function?</p>',
      options: [
        'Program failed',
        'Program executed successfully',
        'Program needs restart',
        'Program is incomplete'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Data Types and Variables (4 questions)
    {
      type: 'multiple-choice',
      title: 'Character Data Type',
      content: '<p>What is the size of <code>char</code> data type in C?</p>',
      options: [
        '1 byte',
        '2 bytes',
        '4 bytes',
        '8 bytes'
      ],
      correctAnswer: 0,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Float vs Double',
      content: '<p>What is the main difference between <code>float</code> and <code>double</code>?</p>',
      options: [
        'No difference',
        'double has more precision',
        'float is faster',
        'double cannot store decimals'
      ],
      correctAnswer: 1,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Variable Initialization',
      content: '<p>Which of the following correctly initializes an integer variable?</p>',
      options: [
        'int x;',
        'int x = 10;',
        'x = 10;',
        'integer x = 10;'
      ],
      correctAnswer: 1,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Unsigned vs Signed',
      content: '<p>What is the range of <code>unsigned char</code>?</p>',
      options: [
        '-128 to 127',
        '0 to 255',
        '-255 to 255',
        '0 to 127'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Operators and Expressions (4 questions)
    {
      type: 'multiple-choice',
      title: 'Increment Operators',
      content: '<p>What is the difference between <code>++i</code> and <code>i++</code>?</p>',
      options: [
        'No difference',
        '++i increments before use, i++ increments after use',
        '++i is faster',
        'i++ can only be used in loops'
      ],
      correctAnswer: 1,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Logical Operators',
      content: '<p>What is the result of <code>!(5 > 3)</code>?</p>',
      options: [
        '1',
        '0',
        '5',
        '3'
      ],
      correctAnswer: 1,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Operator Precedence',
      content: '<p>What is the result of <code>3 + 4 * 2</code>?</p>',
      options: [
        '14',
        '11',
        '10',
        '24'
      ],
      correctAnswer: 1,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Assignment Operators',
      content: '<p>What does <code>x *= 3</code> mean?</p>',
      options: [
        'x = x + 3',
        'x = x * 3',
        'x = 3',
        'x = x / 3'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Control Structures (4 questions)
    {
      type: 'multiple-choice',
      title: 'Ternary Operator',
      content: '<p>What is the syntax of the ternary operator in C?</p>',
      options: [
        'condition ? true_value : false_value',
        'condition : true_value ? false_value',
        'if condition then true_value else false_value',
        'condition && true_value || false_value'
      ],
      correctAnswer: 0,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Switch Statement',
      content: '<p>What happens if you forget to use <code>break</code> in a switch case?</p>',
      options: [
        'Compilation error',
        'Program crashes',
        'Fall-through to next case',
        'Nothing happens'
      ],
      correctAnswer: 2,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Do-While Loop',
      content: '<p>How many times will a do-while loop execute at minimum?</p>',
      options: [
        '0 times',
        '1 time',
        '2 times',
        'Depends on condition'
      ],
      correctAnswer: 1,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Loop Control',
      content: '<p>Which statement is used to skip the current iteration of a loop?</p>',
      options: [
        'break',
        'continue',
        'return',
        'goto'
      ],
      correctAnswer: 1,
      points: 2
    },

    // ========== CODE QUESTIONS (6 questions - 25%) ==========
    
    // Code 1: Basic Input/Output
    {
      type: 'code',
      title: 'Personal Information Display',
      content: '<p>Write a C program that prints your personal information in the following format:</p><p><strong>Name: John Doe<br>Age: 20<br>City: New York</strong></p><p>Use the given sample data exactly as shown.</p>',
      language: 'c',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Name: John Doe\nAge: 20\nCity: New York',
          isHidden: false
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    // Print personal information\n    \n    return 0;\n}',
      points: 5
    },

    // Code 2: Mathematical Operations
    {
      type: 'code',
      title: 'Circle Area and Perimeter',
      content: '<p>Write a C program that calculates the area and perimeter of a circle with radius 7. Use π = 3.14159.</p><p><strong>Expected Output:</strong><br>Area: 153.93791<br>Perimeter: 43.98226</p>',
      language: 'c',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Area: 153.93791\nPerimeter: 43.98226',
          isHidden: false
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    float radius = 7.0;\n    float pi = 3.14159;\n    // Calculate and print area and perimeter\n    \n    return 0;\n}',
      points: 6
    },

    // Code 3: User Input and Processing
    {
      type: 'code',
      title: 'Temperature Conversion',
      content: '<p>Write a C program that reads a temperature in Fahrenheit and converts it to Celsius using the formula: C = (F - 32) * 5/9</p><p><strong>Example:</strong><br>Input: 100<br>Output: Temperature in Celsius: 37.78</p>',
      language: 'c',
      testCases: [
        {
          input: '100',
          expectedOutput: 'Temperature in Celsius: 37.78',
          isHidden: false
        },
        {
          input: '32',
          expectedOutput: 'Temperature in Celsius: 0.00',
          isHidden: false
        },
        {
          input: '212',
          expectedOutput: 'Temperature in Celsius: 100.00',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    float fahrenheit, celsius;\n    scanf("%f", &fahrenheit);\n    // Convert and print temperature\n    \n    return 0;\n}',
      points: 6
    },

    // Code 4: Conditional Logic
    {
      type: 'code',
      title: 'Simple ATM Balance Check',
      content: '<p>Write a C program that simulates a simple ATM balance check. Read a withdrawal amount and check against a balance of $1000. Print appropriate messages.</p><p><strong>Example 1:</strong><br>Input: 500<br>Output: Transaction successful. Remaining balance: $500<br><br><strong>Example 2:</strong><br>Input: 1200<br>Output: Insufficient funds</p>',
      language: 'c',
      testCases: [
        {
          input: '500',
          expectedOutput: 'Transaction successful. Remaining balance: $500',
          isHidden: false
        },
        {
          input: '1200',
          expectedOutput: 'Insufficient funds',
          isHidden: false
        },
        {
          input: '1000',
          expectedOutput: 'Transaction successful. Remaining balance: $0',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int balance = 1000;\n    int withdrawal;\n    scanf("%d", &withdrawal);\n    // Check balance and process withdrawal\n    \n    return 0;\n}',
      points: 7
    },

    // Code 5: Loops and Patterns
    {
      type: 'code',
      title: 'Number Pattern',
      content: '<p>Write a C program that reads a number N and prints the following pattern:</p><p><strong>Example for N=4:</strong><br>1<br>1 2<br>1 2 3<br>1 2 3 4</p>',
      language: 'c',
      testCases: [
        {
          input: '4',
          expectedOutput: '1\n1 2\n1 2 3\n1 2 3 4',
          isHidden: false
        },
        {
          input: '3',
          expectedOutput: '1\n1 2\n1 2 3',
          isHidden: false
        },
        {
          input: '5',
          expectedOutput: '1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    // Print the number pattern\n    \n    return 0;\n}',
      points: 7
    },

    // Code 6: Arrays and Functions
    {
      type: 'code',
      title: 'Array Maximum and Minimum',
      content: '<p>Write a C program with functions <code>findMax</code> and <code>findMin</code> that find the maximum and minimum values in an array of 5 integers. Read the array values and print both results.</p><p><strong>Example:</strong><br>Input: 3 7 1 9 5<br>Output: Maximum: 9<br>Minimum: 1</p>',
      language: 'c',
      testCases: [
        {
          input: '3\n7\n1\n9\n5',
          expectedOutput: 'Maximum: 9\nMinimum: 1',
          isHidden: false
        },
        {
          input: '10\n20\n5\n15\n25',
          expectedOutput: 'Maximum: 25\nMinimum: 5',
          isHidden: false
        },
        {
          input: '-5\n-2\n-8\n-1\n-10',
          expectedOutput: 'Maximum: -1\nMinimum: -10',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\n// Function to find maximum\nint findMax(int arr[], int size) {\n    // Your code here\n}\n\n// Function to find minimum\nint findMin(int arr[], int size) {\n    // Your code here\n}\n\nint main() {\n    int numbers[5];\n    // Read array values and find max/min\n    \n    return 0;\n}',
      points: 8
    }
  ]
};

// Seeder function
async function seedCLevel1Set2Quiz() {
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
    const existingQuiz = await Quiz.findOne({ title: cLevel1Set2Quiz.title });
    
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
      ...cLevel1Set2Quiz,
      quizCode,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ C Programming Level 1 Set 2 Quiz created successfully!');
    console.log('\n' + '='.repeat(80));
    console.log('C PROGRAMMING FUNDAMENTALS ASSESSMENT - LEVEL 1 (SET 2)');
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
    }
    
    console.log('\n🔀 SHUFFLE CONFIGURATION:');
    console.log('-'.repeat(80));
    console.log(`✅ Shuffle Questions: ${quiz.shuffleConfig.shuffleQuestions ? 'Yes' : 'No'}`);
    console.log(`✅ Shuffle Options: ${quiz.shuffleConfig.shuffleOptions ? 'Yes' : 'No'}`);
    
    console.log('\n📑 SET 2 TOPICS OVERVIEW:');
    console.log('-'.repeat(80));
    console.log('📌 MULTIPLE CHOICE AREAS:');
    console.log('   🔸 Basic C Concepts (6 questions)');
    console.log('     • C language history and file extensions');
    console.log('     • Compilation process and case sensitivity');
    console.log('     • Standard library headers');
    console.log('     • Return statements and program flow');
    console.log('   🔸 Data Types & Variables (4 questions)');
    console.log('     • Character data type and sizing');
    console.log('     • Float vs double precision');
    console.log('     • Variable initialization techniques');
    console.log('     • Signed vs unsigned ranges');
    console.log('   🔸 Operators & Expressions (4 questions)');
    console.log('     • Pre/post increment operators');
    console.log('     • Logical operators and precedence');
    console.log('     • Assignment operator variations');
    console.log('   🔸 Control Structures (4 questions)');
    console.log('     • Ternary operator syntax');
    console.log('     • Switch statement fall-through');
    console.log('     • Do-while loop characteristics');
    console.log('     • Loop control statements');
    
    console.log('\n💻 CODING QUESTION AREAS:');
    console.log('   🔸 Basic I/O Operations (1 question)');
    console.log('     • Personal information display');
    console.log('   🔸 Mathematical Calculations (1 question)');
    console.log('     • Circle area and perimeter calculation');
    console.log('   🔸 User Input Processing (1 question)');
    console.log('     • Temperature conversion (Fahrenheit to Celsius)');
    console.log('   🔸 Conditional Logic (1 question)');
    console.log('     • ATM balance checking system');
    console.log('   🔸 Loop Patterns (1 question)');
    console.log('     • Number pattern generation');
    console.log('   🔸 Arrays & Functions (1 question)');
    console.log('     • Maximum and minimum value finder');
    
    console.log('\n🔄 ALTERNATIVE ASSESSMENT FEATURES:');
    console.log('-'.repeat(80));
    console.log('🎯 This Set 2 provides:');
    console.log('   ✓ Fresh questions covering same fundamental concepts');
    console.log('   ✓ Different scenarios for varied practice');
    console.log('   ✓ Alternative assessment for makeup exams');
    console.log('   ✓ Parallel difficulty to original Level 1 quiz');
    console.log('   ✓ Same learning objectives with new contexts');
    console.log('   ✓ Prevents memorization of specific answers');
    
    console.log('\n🎓 LEARNING OBJECTIVES (SAME AS SET 1):');
    console.log('-'.repeat(80));
    console.log('📊 This assessment evaluates:');
    console.log('   ✓ Understanding of C program structure');
    console.log('   ✓ Knowledge of data types and variables');
    console.log('   ✓ Proficiency with operators and expressions');
    console.log('   ✓ Implementation of control structures');
    console.log('   ✓ Basic array and function usage');
    console.log('   ✓ Input/output operations');
    console.log('   ✓ Mathematical problem solving');
    console.log('   ✓ Pattern recognition and generation');
    
    console.log('\n🎯 RECOMMENDED USAGE SCENARIOS:');
    console.log('-'.repeat(80));
    console.log('📝 Ideal for:');
    console.log('   • Makeup examinations');
    console.log('   • Retake assessments');
    console.log('   • Alternative testing sessions');
    console.log('   • Practice before main assessment');
    console.log('   • Different class sections');
    console.log('   • Semester B or different terms');
    console.log('   • Academic integrity investigations');
    
    console.log('\n⚖️  COMPARISON WITH SET 1:');
    console.log('-'.repeat(80));
    console.log('🔀 Key differences:');
    console.log('   • Different question contexts but same concepts');
    console.log('   • Alternative coding scenarios');
    console.log('   • Fresh examples and problem statements');
    console.log('   • Maintains equivalent difficulty level');
    console.log('   • Same point distribution and time limits');
    console.log('   • Parallel learning objective coverage');
    
    console.log('\n📊 GRADING SCALE (EQUIVALENT TO SET 1):');
    console.log('-'.repeat(80));
    const avgMCQPoints = totalMCQPoints / mcqCount;
    const avgCodePoints = totalCodePoints / codeCount;
    const avgStudentPoints = Math.round((quiz.questionPoolConfig.multipleChoiceCount * avgMCQPoints) + (quiz.questionPoolConfig.codeCount * avgCodePoints));
    console.log(`Average Points per Student: ~${avgStudentPoints}`);
    console.log(`A: ${Math.round(avgStudentPoints * 0.9)}+ points (90%+)`);
    console.log(`B: ${Math.round(avgStudentPoints * 0.8)}-${Math.round(avgStudentPoints * 0.89)} points (80-89%)`);
    console.log(`C: ${Math.round(avgStudentPoints * 0.7)}-${Math.round(avgStudentPoints * 0.79)} points (70-79%)`);
    console.log(`D: ${Math.round(avgStudentPoints * 0.6)}-${Math.round(avgStudentPoints * 0.69)} points (60-69%)`);
    console.log(`F: Below ${Math.round(avgStudentPoints * 0.6)} points (Below 60%)`);
    
    console.log('\n🚀 DEPLOYMENT STRATEGY:');
    console.log('-'.repeat(80));
    console.log('1. Use as alternative to Set 1 for different sessions');
    console.log('2. Deploy for makeup exams when students miss Set 1');
    console.log('3. Rotate between sets across different semesters');
    console.log('4. Use for practice sessions before main assessment');
    console.log('5. Implement for academic integrity cases');
    console.log('6. Share quiz code: ' + quiz.quizCode);
    
    console.log('\n💡 INSTRUCTOR NOTES:');
    console.log('-'.repeat(80));
    console.log('🔍 Set 2 specific considerations:');
    console.log('   • Temperature conversion requires precision formatting');
    console.log('   • ATM simulation teaches real-world application');
    console.log('   • Number patterns develop algorithmic thinking');
    console.log('   • Max/min functions reinforce array concepts');
    console.log('   • Circle calculations involve mathematical constants');
    
    console.log('\n' + '='.repeat(80));
    console.log(`🎉 SUCCESS! C Programming Level 1 Set 2 is ready for deployment!`);
    console.log('='.repeat(80));
    console.log('🔄 This alternative assessment provides fresh content while maintaining');
    console.log('   the same rigorous evaluation of C programming fundamentals.');
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
console.log('🔧 === C Programming Level 1 Set 2 Quiz Seeder ===\n');
console.log('🎯 Creating alternative assessment for C programming fundamentals...\n');
seedCLevel1Set2Quiz();