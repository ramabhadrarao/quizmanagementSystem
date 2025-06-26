// server/src/seeders/java-level2-75-25.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Java Level 2 (Intermediate) - 75% MCQ (24 questions) / 25% Code (8 questions)
const javaLevel2Quiz = {
  title: 'Java Programming Intermediate Assessment - Level 2',
  description: 'Advanced Java programming assessment covering inheritance, polymorphism, interfaces, collections, exception handling, and design patterns. Perfect for intermediate Java developers and students progressing beyond fundamentals.',
  timeLimit: 180, // 180 minutes for 32 questions
  isPublished: true,
  allowedAttempts: 2,
  showResults: true,
  randomizeQuestions: false,
  startDate: null,
  endDate: null,
  
  // Question pool configuration
  questionPoolConfig: {
    enabled: true,
    multipleChoiceCount: 18, // Select 18 out of 24 MCQs
    codeCount: 6, // Select 6 out of 8 code questions
  },
  
  // Shuffle configuration for anti-cheating
  shuffleConfig: {
    shuffleQuestions: true,
    shuffleOptions: true,
  },
  
  questions: [
    // ========== MULTIPLE CHOICE QUESTIONS (24 questions - 75%) ==========
    
    // Inheritance and Polymorphism (6 questions)
    {
      type: 'multiple-choice',
      title: 'Method Overriding',
      content: '<p>Which annotation is used to indicate that a method is overriding a parent class method?</p>',
      options: [
        '@Override',
        '@Overwrite',
        '@Inherit',
        '@Super'
      ],
      correctAnswer: 0,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Super Keyword',
      content: '<p>What does the <code>super</code> keyword refer to in Java?</p>',
      options: [
        'The current object',
        'The parent class',
        'A static method',
        'The main method'
      ],
      correctAnswer: 1,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Polymorphism Types',
      content: '<p>Which type of polymorphism is achieved through method overloading?</p>',
      options: [
        'Runtime polymorphism',
        'Compile-time polymorphism',
        'Dynamic polymorphism',
        'Interface polymorphism'
      ],
      correctAnswer: 1,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'Abstract Classes',
      content: '<p>Can an abstract class have concrete (non-abstract) methods?</p>',
      options: [
        'No, all methods must be abstract',
        'Yes, but only private methods',
        'Yes, abstract classes can have both abstract and concrete methods',
        'Only if the class implements an interface'
      ],
      correctAnswer: 2,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Final Keyword',
      content: '<p>What happens when a class is declared as <code>final</code>?</p>',
      options: [
        'It cannot be instantiated',
        'It cannot be extended',
        'Its methods cannot be overridden',
        'It becomes abstract'
      ],
      correctAnswer: 1,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Constructor Inheritance',
      content: '<p>Are constructors inherited in Java?</p>',
      options: [
        'Yes, all constructors are inherited',
        'No, constructors are not inherited',
        'Only public constructors are inherited',
        'Only default constructors are inherited'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Interfaces and Abstract Classes (4 questions)
    {
      type: 'multiple-choice',
      title: 'Interface Implementation',
      content: '<p>Which keyword is used to implement an interface in Java?</p>',
      options: [
        'extends',
        'implements',
        'inherits',
        'uses'
      ],
      correctAnswer: 1,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Interface Methods',
      content: '<p>In Java 8+, which type of methods can interfaces have?</p>',
      options: [
        'Only abstract methods',
        'Abstract and default methods',
        'Abstract, default, and static methods',
        'All types of methods including private'
      ],
      correctAnswer: 2,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'Multiple Inheritance',
      content: '<p>How does Java handle multiple inheritance?</p>',
      options: [
        'Through multiple class extension',
        'Through interface implementation',
        'Java does not support multiple inheritance',
        'Through abstract classes only'
      ],
      correctAnswer: 1,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'Functional Interfaces',
      content: '<p>What is a functional interface in Java?</p>',
      options: [
        'An interface with multiple abstract methods',
        'An interface with exactly one abstract method',
        'An interface with only default methods',
        'An interface that cannot be implemented'
      ],
      correctAnswer: 1,
      points: 4
    },

    // Collections Framework (6 questions)
    {
      type: 'multiple-choice',
      title: 'ArrayList vs LinkedList',
      content: '<p>Which operation is more efficient in ArrayList compared to LinkedList?</p>',
      options: [
        'Insertion at the beginning',
        'Deletion from the middle',
        'Random access by index',
        'Traversal'
      ],
      correctAnswer: 2,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'HashMap Characteristics',
      content: '<p>Which of the following is true about HashMap?</p>',
      options: [
        'It maintains insertion order',
        'It allows duplicate keys',
        'It is synchronized',
        'It allows null values'
      ],
      correctAnswer: 3,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Set Interface',
      content: '<p>Which collection does NOT allow duplicate elements?</p>',
      options: [
        'ArrayList',
        'LinkedList',
        'HashSet',
        'Vector'
      ],
      correctAnswer: 2,
      points: 2
    },

    {
      type: 'multiple-choice',
      title: 'Iterator vs ListIterator',
      content: '<p>What is the main difference between Iterator and ListIterator?</p>',
      options: [
        'Iterator is faster',
        'ListIterator allows bidirectional traversal',
        'Iterator supports modification',
        'No significant difference'
      ],
      correctAnswer: 1,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'TreeMap Properties',
      content: '<p>What is the key characteristic of TreeMap?</p>',
      options: [
        'It maintains insertion order',
        'It sorts keys in natural order',
        'It allows null keys',
        'It is the fastest Map implementation'
      ],
      correctAnswer: 1,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Generics',
      content: '<p>What is the main benefit of using generics in Java?</p>',
      options: [
        'Improved performance',
        'Type safety at compile time',
        'Reduced memory usage',
        'Faster execution'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Exception Handling (4 questions)
    {
      type: 'multiple-choice',
      title: 'Checked vs Unchecked Exceptions',
      content: '<p>Which of the following is a checked exception?</p>',
      options: [
        'NullPointerException',
        'ArrayIndexOutOfBoundsException',
        'IOException',
        'IllegalArgumentException'
      ],
      correctAnswer: 2,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Finally Block',
      content: '<p>When does the finally block NOT execute?</p>',
      options: [
        'When an exception is thrown',
        'When no exception is thrown',
        'When System.exit() is called',
        'When return statement is used'
      ],
      correctAnswer: 2,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'Try-with-resources',
      content: '<p>What is the main advantage of try-with-resources statement?</p>',
      options: [
        'Better performance',
        'Automatic resource management',
        'Simpler syntax',
        'Exception suppression'
      ],
      correctAnswer: 1,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'Custom Exceptions',
      content: '<p>To create a custom checked exception, your class should extend:</p>',
      options: [
        'RuntimeException',
        'Exception',
        'Error',
        'Throwable'
      ],
      correctAnswer: 1,
      points: 3
    },

    // Advanced Concepts (4 questions)
    {
      type: 'multiple-choice',
      title: 'Lambda Expressions',
      content: '<p>Lambda expressions in Java are primarily used with:</p>',
      options: [
        'Any interface',
        'Functional interfaces',
        'Abstract classes',
        'Concrete classes'
      ],
      correctAnswer: 1,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'Stream API',
      content: '<p>Which operation is a terminal operation in Stream API?</p>',
      options: [
        'filter()',
        'map()',
        'collect()',
        'distinct()'
      ],
      correctAnswer: 2,
      points: 4
    },

    {
      type: 'multiple-choice',
      title: 'Enum Features',
      content: '<p>Which of the following can an enum have in Java?</p>',
      options: [
        'Constructors',
        'Methods',
        'Fields',
        'All of the above'
      ],
      correctAnswer: 3,
      points: 3
    },

    {
      type: 'multiple-choice',
      title: 'Reflection',
      content: '<p>What is reflection in Java used for?</p>',
      options: [
        'Creating objects faster',
        'Examining and modifying runtime behavior',
        'Improving performance',
        'Memory management'
      ],
      correctAnswer: 1,
      points: 4
    },

    // ========== CODE QUESTIONS (8 questions - 25%) ==========
    
    // Code 1: Inheritance Implementation
    {
      type: 'code',
      title: 'Inheritance and Method Overriding',
      content: '<p>Create a base class <code>Animal</code> with a method <code>makeSound()</code>. Create a derived class <code>Dog</code> that overrides this method to print "Woof!". In main, create a Dog object and call makeSound().</p><p><strong>Expected Output:</strong><br>Woof!</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Woof!',
          isHidden: false
        }
      ],
      starterCode: 'class Animal {\n    // Base class method\n}\n\nclass Dog extends Animal {\n    // Override makeSound method\n}\n\npublic class InheritanceDemo {\n    public static void main(String[] args) {\n        // Create Dog object and call makeSound\n    }\n}',
      points: 8
    },

    // Code 2: Interface Implementation
    {
      type: 'code',
      title: 'Interface Implementation',
      content: '<p>Create an interface <code>Drawable</code> with a method <code>draw()</code>. Create classes <code>Circle</code> and <code>Rectangle</code> that implement this interface. In main, create objects of both classes and call their draw methods.</p><p><strong>Expected Output:</strong><br>Drawing a Circle<br>Drawing a Rectangle</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Drawing a Circle\nDrawing a Rectangle',
          isHidden: false
        }
      ],
      starterCode: 'interface Drawable {\n    // Define draw method\n}\n\nclass Circle implements Drawable {\n    // Implement draw method\n}\n\nclass Rectangle implements Drawable {\n    // Implement draw method\n}\n\npublic class InterfaceDemo {\n    public static void main(String[] args) {\n        // Create objects and call draw methods\n    }\n}',
      points: 9
    },

    // Code 3: Collections Usage
    {
      type: 'code',
      title: 'ArrayList Operations',
      content: '<p>Create an ArrayList of integers. Add the numbers 10, 20, 30, 40, 50. Remove the element at index 2, then print the remaining elements.</p><p><strong>Expected Output:</strong><br>10 20 40 50</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: '10 20 40 50',
          isHidden: false
        }
      ],
      starterCode: 'import java.util.ArrayList;\n\npublic class ArrayListDemo {\n    public static void main(String[] args) {\n        // Create ArrayList and perform operations\n        \n    }\n}',
      points: 7
    },

    // Code 4: Exception Handling
    {
      type: 'code',
      title: 'Exception Handling with Try-Catch',
      content: '<p>Write a program that reads two integers and divides the first by the second. Handle the ArithmeticException (division by zero) and print "Cannot divide by zero" if it occurs.</p><p><strong>Example:</strong><br>Input: 10 2<br>Output: Result: 5<br><br>Input: 10 0<br>Output: Cannot divide by zero</p>',
      language: 'java',
      testCases: [
        {
          input: '10\n2',
          expectedOutput: 'Result: 5',
          isHidden: false
        },
        {
          input: '10\n0',
          expectedOutput: 'Cannot divide by zero',
          isHidden: false
        },
        {
          input: '15\n3',
          expectedOutput: 'Result: 5',
          isHidden: true
        }
      ],
      starterCode: 'import java.util.Scanner;\n\npublic class ExceptionDemo {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Read two integers and handle division\n        \n    }\n}',
      points: 8
    },

    // Code 5: HashMap Usage
    {
      type: 'code',
      title: 'HashMap Student Grades',
      content: '<p>Create a HashMap to store student names and their grades. Add three students: "Alice" with grade 85, "Bob" with grade 92, "Charlie" with grade 78. Print the grade of "Bob".</p><p><strong>Expected Output:</strong><br>Bob\'s grade: 92</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Bob\'s grade: 92',
          isHidden: false
        }
      ],
      starterCode: 'import java.util.HashMap;\n\npublic class HashMapDemo {\n    public static void main(String[] args) {\n        // Create HashMap and store student grades\n        \n    }\n}',
      points: 7
    },

    // Code 6: Abstract Class Implementation
    {
      type: 'code',
      title: 'Abstract Class and Methods',
      content: '<p>Create an abstract class <code>Shape</code> with an abstract method <code>calculateArea()</code>. Create a concrete class <code>Square</code> that extends Shape and implements calculateArea(). In main, create a Square with side 5 and print its area.</p><p><strong>Expected Output:</strong><br>Area: 25</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Area: 25',
          isHidden: false
        }
      ],
      starterCode: 'abstract class Shape {\n    // Abstract method calculateArea\n}\n\nclass Square extends Shape {\n    private int side;\n    \n    public Square(int side) {\n        this.side = side;\n    }\n    \n    // Implement calculateArea method\n}\n\npublic class AbstractDemo {\n    public static void main(String[] args) {\n        // Create Square and print area\n        \n    }\n}',
      points: 9
    },

    // Code 7: Generic Method
    {
      type: 'code',
      title: 'Generic Method Implementation',
      content: '<p>Create a generic method <code>printArray</code> that can print arrays of any type. Test it with an Integer array [1, 2, 3] and a String array ["Hello", "World"].</p><p><strong>Expected Output:</strong><br>1 2 3<br>Hello World</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: '1 2 3\nHello World',
          isHidden: false
        }
      ],
      starterCode: 'public class GenericDemo {\n    // Generic method to print array\n    public static <T> void printArray(T[] array) {\n        // Implementation here\n    }\n    \n    public static void main(String[] args) {\n        Integer[] intArray = {1, 2, 3};\n        String[] strArray = {"Hello", "World"};\n        \n        // Call printArray for both arrays\n    }\n}',
      points: 8
    },

    // Code 8: Lambda Expression and Stream
    {
      type: 'code',
      title: 'Lambda and Stream Operations',
      content: '<p>Create a list of integers [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]. Use Stream API to filter even numbers, multiply each by 2, and print them.</p><p><strong>Expected Output:</strong><br>4 8 12 16 20</p>',
      language: 'java',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: '4 8 12 16 20',
          isHidden: false
        }
      ],
      starterCode: 'import java.util.Arrays;\nimport java.util.List;\n\npublic class StreamDemo {\n    public static void main(String[] args) {\n        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);\n        \n        // Use Stream API to filter, map, and print\n        \n    }\n}',
      points: 10
    }
  ]
};

