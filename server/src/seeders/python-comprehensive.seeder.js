// server/src/seeders/python-comprehensive.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

dotenv.config();

const pythonComprehensiveQuiz = {
  title: 'Python Programming Comprehensive Assessment',
  description: 'Complete Python programming assessment covering basics to advanced concepts including syntax, data structures, OOP, file handling, and algorithms. Mix of MCQ and coding questions.',
  timeLimit: 120, // 2 hours for 25 questions
  isPublished: true,
  allowedAttempts: 2,
  showResults: true,
  randomizeQuestions: true,
  questions: [
    // Question 1: MCQ - Python Basics
    {
      type: 'multiple-choice',
      title: 'Python Variable Declaration',
      content: '<p>Which of the following is the correct way to declare multiple variables in Python?</p>',
      options: [
        'int a = 5, b = 10, c = 15',
        'a, b, c = 5, 10, 15',
        'var a = 5; var b = 10; var c = 15',
        'let a = 5, b = 10, c = 15'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 2: Code - Hello World with Input
    {
      type: 'code',
      title: 'Personalized Greeting',
      content: '<p>Write a Python program that reads a name from input and prints a personalized greeting.</p><p><strong>Input Format:</strong> A single line containing a name</p><p><strong>Output Format:</strong> Hello, [name]! Welcome to Python programming!</p>',
      language: 'python',
      testCases: [
        {
          input: 'Alice',
          expectedOutput: 'Hello, Alice! Welcome to Python programming!',
          isHidden: false
        },
        {
          input: 'Bob',
          expectedOutput: 'Hello, Bob! Welcome to Python programming!',
          isHidden: false
        },
        {
          input: 'Python Developer',
          expectedOutput: 'Hello, Python Developer! Welcome to Python programming!',
          isHidden: true
        }
      ],
      starterCode: '# Read name and print greeting\n',
      points: 3
    },

    // Question 3: MCQ - Data Types
    {
      type: 'multiple-choice',
      title: 'Python Data Type',
      content: '<p>What is the output of the following code?</p><pre><code>x = 5\ny = 2.5\nz = x / 2\nprint(type(z))</code></pre>',
      options: [
        "<class 'int'>",
        "<class 'float'>",
        "<class 'double'>",
        "<class 'number'>"
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 4: Code - Sum of Numbers
    {
      type: 'code',
      title: 'Sum of N Natural Numbers',
      content: '<p>Write a Python program to calculate the sum of first N natural numbers.</p><p><strong>Input:</strong> A positive integer N</p><p><strong>Output:</strong> Sum of numbers from 1 to N</p><p><strong>Example:</strong><br>Input: 5<br>Output: 15</p>',
      language: 'python',
      testCases: [
        {
          input: '5',
          expectedOutput: '15',
          isHidden: false
        },
        {
          input: '10',
          expectedOutput: '55',
          isHidden: false
        },
        {
          input: '100',
          expectedOutput: '5050',
          isHidden: true
        },
        {
          input: '1',
          expectedOutput: '1',
          isHidden: true
        }
      ],
      starterCode: '# Calculate sum of first N natural numbers\nn = int(input())\n',
      points: 4
    },

    // Question 5: MCQ - Lists
    {
      type: 'multiple-choice',
      title: 'List Operations',
      content: '<p>What is the output of the following code?</p><pre><code>my_list = [1, 2, 3, 4, 5]\nmy_list[1:4] = [8, 9]\nprint(my_list)</code></pre>',
      options: [
        '[1, 8, 9, 4, 5]',
        '[1, 8, 9, 5]',
        '[8, 9, 3, 4, 5]',
        '[1, 2, 8, 9, 5]'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 6: Code - List Manipulation
    {
      type: 'code',
      title: 'Find Maximum and Minimum',
      content: '<p>Write a Python program that reads n integers and finds both the maximum and minimum values.</p><p><strong>Input Format:</strong><br>Line 1: n (number of integers)<br>Line 2: n space-separated integers</p><p><strong>Output Format:</strong><br>Maximum: [max_value]<br>Minimum: [min_value]</p>',
      language: 'python',
      testCases: [
        {
          input: '5\n10 5 8 3 15',
          expectedOutput: 'Maximum: 15\nMinimum: 3',
          isHidden: false
        },
        {
          input: '3\n-5 0 5',
          expectedOutput: 'Maximum: 5\nMinimum: -5',
          isHidden: false
        },
        {
          input: '4\n100 200 150 175',
          expectedOutput: 'Maximum: 200\nMinimum: 100',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 7: MCQ - String Methods
    {
      type: 'multiple-choice',
      title: 'String Methods',
      content: '<p>What is the output of the following code?</p><pre><code>text = "  Python Programming  "\nprint(len(text.strip()))</code></pre>',
      options: [
        '22',
        '18',
        '20',
        '19'
      ],
      correctAnswer: 2,
      points: 2
    },

    // Question 8: Code - Palindrome Check
    {
      type: 'code',
      title: 'Palindrome Checker',
      content: '<p>Write a Python program to check if a given string is a palindrome (reads same forwards and backwards). Ignore case.</p><p><strong>Input:</strong> A string</p><p><strong>Output:</strong> "Palindrome" or "Not Palindrome"</p>',
      language: 'python',
      testCases: [
        {
          input: 'racecar',
          expectedOutput: 'Palindrome',
          isHidden: false
        },
        {
          input: 'hello',
          expectedOutput: 'Not Palindrome',
          isHidden: false
        },
        {
          input: 'Madam',
          expectedOutput: 'Palindrome',
          isHidden: false
        },
        {
          input: 'A man a plan a canal Panama',
          expectedOutput: 'Palindrome',
          isHidden: true
        }
      ],
      starterCode: '# Check if string is palindrome\ntext = input().strip()\n# Remove spaces and convert to lowercase\ntext = text.replace(" ", "").lower()\n',
      points: 6
    },

    // Question 9: MCQ - Loops
    {
      type: 'multiple-choice',
      title: 'Loop Output',
      content: '<p>What is the output of the following code?</p><pre><code>for i in range(2, 10, 3):\n    print(i, end=" ")</code></pre>',
      options: [
        '2 3 4 5 6 7 8 9',
        '2 5 8',
        '3 6 9',
        '2 4 6 8'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 10: Code - Fibonacci Sequence
    {
      type: 'code',
      title: 'Fibonacci Sequence',
      content: '<p>Write a Python program to print the first N numbers in the Fibonacci sequence.</p><p><strong>Input:</strong> A positive integer N</p><p><strong>Output:</strong> First N Fibonacci numbers separated by spaces</p><p><strong>Example:</strong><br>Input: 5<br>Output: 0 1 1 2 3</p>',
      language: 'python',
      testCases: [
        {
          input: '5',
          expectedOutput: '0 1 1 2 3',
          isHidden: false
        },
        {
          input: '8',
          expectedOutput: '0 1 1 2 3 5 8 13',
          isHidden: false
        },
        {
          input: '1',
          expectedOutput: '0',
          isHidden: true
        },
        {
          input: '10',
          expectedOutput: '0 1 1 2 3 5 8 13 21 34',
          isHidden: true
        }
      ],
      points: 6
    },

    // Question 11: MCQ - Functions
    {
      type: 'multiple-choice',
      title: 'Function Arguments',
      content: '<p>Which of the following function definitions allows for a variable number of arguments?</p>',
      options: [
        'def func(args):',
        'def func(*args):',
        'def func([args]):',
        'def func(args[]):'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 12: Code - Prime Number
    {
      type: 'code',
      title: 'Prime Number Checker',
      content: '<p>Write a Python function to check if a number is prime.</p><p><strong>Input:</strong> A positive integer</p><p><strong>Output:</strong> "Prime" if the number is prime, "Not Prime" otherwise</p>',
      language: 'python',
      testCases: [
        {
          input: '7',
          expectedOutput: 'Prime',
          isHidden: false
        },
        {
          input: '12',
          expectedOutput: 'Not Prime',
          isHidden: false
        },
        {
          input: '2',
          expectedOutput: 'Prime',
          isHidden: true
        },
        {
          input: '1',
          expectedOutput: 'Not Prime',
          isHidden: true
        },
        {
          input: '97',
          expectedOutput: 'Prime',
          isHidden: true
        }
      ],
      starterCode: 'def is_prime(n):\n    if n <= 1:\n        return False\n    # Your code here\n\nn = int(input())\nif is_prime(n):\n    print("Prime")\nelse:\n    print("Not Prime")',
      points: 5
    },

    // Question 13: MCQ - Dictionary
    {
      type: 'multiple-choice',
      title: 'Dictionary Operations',
      content: '<p>What is the output of the following code?</p><pre><code>d = {\'a\': 1, \'b\': 2, \'c\': 3}\nprint(d.get(\'d\', 0))</code></pre>',
      options: [
        'None',
        'KeyError',
        '0',
        '3'
      ],
      correctAnswer: 2,
      points: 2
    },

    // Question 14: Code - Word Count
    {
      type: 'code',
      title: 'Word Frequency Counter',
      content: '<p>Write a Python program to count the frequency of each word in a sentence.</p><p><strong>Input:</strong> A sentence</p><p><strong>Output:</strong> Each word and its count in format "word: count" (sorted alphabetically)</p>',
      language: 'python',
      testCases: [
        {
          input: 'hello world hello',
          expectedOutput: 'hello: 2\nworld: 1',
          isHidden: false
        },
        {
          input: 'python is great python is fun',
          expectedOutput: 'fun: 1\ngreat: 1\nis: 2\npython: 2',
          isHidden: false
        },
        {
          input: 'the quick brown fox jumps over the lazy dog',
          expectedOutput: 'brown: 1\ndog: 1\nfox: 1\njumps: 1\nlazy: 1\nover: 1\nquick: 1\nthe: 2',
          isHidden: true
        }
      ],
      points: 6
    },

    // Question 15: MCQ - List Comprehension
    {
      type: 'multiple-choice',
      title: 'List Comprehension',
      content: '<p>What does the following list comprehension produce?</p><pre><code>[x**2 for x in range(5) if x % 2 == 0]</code></pre>',
      options: [
        '[0, 4, 16]',
        '[0, 1, 4, 9, 16]',
        '[1, 9]',
        '[0, 2, 4]'
      ],
      correctAnswer: 0,
      points: 3
    },

    // Question 16: Code - Matrix Operations
    {
      type: 'code',
      title: 'Matrix Transpose',
      content: '<p>Write a Python program to find the transpose of a matrix.</p><p><strong>Input Format:</strong><br>Line 1: rows cols<br>Next rows lines: cols space-separated integers</p><p><strong>Output:</strong> Transposed matrix</p>',
      language: 'python',
      testCases: [
        {
          input: '2 3\n1 2 3\n4 5 6',
          expectedOutput: '1 4\n2 5\n3 6',
          isHidden: false
        },
        {
          input: '3 2\n1 2\n3 4\n5 6',
          expectedOutput: '1 3 5\n2 4 6',
          isHidden: false
        },
        {
          input: '2 2\n1 2\n3 4',
          expectedOutput: '1 3\n2 4',
          isHidden: true
        }
      ],
      points: 7
    },

    // Question 17: MCQ - Exception Handling
    {
      type: 'multiple-choice',
      title: 'Exception Handling',
      content: '<p>Which exception is raised when dividing by zero in Python?</p>',
      options: [
        'ValueError',
        'ZeroDivisionError',
        'ArithmeticError',
        'MathError'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 18: Code - File Operations Simulation
    {
      type: 'code',
      title: 'Count Vowels and Consonants',
      content: '<p>Write a Python program to count the number of vowels and consonants in a given string (ignore non-alphabetic characters).</p><p><strong>Input:</strong> A string</p><p><strong>Output:</strong><br>Vowels: [count]<br>Consonants: [count]</p>',
      language: 'python',
      testCases: [
        {
          input: 'Hello World',
          expectedOutput: 'Vowels: 3\nConsonants: 7',
          isHidden: false
        },
        {
          input: 'Python Programming',
          expectedOutput: 'Vowels: 4\nConsonants: 12',
          isHidden: false
        },
        {
          input: 'AEIOUaeiou',
          expectedOutput: 'Vowels: 10\nConsonants: 0',
          isHidden: true
        }
      ],
      points: 5
    },

    // Question 19: MCQ - Classes
    {
      type: 'multiple-choice',
      title: 'Python Classes',
      content: '<p>What is the correct way to create a class constructor in Python?</p>',
      options: [
        'def constructor(self):',
        'def __init__(self):',
        'def __construct__(self):',
        'def new(self):'
      ],
      correctAnswer: 1,
      points: 2
    },

    // Question 20: Code - Sorting
    {
      type: 'code',
      title: 'Sort Numbers by Frequency',
      content: '<p>Write a Python program to sort numbers by their frequency of occurrence (descending). If frequencies are same, sort by value (ascending).</p><p><strong>Input Format:</strong><br>Line 1: n<br>Line 2: n space-separated integers</p><p><strong>Output:</strong> Sorted numbers separated by spaces</p>',
      language: 'python',
      testCases: [
        {
          input: '8\n1 2 2 3 3 3 4 4',
          expectedOutput: '3 3 3 2 2 4 4 1',
          isHidden: false
        },
        {
          input: '5\n5 5 4 4 3',
          expectedOutput: '4 4 5 5 3',
          isHidden: false
        },
        {
          input: '6\n1 1 2 2 3 3',
          expectedOutput: '1 1 2 2 3 3',
          isHidden: true
        }
      ],
      points: 8
    },

    // Question 21: MCQ - Lambda Functions
    {
      type: 'multiple-choice',
      title: 'Lambda Functions',
      content: '<p>What is the output of the following code?</p><pre><code>numbers = [1, 2, 3, 4, 5]\nresult = list(filter(lambda x: x % 2 == 0, numbers))\nprint(result)</code></pre>',
      options: [
        '[1, 3, 5]',
        '[2, 4]',
        '[1, 2, 3, 4, 5]',
        '[]'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Question 22: Code - Binary Search
    {
      type: 'code',
      title: 'Binary Search Implementation',
      content: '<p>Implement binary search to find if a target number exists in a sorted array.</p><p><strong>Input Format:</strong><br>Line 1: n (size of array)<br>Line 2: n sorted integers<br>Line 3: target number</p><p><strong>Output:</strong> "Found" or "Not Found"</p>',
      language: 'python',
      testCases: [
        {
          input: '5\n1 3 5 7 9\n5',
          expectedOutput: 'Found',
          isHidden: false
        },
        {
          input: '5\n1 3 5 7 9\n4',
          expectedOutput: 'Not Found',
          isHidden: false
        },
        {
          input: '8\n2 4 6 8 10 12 14 16\n10',
          expectedOutput: 'Found',
          isHidden: true
        },
        {
          input: '1\n42\n42',
          expectedOutput: 'Found',
          isHidden: true
        }
      ],
      starterCode: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    # Implement binary search\n    \nn = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\nif binary_search(arr, target):\n    print("Found")\nelse:\n    print("Not Found")',
      points: 8
    },

    // Question 23: MCQ - Decorators
    {
      type: 'multiple-choice',
      title: 'Python Decorators',
      content: '<p>What symbol is used to apply a decorator to a function in Python?</p>',
      options: [
        '#',
        '$',
        '@',
        '&'
      ],
      correctAnswer: 2,
      points: 2
    },

    // Question 24: Code - Advanced Problem
    {
      type: 'code',
      title: 'Longest Common Prefix',
      content: '<p>Write a Python program to find the longest common prefix among an array of strings.</p><p><strong>Input Format:</strong><br>Line 1: n (number of strings)<br>Next n lines: one string per line</p><p><strong>Output:</strong> Longest common prefix (or "No common prefix" if none exists)</p>',
      language: 'python',
      testCases: [
        {
          input: '3\nflower\nflow\nflight',
          expectedOutput: 'fl',
          isHidden: false
        },
        {
          input: '3\ndog\nracecar\ncar',
          expectedOutput: 'No common prefix',
          isHidden: false
        },
        {
          input: '4\nprefix\npreform\nprevent\nprecise',
          expectedOutput: 'pre',
          isHidden: true
        },
        {
          input: '2\nab\na',
          expectedOutput: 'a',
          isHidden: true
        }
      ],
      points: 10
    },

    // Question 25: MCQ - Advanced Concepts
    {
      type: 'multiple-choice',
      title: 'Python Memory Management',
      content: '<p>Which of the following is used for memory management in Python?</p>',
      options: [
        'Manual memory allocation',
        'Garbage collector',
        'Memory pools only',
        'Stack allocation only'
      ],
      correctAnswer: 1,
      points: 3
    }
  ]
};

// Seeder function
async function seedPythonComprehensiveQuiz() {
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

    const existingQuiz = await Quiz.findOne({ title: pythonComprehensiveQuiz.title });
    
    if (existingQuiz) {
      console.log('Quiz already exists. Updating...');
      Object.assign(existingQuiz, {
        ...pythonComprehensiveQuiz,
        createdBy: instructor._id
      });
      await existingQuiz.save();
      console.log('Quiz updated successfully!');
    } else {
      const quizCode = await Quiz.generateUniqueCode();
      const quiz = new Quiz({
        ...pythonComprehensiveQuiz,
        quizCode,
        createdBy: instructor._id
      });
      await quiz.save();
      console.log('Quiz created successfully!');
      console.log(`Quiz Code: ${quiz.quizCode}`);
    }

    console.log('\n✅ Python Comprehensive Quiz seeded successfully!');
    
    const totalPoints = pythonComprehensiveQuiz.questions.reduce((sum, q) => sum + q.points, 0);
    const mcqCount = pythonComprehensiveQuiz.questions.filter(q => q.type === 'multiple-choice').length;
    const codeCount = pythonComprehensiveQuiz.questions.filter(q => q.type === 'code').length;
    
    console.log('\nQuiz Statistics:');
    console.log(`- Total Questions: ${pythonComprehensiveQuiz.questions.length}`);
    console.log(`- Multiple Choice: ${mcqCount}`);
    console.log(`- Coding Questions: ${codeCount}`);
    console.log(`- Total Points: ${totalPoints}`);
    console.log(`- Time Limit: ${pythonComprehensiveQuiz.timeLimit} minutes`);

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
}

// Run seeder
console.log('🐍 === Python Comprehensive Quiz Seeder ===\n');
seedPythonComprehensiveQuiz();