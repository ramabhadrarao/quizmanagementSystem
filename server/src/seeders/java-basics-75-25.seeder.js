// server/src/seeders/java-basics-75-25.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Java Basics Level 1 - 75% MCQ (18 questions) / 25% Code (6 questions)
const javaBasicsQuiz = {
  title: 'Java Programming Fundamentals Assessment - Level 1',
  description: 'Comprehensive Java programming basics quiz with 75% multiple choice and 25% coding questions. Perfect for beginners learning Java programming fundamentals and object-oriented concepts.',
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
    
    // MCQ 1: Java Basics
    {
      type: 'multiple-choice',
      title: 'Java Program Entry Point',
      content: '<p>Which method is the entry point of every Java application?</p>',
      options: [
        'start()',
        'main(String[] args)',
        'begin()',
        'init()'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 2: Java Features
    {
      type: 'multiple-choice',
      title: 'Java Platform Independence',
      content: '<p>What makes Java platform independent?</p>',
      options: [
        'Java Virtual Machine (JVM)',
        'Java Development Kit (JDK)',
        'Java Runtime Environment (JRE)',
        'Java Compiler'
      ],
      correctAnswer: 0,
      points: 2
    },

    // MCQ 3: Data Types
    {
      type: 'multiple-choice',
      title: 'Primitive Data Types',
      content: '<p>Which of the following is NOT a primitive data type in Java?</p>',
      options: [
        'int',
        'boolean',
        'String',
        'char'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 4: Variables
    {
      type: 'multiple-choice',
      title: 'Variable Declaration',
      content: '<p>Which of the following is a valid variable declaration in Java?</p>',
      options: [
        'int 2variable;',
        'int variable-name;',
        'int variableName;',
        'int variable name;'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 5: Output
    {
      type: 'multiple-choice',
      title: 'Output Statement',
      content: '<p>Which statement is used to print output to the console in Java?</p>',
      options: [
        'print()',
        'System.out.println()',
        'console.log()',
        'printf()'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 6: Operators
    {
      type: 'multiple-choice',
      title: 'Arithmetic Operators',
      content: '<p>What is the result of <code>15 % 4</code> in Java?</p>',
      options: [
        '3',
        '4',
        '3.75',
        '0'
      ],
      correctAnswer: 0,
      points: 2
    },

    // MCQ 7: Comments
    {
      type: 'multiple-choice',
      title: 'Comments in Java',
      content: '<p>Which of the following is the correct syntax for a single-line comment in Java?</p>',
      options: [
        '# This is a comment',
        '// This is a comment',
        '/* This is a comment',
        '-- This is a comment'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 8: Conditional Statements
    {
      type: 'multiple-choice',
      title: 'If Statement Syntax',
      content: '<p>What is the correct syntax for an if statement in Java?</p>',
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
      title: 'Enhanced For Loop',
      content: '<p>What is the enhanced for loop in Java also known as?</p>',
      options: [
        'Advanced loop',
        'For-each loop',
        'Iterator loop',
        'Simplified loop'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 10: Arrays
    {
      type: 'multiple-choice',
      title: 'Array Declaration',
      content: '<p>How do you declare an array of 10 integers in Java?</p>',
      options: [
        'int array[10];',
        'int[] array = new int[10];',
        'array int[10];',
        'int[10] array;'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 11: Classes and Objects
    {
      type: 'multiple-choice',
      title: 'Object Creation',
      content: '<p>Which keyword is used to create an object in Java?</p>',
      options: [
        'create',
        'new',
        'object',
        'instantiate'
      ],
      correctAnswer: 1,
      points: 3
    },

    // MCQ 12: Methods
    {
      type: 'multiple-choice',
      title: 'Method Declaration',
      content: '<p>What is the correct way to declare a public method that returns an integer?</p>',
      options: [
        'public int methodName()',
        'int public methodName()',
        'public methodName() int',
        'methodName() public int'
      ],
      correctAnswer: 0,
      points: 3
    },

    // MCQ 13: Input
    {
      type: 'multiple-choice',
      title: 'User Input',
      content: '<p>Which class is commonly used to read user input in Java?</p>',
      options: [
        'InputReader',
        'Scanner',
        'BufferedReader',
        'Console'
      ],
      correctAnswer: 1,
      points: 2
    },

    // MCQ 14: Strings
    {
      type: 'multiple-choice',
      title: 'String Comparison',
      content: '<p>Which method should be used to compare two strings for equality in Java?</p>',
      options: [
        '==',
        'equals()',
        'compare()',
        'isEqual()'
      ],
      correctAnswer: 1,
      points: 3
    },

    // MCQ 15: Inheritance
    {
      type: 'multiple-choice',
      title: 'Inheritance Keyword',
      content: '<p>Which keyword is used to inherit from a class in Java?</p>',
      options: [
        'inherits',
        'extends',
        'implements',
        'derives'
      ],
      correctAnswer: 1,
      points: 3
    },

    // MCQ 16: Access Modifiers
    {
      type: 'multiple-choice',
      title: 'Access Modifiers',
      content: '<p>Which access modifier makes a member accessible only within the same class?</p>',
      options: [
        'public',
        'protected',
        'private',
        'default'
      ],
      correctAnswer: 2,
      points: 2
    },

    // MCQ 17: Exception Handling
    {
      type: 'multiple-choice',
      title: 'Exception Handling',
      content: '<p>Which keyword is used to handle exceptions in Java?</p>',
      options: [
        'handle',
        'catch',
        'except',
        'error'
      ],
      correctAnswer: 1,
      points: 3
    },

    // MCQ 18: Static Keyword
    {
      type: 'multiple-choice',
      title: 'Static Members',
      content: '<p>What does the static keyword mean in Java?</p>',
      options: [
        'The member belongs to the instance',
        'The member belongs to the class',
        'The member cannot be changed',
        'The member is private'
      ],
      correctAnswer: 1,
      points: 3
    },

    // ========== CODE QUESTIONS (6 questions - 25%) ==========
    
    // Code 1: Basic Output
    {
      type: 'code',
      title: 'Hello World Program',
      content: '<p>Write a Java program that prints exactly:</p><p><strong>Hello, World!</strong></p><p>Note: Include the proper class structure and main method.</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Hello, World!',
          isHidden: false
        }
      ],
      starterCode: 'public class HelloWorld {\n    public static void main(String[] args) {\n        // Write your code here\n        \n    }\n}',
      points: 5
    },

    // Code 2: Variables and Arithmetic
    {
      type: 'code',
      title: 'Simple Calculator',
      content: '<p>Write a Java program that declares two integer variables <code>a = 20</code> and <code>b = 6</code>. Calculate and print their sum, difference, product, and integer division on separate lines.</p><p><strong>Expected Output:</strong><br>26<br>14<br>120<br>3</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: '26\n14\n120\n3',
          isHidden: false
        }
      ],
      starterCode: 'public class Calculator {\n    public static void main(String[] args) {\n        // Declare variables a and b\n        // Calculate and print sum, difference, product, and division\n        \n    }\n}',
      points: 6
    },

    // Code 3: User Input
    {
      type: 'code',
      title: 'Name Greeting',
      content: '<p>Write a Java program that reads a person\'s name and age, then prints a greeting message.</p><p><strong>Example:</strong><br>Input: John<br>       25<br>Output: Hello John, you are 25 years old!</p>',
      language: 'java',
      testCases: [
        {
          input: 'John\n25',
          expectedOutput: 'Hello John, you are 25 years old!',
          isHidden: false
        },
        {
          input: 'Alice\n30',
          expectedOutput: 'Hello Alice, you are 30 years old!',
          isHidden: false
        },
        {
          input: 'Bob\n18',
          expectedOutput: 'Hello Bob, you are 18 years old!',
          isHidden: true
        }
      ],
      starterCode: 'import java.util.Scanner;\n\npublic class Greeting {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read name and age, then print greeting\n        \n    }\n}',
      points: 6
    },

    // Code 4: Conditional Logic
    {
      type: 'code',
      title: 'Grade Classifier',
      content: '<p>Write a Java program that reads a score (0-100) and prints the corresponding grade:</p><p>• 90-100: A<br>• 80-89: B<br>• 70-79: C<br>• 60-69: D<br>• Below 60: F</p><p><strong>Example:</strong><br>Input: 85<br>Output: Grade: B</p>',
      language: 'java',
      testCases: [
        {
          input: '85',
          expectedOutput: 'Grade: B',
          isHidden: false
        },
        {
          input: '95',
          expectedOutput: 'Grade: A',
          isHidden: false
        },
        {
          input: '72',
          expectedOutput: 'Grade: C',
          isHidden: false
        },
        {
          input: '45',
          expectedOutput: 'Grade: F',
          isHidden: true
        }
      ],
      starterCode: 'import java.util.Scanner;\n\npublic class GradeClassifier {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int score = scanner.nextInt();\n        // Determine and print the grade\n        \n    }\n}',
      points: 7
    },

    // Code 5: Loops and Arrays
    {
      type: 'code',
      title: 'Array Sum Calculator',
      content: '<p>Write a Java program that reads 5 integers, stores them in an array, and prints their sum.</p><p><strong>Example:</strong><br>Input: 10 20 30 40 50<br>Output: Sum: 150</p>',
      language: 'java',
      testCases: [
        {
          input: '10\n20\n30\n40\n50',
          expectedOutput: 'Sum: 150',
          isHidden: false
        },
        {
          input: '1\n2\n3\n4\n5',
          expectedOutput: 'Sum: 15',
          isHidden: false
        },
        {
          input: '-5\n-3\n0\n3\n5',
          expectedOutput: 'Sum: 0',
          isHidden: true
        }
      ],
      starterCode: 'import java.util.Scanner;\n\npublic class ArraySum {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int[] numbers = new int[5];\n        // Read 5 numbers into array and calculate sum\n        \n    }\n}',
      points: 7
    },

    // Code 6: Object-Oriented Programming
    {
      type: 'code',
      title: 'Simple Class Implementation',
      content: '<p>Create a class called <code>Rectangle</code> with private fields <code>length</code> and <code>width</code>. Include a constructor, getter methods, and a method <code>calculateArea()</code> that returns the area. In main, create a Rectangle object and print its area.</p><p><strong>Example:</strong><br>Length: 5, Width: 3<br>Output: Area: 15</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Area: 15',
          isHidden: false
        }
      ],
      starterCode: 'public class Rectangle {\n    // Private fields\n    \n    // Constructor\n    \n    // Getter methods\n    \n    // calculateArea method\n    \n    public static void main(String[] args) {\n        // Create Rectangle object with length=5, width=3\n        // Print the area\n        \n    }\n}',
      points: 8
    }
  ]
};

// Seeder function
async function seedJavaBasicsQuiz() {
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
    const existingQuiz = await Quiz.findOne({ title: javaBasicsQuiz.title });
    
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
      ...javaBasicsQuiz,
      quizCode,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ Java Programming Basics Quiz (75/25 Split) created successfully!');
    console.log('\n' + '='.repeat(80));
    console.log('JAVA PROGRAMMING FUNDAMENTALS ASSESSMENT');
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
      const avgMCQPoints = totalMCQPoints / mcqCount;
      const avgCodePoints = totalCodePoints / codeCount;
      const studentPoints = (quiz.questionPoolConfig.multipleChoiceCount * avgMCQPoints) + (quiz.questionPoolConfig.codeCount * avgCodePoints);
      console.log(`   • Approximate points per student: ${Math.round(studentPoints)}`);
    }
    
    console.log('\n🔀 SHUFFLE CONFIGURATION:');
    console.log('-'.repeat(80));
    console.log(`✅ Shuffle Questions: ${quiz.shuffleConfig.shuffleQuestions ? 'Yes' : 'No'}`);
    console.log(`✅ Shuffle Options: ${quiz.shuffleConfig.shuffleOptions ? 'Yes' : 'No'}`);
    
    console.log('\n📑 QUESTIONS OVERVIEW:');
    console.log('-'.repeat(80));
    console.log('📌 MULTIPLE CHOICE TOPICS:');
    console.log('   • Java Program Structure & Main Method');
    console.log('   • Platform Independence & JVM');
    console.log('   • Primitive Data Types & Variables');
    console.log('   • Input/Output Operations');
    console.log('   • Operators & Expressions');
    console.log('   • Conditional Statements & Loops');
    console.log('   • Arrays & Collections Basics');
    console.log('   • Classes, Objects & Methods');
    console.log('   • Object-Oriented Concepts');
    console.log('   • Access Modifiers & Static Members');
    console.log('   • Exception Handling Basics');
    console.log('   • String Operations & Comparison');
    
    console.log('\n💻 CODING QUESTION TOPICS:');
    console.log('   • Basic Output (Hello World)');
    console.log('   • Variables & Arithmetic Operations');
    console.log('   • User Input & Scanner Usage');
    console.log('   • Conditional Logic & Decision Making');
    console.log('   • Arrays & Loop Implementation');
    console.log('   • Object-Oriented Programming (Classes & Objects)');
    
    console.log('\n🎓 LEARNING OBJECTIVES:');
    console.log('-'.repeat(80));
    console.log('📊 This assessment evaluates:');
    console.log('   ✓ Understanding of Java syntax and structure');
    console.log('   ✓ Knowledge of data types and variables');
    console.log('   ✓ Proficiency with input/output operations');
    console.log('   ✓ Ability to use operators and control structures');
    console.log('   ✓ Implementation of loops and arrays');
    console.log('   ✓ Object-oriented programming concepts');
    console.log('   ✓ Class design and method implementation');
    console.log('   ✓ Understanding of Java core principles');
    console.log('   ✓ Problem-solving with Java programming');
    
    console.log('\n🎯 RECOMMENDED USAGE:');
    console.log('-'.repeat(80));
    console.log('📝 Perfect for:');
    console.log('   • Introductory Java programming courses');
    console.log('   • Object-oriented programming fundamentals');
    console.log('   • Mid-term or final assessments');
    console.log('   • Java certification preparation');
    console.log('   • Programming bootcamp evaluations');
    console.log('   • Computer Science major prerequisites');
    
    console.log('\n⚙️  TECHNICAL FEATURES:');
    console.log('-'.repeat(80));
    console.log('🔧 Anti-cheating measures:');
    console.log('   ✓ Question pool randomization');
    console.log('   ✓ Question shuffling');
    console.log('   ✓ Option shuffling');
    console.log('   ✓ Multiple test cases for coding questions');
    console.log('   ✓ Hidden test cases for comprehensive validation');
    console.log('   ✓ Limited attempts (3 maximum)');
    console.log('   ✓ Proper Java class structure in starter code');
    
    console.log('\n📊 GRADING SCALE SUGGESTION:');
    console.log('-'.repeat(80));
    if (quiz.questionPoolConfig.enabled) {
      const avgMCQPoints = totalMCQPoints / mcqCount;
      const avgCodePoints = totalCodePoints / codeCount;
      const avgStudentPoints = Math.round((quiz.questionPoolConfig.multipleChoiceCount * avgMCQPoints) + (quiz.questionPoolConfig.codeCount * avgCodePoints));
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
    console.log('3. Review coding submissions for best practices');
    console.log('4. Provide feedback on object-oriented design');
    console.log('5. Export results for grade book integration');
    console.log('6. Use results to identify areas needing reinforcement');
    
    console.log('\n💡 INSTRUCTOR NOTES:');
    console.log('-'.repeat(80));
    console.log('🔍 Key areas to watch for in student submissions:');
    console.log('   • Proper Java syntax and conventions');
    console.log('   • Correct use of access modifiers');
    console.log('   • Understanding of object-oriented principles');
    console.log('   • Proper exception handling practices');
    console.log('   • Efficient use of Java built-in classes');
    
    console.log('\n' + '='.repeat(80));
    console.log(`🎉 SUCCESS! Java Programming Assessment is ready to use!`);
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
console.log('☕ === Java Programming Basics Quiz Seeder (75% MCQ / 25% Code) ===\n');
seedJavaBasicsQuiz();