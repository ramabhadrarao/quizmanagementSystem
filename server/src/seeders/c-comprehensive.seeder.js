// server/src/seeders/c-comprehensive.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

dotenv.config();

const cComprehensiveQuiz = {
  title: 'C Programming Comprehensive Assessment',
  description: 'Complete C programming assessment covering fundamentals to advanced topics including pointers, arrays, structures, memory management, and file handling. Mix of MCQ and coding questions.',
  timeLimit: 120, // 2 hours for 25 questions
  isPublished: true,
  allowedAttempts: 2,
  showResults: true,
  randomizeQuestions: true,
  questions: [
    // Question 1: MCQ - C Basics
    {
      type: 'multiple-choice',
      title: 'C Program Entry Point',
      content: '<p>What is the entry point of a C program?</p>',
      options: [
        'start() function',
        'main() function',
        'begin() function',
        'init() function'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 2: Code - Basic I/O
    {
      type: 'code',
      title: 'Basic Input and Output',
      content: '<p>Write a C program that reads two integers and prints their sum, difference, and product.</p><p><strong>Input Format:</strong> Two space-separated integers</p><p><strong>Output Format:</strong><br>Sum: [sum]<br>Difference: [difference]<br>Product: [product]</p>',
      language: 'c',
      testCases: [
        {
          input: '10 5',
          expectedOutput: 'Sum: 15\nDifference: 5\nProduct: 50',
          isHidden: false
        },
        {
          input: '7 3',
          expectedOutput: 'Sum: 10\nDifference: 4\nProduct: 21',
          isHidden: false
        },
        {
          input: '-5 8',
          expectedOutput: 'Sum: 3\nDifference: -13\nProduct: -40',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    // Your code here\n    return 0;\n}',
      points: 3
    },

    // Question 3: MCQ - Data Types
    {
      type: 'multiple-choice',
      title: 'C Data Type Size',
      content: '<p>On a 32-bit system, what is typically the size of a <code>long int</code>?</p>',
      options: [
        '2 bytes',
        '4 bytes',
        '8 bytes',
        '16 bytes'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 4: Code - Even or Odd
    {
      type: 'code',
      title: 'Even or Odd Checker',
      content: '<p>Write a C program to check if a number is even or odd.</p><p><strong>Input:</strong> An integer</p><p><strong>Output:</strong> "Even" or "Odd"</p>',
      language: 'c',
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
      starterCode: '#include <stdio.h>\n\nint main() {\n    int num;\n    scanf("%d", &num);\n    // Check if even or odd\n    \n    return 0;\n}',
      points: 3
    },

    // Question 5: MCQ - Operators
    {
      type: 'multiple-choice',
      title: 'Operator Precedence',
      content: '<p>What is the output of the following code?</p><pre><code>int a = 10, b = 20, c = 30;\nint result = a + b * c / 10;\nprintf("%d", result);</code></pre>',
      options: [
        '90',
        '70',
        '60',
        '100'
      ],
      correctAnswer: 1, // 10 + (20 * 30) / 10 = 10 + 600/10 = 10 + 60 = 70
      points: 3
    },

    // Question 6: Code - Factorial
    {
      type: 'code',
      title: 'Factorial Calculation',
      content: '<p>Write a C program to calculate the factorial of a given number using a loop.</p><p><strong>Input:</strong> A non-negative integer n (0 ≤ n ≤ 12)</p><p><strong>Output:</strong> Factorial of n</p>',
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
          input: '6',
          expectedOutput: '720',
          isHidden: true
        },
        {
          input: '10',
          expectedOutput: '3628800',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 7: MCQ - Arrays
    {
      type: 'multiple-choice',
      title: 'Array Initialization',
      content: '<p>Which of the following correctly initializes an array of 5 integers with all elements as 0?</p>',
      options: [
        'int arr[5] = {};',
        'int arr[5] = {0};',
        'int arr[5] = {0, 0, 0, 0, 0};',
        'All of the above'
      ],
      correctAnswer: 3,
      points: 2
    },

    // Question 8: Code - Array Sum
    {
      type: 'code',
      title: 'Array Average',
      content: '<p>Write a C program to find the average of n numbers.</p><p><strong>Input Format:</strong><br>Line 1: n (count of numbers)<br>Line 2: n space-separated integers</p><p><strong>Output:</strong> Average with 2 decimal places</p>',
      language: 'c',
      testCases: [
        {
          input: '5\n10 20 30 40 50',
          expectedOutput: '30.00',
          isHidden: false
        },
        {
          input: '3\n5 10 15',
          expectedOutput: '10.00',
          isHidden: false
        },
        {
          input: '4\n1 2 3 4',
          expectedOutput: '2.50',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[n];\n    // Read array and calculate average\n    \n    return 0;\n}',
      points: 5
    },

    // Question 9: MCQ - Pointers
    {
      type: 'multiple-choice',
      title: 'Pointer Declaration',
      content: '<p>Which of the following declares a pointer to an integer?</p>',
      options: [
        'int ptr;',
        'int *ptr;',
        'int &ptr;',
        'pointer int ptr;'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 10: Code - String Length
    {
      type: 'code',
      title: 'String Length Without strlen()',
      content: '<p>Write a C program to find the length of a string without using the strlen() function.</p><p><strong>Input:</strong> A string (max 100 characters)</p><p><strong>Output:</strong> Length of the string</p>',
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
          input: '',
          expectedOutput: '0',
          isHidden: true
        },
        {
          input: 'Test123!@#',
          expectedOutput: '10',
          isHidden: true
        }
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    char str[101];\n    scanf("%s", str);\n    int length = 0;\n    // Calculate length without strlen\n    \n    printf("%d", length);\n    return 0;\n}',
      points: 5
    },

    // Question 11: MCQ - Functions
    {
      type: 'multiple-choice',
      title: 'Function Return Type',
      content: '<p>What is the return type of a function that doesn\'t return any value?</p>',
      options: [
        'null',
        'void',
        'empty',
        'none'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 12: Code - Prime Number
    {
      type: 'code',
      title: 'Prime Number in Range',
      content: '<p>Write a C program to print all prime numbers between 1 and N (inclusive).</p><p><strong>Input:</strong> A positive integer N</p><p><strong>Output:</strong> All prime numbers from 1 to N separated by spaces</p>',
      language: 'c',
      testCases: [
        {
          input: '10',
          expectedOutput: '2 3 5 7',
          isHidden: false
        },
        {
          input: '20',
          expectedOutput: '2 3 5 7 11 13 17 19',
          isHidden: false
        },
        {
          input: '2',
          expectedOutput: '2',
          isHidden: true
        },
        {
          input: '30',
          expectedOutput: '2 3 5 7 11 13 17 19 23 29',
          isHidden: true
        }
      ],
      points: 7
    },

    // Question 13: MCQ - Structures
    {
      type: 'multiple-choice',
      title: 'Structure Size',
      content: '<p>What is the size of the following structure?</p><pre><code>struct Student {\n    int id;      // 4 bytes\n    char grade;  // 1 byte\n    float marks; // 4 bytes\n};</code></pre>',
      options: [
        '9 bytes',
        '12 bytes (due to padding)',
        '8 bytes',
        '16 bytes'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 14: Code - Reverse Array
    {
      type: 'code',
      title: 'Reverse an Array',
      content: '<p>Write a C program to reverse an array of integers in-place.</p><p><strong>Input Format:</strong><br>Line 1: n (size of array)<br>Line 2: n space-separated integers</p><p><strong>Output:</strong> Reversed array</p>',
      language: 'c',
      testCases: [
        {
          input: '5\n1 2 3 4 5',
          expectedOutput: '5 4 3 2 1',
          isHidden: false
        },
        {
          input: '4\n10 20 30 40',
          expectedOutput: '40 30 20 10',
          isHidden: false
        },
        {
          input: '1\n42',
          expectedOutput: '42',
          isHidden: true
        },
        {
          input: '6\n-1 0 1 2 3 4',
          expectedOutput: '4 3 2 1 0 -1',
          isHidden: true
        }
      ],
      points: 6
    },

    // Question 15: MCQ - Memory Allocation
    {
      type: 'multiple-choice',
      title: 'Dynamic Memory Allocation',
      content: '<p>Which function is used to allocate memory for an array of n integers?</p>',
      options: [
        'malloc(n)',
        'malloc(n * sizeof(int))',
        'calloc(n)',
        'alloc(n, int)'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 16: Code - Palindrome
    {
      type: 'code',
      title: 'Palindrome Number Check',
      content: '<p>Write a C program to check if a number is a palindrome.</p><p><strong>Input:</strong> A positive integer</p><p><strong>Output:</strong> "Palindrome" or "Not Palindrome"</p>',
      language: 'c',
      testCases: [
        {
          input: '121',
          expectedOutput: 'Palindrome',
          isHidden: false
        },
        {
          input: '123',
          expectedOutput: 'Not Palindrome',
          isHidden: false
        },
        {
          input: '1001',
          expectedOutput: 'Palindrome',
          isHidden: true
        },
        {
          input: '9',
          expectedOutput: 'Palindrome',
          isHidden: true
        }
      ],
      points: 6
    },

    // Question 17: MCQ - File Operations
    {
      type: 'multiple-choice',
      title: 'File Opening Mode',
      content: '<p>Which mode opens a file for appending at the end?</p>',
      options: [
        'r',
        'w',
        'a',
        'r+'
      ],
      correctAnswer: 2,
      points: 2
    },

    // Question 18: Code - Pattern Printing
    {
      type: 'code',
      title: 'Print Star Pattern',
      content: '<p>Write a C program to print the following pattern for n rows:</p><pre>*\n**\n***\n****</pre><p><strong>Input:</strong> Number of rows n</p><p><strong>Output:</strong> Star pattern</p>',
      language: 'c',
      testCases: [
        {
          input: '3',
          expectedOutput: '*\n**\n***',
          isHidden: false
        },
        {
          input: '5',
          expectedOutput: '*\n**\n***\n****\n*****',
          isHidden: false
        },
        {
          input: '1',
          expectedOutput: '*',
          isHidden: true
        }
      ],
      points: 4
    },

    // Question 19: MCQ - Preprocessor
    {
      type: 'multiple-choice',
      title: 'Preprocessor Directive',
      content: '<p>Which preprocessor directive is used to include header files?</p>',
      options: [
        '#define',
        '#include',
        '#import',
        '#header'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 20: Code - Bubble Sort
    {
      type: 'code',
      title: 'Bubble Sort Implementation',
      content: '<p>Write a C program to sort an array using bubble sort algorithm.</p><p><strong>Input Format:</strong><br>Line 1: n (size of array)<br>Line 2: n space-separated integers</p><p><strong>Output:</strong> Sorted array in ascending order</p>',
      language: 'c',
      testCases: [
        {
          input: '5\n5 3 8 1 2',
          expectedOutput: '1 2 3 5 8',
          isHidden: false
        },
        {
          input: '4\n9 7 5 3',
          expectedOutput: '3 5 7 9',
          isHidden: false
        },
        {
          input: '6\n-5 0 10 -2 8 3',
          expectedOutput: '-5 -2 0 3 8 10',
          isHidden: true
        }
      ],
      points: 8
    },

    // Question 21: MCQ - Recursion
    {
      type: 'multiple-choice',
      title: 'Recursion',
      content: '<p>What is the base case in a recursive function?</p>',
      options: [
        'The first call to the function',
        'The condition that stops recursion',
        'The recursive call',
        'The return statement'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 22: Code - Matrix Addition
    {
      type: 'code',
      title: 'Matrix Addition',
      content: '<p>Write a C program to add two 2x2 matrices.</p><p><strong>Input Format:</strong><br>First 2 lines: First matrix (2 integers per line)<br>Next 2 lines: Second matrix (2 integers per line)</p><p><strong>Output:</strong> Resultant matrix</p>',
      language: 'c',
      testCases: [
        {
          input: '1 2\n3 4\n5 6\n7 8',
          expectedOutput: '6 8\n10 12',
          isHidden: false
        },
        {
          input: '0 0\n0 0\n1 2\n3 4',
          expectedOutput: '1 2\n3 4',
          isHidden: false
        },
        {
          input: '-1 -2\n-3 -4\n1 2\n3 4',
          expectedOutput: '0 0\n0 0',
          isHidden: true
        }
      ],
      points: 7
    },

    // Question 23: MCQ - Bitwise Operators
    {
      type: 'multiple-choice',
      title: 'Bitwise Operations',
      content: '<p>What is the result of <code>5 & 3</code> in C?</p>',
      options: [
        '8',
        '2',
        '1',
        '15'
      ],
      correctAnswer: 2, // 5 (101) & 3 (011) = 001 = 1
      points: 3
    },

    // Question 24: Code - Advanced Problem
    {
      type: 'code',
      title: 'Find Second Largest',
      content: '<p>Write a C program to find the second largest element in an array without sorting.</p><p><strong>Input Format:</strong><br>Line 1: n (size ≥ 2)<br>Line 2: n unique integers</p><p><strong>Output:</strong> Second largest element</p>',
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
          input: '3\n-5 -10 -1',
          expectedOutput: '-5',
          isHidden: true
        },
        {
          input: '6\n100 200 50 300 150 250',
          expectedOutput: '250',
          isHidden: true
        }
      ],
      points: 10
    },

    // Question 25: MCQ - Advanced Concepts
    {
      type: 'multiple-choice',
      title: 'Pointer to Pointer',
      content: '<p>What does <code>int **ptr</code> declare?</p>',
      options: [
        'Pointer to an integer',
        'Pointer to a pointer to an integer',
        'Array of pointers',
        'Invalid declaration'
      ],
      correctAnswer: 1,
      points: 3
    }
  ]
};

// Seeder function
async function seedCComprehensiveQuiz() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-system');
    console.log('Connected to MongoDB');

    const instructor = await User.findOne({ 
      role: { $in: ['instructor', 'admin'] },
      isActive: true 
    });

    if (!instructor) {
      console.error('No instructor or admin user found. Please run the user seeder first.');
      process.exit(1);
    }

    console.log(`Using ${instructor.name} (${instructor.role}) as quiz creator`);

    const existingQuiz = await Quiz.findOne({ title: cComprehensiveQuiz.title });
    
    if (existingQuiz) {
      console.log('Quiz already exists. Updating...');
      Object.assign(existingQuiz, {
        ...cComprehensiveQuiz,
        createdBy: instructor._id
      });
      await existingQuiz.save();
      console.log('Quiz updated successfully!');
    } else {
      const quizCode = await Quiz.generateUniqueCode();
      const quiz = new Quiz({
        ...cComprehensiveQuiz,
        quizCode,
        createdBy: instructor._id
      });
      await quiz.save();
      console.log('Quiz created successfully!');
      console.log(`Quiz Code: ${quiz.quizCode}`);
    }

    console.log('\n✅ C Programming Comprehensive Quiz seeded successfully!');
    
    const totalPoints = cComprehensiveQuiz.questions.reduce((sum, q) => sum + q.points, 0);
    const mcqCount = cComprehensiveQuiz.questions.filter(q => q.type === 'multiple-choice').length;
    const codeCount = cComprehensiveQuiz.questions.filter(q => q.type === 'code').length;
    
    console.log('\nQuiz Statistics:');
    console.log(`- Total Questions: ${cComprehensiveQuiz.questions.length}`);
    console.log(`- Multiple Choice: ${mcqCount}`);
    console.log(`- Coding Questions: ${codeCount}`);
    console.log(`- Total Points: ${totalPoints}`);
    console.log(`- Time Limit: ${cComprehensiveQuiz.timeLimit} minutes`);

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
}

// Run seeder
console.log('🔧 === C Programming Comprehensive Quiz Seeder ===\n');
seedCComprehensiveQuiz();