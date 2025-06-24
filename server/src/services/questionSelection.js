// server/src/services/questionSelection.js - Question selection and shuffling service
import crypto from 'crypto';

/**
 * Generate a deterministic random number generator based on user ID and quiz ID
 * This ensures the same user gets the same questions for the same quiz
 */
function createSeededRandom(userId, quizId) {
  const seed = crypto
    .createHash('sha256')
    .update(`${userId}-${quizId}`)
    .digest('hex');
  
  let seedValue = parseInt(seed.substring(0, 8), 16);
  
  return function() {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
}

/**
 * Fisher-Yates shuffle with seeded random
 */
function shuffleArray(array, random) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Select questions from the pool based on configuration
 */
export function selectQuestionsForUser(quiz, userId) {
  const { questions, questionPoolConfig, shuffleConfig } = quiz;
  
  // If pooling is not enabled and no shuffling, return questions as-is
  if (!questionPoolConfig?.enabled && !shuffleConfig?.shuffleQuestions && !shuffleConfig?.shuffleOptions) {
    return {
      selectedQuestions: questions,
      assignedQuestions: questions.map((q, index) => ({
        originalQuestionId: q._id.toString(),
        displayOrder: index,
        shuffledOptionOrder: null,
      })),
    };
  }
  
  // Create seeded random generator
  const random = createSeededRandom(userId, quiz._id.toString());
  
  let selectedQuestions = [...questions];
  
  // Handle question pool selection if enabled
  if (questionPoolConfig?.enabled) {
    // Separate questions by type
    const multipleChoiceQuestions = questions.filter(q => q.type === 'multiple-choice');
    const codeQuestions = questions.filter(q => q.type === 'code');
    
    // Shuffle the pools
    const shuffledMCQ = shuffleArray(multipleChoiceQuestions, random);
    const shuffledCode = shuffleArray(codeQuestions, random);
    
    // Select the required number of questions
    const selectedMCQ = questionPoolConfig.multipleChoiceCount > 0
      ? shuffledMCQ.slice(0, Math.min(questionPoolConfig.multipleChoiceCount, shuffledMCQ.length))
      : shuffledMCQ;
      
    const selectedCode = questionPoolConfig.codeCount > 0
      ? shuffledCode.slice(0, Math.min(questionPoolConfig.codeCount, shuffledCode.length))
      : shuffledCode;
    
    // Combine selected questions
    selectedQuestions = [...selectedMCQ, ...selectedCode];
  }
  
  // Shuffle the final selection if enabled
  if (shuffleConfig?.shuffleQuestions) {
    selectedQuestions = shuffleArray(selectedQuestions, random);
  }
  
  // Create assigned questions with shuffled options for MCQs
  const assignedQuestions = selectedQuestions.map((question, index) => {
    let shuffledOptionOrder = null;
    
    if (question.type === 'multiple-choice' && shuffleConfig?.shuffleOptions && question.options) {
      // Create indices array [0, 1, 2, 3...]
      const indices = Array.from({ length: question.options.length }, (_, i) => i);
      shuffledOptionOrder = shuffleArray(indices, random);
    }
    
    return {
      originalQuestionId: question._id.toString(),
      displayOrder: index,
      shuffledOptionOrder,
    };
  });
  
  return {
    selectedQuestions,
    assignedQuestions,
  };
}

/**
 * Apply the stored shuffle order to questions for display
 */
export function applyShuffleOrder(questions, assignedQuestions) {
  // Create a map for quick lookup
  const assignmentMap = new Map(
    assignedQuestions.map(aq => [aq.originalQuestionId, aq])
  );
  
  // Sort questions by display order
  const sortedQuestions = [...questions].sort((a, b) => {
    const aOrder = assignmentMap.get(a._id.toString())?.displayOrder ?? 999;
    const bOrder = assignmentMap.get(b._id.toString())?.displayOrder ?? 999;
    return aOrder - bOrder;
  });
  
  // Apply option shuffling
  return sortedQuestions.map(question => {
    const assignment = assignmentMap.get(question._id.toString());
    
    if (question.type === 'multiple-choice' && assignment?.shuffledOptionOrder) {
      // Reorder options based on shuffled indices
      const shuffledOptions = assignment.shuffledOptionOrder.map(
        index => question.options[index]
      );
      
      // Adjust correct answer index
      const originalCorrectIndex = question.correctAnswer;
      const newCorrectIndex = assignment.shuffledOptionOrder.indexOf(originalCorrectIndex);
      
      return {
        ...question.toObject ? question.toObject() : question,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex,
        _shuffleMap: assignment.shuffledOptionOrder, // Store for answer validation
      };
    }
    
    return question.toObject ? question.toObject() : question;
  });
}

/**
 * Convert shuffled answer index back to original index
 */
export function getOriginalAnswerIndex(shuffledIndex, shuffledOptionOrder) {
  if (!shuffledOptionOrder || !Array.isArray(shuffledOptionOrder)) {
    return shuffledIndex;
  }
  return shuffledOptionOrder[shuffledIndex];
}