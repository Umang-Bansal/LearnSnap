const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config');
const { v4: uuidv4 } = require('uuid');
const { createEmptyCard, fsrs, generatorParameters, Rating, State } = require('ts-fsrs');
require('dotenv').config();

const app = express();
const PORT = config.server.port;

// Initialize Gemini AI
let genAI, model;
let apiKeyMissing = false;

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required');
  console.log('📝 Please add your Google AI API key to Vercel environment variables');
  console.log('🔗 Get your API key at: https://makersuite.google.com/app/apikey');
  apiKeyMissing = true;
} else {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: config.ai.model });
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error.message);
    apiKeyMissing = true;
  }
}

// Middleware to check API key before AI operations
const checkApiKey = (req, res, next) => {
  if (apiKeyMissing) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY is not configured. Please add your Google AI API key to the environment variables.',
      setup_url: 'https://aistudio.google.com/app/apikey'
    });
  }
  next();
};

// Middleware with increased limits
app.use(cors());
app.use(express.json({ limit: config.requests.jsonLimit }));
app.use(express.urlencoded(config.requests.urlencoded));
app.use(express.static('public'));

// Directory paths (for local development only)
const uploadsDir = path.join(__dirname, 'uploads');
const flashcardsDir = path.join(__dirname, 'flashcards');
const decksDir = path.join(flashcardsDir, 'decks');
const studySessionsDir = path.join(flashcardsDir, 'sessions');

// Only create directories in non-serverless environments
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;
if (!isServerless) {
  try {
    fs.ensureDirSync(uploadsDir);
    fs.ensureDirSync(flashcardsDir);
    fs.ensureDirSync(decksDir);
    fs.ensureDirSync(studySessionsDir);
  } catch (error) {
    console.warn('Warning: Could not create directories (running in serverless mode?):', error.message);
  }
}

// Initialize FSRS
const fsrsParams = generatorParameters({ 
  enable_fuzz: true,
  enable_short_term: false,
  maximum_interval: 36500, // 100 years max
  request_retention: 0.9 // 90% retention rate
});
const fsrsScheduler = fsrs(fsrsParams);

// Configure multer for serverless compatibility
const storage = isServerless ? 
  multer.memoryStorage() : // Use memory storage in serverless
  multer.diskStorage({     // Use disk storage locally
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, video files, text files, and Word documents are allowed.'), false);
    }
  }
});

