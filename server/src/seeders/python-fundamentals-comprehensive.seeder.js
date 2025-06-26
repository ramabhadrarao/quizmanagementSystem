// server/src/seeders/python-fundamentals-comprehensive.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Python Fundamentals Comprehensive Assessment - 75% MCQ (75 questions) / 25% Code (25 questions)
const pythonFundamentalsQuiz = {
  title: 'Python Fundamentals Comprehensive Assessment',
  description: 'Complete Python fundamentals evaluation with 75 multiple choice questions (2 points each) and 25 coding challenges (6 points each). Total: 300 points. Perfect for thorough assessment of Python programming knowledge.',
  timeLimit: 150, // 150 minutes for 100 questions
  isPublished: true,
  allowedAttempts: 2,
  showResults: true,
  randomizeQuestions: false,
  startDate: null,
  endDate: null,
  
  // Question pool configuration
  questionPoolConfig: {
    enabled: true,
    multipleChoiceCount: 50, // Select 50 out of 75 MCQs
    codeCount: 15, // Select 15 out of 25 code questions
  },
  
  // Shuffle configuration for anti-cheating
  shuffleConfig: {
    shuffleQuestions: true,
    shuffleOptions: true,
  },
  
  questions: [
    // ========== MULTIPLE CHOICE QUESTIONS (75 questions - 2 points each) ==========
    
    // Python Basics (15 questions)
    {
      type: 'multiple-choice',
      title: 'Python File Extension',
      content: '<p>What is the correct file extension for Python files?</p>',
      options: ['.py', '.python', '.pt', '.pyt'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Creator',
      content: '<p>Who created the Python programming language?</p>',
      options: ['Dennis Ritchie', 'Guido van Rossum', 'James Gosling', 'Bjarne Stroustrup'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Type',
      content: '<p>Python is which type of programming language?</p>',
      options: ['Compiled', 'Interpreted', 'Both compiled and interpreted', 'Assembly language'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Print Statement',
      content: '<p>Which of the following is the correct syntax to output "Hello World" in Python?</p>',
      options: ['echo "Hello World"', 'print("Hello World")', 'printf("Hello World")', 'cout << "Hello World"'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Keywords Case',
      content: '<p>Are Python keywords case-sensitive?</p>',
      options: ['Yes', 'No', 'Only some keywords', 'Depends on Python version'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Indentation',
      content: '<p>What is used to define code blocks in Python?</p>',
      options: ['Curly braces {}', 'Square brackets []', 'Indentation', 'Parentheses ()'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Comment Symbol',
      content: '<p>Which symbol is used for single-line comments in Python?</p>',
      options: ['//', '#', '/*', '--'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Statement Terminator',
      content: '<p>How do Python statements typically end?</p>',
      options: ['With a semicolon ;', 'With a period .', 'With a newline', 'With a comma ,'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Interactive Mode',
      content: '<p>What is the Python interactive interpreter prompt?</p>',
      options: ['>>>', '>', '$', '#'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Name Origin',
      content: '<p>Python programming language is named after:</p>',
      options: ['The snake Python', 'Monty Python\'s Flying Circus', 'Greek mythology', 'A mathematician'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Platform',
      content: '<p>Python is:</p>',
      options: ['Platform dependent', 'Platform independent', 'Only for Windows', 'Only for Linux'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Features',
      content: '<p>Which of the following is NOT a feature of Python?</p>',
      options: ['Easy to learn', 'High-level language', 'Compiled language only', 'Object-oriented'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Paradigm',
      content: '<p>Python supports which programming paradigms?</p>',
      options: ['Only procedural', 'Only object-oriented', 'Only functional', 'Multiple paradigms'],
      correctAnswer: 3,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python Memory Management',
      content: '<p>Python has:</p>',
      options: ['Manual memory management', 'Automatic memory management', 'No memory management', 'Static memory allocation'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Python License',
      content: '<p>Python is:</p>',
      options: ['Commercial software', 'Open source', 'Proprietary', 'Shareware'],
      correctAnswer: 1,
      points: 2
    },

    // Variables and Data Types (15 questions)
    {
      type: 'multiple-choice',
      title: 'Variable Declaration',
      content: '<p>How do you declare a variable in Python?</p>',
      options: ['var x = 5', 'int x = 5', 'x = 5', 'declare x = 5'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Variable Naming',
      content: '<p>Which is a valid variable name in Python?</p>',
      options: ['2var', 'var-2', 'var_2', 'var.2'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Data Type Check',
      content: '<p>Which function is used to check the data type of a variable?</p>',
      options: ['type()', 'dtype()', 'typeof()', 'datatype()'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Integer Type',
      content: '<p>What is the data type of the variable x = 10?</p>',
      options: ['str', 'int', 'float', 'bool'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Float Type',
      content: '<p>What is the data type of the variable x = 10.5?</p>',
      options: ['int', 'float', 'str', 'double'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Type',
      content: '<p>What is the data type of the variable x = "Hello"?</p>',
      options: ['char', 'string', 'str', 'text'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Boolean Type',
      content: '<p>What are the two boolean values in Python?</p>',
      options: ['true, false', 'True, False', '1, 0', 'yes, no'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Type Conversion',
      content: '<p>Which function converts a string to an integer?</p>',
      options: ['str()', 'int()', 'float()', 'bool()'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Global Variable',
      content: '<p>Which keyword is used to declare a global variable inside a function?</p>',
      options: ['global', 'nonlocal', 'extern', 'static'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Variable Assignment',
      content: '<p>What happens when you do: x = y = z = 10?</p>',
      options: ['Error', 'Only z gets 10', 'All three get 10', 'Only x gets 10'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Dynamic Typing',
      content: '<p>Python variables are:</p>',
      options: ['Statically typed', 'Dynamically typed', 'Weakly typed', 'Strongly statically typed'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'None Type',
      content: '<p>What does None represent in Python?</p>',
      options: ['Zero', 'Empty string', 'Null/absence of value', 'False'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Variable Scope',
      content: '<p>A variable defined inside a function has:</p>',
      options: ['Global scope', 'Local scope', 'Module scope', 'Class scope'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Constant Convention',
      content: '<p>How are constants typically named in Python?</p>',
      options: ['lowercase', 'camelCase', 'UPPERCASE', 'PascalCase'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Multiple Assignment',
      content: '<p>What is the result of: a, b = 10, 20?</p>',
      options: ['Error', 'a=10, b=20', 'a=20, b=10', 'a=30, b=0'],
      correctAnswer: 1,
      points: 2
    },

    // Operators (10 questions)
    {
      type: 'multiple-choice',
      title: 'Arithmetic Operators',
      content: '<p>What is the result of 10 // 3 in Python?</p>',
      options: ['3.33', '3', '4', '3.0'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Modulus Operator',
      content: '<p>What is the result of 17 % 5?</p>',
      options: ['2', '3', '3.4', '12'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Exponentiation',
      content: '<p>Which operator is used for exponentiation in Python?</p>',
      options: ['^', '**', 'pow', 'exp'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Comparison Operators',
      content: '<p>What is the result of 5 == 5.0?</p>',
      options: ['True', 'False', 'Error', 'None'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Logical Operators',
      content: '<p>What is the result of True and False?</p>',
      options: ['True', 'False', '1', '0'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Identity Operators',
      content: '<p>Which operator checks if two variables point to the same object?</p>',
      options: ['==', '!=', 'is', 'in'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Membership Operators',
      content: '<p>Which operator checks if a value exists in a sequence?</p>',
      options: ['is', 'in', 'has', 'contains'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Bitwise Operators',
      content: '<p>What is the result of 5 & 3 (bitwise AND)?</p>',
      options: ['1', '3', '5', '8'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Assignment Operators',
      content: '<p>What does x += 5 mean?</p>',
      options: ['x = 5', 'x = x + 5', 'x = x * 5', 'x = 5 + x'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Operator Precedence',
      content: '<p>What is the result of 2 + 3 * 4?</p>',
      options: ['20', '14', '24', '9'],
      correctAnswer: 1,
      points: 2
    },

    // Strings (10 questions)
    {
      type: 'multiple-choice',
      title: 'String Creation',
      content: '<p>Which of the following creates a string in Python?</p>',
      options: ['"Hello"', "'Hello'", '"""Hello"""', 'All of the above'],
      correctAnswer: 3,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Indexing',
      content: '<p>What is the index of the first character in a Python string?</p>',
      options: ['1', '0', '-1', 'None'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Length',
      content: '<p>Which function returns the length of a string?</p>',
      options: ['length()', 'len()', 'size()', 'count()'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Slicing',
      content: '<p>What does "Hello"[1:3] return?</p>',
      options: ['"He"', '"el"', '"ell"', '"ello"'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Methods',
      content: '<p>Which method converts a string to uppercase?</p>',
      options: ['uppercase()', 'upper()', 'toUpper()', 'capitalize()'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Concatenation',
      content: '<p>What is the result of "Hello" + " " + "World"?</p>',
      options: ['"HelloWorld"', '"Hello World"', 'Error', '"Hello + World"'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Formatting',
      content: '<p>Which is a valid way to format strings in Python?</p>',
      options: ['f"Hello {name}"', '"Hello {}".format(name)', '"Hello %s" % name', 'All of the above'],
      correctAnswer: 3,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Immutability',
      content: '<p>Strings in Python are:</p>',
      options: ['Mutable', 'Immutable', 'Sometimes mutable', 'Depends on content'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Split',
      content: '<p>What does "a,b,c".split(",") return?</p>',
      options: ['"abc"', '["a", "b", "c"]', '"a b c"', 'Error'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'String Replace',
      content: '<p>What does "Hello World".replace("World", "Python") return?</p>',
      options: ['"Hello Python"', '"Python World"', '"Hello"', 'Error'],
      correctAnswer: 0,
      points: 2
    },

    // Lists (10 questions)
    {
      type: 'multiple-choice',
      title: 'List Creation',
      content: '<p>How do you create an empty list in Python?</p>',
      options: ['list = ()', 'list = {}', 'list = []', 'list = ""'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Indexing',
      content: '<p>What does [1, 2, 3, 4][2] return?</p>',
      options: ['2', '3', '4', 'Error'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Append',
      content: '<p>Which method adds an element to the end of a list?</p>',
      options: ['add()', 'append()', 'insert()', 'push()'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Remove',
      content: '<p>Which method removes and returns the last element of a list?</p>',
      options: ['remove()', 'delete()', 'pop()', 'clear()'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Length',
      content: '<p>How do you find the length of a list?</p>',
      options: ['list.length()', 'len(list)', 'list.size()', 'list.count()'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Slicing',
      content: '<p>What does [1, 2, 3, 4, 5][1:4] return?</p>',
      options: ['[1, 2, 3]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 2, 3, 4]'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Concatenation',
      content: '<p>What is the result of [1, 2] + [3, 4]?</p>',
      options: ['[4, 6]', '[1, 2, 3, 4]', 'Error', '[1, 2] [3, 4]'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Mutability',
      content: '<p>Lists in Python are:</p>',
      options: ['Immutable', 'Mutable', 'Sometimes mutable', 'Read-only'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Sorting',
      content: '<p>Which method sorts a list in place?</p>',
      options: ['sort()', 'sorted()', 'order()', 'arrange()'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'List Comprehension',
      content: '<p>What does [x*2 for x in [1, 2, 3]] return?</p>',
      options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', 'Error'],
      correctAnswer: 1,
      points: 2
    },

    // Dictionaries and Tuples (10 questions)
    {
      type: 'multiple-choice',
      title: 'Dictionary Creation',
      content: '<p>How do you create an empty dictionary?</p>',
      options: ['dict = []', 'dict = ()', 'dict = {}', 'dict = ""'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Dictionary Access',
      content: '<p>How do you access the value for key "name" in a dictionary?</p>',
      options: ['dict.name', 'dict["name"]', 'dict(name)', 'dict->name'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Dictionary Keys',
      content: '<p>Which method returns all keys of a dictionary?</p>',
      options: ['keys()', 'getKeys()', 'allKeys()', 'keyList()'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Tuple Creation',
      content: '<p>How do you create a tuple with one element?</p>',
      options: ['(5)', '(5,)', '[5]', '{5}'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Tuple Mutability',
      content: '<p>Tuples are:</p>',
      options: ['Mutable', 'Immutable', 'Sometimes mutable', 'Depends on content'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Dictionary vs List',
      content: '<p>What is the main difference between a list and a dictionary?</p>',
      options: ['Lists are ordered, dictionaries are not', 'Lists use indices, dictionaries use keys', 'Lists are faster', 'No difference'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Set Creation',
      content: '<p>How do you create an empty set?</p>',
      options: ['set = {}', 'set = []', 'set = set()', 'set = ()'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Set Properties',
      content: '<p>Sets in Python:</p>',
      options: ['Allow duplicates', 'Do not allow duplicates', 'Are ordered', 'Use indices'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Dictionary Update',
      content: '<p>How do you add a new key-value pair to a dictionary?</p>',
      options: ['dict.add(key, value)', 'dict[key] = value', 'dict.insert(key, value)', 'dict.append(key, value)'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Tuple Unpacking',
      content: '<p>What does a, b = (1, 2) do?</p>',
      options: ['Error', 'a=1, b=2', 'a=2, b=1', 'a=(1,2), b=None'],
      correctAnswer: 1,
      points: 2
    },

    // Control Flow (5 questions)
    {
      type: 'multiple-choice',
      title: 'If Statement Syntax',
      content: '<p>What is the correct syntax for an if statement?</p>',
      options: ['if x > 5 then:', 'if (x > 5):', 'if x > 5:', 'if x > 5 {'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Elif Statement',
      content: '<p>What keyword is used for "else if" in Python?</p>',
      options: ['elseif', 'else if', 'elif', 'elsif'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Ternary Operator',
      content: '<p>What is the Python equivalent of the ternary operator?</p>',
      options: ['x if condition else y', 'condition ? x : y', 'if condition then x else y', 'condition and x or y'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Pass Statement',
      content: '<p>What does the pass statement do?</p>',
      options: ['Skips to next iteration', 'Exits the loop', 'Does nothing', 'Throws an exception'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Boolean Evaluation',
      content: '<p>Which of the following evaluates to False?</p>',
      options: ['[]', '""', '0', 'All of the above'],
      correctAnswer: 3,
      points: 2
    },

    // Loops (10 questions)
    {
      type: 'multiple-choice',
      title: 'For Loop Syntax',
      content: '<p>What is the correct syntax for a for loop in Python?</p>',
      options: ['for i in range(10):', 'for (i=0; i<10; i++):', 'for i = 1 to 10:', 'for i in 1..10:'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Range Function',
      content: '<p>What does range(5) generate?</p>',
      options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[0, 1, 2, 3, 4, 5]', '[1, 2, 3, 4]'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'While Loop',
      content: '<p>While loops continue until:</p>',
      options: ['The condition is True', 'The condition is False', 'Break is encountered', 'Both B and C'],
      correctAnswer: 3,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Break Statement',
      content: '<p>What does the break statement do in a loop?</p>',
      options: ['Skips current iteration', 'Exits the loop', 'Pauses the loop', 'Restarts the loop'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Continue Statement',
      content: '<p>What does the continue statement do in a loop?</p>',
      options: ['Exits the loop', 'Skips to next iteration', 'Pauses the loop', 'Repeats current iteration'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Nested Loops',
      content: '<p>Can you have a loop inside another loop in Python?</p>',
      options: ['Yes', 'No', 'Only for loops', 'Only while loops'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Loop Else',
      content: '<p>When does the else clause of a loop execute?</p>',
      options: ['When loop breaks', 'When loop completes normally', 'Always', 'Never'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Enumerate Function',
      content: '<p>What does enumerate() do?</p>',
      options: ['Counts elements', 'Returns index and value pairs', 'Sorts elements', 'Filters elements'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Zip Function',
      content: '<p>What does zip() function do?</p>',
      options: ['Compresses files', 'Combines multiple iterables', 'Sorts lists', 'Reverses lists'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Infinite Loop',
      content: '<p>How do you create an infinite loop in Python?</p>',
      options: ['while True:', 'for ever:', 'loop:', 'while 1 == 1:'],
      correctAnswer: 0,
      points: 2
    },

    // Functions (10 questions)
    {
      type: 'multiple-choice',
      title: 'Function Definition',
      content: '<p>What keyword is used to define a function in Python?</p>',
      options: ['function', 'def', 'func', 'define'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Function Return',
      content: '<p>What keyword is used to return a value from a function?</p>',
      options: ['return', 'give', 'send', 'output'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Function Parameters',
      content: '<p>What are the values passed to a function called?</p>',
      options: ['Variables', 'Arguments', 'Parameters', 'Inputs'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Default Parameters',
      content: '<p>How do you set a default value for a function parameter?</p>',
      options: ['def func(x=5):', 'def func(x default 5):', 'def func(x := 5):', 'def func(x -> 5):'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Variable Arguments',
      content: '<p>What does *args allow in a function?</p>',
      options: ['Fixed arguments', 'Variable number of arguments', 'Keyword arguments', 'No arguments'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Keyword Arguments',
      content: '<p>What does **kwargs allow in a function?</p>',
      options: ['Fixed arguments', 'Variable arguments', 'Variable keyword arguments', 'No arguments'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Function Scope',
      content: '<p>Variables defined inside a function have:</p>',
      options: ['Global scope', 'Local scope', 'Module scope', 'Class scope'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Lambda Functions',
      content: '<p>Lambda functions in Python are:</p>',
      options: ['Named functions', 'Anonymous functions', 'Class methods', 'Built-in functions'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Function Documentation',
      content: '<p>What are docstrings used for?</p>',
      options: ['Comments', 'Function documentation', 'Variable names', 'Import statements'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Recursive Functions',
      content: '<p>A recursive function is a function that:</p>',
      options: ['Calls other functions', 'Calls itself', 'Has no parameters', 'Returns multiple values'],
      correctAnswer: 1,
      points: 2
    },

    // File Handling (5 questions)
    {
      type: 'multiple-choice',
      title: 'File Opening',
      content: '<p>Which function is used to open a file in Python?</p>',
      options: ['open()', 'file()', 'read()', 'load()'],
      correctAnswer: 0,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'File Modes',
      content: '<p>What does "r" mode mean when opening a file?</p>',
      options: ['Write mode', 'Read mode', 'Append mode', 'Binary mode'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'File Writing',
      content: '<p>What does "w" mode do when opening a file?</p>',
      options: ['Reads file', 'Writes to file (overwrites)', 'Appends to file', 'Creates backup'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'File Context Manager',
      content: '<p>What is the advantage of using "with" statement for file operations?</p>',
      options: ['Faster execution', 'Automatic file closing', 'Better syntax', 'Error prevention'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'File Reading',
      content: '<p>Which method reads the entire file content as a string?</p>',
      options: ['read()', 'readline()', 'readlines()', 'readall()'],
      correctAnswer: 0,
      points: 2
    },

    // Error Handling (5 questions)
    {
      type: 'multiple-choice',
      title: 'Exception Handling',
      content: '<p>Which keyword is used to handle exceptions in Python?</p>',
      options: ['catch', 'except', 'handle', 'error'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Try-Except',
      content: '<p>What block always executes in exception handling?</p>',
      options: ['try', 'except', 'finally', 'else'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Raising Exceptions',
      content: '<p>Which keyword is used to manually raise an exception?</p>',
      options: ['throw', 'raise', 'error', 'exception'],
      correctAnswer: 1,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Common Exceptions',
      content: '<p>What exception is raised when dividing by zero?</p>',
      options: ['ValueError', 'TypeError', 'ZeroDivisionError', 'ArithmeticError'],
      correctAnswer: 2,
      points: 2
    },
    {
      type: 'multiple-choice',
      title: 'Exception Inheritance',
      content: '<p>All built-in exceptions inherit from:</p>',
      options: ['Exception', 'BaseException', 'Error', 'SystemError'],
      correctAnswer: 1,
      points: 2
    },

    // ========== CODE QUESTIONS (25 questions - 6 points each) ==========
    
    // Basic Programming (10 questions)
    {
      type: 'code',
      title: 'Hello World Program',
      content: '<p>Write a Python program that prints "Hello, World!" exactly as shown.</p>',
      language: 'python',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: 'Hello, World!',
          isHidden: false
        }
      ],
      starterCode: '# Write your code here\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Variable Assignment and Arithmetic',
      content: '<p>Create two variables: <code>a = 15</code> and <code>b = 4</code>. Calculate and print their sum, difference, product, and integer division (in that order, each on a new line).</p>',
      language: 'python',
      testCases: [
        {
          input: 'no_input',
          expectedOutput: '19\n11\n60\n3',
          isHidden: false
        }
      ],
      starterCode: '# Create variables and perform calculations\n',
      points: 6
    },
    {
      type: 'code',
      title: 'User Input and Output',
      content: '<p>Write a program that asks for a user\'s name and age, then prints a personalized message: "Hello [name], you are [age] years old!"</p>',
      language: 'python',
      testCases: [
        {
          input: 'Alice\n25',
          expectedOutput: 'Hello Alice, you are 25 years old!',
          isHidden: false
        },
        {
          input: 'Bob\n30',
          expectedOutput: 'Hello Bob, you are 30 years old!',
          isHidden: true
        }
      ],
      starterCode: '# Get user input and create personalized message\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Type Conversion',
      content: '<p>Read two numbers as strings, convert them to integers, add them, and print the result.</p>',
      language: 'python',
      testCases: [
        {
          input: '10\n20',
          expectedOutput: '30',
          isHidden: false
        },
        {
          input: '100\n50',
          expectedOutput: '150',
          isHidden: true
        }
      ],
      starterCode: '# Read strings, convert to integers, and add\n',
      points: 6
    },
    {
      type: 'code',
      title: 'String Manipulation',
      content: '<p>Read a string and print it in three formats: all uppercase, all lowercase, and title case (each on a new line).</p>',
      language: 'python',
      testCases: [
        {
          input: 'python programming',
          expectedOutput: 'PYTHON PROGRAMMING\npython programming\nPython Programming',
          isHidden: false
        },
        {
          input: 'hello WORLD',
          expectedOutput: 'HELLO WORLD\nhello world\nHello World',
          isHidden: true
        }
      ],
      starterCode: '# Read string and format it\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Simple Calculator',
      content: '<p>Create a simple calculator that reads two numbers and an operator (+, -, *, /) and prints the result.</p>',
      language: 'python',
      testCases: [
        {
          input: '10\n5\n+',
          expectedOutput: '15.0',
          isHidden: false
        },
        {
          input: '20\n4\n/',
          expectedOutput: '5.0',
          isHidden: false
        },
        {
          input: '8\n3\n*',
          expectedOutput: '24.0',
          isHidden: true
        }
      ],
      starterCode: '# Simple calculator\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Boolean Logic',
      content: '<p>Read three numbers and determine if all three are positive. Print "All positive" if true, "Not all positive" if false.</p>',
      language: 'python',
      testCases: [
        {
          input: '5\n10\n15',
          expectedOutput: 'All positive',
          isHidden: false
        },
        {
          input: '-1\n5\n10',
          expectedOutput: 'Not all positive',
          isHidden: false
        },
        {
          input: '0\n5\n10',
          expectedOutput: 'Not all positive',
          isHidden: true
        }
      ],
      starterCode: '# Check if all numbers are positive\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Area Calculator',
      content: '<p>Calculate the area of a rectangle. Read length and width, then print the area.</p>',
      language: 'python',
      testCases: [
        {
          input: '10\n5',
          expectedOutput: '50',
          isHidden: false
        },
        {
          input: '7.5\n4.2',
          expectedOutput: '31.5',
          isHidden: true
        }
      ],
      starterCode: '# Calculate rectangle area\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Temperature Converter',
      content: '<p>Convert Celsius to Fahrenheit. Read temperature in Celsius and print the equivalent in Fahrenheit using the formula: F = (C * 9/5) + 32</p>',
      language: 'python',
      testCases: [
        {
          input: '0',
          expectedOutput: '32.0',
          isHidden: false
        },
        {
          input: '100',
          expectedOutput: '212.0',
          isHidden: false
        },
        {
          input: '25',
          expectedOutput: '77.0',
          isHidden: true
        }
      ],
      starterCode: '# Convert Celsius to Fahrenheit\n',
      points: 6
    },
    {
      type: 'code',
      title: 'String Length and Character Count',
      content: '<p>Read a string and print its length and the number of vowels (a, e, i, o, u) in it.</p>',
      language: 'python',
      testCases: [
        {
          input: 'hello',
          expectedOutput: '5\n2',
          isHidden: false
        },
        {
          input: 'programming',
          expectedOutput: '11\n3',
          isHidden: true
        }
      ],
      starterCode: '# Count string length and vowels\n',
      points: 6
    },

    // Conditional Statements (5 questions)
    {
      type: 'code',
      title: 'Even or Odd Checker',
      content: '<p>Read an integer and print "Even" if it\'s even, "Odd" if it\'s odd.</p>',
      language: 'python',
      testCases: [
        {
          input: '10',
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
        }
      ],
      starterCode: '# Check if number is even or odd\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Grade Calculator',
      content: '<p>Read a score (0-100) and print the grade: A (90-100), B (80-89), C (70-79), D (60-69), F (below 60).</p>',
      language: 'python',
      testCases: [
        {
          input: '95',
          expectedOutput: 'A',
          isHidden: false
        },
        {
          input: '75',
          expectedOutput: 'C',
          isHidden: false
        },
        {
          input: '45',
          expectedOutput: 'F',
          isHidden: true
        }
      ],
      starterCode: '# Calculate grade based on score\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Largest of Three Numbers',
      content: '<p>Read three numbers and print the largest one.</p>',
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
          input: '100\n100\n50',
          expectedOutput: '100',
          isHidden: true
        }
      ],
      starterCode: '# Find the largest of three numbers\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Leap Year Checker',
      content: '<p>Read a year and determine if it\'s a leap year. Print "Leap year" or "Not a leap year". A year is leap if it\'s divisible by 4, but not by 100, unless also divisible by 400.</p>',
      language: 'python',
      testCases: [
        {
          input: '2020',
          expectedOutput: 'Leap year',
          isHidden: false
        },
        {
          input: '1900',
          expectedOutput: 'Not a leap year',
          isHidden: false
        },
        {
          input: '2000',
          expectedOutput: 'Leap year',
          isHidden: true
        }
      ],
      starterCode: '# Check if year is leap year\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Age Category',
      content: '<p>Read an age and categorize it: "Child" (0-12), "Teenager" (13-19), "Adult" (20-59), "Senior" (60+).</p>',
      language: 'python',
      testCases: [
        {
          input: '10',
          expectedOutput: 'Child',
          isHidden: false
        },
        {
          input: '25',
          expectedOutput: 'Adult',
          isHidden: false
        },
        {
          input: '65',
          expectedOutput: 'Senior',
          isHidden: true
        }
      ],
      starterCode: '# Categorize age\n',
      points: 6
    },

    // Loops (5 questions)
    {
      type: 'code',
      title: 'Print Numbers 1 to N',
      content: '<p>Read a positive integer N and print all numbers from 1 to N (each on a new line).</p>',
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
          isHidden: true
        }
      ],
      starterCode: '# Print numbers from 1 to N\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Sum of First N Natural Numbers',
      content: '<p>Read a positive integer N and calculate the sum of first N natural numbers (1+2+3+...+N).</p>',
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
          isHidden: true
        }
      ],
      starterCode: '# Calculate sum of first N natural numbers\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Factorial Calculator',
      content: '<p>Read a non-negative integer and calculate its factorial. (5! = 5×4×3×2×1 = 120)</p>',
      language: 'python',
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
          input: '4',
          expectedOutput: '24',
          isHidden: true
        }
      ],
      starterCode: '# Calculate factorial\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Multiplication Table',
      content: '<p>Read a number and print its multiplication table from 1 to 10. Format: "N x 1 = N"</p>',
      language: 'python',
      testCases: [
        {
          input: '3',
          expectedOutput: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
          isHidden: false
        }
      ],
      starterCode: '# Print multiplication table\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Count Digits',
      content: '<p>Read a positive integer and count the number of digits in it.</p>',
      language: 'python',
      testCases: [
        {
          input: '12345',
          expectedOutput: '5',
          isHidden: false
        },
        {
          input: '7',
          expectedOutput: '1',
          isHidden: false
        },
        {
          input: '1000',
          expectedOutput: '4',
          isHidden: true
        }
      ],
      starterCode: '# Count digits in a number\n',
      points: 6
    },

    // Functions and Advanced (5 questions)
    {
      type: 'code',
      title: 'Simple Function',
      content: '<p>Create a function called <code>square</code> that takes a number and returns its square. Then read a number, call the function, and print the result.</p>',
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
          isHidden: true
        }
      ],
      starterCode: '# Define square function and use it\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Prime Number Checker',
      content: '<p>Write a function to check if a number is prime. Read a number and print "Prime" or "Not Prime".</p>',
      language: 'python',
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
          input: '2',
          expectedOutput: 'Prime',
          isHidden: true
        }
      ],
      starterCode: '# Check if number is prime\n',
      points: 6
    },
    {
      type: 'code',
      title: 'List Operations',
      content: '<p>Read 5 integers, store them in a list, and print: the list, its length, sum of all elements, and the maximum element (each on a new line).</p>',
      language: 'python',
      testCases: [
        {
          input: '1\n2\n3\n4\n5',
          expectedOutput: '[1, 2, 3, 4, 5]\n5\n15\n5',
          isHidden: false
        }
      ],
      starterCode: '# Work with lists\n',
      points: 6
    },
    {
      type: 'code',
      title: 'String Reversal',
      content: '<p>Read a string and print it in reverse order.</p>',
      language: 'python',
      testCases: [
        {
          input: 'hello',
          expectedOutput: 'olleh',
          isHidden: false
        },
        {
          input: 'python',
          expectedOutput: 'nohtyp',
          isHidden: true
        }
      ],
      starterCode: '# Reverse a string\n',
      points: 6
    },
    {
      type: 'code',
      title: 'Dictionary Usage',
      content: '<p>Create a dictionary with student names as keys and their scores as values. Add 3 students, then print the name of the student with the highest score.</p>',
      language: 'python',
      testCases: [
        {
          input: 'Alice\n85\nBob\n92\nCharlie\n78',
          expectedOutput: 'Bob',
          isHidden: false
        }
      ],
      starterCode: '# Work with dictionaries\n',
      points: 6
    }
  ]
};

// Seeder function
async function seedPythonFundamentalsQuiz() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-system');
    console.log('Connected to MongoDB');

    // Find an instructor or admin user
    const instructor = await User.findOne({ 
      role: { $in: ['instructor', 'admin'] },
      isActive: true 
    });

    if (!instructor) {
      console.error('No instructor or admin user found. Please run the user seeder first.');
      process.exit(1);
    }

    console.log(`Using ${instructor.name} (${instructor.role}) as quiz creator`);

    // Check if quiz already exists
    const existingQuiz = await Quiz.findOne({ title: pythonFundamentalsQuiz.title });
    
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

    // Create the quiz
    const quiz = new Quiz({
      ...pythonFundamentalsQuiz,
      quizCode,
      createdBy: instructor._id
    });

    await quiz.save();

    console.log('\n✅ Python Fundamentals Comprehensive Assessment created successfully!');
    console.log('\n' + '='.repeat(80));
    console.log('COMPREHENSIVE QUIZ DETAILS');
    console.log('='.repeat(80));
    console.log(`📚 Title: ${quiz.title}`);
    console.log(`📝 Description: ${quiz.description}`);
    console.log(`🔑 Quiz Code: ${quiz.quizCode} (Share this with students!)`);
    console.log(`❓ Total Questions: ${quiz.questions.length}`);
    console.log(`⏱️  Time Limit: ${quiz.timeLimit} minutes`);
    console.log(`👤 Created by: ${instructor.name}`);
    console.log(`📊 Status: ${quiz.isPublished ? 'Published' : 'Draft'}`);
    console.log(`🔄 Allowed Attempts: ${quiz.allowedAttempts}`);
    
    // Question breakdown
    const mcqQuestions = quiz.questions.filter(q => q.type === 'multiple-choice');
    const codeQuestions = quiz.questions.filter(q => q.type === 'code');
    const totalMCQPoints = mcqQuestions.reduce((sum, q) => sum + q.points, 0);
    const totalCodePoints = codeQuestions.reduce((sum, q) => sum + q.points, 0);
    const totalPoints = totalMCQPoints + totalCodePoints;
    
    console.log('\n📋 QUESTION BREAKDOWN:');
    console.log('-'.repeat(80));
    console.log(`📌 Multiple Choice Questions: ${mcqQuestions.length} (${Math.round(mcqQuestions.length/quiz.questions.length*100)}%)`);
    console.log(`   • Points per question: 2`);
    console.log(`   • Total MCQ points: ${totalMCQPoints}`);
    console.log(`💻 Coding Questions: ${codeQuestions.length} (${Math.round(codeQuestions.length/quiz.questions.length*100)}%)`);
    console.log(`   • Points per question: 6`);
    console.log(`   • Total Code points: ${totalCodePoints}`);
    console.log(`🎯 TOTAL POINTS: ${totalPoints}`);
    
    console.log('\n🎲 QUESTION POOL CONFIGURATION:');
    console.log('-'.repeat(80));
    console.log(`✅ Question Pool Enabled: ${quiz.questionPoolConfig.enabled ? 'Yes' : 'No'}`);
    if (quiz.questionPoolConfig.enabled) {
      console.log(`   • MCQs to select: ${quiz.questionPoolConfig.multipleChoiceCount} out of ${mcqQuestions.length}`);
      console.log(`   • Code questions to select: ${quiz.questionPoolConfig.codeCount} out of ${codeQuestions.length}`);
      console.log(`   • Students will get: ${quiz.questionPoolConfig.multipleChoiceCount + quiz.questionPoolConfig.codeCount} questions total`);
      console.log(`   • Points per student: ${(quiz.questionPoolConfig.multipleChoiceCount * 2) + (quiz.questionPoolConfig.codeCount * 6)}`);
    }
    
    console.log('\n🔀 SHUFFLE CONFIGURATION:');
    console.log('-'.repeat(80));
    console.log(`✅ Shuffle Questions: ${quiz.shuffleConfig.shuffleQuestions ? 'Yes' : 'No'}`);
    console.log(`✅ Shuffle Options: ${quiz.shuffleConfig.shuffleOptions ? 'Yes' : 'No'}`);
    
    console.log('\n📑 QUESTION CATEGORIES:');
    console.log('-'.repeat(80));
    console.log('📌 MULTIPLE CHOICE TOPICS:');
    console.log('   • Python Basics (15 questions)');
    console.log('   • Variables and Data Types (15 questions)');
    console.log('   • Operators (10 questions)');
    console.log('   • Strings (10 questions)');
    console.log('   • Lists (10 questions)');
    console.log('   • Dictionaries and Tuples (10 questions)');
    console.log('   • Control Flow (5 questions)');
    console.log('   • Loops (10 questions)');
    console.log('   • Functions (10 questions)');
    console.log('   • File Handling (5 questions)');
    console.log('   • Error Handling (5 questions)');
    
    console.log('\n💻 CODING QUESTION TOPICS:');
    console.log('   • Basic Programming (10 questions)');
    console.log('   • Conditional Statements (5 questions)');
    console.log('   • Loops (5 questions)');
    console.log('   • Functions and Advanced (5 questions)');
    
    console.log('\n🎓 ASSESSMENT INFORMATION:');
    console.log('-'.repeat(80));
    console.log('📊 This comprehensive assessment evaluates:');
    console.log('   ✓ Python syntax and basic concepts');
    console.log('   ✓ Data types and variable handling');
    console.log('   ✓ Control structures and flow');
    console.log('   ✓ Functions and scope');
    console.log('   ✓ Data structures (lists, dictionaries, tuples)');
    console.log('   ✓ String manipulation');
    console.log('   ✓ File operations');
    console.log('   ✓ Error handling');
    console.log('   ✓ Problem-solving skills');
    console.log('   ✓ Code implementation abilities');
    
    console.log('\n🎯 RECOMMENDED USAGE:');
    console.log('-'.repeat(80));
    console.log('📝 Perfect for:');
    console.log('   • Final assessments in Python fundamentals courses');
    console.log('   • Placement tests for intermediate Python courses');
    console.log('   • Certification assessments');
    console.log('   • Comprehensive skill evaluation');
    console.log('   • Interview screening for Python developers');
    
    console.log('\n⚙️  TECHNICAL FEATURES:');
    console.log('-'.repeat(80));
    console.log('🔧 Anti-cheating measures:');
    console.log('   ✓ Question pool randomization');
    console.log('   ✓ Question shuffling');
    console.log('   ✓ Option shuffling');
    console.log('   ✓ Multiple test cases for coding questions');
    console.log('   ✓ Hidden test cases');
    console.log('   ✓ Limited attempts (2 maximum)');
    
    console.log('\n📊 GRADING SCALE SUGGESTION:');
    console.log('-'.repeat(80));
    if (quiz.questionPoolConfig.enabled) {
      const studentPoints = (quiz.questionPoolConfig.multipleChoiceCount * 2) + (quiz.questionPoolConfig.codeCount * 6);
      console.log(`Total Points per Student: ${studentPoints}`);
      console.log(`A: ${Math.round(studentPoints * 0.9)}+ points (90%+)`);
      console.log(`B: ${Math.round(studentPoints * 0.8)}-${Math.round(studentPoints * 0.89)} points (80-89%)`);
      console.log(`C: ${Math.round(studentPoints * 0.7)}-${Math.round(studentPoints * 0.79)} points (70-79%)`);
      console.log(`D: ${Math.round(studentPoints * 0.6)}-${Math.round(studentPoints * 0.69)} points (60-69%)`);
      console.log(`F: Below ${Math.round(studentPoints * 0.6)} points (Below 60%)`);
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
    console.log('1. Share the quiz code with your students');
    console.log('2. Monitor quiz attempts in the instructor dashboard');
    console.log('3. Review detailed results and analytics');
    console.log('4. Export results for grade book integration');
    console.log('5. Provide feedback based on performance patterns');
    
    console.log('\n' + '='.repeat(80));
    console.log(`🎉 SUCCESS! Quiz "${quiz.title}" is ready to use!`);
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
console.log('🐍 === Python Fundamentals Comprehensive Assessment Seeder ===\n');
seedPythonFundamentalsQuiz();