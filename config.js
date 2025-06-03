// Configuration for AI Learning Platform
module.exports = {
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },

  // File upload limits
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'video/avi',
      'video/mov'
    ]
  },

  // Website scraping limits
  websiteScraping: {
    timeout: 60000, // 60 seconds for large content
    maxContentLength: 5000000, // 5MB max content extraction (massive increase)
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    retryAttempts: 2, // Retry failed requests
    retryDelay: 2000 // 2 second delay between retries
  },

  // Content processing limits
  content: {
    previewLength: 2000, // Characters shown in preview
    uiPreviewLength: 5000, // UI content preview
    aiProcessingLength: 1000000, // 1M characters for AI processing (utilize full Gemini context)
    maxCombinedSources: 50, // Increased from 10 - can handle many more sources
    textInputMinLength: 10,
    textInputMaxLength: 2000000 // 2MB max for direct text input (increased significantly)
  },

  // AI generation settings
  ai: {
    model: 'gemini-2.0-flash',
    maxTokens: 1000000, // Utilize full 1M token context
    temperature: 0.7,
    flashcardRange: { min: 5, max: 100 }, // Increased max from 50 to 100
    difficultyLevels: ['easy', 'medium', 'hard'],
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Request limits
  requests: {
    jsonLimit: '100mb', // Increased from 50mb
    urlencoded: { limit: '100mb', extended: true },
    timeout: 60000 // 60 seconds for complex operations
  },

  // Performance settings
  performance: {
    enableCaching: true,
    cacheExpiry: 300000, // 5 minutes
    maxConcurrentRequests: 5,
    rateLimitWindow: 900000, // 15 minutes
    rateLimitMax: 100 // requests per window
  },

  // Security settings
  security: {
    allowedDomains: [], // Empty = allow all domains
    blockedDomains: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    maxRedirects: 5,
    validateSSL: true
  },

  // Feature flags
  features: {
    websiteScraping: true,
    fileUpload: true,
    textInput: true,
    progressiveLoading: true, // Load large content progressively
    contentCompression: true, // Compress large content
    advancedExtraction: true // Use advanced content extraction techniques
  }
}; 