class AILearningPlatform {
    constructor() {
        this.sources = []; // Array to store multiple sources
        this.combinedContent = '';
        this.flashcards = [];
        this.currentCardIndex = 0;
        this.isFlipped = false;
        
        // Deck management
        this.decks = [];
        this.currentDeck = null;
        this.currentSession = null;
        this.studyStartTime = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadDecks(); // Load saved decks on startup
    }
    
    initializeElements() {
        // Tab elements
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Navigation elements
        this.sourcesNav = document.getElementById('sourcesNav');
        this.flashcardsNav = document.getElementById('flashcardsNav');
        this.decksNav = document.getElementById('decksNav');
        this.progressNav = document.getElementById('progressNav');
        
        // Modal elements
        this.addSourcesBtn = document.getElementById('addSourcesBtn');
        this.addMoreSourcesBtn = document.getElementById('addMoreSourcesBtn');
        this.addSourcesModal = document.getElementById('addSourcesModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        
        // File upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.uploadBtn = document.getElementById('uploadBtn');
        
        // URL input elements
        this.urlInput = document.getElementById('urlInput');
        this.urlBtn = document.getElementById('urlBtn');
        
        // Text input elements
        this.textTitle = document.getElementById('textTitle');
        this.textInput = document.getElementById('textInput');
        this.textBtn = document.getElementById('textBtn');
        
        // Progress elements
        this.processingProgress = document.getElementById('processingProgress');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.progressPercent = document.getElementById('progressPercent');
        
        // Sources management elements
        this.sourcesManagementSection = document.getElementById('sourcesManagementSection');
        this.sourcesSelectionList = document.getElementById('sourcesSelectionList');
        this.clearAllSourcesBtn = document.getElementById('clearAllSourcesBtn');
        
        // Source selection elements
        this.selectedSourcesCount = document.getElementById('selectedSourcesCount');
        this.combinedContentSize = document.getElementById('combinedContentSize');
        this.previewStats = document.getElementById('previewStats');
        this.contentPreview = document.getElementById('contentPreview');
        
        // Generation elements
        this.flashcardCount = document.getElementById('flashcardCount');
        this.difficulty = document.getElementById('difficulty');
        this.customInstructions = document.getElementById('customInstructions');
        this.saveAsDeck = document.getElementById('saveAsDeck');
        this.deckNameInput = document.getElementById('deckNameInput');
        this.deckName = document.getElementById('deckName');
        this.generateFlashcardsBtn = document.getElementById('generateFlashcardsBtn');
        this.generateSummaryBtn = document.getElementById('generateSummaryBtn');
        
        // Save to deck modal elements
        this.saveFlashcardsToDeckBtn = document.getElementById('saveFlashcardsToDeckBtn');
        this.saveToDeckModal = document.getElementById('saveToDeckModal');
        this.closeSaveToDeckModalBtn = document.getElementById('closeSaveToDeckModalBtn');
        this.cancelSaveToDeckBtn = document.getElementById('cancelSaveToDeckBtn');
        this.confirmSaveToDeckBtn = document.getElementById('confirmSaveToDeckBtn');
        this.saveDeckName = document.getElementById('saveDeckName');
        this.saveDeckDescription = document.getElementById('saveDeckDescription');
        this.saveFlashcardCount = document.getElementById('saveFlashcardCount');
        
        // Flashcard elements
        this.flashcardsSection = document.getElementById('flashcardsSection');
        this.flashcard = document.getElementById('flashcard');
        this.questionText = document.getElementById('questionText');
        this.answerText = document.getElementById('answerText');
        this.currentCard = document.getElementById('currentCard');
        this.totalCards = document.getElementById('totalCards');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Deck library elements
        this.deckLibrarySection = document.getElementById('deckLibrarySection');
        this.refreshDecksBtn = document.getElementById('refreshDecksBtn');
        this.decksGrid = document.getElementById('decksGrid');
        
        // Study session elements
        this.studySessionSection = document.getElementById('studySessionSection');
        this.studyDeckTitle = document.getElementById('studyDeckTitle');
        this.endStudyBtn = document.getElementById('endStudyBtn');
        this.studyProgressFill = document.getElementById('studyProgressFill');
        this.studyProgressText = document.getElementById('studyProgressText');
        this.studyProgressPercent = document.getElementById('studyProgressPercent');
        this.studyCard = document.getElementById('studyCard');
        this.studyQuestionText = document.getElementById('studyQuestionText');
        this.studyAnswerText = document.getElementById('studyAnswerText');
        
        // Summary elements
        this.summarySection = document.getElementById('summarySection');
        this.summaryContent = document.getElementById('summaryContent');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
        
        // Feedback buttons
        this.feedbackBtns = document.querySelectorAll('.feedback-btn');
    }
    
    attachEventListeners() {
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Navigation
        this.sourcesNav.addEventListener('click', () => this.showSection('sources'));
        this.flashcardsNav.addEventListener('click', () => this.showSection('flashcards'));
        this.decksNav.addEventListener('click', () => this.showSection('decks'));
        this.progressNav.addEventListener('click', () => this.showSection('progress'));
        
        // Modal controls
        this.addSourcesBtn.addEventListener('click', () => this.showModal());
        this.addMoreSourcesBtn.addEventListener('click', () => this.showModal());
        this.closeModalBtn.addEventListener('click', () => this.hideModal());
        this.addSourcesModal.addEventListener('click', (e) => {
            if (e.target === this.addSourcesModal) this.hideModal();
        });
        
        // File upload
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', () => this.handleFileUpload());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('drop', this.handleFileDrop.bind(this));
        
        // URL processing
        this.urlBtn.addEventListener('click', () => this.handleUrlSubmit());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUrlSubmit();
        });
        
