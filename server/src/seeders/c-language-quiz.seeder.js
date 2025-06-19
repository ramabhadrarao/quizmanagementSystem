import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// C Language Quiz Data
const cLanguageQuiz = {
  title: 'C Programming Fundamentals - Complete Assessment',
  description: 'Comprehensive C programming quiz covering basic to advanced concepts including syntax, pointers, arrays, structures, file handling, and memory management.',
  timeLimit: 90, // 90 minutes for 25 questions
  isPublished: true,
  allowedAttempts: 3,
  showResults: true,
  randomizeQuestions: false,
  questions: [
    // Question 1: Multiple Choice - Basic Syntax
    {
      type: 'multiple-choice',
      title: 'C Program Structure',
      content: '<p>Which of the following is the correct structure of a basic C program?</p>',
      options: [
        '#include <stdio.h>\nint main() {\n    printf("Hello World");\n    return 0;\n}',
        'import stdio.h\nvoid main() {\n    print("Hello World");\n    return 0;\n}',
        '#include <stdio.h>\nvoid main() {\n    System.out.println("Hello World");\n}',
        'include stdio.h\nint main() {\n    cout << "Hello World";\n    return 0;\n}'
      ],
      correctAnswer: 0,
      points: 2
    },

    // Question 2: Code - Hello World
    {
      type: 'code',
      title: 'Write Hello World Program',
      content: '<p>Write a complete C program that prints "Hello, World!" to the console.</p>',
      language: 'c',
      testCases: [
        {
          input: ' ',  // Space character for no input programs
          expectedOutput: 'Hello, World!',
          isHidden: false
        }
      ],
      points: 3
    },

    // Question 3: Multiple Choice - Data Types
    {
      type: 'multiple-choice',
      title: 'C Data Types',
      content: '<p>What is the size of <code>int</code> data type in C on a 32-bit system?</p>',
      options: [
        '2 bytes',
        '4 bytes',
        '8 bytes',
        '1 byte'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 4: Code - Variables and Input
    {
      type: 'code',
      title: 'Sum of Two Numbers',
      content: '<p>Write a C program that takes two integers as input and prints their sum.</p><p><strong>Input Format:</strong> Two space-separated integers</p><p><strong>Output Format:</strong> Sum of the two numbers</p>',
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
          input: '-5 5',
          expectedOutput: '0',
          isHidden: true
        }
      ],
      points: 4
    },

    // Question 5: Multiple Choice - Operators
    {
      type: 'multiple-choice',
      title: 'Operator Precedence',
      content: '<p>What is the output of the following C code?</p><pre><code>int a = 5, b = 2, c = 3;\nint result = a + b * c;\nprintf("%d", result);</code></pre>',
      options: [
        '21',
        '11',
        '35',
        '10'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 6: Multiple Choice - Control Structures
    {
      type: 'multiple-choice',
      title: 'Loop Output',
      content: '<p>What is the output of the following code?</p><pre><code>for(int i = 0; i < 5; i++) {\n    if(i == 3) continue;\n    printf("%d ", i);\n}</code></pre>',
      options: [
        '0 1 2 3 4',
        '0 1 2 4',
        '1 2 4 5',
        '0 1 2 3'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 7: Code - Factorial
    {
      type: 'code',
      title: 'Calculate Factorial',
      content: '<p>Write a C program to calculate the factorial of a given number using a loop.</p><p><strong>Input:</strong> A single integer n (0 ≤ n ≤ 12)</p><p><strong>Output:</strong> Factorial of n</p>',
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
          input: '7',
          expectedOutput: '5040',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 8: Multiple Choice - Arrays
    {
      type: 'multiple-choice',
      title: 'Array Declaration',
      content: '<p>Which of the following correctly declares an array of 10 integers in C?</p>',
      options: [
        'int arr[10];',
        'int arr(10);',
        'array int arr[10];',
        'int[] arr = new int[10];'
      ],
      correctAnswer: 0,
      points: 2
    },

    // Question 9: Code - Array Sum
    {
      type: 'code',
      title: 'Sum of Array Elements',
      content: '<p>Write a C program that reads n integers into an array and prints their sum.</p><p><strong>Input Format:</strong><br>First line: n (number of elements)<br>Second line: n space-separated integers</p><p><strong>Output:</strong> Sum of all elements</p>',
      language: 'c',
      testCases: [
        {
          input: '5\n1 2 3 4 5',
          expectedOutput: '15',
          isHidden: false
        },
        {
          input: '3\n10 20 30',
          expectedOutput: '60',
          isHidden: false
        },
        {
          input: '4\n-1 -2 3 4',
          expectedOutput: '4',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 10: Multiple Choice - Pointers
    {
      type: 'multiple-choice',
      title: 'Pointer Basics',
      content: '<p>What does the following code print?</p><pre><code>int x = 10;\nint *p = &x;\nprintf("%d", *p);</code></pre>',
      options: [
        'Address of x',
        '10',
        'Garbage value',
        'Compilation error'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 11: Multiple Choice - Pointer Arithmetic
    {
      type: 'multiple-choice',
      title: 'Pointer Arithmetic',
      content: '<p>If <code>ptr</code> is a pointer to an integer and currently points to address 1000, what will be the value of <code>ptr + 1</code>?</p>',
      options: [
        '1001',
        '1004',
        '1002',
        'Depends on the compiler'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 12: Code - Swap Using Pointers
    {
      type: 'code',
      title: 'Swap Two Numbers Using Pointers',
      content: '<p>Write a C program that swaps two numbers using pointers. The program should read two integers and print them after swapping.</p><p><strong>Input:</strong> Two space-separated integers</p><p><strong>Output:</strong> The swapped values</p>',
      language: 'c',
      testCases: [
        {
          input: '5 10',
          expectedOutput: '10 5',
          isHidden: false
        },
        {
          input: '100 200',
          expectedOutput: '200 100',
          isHidden: false
        },
        {
          input: '-5 25',
          expectedOutput: '25 -5',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 13: Multiple Choice - Strings
    {
      type: 'multiple-choice',
      title: 'String Declaration',
      content: '<p>Which of the following is the correct way to declare a string that can hold "Hello" in C?</p>',
      options: [
        'char str[5];',
        'char str[6];',
        'string str = "Hello";',
        'char str[] = Hello;'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 14: Code - String Length
    {
      type: 'code',
      title: 'Calculate String Length',
      content: '<p>Write a C program to calculate the length of a string without using the strlen() function.</p><p><strong>Input:</strong> A string (max 100 characters)</p><p><strong>Output:</strong> Length of the string</p>',
      language: 'c',
      testCases: [
        {
          input: 'Hello',
          expectedOutput: '5',
          isHidden: false
        },
        {
          input: 'C Programming',
          expectedOutput: '13',
          isHidden: false
        },
        {
          input: 'Test123',
          expectedOutput: '7',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 15: Multiple Choice - Functions
    {
      type: 'multiple-choice',
      title: 'Function Return Type',
      content: '<p>What is the default return type of a function in C if not specified?</p>',
      options: [
        'void',
        'int',
        'float',
        'No default type'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 16: Code - Prime Number
    {
      type: 'code',
      title: 'Check Prime Number',
      content: '<p>Write a C program to check if a given number is prime or not.</p><p><strong>Input:</strong> A positive integer</p><p><strong>Output:</strong> "Prime" if the number is prime, "Not Prime" otherwise</p>',
      language: 'c',
      testCases: [
        {
          input: '7',
          expectedOutput: 'Prime',
          isHidden: false
        },
        {
          input: '10',
          expectedOutput: 'Not Prime',
          isHidden: false
        },
        {
          input: '17',
          expectedOutput: 'Prime',
          isHidden: true
        },
        {
          input: '1',
          expectedOutput: 'Not Prime',
          isHidden: true
        }
      ],
      points: 6
    },

    // Question 17: Multiple Choice - Structures
    {
      type: 'multiple-choice',
      title: 'Structure Definition',
      content: '<p>Which keyword is used to define a structure in C?</p>',
      options: [
        'class',
        'struct',
        'structure',
        'record'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 18: Multiple Choice - Structure Access
    {
      type: 'multiple-choice',
      title: 'Structure Member Access',
      content: '<p>How do you access a member of a structure using a pointer to the structure?</p>',
      options: [
        'ptr.member',
        'ptr->member',
        'ptr:member',
        '*ptr.member'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 19: Code - Structure Implementation
    {
      type: 'code',
      title: 'Student Structure',
      content: '<p>Create a structure to store student information (name and marks) and write a program to read and display the information of one student.</p><p><strong>Input Format:</strong><br>Line 1: Student name (single word)<br>Line 2: Marks (integer)</p><p><strong>Output Format:</strong><br>Name: [name]<br>Marks: [marks]</p>',
      language: 'c',
      testCases: [
        {
          input: 'John\n85',
          expectedOutput: 'Name: John\nMarks: 85',
          isHidden: false
        },
        {
          input: 'Alice\n92',
          expectedOutput: 'Name: Alice\nMarks: 92',
          isHidden: false
        }
      ],
      points: 6
    },

    // Question 20: Multiple Choice - File Handling
    {
      type: 'multiple-choice',
      title: 'File Opening Mode',
      content: '<p>Which mode opens a file for both reading and writing in C?</p>',
      options: [
        'r',
        'w',
        'r+',
        'a'
      ],
      correctAnswer: 2,
      points: 3
    },

    // Question 21: Multiple Choice - Memory Allocation
    {
      type: 'multiple-choice',
      title: 'Dynamic Memory Allocation',
      content: '<p>Which function is used to allocate memory dynamically in C?</p>',
      options: [
        'alloc()',
        'malloc()',
        'new()',
        'memory()'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 22: Code - Reverse Array
    {
      type: 'code',
      title: 'Reverse an Array',
      content: '<p>Write a C program to reverse an array of integers.</p><p><strong>Input Format:</strong><br>Line 1: n (size of array)<br>Line 2: n space-separated integers</p><p><strong>Output:</strong> Reversed array (space-separated)</p>',
      language: 'c',
      testCases: [
        {
          input: '5\n1 2 3 4 5',
          expectedOutput: '5 4 3 2 1',
          isHidden: false
        },
        {
          input: '3\n10 20 30',
          expectedOutput: '30 20 10',
          isHidden: false
        },
        {
          input: '4\n-1 0 1 2',
          expectedOutput: '2 1 0 -1',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 23: Multiple Choice - Preprocessor
    {
      type: 'multiple-choice',
      title: 'Preprocessor Directives',
      content: '<p>Which of the following is a valid preprocessor directive in C?</p>',
      options: [
        '#define MAX 100',
        'define MAX 100',
        '@define MAX 100',
        '$define MAX 100'
      ],
      correctAnswer: 0,
      points: 2
    },

    // Question 24: Code - Pattern Printing
    {
      type: 'code',
      title: 'Print Number Triangle',
      content: '<p>Write a C program to print the following pattern for n rows:</p><pre>1\n1 2\n1 2 3\n1 2 3 4\n...</pre><p><strong>Input:</strong> Number of rows (n)</p><p><strong>Output:</strong> The pattern as shown</p>',
      language: 'c',
      testCases: [
        {
          input: '3',
          expectedOutput: '1\n1 2\n1 2 3',
          isHidden: false
        },
        {
          input: '5',
          expectedOutput: '1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5',
          isHidden: false
        },
        {
          input: '1',
          expectedOutput: '1',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 25: Code - Advanced Problem
    {
      type: 'code',
      title: 'Find Second Largest Element',
      content: '<p>Write a C program to find the second largest element in an array without sorting.</p><p><strong>Input Format:</strong><br>Line 1: n (size of array, n ≥ 2)<br>Line 2: n space-separated unique integers</p><p><strong>Output:</strong> The second largest element</p>',
      language: 'c',
      testCases: [
        {
          input: '5\n10 20 30 40 50',
          expectedOutput: '40',
          isHidden: false
        },
        {
          input: '4\n15 8 23 12',
          expectedOutput: '15',
          isHidden: false
        },
        {
          input: '6\n100 200 50 300 150 250',
          expectedOutput: '250',
          isHidden: true
        }
      ],
      points: 7
    }
  ]
};

// Seeder function
async function seedCLanguageQuiz() {
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
    const existingQuiz = await Quiz.findOne({ title: cLanguageQuiz.title });
    
    if (existingQuiz) {
      const response = await promptUser('A quiz with this title already exists. Do you want to replace it? (yes/no): ');
      
      if (response.toLowerCase() !== 'yes') {
        console.log('Seeding cancelled.');
        process.exit(0);
      }
      
      await Quiz.deleteOne({ _id: existingQuiz._id });
      console.log('Existing quiz deleted.');
    }

    // Create the quiz
    const quiz = new Quiz({
      ...cLanguageQuiz,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ C Language Quiz created successfully!');
    console.log('\nQuiz Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Title: ${quiz.title}`);
    console.log(`Questions: ${quiz.questions.length}`);
    console.log(`Time Limit: ${quiz.timeLimit} minutes`);
    console.log(`Created by: ${instructor.name}`);
    console.log(`Published: ${quiz.isPublished ? 'Yes' : 'No'}`);
    console.log('\nQuestion Distribution:');
    
    const mcCount = quiz.questions.filter(q => q.type === 'multiple-choice').length;
    const codeCount = quiz.questions.filter(q => q.type === 'code').length;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    
    console.log(`- Multiple Choice: ${mcCount} questions`);
    console.log(`- Code Challenges: ${codeCount} questions`);
    console.log(`- Total Points: ${totalPoints}`);
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
console.log('=== QuizMaster Pro - C Language Quiz Seeder ===\n');
seedCLanguageQuiz();