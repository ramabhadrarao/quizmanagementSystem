import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'instructor', 'admin').default('student'),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid('student', 'instructor', 'admin'),
  isActive: Joi.boolean(),
  department: Joi.string().allow('', null),
  studentId: Joi.string().allow('', null),
});

const bulkUsersSchema = Joi.object({
  users: Joi.array().items(
    Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6),
      role: Joi.string().valid('student', 'instructor', 'admin'),
      department: Joi.string().allow('', null),
      studentId: Joi.string().allow('', null),
      isActive: Joi.boolean(),
    })
  ).min(1).max(100).required(),
});

const questionSchema = Joi.object({
  type: Joi.string().valid('multiple-choice', 'code').required(),
  title: Joi.string().min(1).required(),
  content: Joi.string().min(1).required(),
  options: Joi.when('type', {
    is: 'multiple-choice',
    then: Joi.array().items(Joi.string()).min(2).max(6),
    otherwise: Joi.optional(),
  }),
  correctAnswer: Joi.when('type', {
    is: 'multiple-choice',
    then: Joi.number().integer().min(0),
    otherwise: Joi.optional(),
  }),
  language: Joi.when('type', {
    is: 'code',
    then: Joi.string().valid('javascript', 'python', 'cpp', 'c', 'java'),
    otherwise: Joi.optional(),
  }),
  testCases: Joi.when('type', {
    is: 'code',
    then: Joi.array().items(
      Joi.object({
        input: Joi.string().allow('').required(),
        expectedOutput: Joi.string().required(),
        isHidden: Joi.boolean().default(false),
      })
    ).min(1),
    otherwise: Joi.optional(),
  }),
  points: Joi.number().integer().min(1).max(100).default(1),
});

const quizSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(1000).required(),
  questions: Joi.array().items(questionSchema).min(1).required(),
  timeLimit: Joi.number().integer().min(1).max(300).default(60),
  isPublished: Joi.boolean().default(false),
  allowedAttempts: Joi.number().integer().min(1).default(1),
  showResults: Joi.boolean().default(true),
  randomizeQuestions: Joi.boolean().default(false),
  startDate: Joi.date().allow(null),
  endDate: Joi.date().allow(null),
  // Question pool configuration
  questionPoolConfig: Joi.object({
    enabled: Joi.boolean().default(false),
    multipleChoiceCount: Joi.number().integer().min(0).default(0),
    codeCount: Joi.number().integer().min(0).default(0),
  }).default({
    enabled: false,
    multipleChoiceCount: 0,
    codeCount: 0,
  }),
  // Shuffle configuration
  shuffleConfig: Joi.object({
    shuffleQuestions: Joi.boolean().default(false),
    shuffleOptions: Joi.boolean().default(false),
  }).default({
    shuffleQuestions: false,
    shuffleOptions: false,
  }),
});

export const validateAuth = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

export const validateUserUpdate = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

export const validateBulkUsers = (req, res, next) => {
  const { error } = bulkUsersSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};

export const validateQuiz = (req, res, next) => {
  const { error } = quizSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
  }
  next();
};