        // Text processing
        this.textBtn.addEventListener('click', () => this.handleTextSubmit());
        
        // Save deck options
        this.saveAsDeck.addEventListener('change', () => {
            this.deckNameInput.style.display = this.saveAsDeck.checked ? 'block' : 'none';
            if (this.saveAsDeck.checked) {
                this.deckName.focus();
            }
        });
        
        // Source management
        this.clearAllSourcesBtn.addEventListener('click', () => this.clearAllSources());
        
        // Generation
        this.generateFlashcardsBtn.addEventListener('click', () => this.generateFlashcards());
        this.generateSummaryBtn.addEventListener('click', () => this.generateSummary());
        
        // Flashcard navigation
        this.prevBtn.addEventListener('click', () => this.previousCard());
        this.nextBtn.addEventListener('click', () => this.nextCard());
        this.shuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.resetBtn.addEventListener('click', () => this.resetCards());
        this.flashcard.addEventListener('click', () => this.flipCard());
        
        // Deck library
        this.refreshDecksBtn.addEventListener('click', () => this.loadDecks());
        
        // Save to deck modal
        this.saveFlashcardsToDeckBtn.addEventListener('click', () => this.showSaveToDeckModal());
        this.closeSaveToDeckModalBtn.addEventListener('click', () => this.hideSaveToDeckModal());
        this.cancelSaveToDeckBtn.addEventListener('click', () => this.hideSaveToDeckModal());
        this.confirmSaveToDeckBtn.addEventListener('click', () => this.saveFlashcardsToDeck());
        this.saveToDeckModal.addEventListener('click', (e) => {
            if (e.target === this.saveToDeckModal) this.hideSaveToDeckModal();
        });
        
        // Study session
        this.endStudyBtn.addEventListener('click', () => this.endStudySession());
        