// Seeder function
async function seedJavaLevel2Quiz() {
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
    const existingQuiz = await Quiz.findOne({ title: javaLevel2Quiz.title });
    
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
      ...javaLevel2Quiz,
      quizCode,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ Java Programming Level 2 Quiz (75/25 Split) created successfully!');
    console.log('\n' + '='.repeat(80));
    console.log('JAVA PROGRAMMING INTERMEDIATE ASSESSMENT - LEVEL 2');
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
    console.log(`   • Points per MCQ: 2-4 points`);
    console.log(`   • Total MCQ points: ${totalMCQPoints}`);
    console.log(`💻 Coding Questions: ${codeCount} (${Math.round(codeCount/quiz.questions.length*100)}%)`);
    console.log(`   • Points per Code: 7-10 points`);
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
    
    console.log('\n📑 ADVANCED TOPICS COVERED:');
    console.log('-'.repeat(80));
    console.log('📌 MULTIPLE CHOICE AREAS:');
    console.log('   🔸 Inheritance & Polymorphism (6 questions)');
    console.log('     • Method overriding and @Override annotation');
    console.log('     • Super keyword and constructor inheritance');
    console.log('     • Abstract classes and final keyword');
    console.log('     • Runtime vs compile-time polymorphism');
    console.log('   🔸 Interfaces & Abstract Classes (4 questions)');
    console.log('     • Interface implementation and multiple inheritance');
    console.log('     • Default and static methods in interfaces');
    console.log('     • Functional interfaces and lambda expressions');
    console.log('   🔸 Collections Framework (6 questions)');
    console.log('     • ArrayList vs LinkedList performance');
    console.log('     • HashMap, TreeMap, and Set implementations');
    console.log('     • Iterator patterns and generics');
    console.log('   🔸 Exception Handling (4 questions)');
    console.log('     • Checked vs unchecked exceptions');
    console.log('     • Try-with-resources and finally blocks');
    console.log('     • Custom exception creation');
    console.log('   🔸 Advanced Concepts (4 questions)');
    console.log('     • Lambda expressions and Stream API');
    console.log('     • Enum features and reflection');
    
    console.log('\n💻 CODING CHALLENGE AREAS:');
    console.log('   🔸 Object-Oriented Design (3 questions)');
    console.log('     • Inheritance and method overriding');
    console.log('     • Interface implementation');
    console.log('     • Abstract class usage');
    console.log('   🔸 Collections & Data Structures (2 questions)');
    console.log('     • ArrayList operations and HashMap usage');
    console.log('   🔸 Exception Handling (1 question)');
    console.log('     • Try-catch implementation');
    console.log('   🔸 Advanced Features (2 questions)');
    console.log('     • Generic methods and Stream API');
    
    console.log('\n🎓 LEARNING OBJECTIVES:');
    console.log('-'.repeat(80));
    console.log('📊 This intermediate assessment evaluates:');
    console.log('   ✓ Advanced object-oriented programming concepts');
    console.log('   ✓ Inheritance hierarchies and polymorphism');
    console.log('   ✓ Interface design and implementation');
    console.log('   ✓ Collections framework proficiency');
    console.log('   ✓ Exception handling best practices');
    console.log('   ✓ Generic programming techniques');
    console.log('   ✓ Lambda expressions and functional programming');
    console.log('   ✓ Stream API operations');
    console.log('   ✓ Design pattern understanding');
    console.log('   ✓ Code organization and architecture');
    
    console.log('\n🎯 RECOMMENDED USAGE:');
    console.log('-'.repeat(80));
    console.log('📝 Perfect for:');
    console.log('   • Intermediate Java programming courses');
    console.log('   • Object-oriented design assessments');
    console.log('   • Java certification preparation (OCA/OCP)');
    console.log('   • Software engineering coursework');
    console.log('   • Junior developer evaluations');
    console.log('   • Programming bootcamp advanced modules');
    console.log('   • University computer science assessments');
    
    console.log('\n📋 PREREQUISITES:');
    console.log('-'.repeat(80));
    console.log('🔰 Students should have mastery of:');
    console.log('   • Java syntax and basic programming constructs');
    console.log('   • Classes, objects, and methods');
    console.log('   • Arrays and basic data structures');
    console.log('   • Control flow statements');
    console.log('   • Basic exception handling concepts');
    
    console.log('\n⚙️  TECHNICAL FEATURES:');
    console.log('-'.repeat(80));
    console.log('🔧 Advanced assessment features:');
    console.log('   ✓ Question pool randomization for unique tests');
    console.log('   ✓ Progressive difficulty scoring (3-4 pts MCQ, 7-10 pts Code)');
    console.log('   ✓ Complex coding challenges with multiple test cases');
    console.log('   ✓ Real-world programming scenarios');
    console.log('   ✓ Advanced Java feature implementation');
    console.log('   ✓ Design pattern recognition');
    console.log('   ✓ Limited attempts for serious assessment');
    
    console.log('\n📊 GRADING SCALE SUGGESTION:');
    console.log('-'.repeat(80));
    if (quiz.questionPoolConfig.enabled) {
      const avgMCQPoints = totalMCQPoints / mcqCount;
      const avgCodePoints = totalCodePoints / codeCount;
      const avgStudentPoints = Math.round((quiz.questionPoolConfig.multipleChoiceCount * avgMCQPoints) + (quiz.questionPoolConfig.codeCount * avgCodePoints));
      console.log(`Average Points per Student: ~${avgStudentPoints}`);
      console.log(`A: ${Math.round(avgStudentPoints * 0.9)}+ points (90%+) - Advanced proficiency`);
      console.log(`B: ${Math.round(avgStudentPoints * 0.8)}-${Math.round(avgStudentPoints * 0.89)} points (80-89%) - Good understanding`);
      console.log(`C: ${Math.round(avgStudentPoints * 0.7)}-${Math.round(avgStudentPoints * 0.79)} points (70-79%) - Satisfactory knowledge`);
      console.log(`D: ${Math.round(avgStudentPoints * 0.6)}-${Math.round(avgStudentPoints * 0.69)} points (60-69%) - Needs improvement`);
      console.log(`F: Below ${Math.round(avgStudentPoints * 0.6)} points (Below 60%) - Insufficient knowledge`);
    } else {
      console.log(`Total Points: ${totalPoints}`);
      console.log(`A: ${Math.round(totalPoints * 0.9)}+ points (90%+) - Advanced proficiency`);
      console.log(`B: ${Math.round(totalPoints * 0.8)}-${Math.round(totalPoints * 0.89)} points (80-89%) - Good understanding`);
      console.log(`C: ${Math.round(totalPoints * 0.7)}-${Math.round(totalPoints * 0.79)} points (70-79%) - Satisfactory knowledge`);
      console.log(`D: ${Math.round(totalPoints * 0.6)}-${Math.round(totalPoints * 0.69)} points (60-69%) - Needs improvement`);
      console.log(`F: Below ${Math.round(totalPoints * 0.6)} points (Below 60%) - Insufficient knowledge`);
    }
    
    console.log('\n🚀 ASSESSMENT WORKFLOW:');
    console.log('-'.repeat(80));
    console.log('1. Share the quiz code with intermediate students: ' + quiz.quizCode);
    console.log('2. Monitor coding submissions for design quality');
    console.log('3. Review object-oriented implementations');
    console.log('4. Evaluate exception handling practices');
    console.log('5. Assess collection framework usage');
    console.log('6. Provide detailed feedback on advanced concepts');
    console.log('7. Export results for grade book integration');
    
    console.log('\n💡 INSTRUCTOR EVALUATION GUIDE:');
    console.log('-'.repeat(80));
    console.log('🔍 Key areas to evaluate in coding submissions:');
    console.log('   • Proper inheritance hierarchy design');
    console.log('   • Correct interface implementation');
    console.log('   • Appropriate exception handling strategies');
    console.log('   • Efficient collection usage');
    console.log('   • Clean code practices and organization');
    console.log('   • Understanding of polymorphism concepts');
    console.log('   • Generic programming implementation');
    console.log('   • Lambda expression usage');
    
    console.log('\n📈 PERFORMANCE INDICATORS:');
    console.log('-'.repeat(80));
    console.log('🎯 Students excelling will demonstrate:');
    console.log('   ✓ Mastery of inheritance and polymorphism');
    console.log('   ✓ Effective interface design skills');
    console.log('   ✓ Proper exception handling implementation');
    console.log('   ✓ Advanced collections framework usage');
    console.log('   ✓ Understanding of generic programming');
    console.log('   ✓ Functional programming concepts');
    
    console.log('\n🔄 COMMON AREAS FOR IMPROVEMENT:');
    console.log('-'.repeat(80));
    console.log('⚠️  Watch for these common mistakes:');
    console.log('   • Confusion between method overloading and overriding');
    console.log('   • Improper exception handling (catching too broadly)');
    console.log('   • Inefficient collection choices for specific use cases');
    console.log('   • Misunderstanding of interface vs abstract class usage');
    console.log('   • Poor generic type parameter usage');
    console.log('   • Incorrect lambda expression syntax');
    
    console.log('\n🎖️  CERTIFICATION ALIGNMENT:');
    console.log('-'.repeat(80));
    console.log('📜 This assessment aligns with:');
    console.log('   • Oracle Certified Associate (OCA) Java Programmer');
    console.log('   • Oracle Certified Professional (OCP) Java Programmer');
    console.log('   • University-level intermediate Java coursework');
    console.log('   • Industry junior developer competency standards');
    
    console.log('\n📚 FOLLOW-UP LEARNING PATHS:');
    console.log('-'.repeat(80));
    console.log('🎓 Based on performance, recommend:');
    console.log('   📖 High performers: Advanced topics like concurrency, design patterns');
    console.log('   📖 Average performers: Practice with real-world projects');
    console.log('   📖 Struggling students: Review fundamentals, additional practice');
    
    console.log('\n🛡️  ACADEMIC INTEGRITY FEATURES:');
    console.log('-'.repeat(80));
    console.log('🔒 Built-in anti-cheating measures:');
    console.log('   ✓ Randomized question pools (18/24 MCQ, 6/8 Code)');
    console.log('   ✓ Question and option shuffling');
    console.log('   ✓ Multiple test cases with hidden validations');
    console.log('   ✓ Complex coding scenarios requiring understanding');
    console.log('   ✓ Limited attempts (2 maximum)');
    console.log('   ✓ Extended time limit for thoughtful responses');
    
    console.log('\n🔧 CUSTOMIZATION OPTIONS:');
    console.log('-'.repeat(80));
    console.log('⚙️  Instructors can modify:');
    console.log('   • Question pool sizes for different class sizes');
    console.log('   • Time limits based on student needs');
    console.log('   • Attempt limits for makeup exams');
    console.log('   • Point values for institutional grading scales');
    console.log('   • Shuffle settings for security preferences');
    
    console.log('\n📊 ANALYTICS AND REPORTING:');
    console.log('-'.repeat(80));
    console.log('📈 Available metrics:');
    console.log('   • Individual student performance breakdown');
    console.log('   • Class-wide concept mastery analysis');
    console.log('   • Question difficulty and discrimination indices');
    console.log('   • Time-to-completion statistics');
    console.log('   • Common error pattern identification');
    
    console.log('\n' + '='.repeat(80));
    console.log(`🎉 SUCCESS! Java Level 2 Assessment is ready for deployment!`);
    console.log('='.repeat(80));
    console.log('🚀 This intermediate assessment will effectively evaluate students\' mastery');
    console.log('   of advanced Java concepts and prepare them for senior-level programming.');
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
console.log('☕ === Java Programming Level 2 (Intermediate) Quiz Seeder ===\n');
console.log('🎯 Creating advanced assessment for intermediate Java developers...\n');
seedJavaLevel2Quiz();