// Content processing functions
async function extractTextFromPDF(source) {
  try {
    let dataBuffer;
    if (Buffer.isBuffer(source)) {
      // Serverless: source is already a buffer
      dataBuffer = source;
    } else {
      // Local: source is a file path
      dataBuffer = fs.readFileSync(source);
    }
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
}

async function extractTextFromDocx(source) {
  try {
    let options;
    if (Buffer.isBuffer(source)) {
      // Serverless: source is a buffer
      options = { buffer: source };
    } else {
      // Local: source is a file path
      options = { path: source };
    }
    const result = await mammoth.extractRawText(options);
    return result.value;
  } catch (error) {
    throw new Error('Failed to extract text from Word document: ' + error.message);
  }
}

async function extractTextFromTxt(source) {
  try {
    if (Buffer.isBuffer(source)) {
      // Serverless: source is a buffer
      return source.toString('utf-8');
    } else {
      // Local: source is a file path
      return fs.readFileSync(source, 'utf-8');
    }
  } catch (error) {
    throw new Error('Failed to read text file: ' + error.message);
  }
}

// Enhanced website content extraction with config-based limits
async function extractTextFromWebsite(url) {
  try {
    console.log(`Extracting content from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: config.websiteScraping.timeout,
      maxContentLength: config.websiteScraping.maxContentLength,
      headers: {
        'User-Agent': config.websiteScraping.userAgent
      },
      maxRedirects: config.security.maxRedirects
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .sidebar, .menu, .advertisement, .ads, .popup, .modal').remove();
    
    // Extract main content with priority selectors
    let content = '';
    
    // Enhanced content selectors for better extraction
    const contentSelectors = [
      'main article',
      'main',
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.article-body',
      '#content',
      '.main-content',
      '.page-content',
      '.post-body'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0 && element.text().trim().length > 200) {
        content = element.text().trim();
        console.log(`Content extracted using selector: ${selector}`);
        break;
      }
    }
    
    // Fallback to body if no specific content found
    if (!content) {
      content = $('body').text().trim();
      console.log('Using body content as fallback');
    }
    
    // Enhanced text cleaning
    content = content
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\n\s*\n/g, '\n') // Multiple newlines to single
      .replace(/[\r\n\t]+/g, ' ') // Remove tabs and line breaks
      .replace(/\s{2,}/g, ' ') // Multiple spaces to single
      .trim();
    
    // Apply content length limit
    if (content.length > config.websiteScraping.maxContentLength) {
      content = content.substring(0, config.websiteScraping.maxContentLength) + '...\n\n[Content truncated - reached maximum extraction limit]';
      console.log(`Content truncated to ${config.websiteScraping.maxContentLength} characters`);
    }
    
    if (content.length < 50) {
      throw new Error('Could not extract meaningful content from this website');
    }
    
    console.log(`Successfully extracted ${content.length} characters from website`);
    return content;
    
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Could not access the website. Please check the URL.');
    } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      throw new Error('Website took too long to respond. The site may be slow or temporarily unavailable.');
    } else if (error.response && error.response.status) {
      throw new Error(`Website returned error ${error.response.status}. The page may not exist or be accessible.`);
    }
    throw new Error('Failed to extract content from website: ' + error.message);
  }
}

// Enhanced AI generation with config-based limits
async function generateFlashcards(content, options = {}) {
  const { count = 10, difficulty = 'medium', type = 'flashcards', customInstructions = '' } = options;
  
  // Ensure count is within allowed range
  const validCount = Math.min(Math.max(count, config.ai.flashcardRange.min), config.ai.flashcardRange.max);
  
  // With Gemini 2.0 Flash's 1M token context, we can process much more content
  const processContent = content.length > config.content.aiProcessingLength 
    ? content.substring(0, config.content.aiProcessingLength) + '...\n\n[Content truncated for processing - consider breaking into smaller chunks]'
    : content;

  // Base prompt with custom instructions integration
  let prompt = `Based on the following content, generate exactly ${validCount} educational ${type} that will help someone learn and remember the key concepts. 

Content (${processContent.length} characters):
${processContent}

Requirements:
- Difficulty level: ${difficulty}
- Create concise, clear questions and answers
- Focus on the most important concepts across ALL the content provided
- Ensure questions test understanding, not just memorization
- Include a variety of question types (definitions, explanations, applications, examples)
- Make questions engaging and educational
- Draw from the entire content to create comprehensive coverage`;

  // Add custom instructions if provided
  if (customInstructions && customInstructions.trim()) {
    prompt += `\n\nCustom Instructions (follow these specific requirements):
${customInstructions.trim()}`;
  }

  prompt += `\n\nFormat your response as a valid JSON array with objects containing exactly "question" and "answer" fields.
Example format:
[
  {
    "question": "What is the main concept?",
    "answer": "The main concept is..."
  }
]

Respond with ONLY the JSON array, no additional text or formatting.`;

  try {
    console.log(`Generating ${validCount} flashcards from ${processContent.length} characters of content${customInstructions ? ' with custom instructions' : ''}`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const flashcardsText = response.text();
    
    // Clean up the response and parse JSON
    let cleanedText = flashcardsText.replace(/```json\n?|\n?```/g, '').trim();
    
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```[\w]*\n?|\n?```$/g, '').trim();
    }
    
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating flashcards with Gemini:', error);
    throw new Error('Failed to generate flashcards. Please try again in a moment.');
  }
}

async function generateSummary(content) {
  // With Gemini 2.0 Flash's massive context, we can process much more content
  const processContent = content.length > config.content.aiProcessingLength 
    ? content.substring(0, config.content.aiProcessingLength) + '...\n\n[Content truncated for processing]'
    : content;

  const prompt = `Please create a comprehensive and well-structured summary of the following content. Include:

- Main topics and key points from ALL sections
- Important concepts and definitions
- Practical applications or examples
- Use clear headings and subheadings
- Make it educational and easy to understand
- Organize information logically across all the provided content

Content (${processContent.length} characters):
${processContent}

Format your response with clear headings using ## for main sections and ### for subsections.
Focus on making the summary useful for learning and studying, covering all major topics presented in the content.`;

  try {
    console.log(`Generating summary from ${processContent.length} characters of content`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    throw new Error('Failed to generate summary. Please try again in a moment.');
  }
}

// Routes with enhanced error handling and limits
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = req.file.mimetype;
    let extractedText = '';
    
    // Determine source: buffer (serverless) or path (local)
    const source = isServerless ? req.file.buffer : req.file.path;

    if (fileType === 'application/pdf') {
      extractedText = await extractTextFromPDF(source);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDocx(source);
    } else if (fileType === 'text/plain') {
      extractedText = await extractTextFromTxt(source);
    } else if (fileType.startsWith('video/')) {
      extractedText = "Video processing feature coming soon! Please upload PDF, Word, or text files for now.";
    }

    // Only remove file in local environment
    if (!isServerless && req.file.path) {
      try {
        fs.removeSync(req.file.path);
      } catch (error) {
        console.warn('Could not remove uploaded file:', error.message);
      }
    }

    res.json({
      success: true,
      filename: req.file.originalname,
      fileType: fileType,
      sourceType: 'file',
      extractedText: extractedText.substring(0, config.content.previewLength) + (extractedText.length > config.content.previewLength ? '...' : ''),
      fullText: extractedText,
      contentLength: extractedText.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/process-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Only handle website URLs, reject YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return res.status(400).json({ 
        error: 'YouTube URLs are not supported. Please use the "Direct Text" option to manually add video content.' 
      });
    }
    
    const sourceType = 'website';
    const title = new URL(url).hostname;
    const extractedText = await extractTextFromWebsite(url);
    
    res.json({
      success: true,
      url: url,
      title: title,
      sourceType: sourceType,
      extractedText: extractedText.substring(0, config.content.previewLength) + (extractedText.length > config.content.previewLength ? '...' : ''),
      fullText: extractedText,
      contentLength: extractedText.length
    });
    
  } catch (error) {
    console.error('URL processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/process-text', async (req, res) => {
  try {
    const { text, title } = req.body;
    
    if (!text || text.trim().length < config.content.textInputMinLength) {
      return res.status(400).json({ error: `Text content is required (minimum ${config.content.textInputMinLength} characters)` });
    }
    
    if (text.length > config.content.textInputMaxLength) {
      return res.status(400).json({ error: `Text content too large (maximum ${config.content.textInputMaxLength} characters)` });
    }
    
    res.json({
      success: true,
      title: title || 'Direct Text Input',
      sourceType: 'text',
      extractedText: text.substring(0, config.content.previewLength) + (text.length > config.content.previewLength ? '...' : ''),
      fullText: text,
      contentLength: text.length
    });
    
  } catch (error) {
    console.error('Text processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-flashcards', checkApiKey, async (req, res) => {
  try {
    const { content, count, difficulty, type, saveAsDeck, deckName, customInstructions } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const flashcards = await generateFlashcards(content, { count, difficulty, type, customInstructions });
    
    // If user wants to save as deck, create a deck with FSRS cards
    let deckId = null;
    if (saveAsDeck && deckName) {
      if (isServerless) {
        console.warn('Deck saving is not available in serverless mode');
        // Return flashcards without saving deck
        return res.json({ 
          success: true, 
          flashcards,
          deckId: null,
          deckName: null,
          totalCards: flashcards.length,
          warning: 'Deck saving is not available in serverless deployment. Flashcards generated successfully.'
        });
      }
      
      deckId = uuidv4();
      const now = new Date();
      
      // Create FSRS cards for each flashcard
      const fsrsCards = flashcards.map((flashcard, index) => {
        const card = createEmptyCard(now);
        return {
          id: uuidv4(),
          question: flashcard.question,
          answer: flashcard.answer,
          fsrsCard: card,
          createdAt: now,
          lastReviewed: null,
          totalReviews: 0,
          tags: [],
          difficulty: difficulty,
          source: 'generated'
        };
      });
      
      // Create deck object
      const deck = {
        id: deckId,
        name: deckName.trim(),
        description: `Generated from ${fsrsCards.length} flashcards (${difficulty} difficulty)`,
        cards: fsrsCards,
        createdAt: now,
        updatedAt: now,
        totalCards: fsrsCards.length,
        newCards: fsrsCards.length,
        learningCards: 0,
        reviewCards: 0,
        settings: {
          difficulty: difficulty,
          maxNewCardsPerDay: 20,
          maxReviewsPerDay: 100,
          enableFsrs: true
        },
        stats: {
          totalStudyTime: 0,
          totalReviews: 0,
          retentionRate: 0,
          averageGrade: 0
        }
      };
      
      // Save deck to file
      try {
        const deckPath = path.join(decksDir, `${deckId}.json`);
        await fs.writeJson(deckPath, deck, { spaces: 2 });
        console.log(`Saved deck "${deckName}" with ${fsrsCards.length} cards to ${deckPath}`);
      } catch (error) {
        console.error('Error saving deck:', error);
        // Continue without deck saving
      }
    }

    res.json({ 
      success: true, 
      flashcards,
      deckId: deckId,
      deckName: saveAsDeck ? deckName : null,
      totalCards: flashcards.length
    });

  } catch (error) {
    console.error('Flashcard generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save existing flashcards as a deck
app.post('/save-flashcards-to-deck', async (req, res) => {
  try {
    if (isServerless) {
      return res.status(503).json({ 
        error: 'Deck saving is not available in serverless deployment',
        message: 'This feature requires persistent storage. Please use the flashcards directly or deploy to a platform with persistent storage.'
      });
    }
    
    const { flashcards, deckName, deckDescription, difficulty = 'medium' } = req.body;
    
    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      return res.status(400).json({ error: 'Flashcards array is required' });
    }
    
    if (!deckName || !deckName.trim()) {
      return res.status(400).json({ error: 'Deck name is required' });
    }
    
    const deckId = uuidv4();
    const now = new Date();
    
    // Create FSRS cards for each flashcard
    const fsrsCards = flashcards.map((flashcard, index) => {
      const card = createEmptyCard(now);
      return {
        id: uuidv4(),
        question: flashcard.question,
        answer: flashcard.answer,
        fsrsCard: card,
        createdAt: now,
        lastReviewed: null,
        totalReviews: 0,
        tags: [],
        difficulty: difficulty,
        source: 'saved_from_session'
      };
    });
    
    // Create deck object
    const deck = {
      id: deckId,
      name: deckName.trim(),
      description: deckDescription ? deckDescription.trim() : `Saved deck with ${fsrsCards.length} flashcards`,
      cards: fsrsCards,
      createdAt: now,
      updatedAt: now,
      totalCards: fsrsCards.length,
      newCards: fsrsCards.length,
      learningCards: 0,
      reviewCards: 0,
      settings: {
        difficulty: difficulty,
        maxNewCardsPerDay: 20,
        maxReviewsPerDay: 100,
        enableFsrs: true
      },
      stats: {
        totalStudyTime: 0,
        totalReviews: 0,
        retentionRate: 0,
        averageGrade: 0
      }
    };
    
    // Save deck to file
    const deckPath = path.join(decksDir, `${deckId}.json`);
    await fs.writeJson(deckPath, deck, { spaces: 2 });
    
    console.log(`Saved flashcards to deck "${deckName}" with ${fsrsCards.length} cards`);
    
    res.json({ 
      success: true, 
      deckId: deckId,
      deckName: deckName.trim(),
      totalCards: fsrsCards.length,
      message: `Successfully saved ${fsrsCards.length} flashcards to deck "${deckName.trim()}"`
    });

  } catch (error) {
    console.error('Save to deck error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-summary', checkApiKey, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const summary = await generateSummary(content);
    res.json({ success: true, summary });

  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Deck Management Endpoints

// Get all decks
app.get('/api/decks', async (req, res) => {
  try {
    if (isServerless) {
      return res.json({ 
        success: true, 
        decks: [],
        message: 'Deck management is not available in serverless deployment. Please use the flashcard generation feature directly.'
      });
    }
    
    const deckFiles = await fs.readdir(decksDir);
    const decks = [];
    
    for (const file of deckFiles) {
      if (file.endsWith('.json')) {
        const deckPath = path.join(decksDir, file);
        const deck = await fs.readJson(deckPath);
        
        // Calculate current stats
        const now = new Date();
        const newCards = deck.cards.filter(card => card.fsrsCard.state === State.New).length;
        const learningCards = deck.cards.filter(card => card.fsrsCard.state === State.Learning).length;
        const reviewCards = deck.cards.filter(card => card.fsrsCard.state === State.Review).length;
        const dueCards = deck.cards.filter(card => new Date(card.fsrsCard.due) <= now).length;
        
        decks.push({
          id: deck.id,
          name: deck.name,
          description: deck.description,
          totalCards: deck.totalCards,
          newCards,
          learningCards,
          reviewCards,
          dueCards,
          createdAt: deck.createdAt,
          updatedAt: deck.updatedAt,
          settings: deck.settings,
          stats: deck.stats
        });
      }
    }
    
    res.json({ success: true, decks });
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific deck
app.get('/api/decks/:id', async (req, res) => {
  try {
    if (isServerless) {
      return res.status(503).json({ 
        error: 'Deck management is not available in serverless deployment',
        message: 'Individual deck access requires persistent storage.'
      });
    }
    
    const deckPath = path.join(decksDir, `${req.params.id}.json`);
    
    if (!await fs.pathExists(deckPath)) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    const deck = await fs.readJson(deckPath);
    res.json({ success: true, deck });
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete deck
app.delete('/api/decks/:id', async (req, res) => {
  try {
    const deckPath = path.join(decksDir, `${req.params.id}.json`);
    
    if (!await fs.pathExists(deckPath)) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    await fs.remove(deckPath);
    res.json({ success: true, message: 'Deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: error.message });
  }
});

// Study Session Endpoints

// Start study session - get due cards for review
app.post('/api/study/:deckId/start', async (req, res) => {
  try {
    const { deckId } = req.params;
    const { maxCards = 20 } = req.body;
    const deckPath = path.join(decksDir, `${deckId}.json`);
    
    if (!await fs.pathExists(deckPath)) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    const deck = await fs.readJson(deckPath);
    const now = new Date();
    
    // Get cards due for review (including new cards)
    const dueCards = deck.cards.filter(card => {
      const cardDue = new Date(card.fsrsCard.due);
      return cardDue <= now || card.fsrsCard.state === State.New;
    }).slice(0, maxCards);
    
    // Create study session
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      deckId: deckId,
      startTime: now,
      endTime: null,
      cards: dueCards.map(card => card.id),
      currentCardIndex: 0,
      completed: false,
      reviews: [],
      stats: {
        totalCards: dueCards.length,
        reviewedCards: 0,
        correctAnswers: 0,
        studyTime: 0
      }
    };
    
    const sessionPath = path.join(studySessionsDir, `${sessionId}.json`);
    await fs.writeJson(sessionPath, session, { spaces: 2 });
    
    res.json({ 
      success: true, 
      sessionId,
      totalCards: dueCards.length,
      firstCard: dueCards.length > 0 ? dueCards[0] : null
    });
  } catch (error) {
    console.error('Error starting study session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get next card in study session
app.get('/api/study/:sessionId/next', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionPath = path.join(studySessionsDir, `${sessionId}.json`);
    
    if (!await fs.pathExists(sessionPath)) {
      return res.status(404).json({ error: 'Study session not found' });
    }
    
    const session = await fs.readJson(sessionPath);
    
    if (session.completed || session.currentCardIndex >= session.cards.length) {
      return res.json({ 
        success: true, 
        completed: true,
        stats: session.stats
      });
    }
    
    // Get current card
    const cardId = session.cards[session.currentCardIndex];
    const deckPath = path.join(decksDir, `${session.deckId}.json`);
    const deck = await fs.readJson(deckPath);
    const card = deck.cards.find(c => c.id === cardId);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json({ 
      success: true,
      card: {
        id: card.id,
        question: card.question,
        answer: card.answer,
        state: card.fsrsCard.state,
        due: card.fsrsCard.due,
        difficulty: card.fsrsCard.difficulty,
        stability: card.fsrsCard.stability
      },
      progress: {
        current: session.currentCardIndex + 1,
        total: session.cards.length,
        percentage: Math.round(((session.currentCardIndex + 1) / session.cards.length) * 100)
      }
    });
  } catch (error) {
    console.error('Error getting next card:', error);
    res.status(500).json({ error: error.message });
  }
});

// Review card with FSRS algorithm
app.post('/api/study/:sessionId/review', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, studyTime = 0 } = req.body; // rating: 1=Again, 2=Hard, 3=Good, 4=Easy
    
    if (!rating || rating < 1 || rating > 4) {
      return res.status(400).json({ error: 'Invalid rating. Must be 1-4 (Again, Hard, Good, Easy)' });
    }
    
    const sessionPath = path.join(studySessionsDir, `${sessionId}.json`);
    const session = await fs.readJson(sessionPath);
    
    const cardId = session.cards[session.currentCardIndex];
    const deckPath = path.join(decksDir, `${session.deckId}.json`);
    const deck = await fs.readJson(deckPath);
    const cardIndex = deck.cards.findIndex(c => c.id === cardId);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const card = deck.cards[cardIndex];
    const now = new Date();
    
    // Convert rating to FSRS Rating enum
    const fsrsRating = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy][rating - 1];
    
    // Use FSRS to schedule next review
    const schedulingCards = fsrsScheduler.repeat(card.fsrsCard, now);
    const updatedFsrsCard = schedulingCards[fsrsRating].card;
    const reviewLog = schedulingCards[fsrsRating].log;
    
    // Update card with new FSRS data
    deck.cards[cardIndex] = {
      ...card,
      fsrsCard: updatedFsrsCard,
      lastReviewed: now,
      totalReviews: card.totalReviews + 1
    };
    
    // Update deck stats
    deck.updatedAt = now;
    deck.stats.totalReviews += 1;
    deck.stats.totalStudyTime += studyTime;
    
    // Calculate retention rate
    if (deck.stats.totalReviews > 0) {
      const correctReviews = rating >= 3 ? 1 : 0; // Good or Easy = correct
      deck.stats.retentionRate = ((deck.stats.retentionRate * (deck.stats.totalReviews - 1)) + correctReviews) / deck.stats.totalReviews;
      deck.stats.averageGrade = ((deck.stats.averageGrade * (deck.stats.totalReviews - 1)) + rating) / deck.stats.totalReviews;
    }
    
    // Save updated deck
    await fs.writeJson(deckPath, deck, { spaces: 2 });
    
    // Update session
    session.reviews.push({
      cardId: cardId,
      rating: rating,
      reviewTime: now,
      studyTime: studyTime,
      previousDue: card.fsrsCard.due,
      newDue: updatedFsrsCard.due,
      interval: updatedFsrsCard.scheduled_days
    });
    
    session.currentCardIndex += 1;
    session.stats.reviewedCards += 1;
    session.stats.studyTime += studyTime;
    if (rating >= 3) session.stats.correctAnswers += 1;
    
    // Check if session is completed
    if (session.currentCardIndex >= session.cards.length) {
      session.completed = true;
      session.endTime = now;
    }
    
    await fs.writeJson(sessionPath, session, { spaces: 2 });
    
    res.json({ 
      success: true,
      nextDue: updatedFsrsCard.due,
      interval: updatedFsrsCard.scheduled_days,
      stability: updatedFsrsCard.stability,
      difficulty: updatedFsrsCard.difficulty,
      state: updatedFsrsCard.state,
      completed: session.completed,
      progress: {
        current: session.currentCardIndex,
        total: session.cards.length,
        percentage: Math.round((session.currentCardIndex / session.cards.length) * 100)
      }
    });
  } catch (error) {
    console.error('Error reviewing card:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get study session stats
app.get('/api/study/:sessionId/stats', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionPath = path.join(studySessionsDir, `${sessionId}.json`);
    
    if (!await fs.pathExists(sessionPath)) {
      return res.status(404).json({ error: 'Study session not found' });
    }
    
    const session = await fs.readJson(sessionPath);
    
    res.json({ 
      success: true,
      stats: {
        ...session.stats,
        accuracy: session.stats.reviewedCards > 0 ? 
          Math.round((session.stats.correctAnswers / session.stats.reviewedCards) * 100) : 0,
        averageTimePerCard: session.stats.reviewedCards > 0 ? 
          Math.round(session.stats.studyTime / session.stats.reviewedCards) : 0
      },
      completed: session.completed,
      reviews: session.reviews
    });
  } catch (error) {
    console.error('Error getting session stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Setup status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    apiKeyConfigured: !apiKeyMissing,
    message: apiKeyMissing ? 
      'Please configure GEMINI_API_KEY in environment variables' : 
      'System ready'
  });
});

// Serve the main page
app.get('/', (req, res) => {
  if (apiKeyMissing) {
    // Send a setup page instead of the main app if API key is missing
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>LearnSnap - Setup Required</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
          .error { color: #e74c3c; }
          .code { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          a { color: #3498db; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>🚀 LearnSnap Setup Required</h1>
        <p class="error">❌ GEMINI_API_KEY environment variable is missing</p>
        <h3>To complete setup:</h3>
        <ol>
          <li>Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
          <li>Go to your <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a></li>
          <li>Select this project → Settings → Environment Variables</li>
          <li>Add: <code>GEMINI_API_KEY</code> with your API key</li>
          <li>Redeploy the application</li>
        </ol>
        <p>Once configured, your AI-powered flashcard platform will be ready! 🎉</p>
      </body>
      </html>
    `);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Export app for Vercel deployment
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 LearnSnap running on http://localhost:${PORT}`);
    console.log('⚡ Snap learning from any source with AI');
    console.log('🤖 Powered by Google Gemini 2.0 Flash');
    console.log('📚 Upload files, add URLs, or paste text to start learning!');
    console.log('🌐 Supports: PDFs, Word docs, Websites, and direct text');
  });
} 