# LearnSnap ⚡

**Snap learning from any source with AI-powered flashcards and summaries.**

Transform any content into interactive learning materials instantly. Upload files, paste URLs, or add text directly - LearnSnap generates comprehensive flashcards and summaries using advanced AI. Like NotebookLM, but built specifically for active learning and spaced repetition.

## ⚡ Why LearnSnap?

- **Instant Learning**: Generate flashcards in seconds from any source
- **Multi-Source Intelligence**: Combine unlimited sources for comprehensive study materials  
- **Smart Spaced Repetition**: FSRS algorithm optimizes your learning schedule
- **Custom AI Instructions**: Tailor flashcard generation to your specific needs
- **Modern UI**: Beautiful, responsive design built for productivity
- **Open Source**: Free to use, modify, and self-host

## Features ✨

- **Multi-Source Support**: Add content from various sources like NotebookLM
  - 📄 **File Upload**: PDFs, Word documents, and text files
  - 🌐 **Website URLs**: Extract content from any website (up to 5MB)
  - ✍️ **Direct Text**: Paste or type content directly (up to 2MB)
- **Source Management**: Add, remove, and combine up to 50 sources
- **AI-Powered Generation**: Create flashcards and summaries using Google Gemini 2.0 Flash with 1M token context
- **Custom Instructions**: Add optional custom instructions to tailor flashcard generation to your specific needs
- **Massive Content Processing**: Utilize full 1 million token context for comprehensive analysis
- **Interactive Flashcards**: 3D flip cards with smooth animations (5-100 cards)
- **Difficulty Levels**: Generate content for easy, medium, or hard difficulty
- **Spaced Repetition**: Rate your knowledge to improve learning with FSRS algorithm
- **Deck Management**: Save flashcards to permanent decks for spaced repetition study sessions
- **Save Anytime**: Save generated flashcards to decks both during generation and after creation
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Keyboard Navigation**: Use arrow keys and spacebar for flashcard navigation
- **Drag & Drop**: Easy file upload with visual feedback

## Screenshots 📸

### Multi-Source Input Interface
Beautiful tabbed interface for adding multiple types of content sources.

### Sources Management
View, manage, and combine content from multiple sources in one place.

### AI-Generated Flashcards
Interactive 3D flip cards generated from your combined sources.

### Content Summary
AI-generated summaries with formatted headings and key points.

## Quick Start 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- **Google AI API key** (free from Google)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/learnsnap.git
   cd learnsnap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key** (Required)
   
   **Option A: Quick Setup (Recommended)**
   ```bash
   npm run setup
   ```
   This will guide you through getting and setting up your Google AI API key.
   
   **Option B: Manual Setup**
   
   **Get your free Google AI API key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API key"
   - Copy your API key
   
   **Add it to your environment:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env and add your API key
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start LearnSnap**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage Guide 📖

### 1. Add Your Sources (Like NotebookLM)

The platform supports multiple source types that you can combine:

#### 📄 File Upload
- Drag and drop files or click to browse
- Supported formats: PDF, Word documents (.docx), Text files (.txt)
- File size limit: 100MB

#### 🌐 Website URLs
- Paste any website URL
- Automatic content extraction from articles, blogs, documentation
- Example: `https://en.wikipedia.org/wiki/Machine_Learning`

#### ✍️ Direct Text Input
- Paste articles, notes, transcripts, or any text content
- Optional title for organization
- Minimum 10 characters required

### 2. Manage Your Sources
- View all added sources in the sources list
- Each source shows type, title, and preview
- Remove individual sources or clear all
- Combine content from multiple sources automatically

### 3. Generate Learning Materials
- **Flashcards**: AI-generated question/answer pairs (5-100 cards)
- **Summary**: Comprehensive overview with key points
- Choose difficulty level (Easy, Medium, Hard)
- **Custom Instructions**: Add optional specific instructions to tailor flashcard generation
  - Examples: "Focus on definitions", "Include practical examples", "Make questions more challenging"
  - "Include formulas and calculations", "Focus on key concepts only"
- **Save Options**: Choose to save as a permanent deck for spaced repetition study
- Content generated from all your sources combined
- Utilizes full 1 million token context for comprehensive analysis

### 4. Study with Interactive Flashcards
- Click cards to flip between question and answer
- Use keyboard shortcuts:
  - **Arrow Keys**: Navigate between cards
  - **Space/Enter**: Flip card
- Rate your knowledge (Easy/Medium/Hard)
- **Save to Deck**: Save current flashcards to a permanent deck anytime
- Shuffle or reset cards as needed

### 5. Deck Management & Spaced Repetition
- **My Decks**: Access all your saved flashcard decks
- **FSRS Algorithm**: Intelligent spaced repetition scheduling
- **Study Sessions**: Optimized review sessions based on memory retention
- **Progress Tracking**: Monitor your learning progress and statistics
- **Flexible Saving**: Save flashcards during generation or after studying them

## Source Format Support 📄

| Source Type | Format | Capacity | Status | Features |
|-------------|---------|----------|---------|----------|
| Files | PDF | 100MB | ✅ Supported | Text extraction |
| Files | Word (.docx) | 100MB | ✅ Supported | Text extraction |
| Files | Text (.txt) | 100MB | ✅ Supported | Direct import |
| URLs | Websites | 5MB content | ✅ Supported | Advanced content scraping |
| Text | Direct Input | 2MB | ✅ Supported | Immediate processing |
| Files | Videos (.mp4, .avi) | 100MB | 🚧 Coming Soon | Transcript generation |