        // Feedback buttons
        this.feedbackBtns.forEach(btn => {
            btn.addEventListener('click', () => this.submitFeedback(btn.dataset.difficulty));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    switchTab(tabName) {
        // Update tab buttons
        this.tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab content
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabName + 'Tab') {
                content.classList.add('active');
            }
        });
    }
    
    // File upload handlers
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea.classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.uploadFile(files[0]);
        }
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.uploadFile(file);
        }
    }
    
    async uploadFile(file) {
        try {
            this.showProcessing('Uploading and processing file...');
            
            const formData = new FormData();
            formData.append('file', file);
            
            // Reset progress bar
            this.progressFill.style.width = '0%';
            
            // Use XMLHttpRequest for real progress tracking
            const xhr = new XMLHttpRequest();
            
            return new Promise((resolve, reject) => {
                // Upload progress event
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const uploadProgress = (e.loaded / e.total) * 60; // Reserve 60% for upload
                        this.progressFill.style.width = uploadProgress + '%';
                        this.progressPercent.textContent = Math.round(uploadProgress) + '%';
                        this.progressText.textContent = `Uploading file... ${Math.round(uploadProgress)}%`;
                    }
                });
                
                // Request state changes
                xhr.addEventListener('readystatechange', () => {
                    if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                        // Headers received, start processing animation
                        this.progressFill.style.width = '70%';
                        this.progressPercent.textContent = '70%';
                        this.progressText.textContent = 'Processing file...';
                    }
                });
                
                // Upload complete
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        try {
                            const result = JSON.parse(xhr.responseText);
            
            if (result.success) {
                                // Animate to completion
                                this.progressFill.style.width = '100%';
                                this.progressPercent.textContent = '100%';
                                this.progressText.textContent = 'Upload complete!';
                
                setTimeout(() => {
                    this.addSource({
                        id: Date.now(),
                        title: result.filename,
                        type: result.sourceType,
                        content: result.fullText,
                        preview: result.extractedText
                    });
                    this.hideProcessing();
                                    resolve(result);
                                }, 500);
            } else {
                                reject(new Error(result.error || 'Upload failed'));
                            }
                        } catch (error) {
                            this.progressFill.style.width = '0%';
                            this.progressPercent.textContent = '0%';
                            this.progressText.textContent = 'Upload failed';
                            reject(new Error('Failed to parse server response'));
                        }
                    } else {
                        this.progressFill.style.width = '0%';
                        this.progressPercent.textContent = '0%';
                        this.progressText.textContent = 'Upload failed';
                        reject(new Error(`Server error: ${xhr.status}`));
                    }
                });
                
                // Upload error
                xhr.addEventListener('error', () => {
                    this.progressFill.style.width = '0%';
                    this.progressPercent.textContent = '0%';
                    this.progressText.textContent = 'Upload failed';
                    reject(new Error('Network error during upload'));
                });
                
                // Upload timeout
                xhr.addEventListener('timeout', () => {
                    this.progressFill.style.width = '0%';
                    this.progressPercent.textContent = '0%';
                    this.progressText.textContent = 'Upload timed out';
                    reject(new Error('Upload timed out'));
                });
                
                // Start upload
                xhr.open('POST', '/upload');
                xhr.timeout = 300000; // 5 minute timeout
                xhr.send(formData);
            });
            
        } catch (error) {
            console.error('Upload error:', error);
            this.showError('Upload failed: ' + error.message);
            this.hideProcessing();
        }
    }
    
    // URL input handler
    async handleUrlInput() {
        const url = this.urlInput.value.trim();
        if (!url) {
            this.showError('Please enter a valid URL');
            return;
        }
        
        this.showProcessing('Processing URL...');
        
        try {
            const response = await fetch('/process-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.addSource({
                    id: Date.now(),
                    title: result.title,
                    type: result.sourceType,
                    content: result.fullText,
                    preview: result.extractedText,
                    url: result.url
                });
                this.urlInput.value = '';
                this.hideProcessing();
            } else {
                throw new Error(result.error || 'URL processing failed');
            }
            
        } catch (error) {
            console.error('URL processing error:', error);
            this.showError('URL processing failed: ' + error.message);
            this.hideProcessing();
        }
    }
    
    // Text input handler
    async handleTextInput() {
        const text = this.textInput.value.trim();
        const title = this.textTitle.value.trim();
        
        if (!text || text.length < 10) {
            this.showError('Please enter at least 10 characters of text');
            return;
        }
        
        try {
            this.showProcessing('Processing text...');
            
            const response = await fetch('/process-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, title })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.addSource({
                    id: Date.now(),
                    title: result.title,
                    type: result.sourceType,
                    content: result.fullText,
                    preview: result.extractedText
                });
                this.textInput.value = '';
                this.textTitle.value = '';
                this.hideProcessing();
            } else {
                throw new Error(result.error || 'Text processing failed');
            }
            
        } catch (error) {
            console.error('Text processing error:', error);
            this.showError('Text processing failed: ' + error.message);
            this.hideProcessing();
        }
    }
    
    // Source management
    addSource(source) {
        this.sources.push(source);
        this.updateSourcesList();
        this.updateContentPreview();
        this.sourcesManagementSection.style.display = 'block';
        this.closeModal(); // Close the modal after adding source
        
        // Show success message
        this.showSuccess(`Added ${source.type} source: ${source.title}`);
        
        // Clear form inputs
        this.clearFormInputs();
        
        // Scroll to sources section
        this.sourcesManagementSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    removeSource(sourceId) {
        this.sources = this.sources.filter(source => source.id !== sourceId);
        this.updateSourcesList();
        this.updateContentPreview();
        
        if (this.sources.length === 0) {
            this.sourcesManagementSection.style.display = 'none';
            this.flashcardsSection.style.display = 'none';
            this.summarySection.style.display = 'none';
        }
    }
    
    clearAllSources() {
        this.sources = [];
        this.combinedContent = '';
        this.updateSourcesList();
        this.updateContentPreview();
        this.sourcesManagementSection.style.display = 'none';
        this.flashcardsSection.style.display = 'none';
        this.summarySection.style.display = 'none';
    }
    
    updateSourcesList() {
        if (this.sources.length === 0) {
            this.sourcesManagementSection.style.display = 'none';
            return;
        }
        
        this.sourcesManagementSection.style.display = 'block';
        this.sourcesSelectionList.innerHTML = '';
        
        this.sources.forEach((source, index) => {
            const sourceItem = document.createElement('label');
            sourceItem.className = 'source-selection-item';
            
            // Calculate content size
            const contentSize = this.formatFileSize(source.content.length * 2);
            
            sourceItem.innerHTML = `
                <input type="checkbox" name="sourceSelection" value="${source.id}" ${index === 0 ? 'checked' : ''}>
                <span class="source-checkbox-custom"></span>
                <div class="source-item-info">
                    <div class="source-item-type ${source.type}">${source.type.toUpperCase()}</div>
                    <div class="source-item-details">
                        <h5>${source.title}</h5>
                        <p>${source.preview.substring(0, 120)}${source.preview.length > 120 ? '...' : ''}</p>
                        <p class="source-item-size">${contentSize}</p>
                    </div>
                </div>
                <div class="source-item-actions">
                    <button class="source-remove-btn" onclick="platform.removeSource(${source.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add click event for the entire item
            sourceItem.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') {
                    const checkbox = sourceItem.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    this.updateSelectionStyles();
                    this.updateContentPreview();
                }
            });
            
            this.sourcesSelectionList.appendChild(sourceItem);
        });
        
        // Add event listeners to checkboxes
        const checkboxes = this.sourcesSelectionList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateSelectionStyles();
                this.updateContentPreview();
            });
        });
        
        this.updateSelectionStyles();
        this.updateContentPreview();
    }
    
    updateSelectionStyles() {
        const items = this.sourcesSelectionList.querySelectorAll('.source-selection-item');
        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    getSelectedSources() {
        const selectedCheckboxes = this.sourcesSelectionList.querySelectorAll('input[name="sourceSelection"]:checked');
        const selectedSources = [];
        selectedCheckboxes.forEach(checkbox => {
            const selectedId = parseInt(checkbox.value);
            const selectedSource = this.sources.find(source => source.id === selectedId);
            if (selectedSource) {
                selectedSources.push(selectedSource);
            }
        });
        return selectedSources;
    }
    
    formatFileSize(bytes) {
        if (!bytes) return '0 B';
        
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    // Progress and UI helpers
    animateProgress(from, to, duration) {
        const start = Date.now();
        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = from + (to - from) * progress;
            
            this.progressFill.style.width = value + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
    
    showProcessing(message = 'Processing...') {
        this.progressText.textContent = message;
        this.processingProgress.style.display = 'block';
    }
    
    hideProcessing() {
        this.processingProgress.style.display = 'none';
        this.progressFill.style.width = '0%';
        this.progressPercent.textContent = '0%';
    }
    
    // AI generation methods
    async generateFlashcards() {
        const selectedSources = this.getSelectedSources();
        
        if (selectedSources.length === 0) {
            this.showError('Please select at least one source to generate flashcards.');
            return;
        }

        try {
            this.showLoading('Generating flashcards from selected sources...');
            
            const count = this.flashcardCount.value;
            const difficulty = this.difficulty.value;
            const customInstructions = this.customInstructions.value.trim();
            const saveAsDeck = this.saveAsDeck.checked;
            const deckName = this.deckName.value.trim();
            
            // Validate deck name if saving
            if (saveAsDeck && !deckName) {
                this.hideLoading();
                this.showError('Please enter a deck name to save flashcards.');
                this.deckName.focus();
                return;
            }
            
            // Combine all selected sources
            const content = selectedSources.map(source => 
                `=== ${source.title} (${source.type.toUpperCase()}) ===\n\n${source.content}\n\n`
            ).join('');
            
            const response = await fetch('/generate-flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    content, 
                    count, 
                    difficulty, 
                    type: 'flashcards',
                    customInstructions,
                    saveAsDeck,
                    deckName
                })
            });

            const result = await response.json();

            if (result.success) {
                this.flashcards = result.flashcards;
                this.currentCardIndex = 0;
                this.updateFlashcardDisplay();
                this.hideLoading();
                
                // Show success message
                if (result.deckId) {
                    this.showSuccess(`Generated ${result.totalCards} flashcards and saved as deck "${result.deckName}"! 
                        You can now study with spaced repetition in the My Decks section.`);
                    this.loadDecks(); // Refresh decks list
                    
                    // Reset save options
                    this.saveAsDeck.checked = false;
                    this.deckName.value = '';
                    this.deckNameInput.style.display = 'none';
                } else {
                    this.showSuccess(`Generated ${result.flashcards.length} flashcards from your selected sources!`);
                }
                
                this.showSection('flashcards');
            } else {
                this.hideLoading();
                this.showError(result.error || 'Failed to generate flashcards');
            }

        } catch (error) {
            console.error('Flashcard generation error:', error);
            this.hideLoading();
            this.showError('Failed to generate flashcards. Please try again.');
        }
    }
    
    async generateSummary() {
        const selectedSources = this.getSelectedSources();
        
        if (selectedSources.length === 0) {
            this.showError('Please select at least one source to generate a summary.');
            return;
        }

        try {
            this.showLoading('Generating summary from selected sources...');
            
            // Combine all selected sources
            const content = selectedSources.map(source => 
                `=== ${source.title} (${source.type.toUpperCase()}) ===\n\n${source.content}\n\n`
            ).join('');
            
            const response = await fetch('/generate-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    sourceCount: selectedSources.length
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showSummary(result.summary);
                this.hideLoading();
            } else {
                this.hideLoading();
                this.showError(result.error || 'Failed to generate summary');
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            this.hideLoading();
            this.showError('Failed to generate summary. Please try again.');
        }
    }
    
    // Display methods (keeping existing flashcard and summary logic)
    showFlashcards() {
        this.flashcardsSection.style.display = 'block';
        this.summarySection.style.display = 'none';
        
        this.updateFlashcardDisplay();
        this.updateNavigation();
        
        this.flashcardsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showSummary(summary) {
        this.summaryContent.innerHTML = this.formatSummary(summary);
        this.summarySection.style.display = 'block';
        this.flashcardsSection.style.display = 'none';
        
        this.summarySection.scrollIntoView({ behavior: 'smooth' });
    }
    
    formatSummary(summary) {
        return summary
            .replace(/#{3}\s*(.*)/g, '<h3>$1</h3>')
            .replace(/#{2}\s*(.*)/g, '<h2>$1</h2>')
            .replace(/#{1}\s*(.*)/g, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)/, '<p>$1')
            .replace(/(.*$)/, '$1</p>');
    }
    
    updateFlashcardDisplay() {
        if (this.flashcards.length === 0) return;
        
        const card = this.flashcards[this.currentCardIndex];
        this.questionText.textContent = card.question;
        this.answerText.textContent = card.answer;
        
        this.currentCard.textContent = this.currentCardIndex + 1;
        this.totalCards.textContent = this.flashcards.length;
        
        this.isFlipped = false;
        this.flashcard.classList.remove('flipped');
    }
    
    updateNavigation() {
        this.prevBtn.disabled = this.currentCardIndex === 0;
        this.nextBtn.disabled = this.currentCardIndex === this.flashcards.length - 1;
    }
    
    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.flashcard.classList.toggle('flipped');
    }
    
    previousCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.updateFlashcardDisplay();
            this.updateNavigation();
        }
    }
    
    nextCard() {
        if (this.currentCardIndex < this.flashcards.length - 1) {
            this.currentCardIndex++;
            this.updateFlashcardDisplay();
            this.updateNavigation();
        }
    }
    
    shuffleCards() {
        for (let i = this.flashcards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
        }
        
        this.currentCardIndex = 0;
        this.updateFlashcardDisplay();
        this.updateNavigation();
        
        this.shuffleBtn.innerHTML = '<i class="fas fa-check"></i> Shuffled!';
        setTimeout(() => {
            this.shuffleBtn.innerHTML = '<i class="fas fa-random"></i> Shuffle';
        }, 1500);
    }
    
    resetCards() {
        this.currentCardIndex = 0;
        this.updateFlashcardDisplay();
        this.updateNavigation();
        
        this.resetBtn.innerHTML = '<i class="fas fa-check"></i> Reset!';
        setTimeout(() => {
            this.resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset';
        }, 1500);
    }
    
    handleKeydown(e) {
        if (this.flashcardsSection.style.display !== 'block') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousCard();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextCard();
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                this.flipCard();
                break;
        }
    }
    
    handleFeedback(e) {
        const difficulty = e.currentTarget.dataset.difficulty;
        const card = this.flashcards[this.currentCardIndex];
        
        card.userFeedback = difficulty;
        
        e.currentTarget.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.currentTarget.style.transform = 'scale(1)';
        }, 150);
        
        setTimeout(() => {
            if (this.currentCardIndex < this.flashcards.length - 1) {
                this.nextCard();
            }
        }, 800);
    }
    
    showLoading(message = 'Processing...') {
        this.loadingText.textContent = message;
        this.loadingOverlay.style.display = 'flex';
    }
    
    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 5000);
    }
    
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    updateContentPreview() {
        const selectedSources = this.getSelectedSources();
        
        // Update stats
        this.selectedSourcesCount.textContent = selectedSources.length;
        
        if (selectedSources.length === 0) {
            this.combinedContentSize.textContent = '0';
            this.contentPreview.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No sources selected</p>';
            this.generateFlashcardsBtn.disabled = true;
            this.generateSummaryBtn.disabled = true;
            return;
        }

        // Combine all selected sources
        const combinedContent = selectedSources.map(source => 
            `=== ${source.title} (${source.type.toUpperCase()}) ===\n\n${source.content}\n\n`
        ).join('');

        this.combinedContent = combinedContent;
        this.combinedContentSize.textContent = this.formatFileSize(combinedContent.length * 2);
        
        // Update preview (limit to 1000 characters for display)
        const previewContent = combinedContent.substring(0, 1000);
        this.contentPreview.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <h5 style="margin: 0 0 10px 0; color: #333;">
                    Combined Sources Preview
                </h5>
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${previewContent}${combinedContent.length > 1000 ? '\n\n...' : ''}</p>
            </div>
        `;

        // Enable generation buttons
        this.generateFlashcardsBtn.disabled = false;
        this.generateSummaryBtn.disabled = false;
    }

    // Modal methods
    showModal() {
        this.addSourcesModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.addSourcesModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetUploadForm();
    }

    resetUploadForm() {
        this.fileInput.value = '';
        this.urlInput.value = '';
        this.textInput.value = '';
        this.textTitle.value = '';
        this.processingProgress.style.display = 'none';
        this.progressFill.style.width = '0%';
    }

    // File upload methods
    handleFileUpload() {
        const file = this.fileInput.files[0];
        if (file) {
            this.uploadFile(file);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea.classList.add('drag-over');
    }

    handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.uploadFile(files[0]);
        }
    }

    // URL processing methods
    async handleUrlSubmit() {
        const url = this.urlInput.value.trim();
        if (!url) {
            this.showError('Please enter a URL');
            return;
        }

        try {
            this.showProcessingProgress('Extracting content from website...');
            
            const response = await fetch('/process-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const result = await response.json();

            if (result.success) {
                this.addSource(result);
                this.hideModal();
                this.showSuccess(`Successfully added website: ${result.title}`);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('URL processing error:', error);
            this.showError('Failed to process URL');
        } finally {
            this.hideProcessingProgress();
        }
    }

    // Text processing methods
    async handleTextSubmit() {
        const text = this.textInput.value.trim();
        const title = this.textTitle.value.trim() || 'Direct Text Input';
        
        if (!text) {
            this.showError('Please enter some text content');
            return;
        }

        try {
            this.showProcessingProgress('Processing text content...');
            
            const response = await fetch('/process-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, title })
            });

            const result = await response.json();

            if (result.success) {
                this.addSource(result);
                this.hideModal();
                this.showSuccess(`Successfully added text: ${result.title}`);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Text processing error:', error);
            this.showError('Failed to process text');
        } finally {
            this.hideProcessingProgress();
        }
    }

    // Utility methods
    showProcessingProgress(message) {
        this.processingProgress.style.display = 'block';
        this.progressText.textContent = message;
        this.progressFill.style.width = '50%';
    }

    hideProcessingProgress() {
        this.processingProgress.style.display = 'none';
        this.progressFill.style.width = '0%';
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            max-width: 400px;
            z-index: 10002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Keyboard shortcuts
    handleKeyboard(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case 'ArrowLeft':
                if (this.flashcardsSection.style.display !== 'none') {
                    this.previousCard();
                }
                break;
            case 'ArrowRight':
                if (this.flashcardsSection.style.display !== 'none') {
                    this.nextCard();
                }
                break;
            case ' ':
                e.preventDefault();
                if (this.flashcardsSection.style.display !== 'none') {
                    this.flipCard();
                } else if (this.studySessionSection.style.display !== 'none') {
                    this.studyCard.classList.toggle('flipped');
                }
                break;
            case 'Escape':
                this.hideModal();
                break;
        }
    }

    // Add missing method
    submitFeedback(difficulty) {
        // For regular flashcards (not study mode)
        console.log('Feedback:', difficulty);
    }

    // Navigation methods
    showSection(section) {
        // Hide all sections
        this.sourcesManagementSection.style.display = 'none';
        this.flashcardsSection.style.display = 'none';
        this.deckLibrarySection.style.display = 'none';
        this.studySessionSection.style.display = 'none';
        this.summarySection.style.display = 'none';
        
        // Hide add sources button when not on sources page
        const addSourcesSection = document.querySelector('.add-sources-section');
        if (addSourcesSection) {
            addSourcesSection.style.display = 'none';
        }
        
        // Update navigation active states
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        switch (section) {
            case 'sources':
                this.sourcesNav.classList.add('active');
                if (this.sources.length > 0) {
                    this.sourcesManagementSection.style.display = 'block';
                } else {
                    if (addSourcesSection) addSourcesSection.style.display = 'block';
                }
                break;
                
            case 'flashcards':
                this.flashcardsNav.classList.add('active');
                if (this.flashcards.length > 0) {
                    this.flashcardsSection.style.display = 'block';
                } else {
                    this.showError('No flashcards available. Please generate some first.');
                    this.showSection('sources');
                }
                break;
                
            case 'decks':
                this.decksNav.classList.add('active');
                this.deckLibrarySection.style.display = 'block';
                this.loadDecks();
                break;
                
            case 'study':
                this.studySessionSection.style.display = 'block';
                break;
                
            case 'summary':
                this.summarySection.style.display = 'block';
                break;
                
            case 'progress':
                this.progressNav.classList.add('active');
                this.showError('Progress tracking coming soon!');
                this.showSection('sources');
                break;
        }
    }

    // Deck management methods
    async loadDecks() {
        try {
            const response = await fetch('/api/decks');
            const result = await response.json();
            
            if (result.success) {
                this.decks = result.decks;
                this.renderDecks();
            } else {
                this.showError('Failed to load decks: ' + result.error);
            }
        } catch (error) {
            console.error('Error loading decks:', error);
            this.showError('Failed to load decks');
        }
    }
    
    renderDecks() {
        if (this.decks.length === 0) {
            this.decksGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-book-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No Decks Yet</h3>
                    <p>Generate some flashcards and save them as a deck to get started!</p>
                </div>
            `;
            return;
        }
        
        this.decksGrid.innerHTML = this.decks.map(deck => `
            <div class="deck-card" data-deck-id="${deck.id}">
                <div class="deck-header">
                    <h4 class="deck-title">${deck.name}</h4>
                    <div class="deck-menu">
                        <button class="deck-menu-btn" onclick="event.stopPropagation(); learningPlatform.deleteDeck('${deck.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${deck.description}</p>
                
                <div class="deck-stats">
                    <div class="stat-item">
                        <span class="stat-number">${deck.totalCards}</span>
                        <span class="stat-label">Total</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${deck.newCards}</span>
                        <span class="stat-label">New</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${deck.reviewCards}</span>
                        <span class="stat-label">Review</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${deck.dueCards}</span>
                        <span class="stat-label">Due</span>
                    </div>
                </div>
                
                <div class="deck-actions">
                    <button class="deck-btn primary" onclick="learningPlatform.startStudySession('${deck.id}')">
                        <i class="fas fa-play"></i>
                        Study ${deck.dueCards > 0 ? `(${deck.dueCards})` : ''}
                    </button>
                    <button class="deck-btn secondary" onclick="learningPlatform.viewDeck('${deck.id}')">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                </div>
                
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #999;">
                    Created: ${new Date(deck.createdAt).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }
    
    async deleteDeck(deckId) {
        if (!confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/decks/${deckId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Deck deleted successfully');
                this.loadDecks(); // Reload decks
            } else {
                this.showError('Failed to delete deck: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting deck:', error);
            this.showError('Failed to delete deck');
        }
    }
    
    async viewDeck(deckId) {
        try {
            console.log('Attempting to view deck:', deckId);
            this.showLoading('Loading deck...');
            
            const response = await fetch(`/api/decks/${deckId}`);
            const result = await response.json();
            
            console.log('Deck response:', result);
            
            if (result.success) {
                this.currentDeck = result.deck;
                this.flashcards = this.currentDeck.cards.map(card => ({
                    question: card.question,
                    answer: card.answer
                }));
                console.log('Loaded flashcards:', this.flashcards.length);
                
                this.currentCardIndex = 0;
                this.updateFlashcardDisplay();
                this.hideLoading();
                this.showSection('flashcards');
                this.showSuccess(`Loaded deck "${this.currentDeck.name}" with ${this.flashcards.length} cards`);
            } else {
                this.hideLoading();
                this.showError('Failed to load deck: ' + result.error);
            }
        } catch (error) {
            console.error('Error loading deck:', error);
            this.hideLoading();
            this.showError('Failed to load deck: ' + error.message);
        }
    }

    // Study session methods
    async startStudySession(deckId, maxCards = 20) {
        try {
            console.log('Starting study session for deck:', deckId);
            this.showLoading('Starting study session...');
            
            const response = await fetch(`/api/study/${deckId}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ maxCards })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Study session response:', result);
            
            if (result.success) {
                this.currentSession = {
                    id: result.sessionId,
                    deckId: deckId,
                    totalCards: result.totalCards,
                    currentCard: 0,
                    startTime: new Date()
                };
                
                if (result.totalCards === 0) {
                    this.hideLoading();
                    this.showError('No cards due for review in this deck.');
                    return;
                }
                
                // Find deck name for display
                const deck = this.decks.find(d => d.id === deckId);
                this.studyDeckTitle.textContent = `🎯 Studying: ${deck ? deck.name : 'Unknown Deck'}`;
                
                this.hideLoading();
                this.showSection('study');
                this.loadNextStudyCard();
                this.showSuccess(`Starting study session with ${result.totalCards} cards`);
            } else {
                this.hideLoading();
                this.showError('Failed to start study session: ' + result.error);
            }
        } catch (error) {
            console.error('Error starting study session:', error);
            this.hideLoading();
            this.showError('Failed to start study session: ' + error.message);
        }
    }
    
    async loadNextStudyCard() {
        try {
            const response = await fetch(`/api/study/${this.currentSession.id}/next`);
            const result = await response.json();
            
            if (result.success) {
                if (result.completed) {
                    this.showStudyComplete(result.stats);
                    return;
                }
                
                this.currentStudyCard = result.card;
                this.updateStudyDisplay();
                this.updateStudyProgress(result.progress);
            } else {
                this.showError('Failed to load next card: ' + result.error);
            }
        } catch (error) {
            console.error('Error loading next card:', error);
            this.showError('Failed to load next card');
        }
    }
    
    updateStudyDisplay() {
        this.studyQuestionText.textContent = this.currentStudyCard.question;
        this.studyAnswerText.textContent = this.currentStudyCard.answer;
        
        // Reset card to front side
        this.studyCard.classList.remove('flipped');
        
        // Add click handler to flip card
        this.studyCard.onclick = () => {
            this.studyCard.classList.toggle('flipped');
        };
        
        // Update rating buttons event listeners
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.onclick = () => this.rateCard(parseInt(btn.dataset.rating));
        });
    }
    
    updateStudyProgress(progress) {
        const percentage = progress.percentage;
        this.studyProgressFill.style.width = percentage + '%';
        this.studyProgressText.textContent = `Card ${progress.current} of ${progress.total}`;
        this.studyProgressPercent.textContent = percentage + '%';
    }
    
    async rateCard(rating) {
        try {
            const studyTime = Date.now() - (this.cardStartTime || Date.now());
            this.cardStartTime = Date.now();
            
            const response = await fetch(`/api/study/${this.currentSession.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    rating: rating,
                    studyTime: Math.round(studyTime / 1000) // Convert to seconds
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show brief feedback
                this.showRatingFeedback(rating, result);
                
                // Load next card after a short delay
                setTimeout(() => {
                    if (result.completed) {
                        this.showStudyComplete();
                    } else {
                        this.loadNextStudyCard();
                    }
                }, 1000);
            } else {
                this.showError('Failed to record rating: ' + result.error);
            }
        } catch (error) {
            console.error('Error rating card:', error);
            this.showError('Failed to record rating');
        }
    }
    
    showRatingFeedback(rating, result) {
        const messages = {
            1: 'Again - Try again soon',
            2: 'Hard - Will review sooner',
            3: 'Good - Nice job!',
            4: 'Easy - Perfect!'
        };
        
        const colors = {
            1: '#dc3545',
            2: '#ffc107', 
            3: '#28a745',
            4: '#17a2b8'
        };
        
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${colors[rating]};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10001;
            animation: fadeInOut 1s ease;
        `;
        feedback.textContent = messages[rating];
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 1000);
    }
    
    showStudyComplete(stats) {
        const sessionTime = Date.now() - this.currentSession.startTime.getTime();
        const sessionMinutes = Math.round(sessionTime / 60000);
        
        this.studyCard.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: white;">
                <i class="fas fa-trophy" style="font-size: 4rem; margin-bottom: 1rem; color: #ffd700;"></i>
                <h2>Study Session Complete!</h2>
                <div style="margin: 2rem 0;">
                    <div style="margin-bottom: 1rem;">
                        <strong>Time Studied:</strong> ${sessionMinutes} minutes
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <strong>Cards Reviewed:</strong> ${this.currentSession.totalCards}
                    </div>
                </div>
                <button onclick="learningPlatform.endStudySession()" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 1rem;
                ">
                    Return to Decks
                </button>
            </div>
        `;
    }
    
    endStudySession() {
        this.currentSession = null;
        this.currentDeck = null;
        this.studyStartTime = null;
        this.showSection('decks');
    }
    
    // Save to Deck Modal Methods
    showSaveToDeckModal() {
        if (!this.flashcards || this.flashcards.length === 0) {
            this.showError('No flashcards available to save. Please generate flashcards first.');
            return;
        }
        
        // Reset modal form
        this.saveDeckName.value = '';
        this.saveDeckDescription.value = '';
        this.saveFlashcardCount.textContent = this.flashcards.length;
        
        // Show modal
        this.saveToDeckModal.style.display = 'flex';
        this.saveDeckName.focus();
    }
    
    hideSaveToDeckModal() {
        this.saveToDeckModal.style.display = 'none';
    }
    
    async saveFlashcardsToDeck() {
        const deckName = this.saveDeckName.value.trim();
        const deckDescription = this.saveDeckDescription.value.trim();
        
        if (!deckName) {
            this.showError('Please enter a deck name.');
            this.saveDeckName.focus();
            return;
        }
        
        if (!this.flashcards || this.flashcards.length === 0) {
            this.showError('No flashcards available to save.');
            this.hideSaveToDeckModal();
            return;
        }
        
        try {
            this.showLoading('Saving flashcards to deck...');
            
            const response = await fetch('/save-flashcards-to-deck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    flashcards: this.flashcards,
                    deckName: deckName,
                    deckDescription: deckDescription,
                    difficulty: this.difficulty.value
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.hideLoading();
                this.hideSaveToDeckModal();
                this.showSuccess(`Successfully saved ${result.totalCards} flashcards to deck "${result.deckName}"! You can now study with spaced repetition in the My Decks section.`);
                this.loadDecks(); // Refresh decks list
            } else {
                this.hideLoading();
                this.showError(result.error || 'Failed to save flashcards to deck');
            }
            
        } catch (error) {
            console.error('Error saving flashcards to deck:', error);
            this.hideLoading();
            this.showError('Failed to save flashcards to deck. Please try again.');
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application and make it globally accessible
let platform;
let learningPlatform; // Add this for HTML compatibility
document.addEventListener('DOMContentLoaded', () => {
    platform = new AILearningPlatform();
    learningPlatform = platform; // Make it accessible as learningPlatform too
    window.platform = platform; // Also make it accessible globally
    window.learningPlatform = learningPlatform; // And this too
}); 