## API Endpoints 🔗

### Upload File
```
POST /upload
Content-Type: multipart/form-data
```

### Process URL (Website)
```
POST /process-url
Content-Type: application/json
{
  "url": "https://example.com"
}
```

### Process Direct Text
```
POST /process-text
Content-Type: application/json
{
  "text": "content text",
  "title": "optional title"
}
```

### Generate Flashcards
```
POST /generate-flashcards
Content-Type: application/json
{
  "content": "combined content from sources",
  "count": 10,
  "difficulty": "medium"
}
```

### Generate Summary
```
POST /generate-summary
Content-Type: application/json
{
  "content": "combined content from sources"
}
```

## Development 🛠️

### Project Structure
```
learnsnap/
├── public/
│   ├── index.html          # Multi-source interface
│   ├── styles.css          # Modern UI styles
│   └── script.js           # Source management logic
├── uploads/                # Temporary file storage
├── flashcards/            # Saved decks and sessions
├── server.js              # Express server with AI processing
├── package.json           # Dependencies
└── README.md              # This file
```

### Development Mode
```bash
npm run dev
```
Uses nodemon for automatic server restart on file changes.

### Technologies Used
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini 2.0 Flash 
- **File Processing**: pdf-parse, mammoth
- **Web Scraping**: axios, cheerio
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **UI**: Font Awesome icons, Inter font
- **Spaced Repetition**: FSRS algorithm

## Configuration ⚙️

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google AI API key | Pre-configured |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |

### Google AI Setup

**LearnSnap requires a Google AI API key to function.** The API is free with generous limits:

- **Free tier**: 15 requests per minute, 1,500 requests per day
- **Rate limits**: More than enough for personal use
- **Cost**: Completely free for most users

**To get your API key:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account  
3. Click "Create API key"
4. Copy your API key
5. Add it to your `.env` file: `GEMINI_API_KEY=your_key_here`

**Security note**: Never commit your API key to version control. It's already in `.gitignore`.

## Troubleshooting 🔧

### Common Issues

**Error: "API key not found"**
- You need to add your own Google AI API key
- Get a free key at https://makersuite.google.com/app/apikey
- Add it to your .env file: `GEMINI_API_KEY=your_key_here`
- Restart the server after adding the key

**File upload fails**
- Check file size (max 100MB)
- Ensure file format is supported
- Try a different file

**Website content extraction fails**
- Some websites block automated access
- Try a different URL or use direct text input
- Check if the website is accessible

**Flashcards not generating**
- Ensure you have at least one source added
- Check your internet connection
- Try with smaller content or fewer flashcards
- Wait a moment and try again (rate limiting)

## NotebookLM Alternative 🤖

LearnSnap provides similar functionality to Google's NotebookLM but with enhanced learning features:

- **Multiple Source Types**: Files, URLs, text input
- **Source Management**: Add, remove, and organize sources
- **Content Combination**: Automatically combine all sources for AI generation
- **AI-Powered Analysis**: Generate learning materials from combined sources
- **Interactive Study Tools**: Flashcards with spaced repetition
- **Custom Instructions**: Tailor AI generation to your needs
- **Open Source**: Self-hostable and customizable

## Gemini 2.0 Flash Advantages 🚀

- **1 Million Token Context**: Process massive amounts of content simultaneously
- **Experimental Model**: Latest Google AI technology
- **Multi-Modal**: Advanced understanding of various content types
- **Ultra-Fast Generation**: Quick response times even with large content
- **High Quality**: Superior educational content generation from extensive sources
- **Comprehensive Analysis**: Can analyze entire books, long documentations, and multiple sources together
- **No Artificial Limits**: Utilizes the full context window for maximum comprehension

## Roadmap 🛣️

### Planned Features
- [ ] **Mobile App**: Native iOS and Android apps
- [ ] **Chrome Extension**: Quick source addition from any webpage
- [ ] **Video Transcription**: Upload videos with automatic transcription
- [ ] **Audio Support**: Process podcasts and audio lectures
- [ ] **OCR**: Extract text from images and scanned documents
- [ ] **Export Options**: Export to Anki, Quizlet, PDF
- [ ] **Team Features**: Shared decks and collaborative learning
- [ ] **Analytics**: Detailed learning progress and insights
- [ ] **Integrations**: Connect with LMS platforms and note-taking apps

### Recent Updates
- ✅ **Custom Instructions**: Tailor flashcard generation
- ✅ **Save to Deck**: Save flashcards anytime during study
- ✅ **Improved UI**: Better error handling and user feedback
- ✅ **FSRS Integration**: Advanced spaced repetition algorithm

## Contributing 🤝

We welcome contributions to LearnSnap! Whether it's bug fixes, new features, or documentation improvements.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

If you have any questions or need help:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the Google AI documentation

## Security Notice 🔒

**Important**: LearnSnap requires your own Google AI API key to function. We do not include any hardcoded keys for security reasons.

### API Key Best Practices:
- ✅ **Get your own free key** from Google AI Studio
- ✅ **Store it in .env file** (already in .gitignore)
- ✅ **Never commit API keys** to version control
- ✅ **Don't share your API key** publicly
- ✅ **Regenerate if compromised**

### Why This Approach:
- **Security**: No risk of exposed API keys in public code
- **Control**: You control your own usage and limits
- **Privacy**: Your API calls go directly to Google, not through our servers
- **Cost**: Free tier is generous for personal use

For security issues, see [SECURITY.md](SECURITY.md)

---

**Built with ⚡  | Powered by Google Gemini | Open Source Learning Revolution** 