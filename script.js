// =========================================================
// Zen Sudoku — Game Logic
// (Arayüz/tasarım orijinaliyle aynıdır; bu dosyada animasyon
//  kancaları eklendi ve birkaç davranış hatası düzeltildi.)
// =========================================================

// --- TRANSLATIONS DICTIONARY ---
const translations = {
    tr: {
        logo_title: "Zen Sudoku",
        logo_subtitle: "Zihnini Odakla, Çözümü Bul",
        difficulty_title: "Zorluk Seviyesi",
        diff_easy: "Kolay",
        diff_medium: "Orta",
        diff_hard: "Zor",
        mistakes_label: "Hatalar:",
        paused_title: "Oyun Duraklatıldı",
        paused_subtitle: "Zaman donduruldu. Devam etmek için tıkla.",
        resume_btn: "Devam Et",
        control_undo: "Geri Al",
        control_erase: "Sil",
        control_notes_on: "Not Al (Açık)",
        control_notes_off: "Not Al (Kapalı)",
        control_hint: "İpucu",
        new_game_btn: "Yeni Oyun Oluştur",
        numbers_title: "Sayı Seçimi",
        stats_title: "İstatistiklerin",
        stats_games_won: "Tamamlanan Oyunlar",
        stats_best_time_label: "En İyi Süre",
        help_title: "Sudoku Nasıl Oynanır?",
        help_rule_header: "Temel Kural:",
        help_rule_body: "9x9 boyutundaki ızgaranın her satırında, her sütununda ve her 3x3'lük alt kutusunda (blok) 1'den 9'a kadar olan sayılar sadece bir kez yer almalıdır.",
        help_li1: "Boş bir kareye tıklayarak seçin.",
        help_li2: "Sayı tuşlarını kullanarak rakamı yerleştirin.",
        help_li3: "Not Al: Bir kareden emin değilseniz not modunu açıp aday sayıları ekleyebilirsiniz.",
        help_li4: "Hata Sınırı: En fazla 3 hata yapma hakkınız vardır.",
        help_li5: "İpuçları: Her el en fazla 3 ipucu kullanabilirsiniz.",
        help_ok_btn: "Anladım, Oyuna Dön",
        modal_time: "Süre",
        modal_mistakes: "Hatalar",
        modal_action_btn: "Yeni Oyun Başlat",
        footer_text: "Tüm hakları saklıdır.",
        win_title: "Tebrikler, Kazandın!",
        win_desc: "Zekanı ve sabrını konuşturarak bu zorlu bulmacayı tamamladın!",
        gameover_title: "Oyun Bitti!",
        gameover_desc: "3 hata sınırına ulaştın. Tekrar dene ve zihnini geliştir!"
    },
    en: {
        logo_title: "Zen Sudoku",
        logo_subtitle: "Focus Your Mind, Solve the Puzzle",
        difficulty_title: "Difficulty Level",
        diff_easy: "Easy",
        diff_medium: "Medium",
        diff_hard: "Hard",
        mistakes_label: "Mistakes:",
        paused_title: "Game Paused",
        paused_subtitle: "Time is frozen. Click to resume.",
        resume_btn: "Resume",
        control_undo: "Undo",
        control_erase: "Erase",
        control_notes_on: "Notes (On)",
        control_notes_off: "Notes (Off)",
        control_hint: "Hint",
        new_game_btn: "Create New Game",
        numbers_title: "Number Selection",
        stats_title: "Your Statistics",
        stats_games_won: "Games Won",
        stats_best_time_label: "Best Time",
        help_title: "How to Play Sudoku?",
        help_rule_header: "Basic Rule:",
        help_rule_body: "Every row, column, and 3x3 subgrid (block) of a 9x9 grid must contain the numbers 1 through 9 exactly once.",
        help_li1: "Click any empty square to select it.",
        help_li2: "Enter numbers using the keypad or keyboard.",
        help_li3: "Notes: If you are not sure, toggle Notes mode to add candidate numbers.",
        help_li4: "Mistake Limit: You have a maximum of 3 mistakes.",
        help_li5: "Hints: You can use up to 3 hints per game.",
        help_ok_btn: "Got it, Back to Game",
        modal_time: "Time",
        modal_mistakes: "Mistakes",
        modal_action_btn: "Start New Game",
        footer_text: "All rights reserved.",
        win_title: "Congratulations, You Won!",
        win_desc: "You completed this challenging puzzle with your intelligence and patience!",
        gameover_title: "Game Over!",
        gameover_desc: "You reached the limit of 3 mistakes. Try again to sharpen your mind!"
    }
};

// --- SUDOKU GENERATION & SOLVING ENGINE ---
class SudokuGenerator {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
    }

    isValid(row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (this.grid[row][x] === num || this.grid[x][col] === num) return false;
        }
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    fillGrid() {
        let row = 0;
        let col = 0;
        let emptyCellFound = false;
        for (let i = 0; i < 81; i++) {
            row = Math.floor(i / 9);
            col = i % 9;
            if (this.grid[row][col] === 0) {
                emptyCellFound = true;
                break;
            }
        }

        if (!emptyCellFound) return true;

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

        for (let num of numbers) {
            if (this.isValid(row, col, num)) {
                this.grid[row][col] = num;
                if (this.fillGrid()) return true;
                this.grid[row][col] = 0;
            }
        }
        return false;
    }

    generate() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillGrid();
        return this.grid;
    }

    createPuzzle(solvedGrid, difficulty = 'medium') {
        const puzzle = solvedGrid.map(row => [...row]);
        let cellsToRemove = 40; // Default Medium

        if (difficulty === 'easy') cellsToRemove = 30;
        if (difficulty === 'hard') cellsToRemove = 52;

        let attempts = cellsToRemove;
        while (attempts > 0) {
            const cellIndex = Math.floor(Math.random() * 81);
            const row = Math.floor(cellIndex / 9);
            const col = cellIndex % 9;

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                attempts--;
            }
        }
        return puzzle;
    }
}

// --- APP STATE ---
const state = {
    language: 'tr',
    solvedBoard: [],
    currentBoard: [],
    initialBoard: [],
    notesBoard: Array(81).fill(null).map(() => []),
    history: [],
    selectedCell: null,
    difficulty: 'medium',
    notesMode: false,
    mistakes: 0,
    maxMistakes: 3,
    hintsLeft: 3,
    maxHints: 3,
    secondsElapsed: 0,
    timerInterval: null,
    isPaused: false,
    justGenerated: false,
    stats: {
        gamesWon: 0,
        bestTimes: { easy: '--:--', medium: '--:--', hard: '--:--' }
    }
};

const generator = new SudokuGenerator();

// DOM elements cache
const gridContainer = document.getElementById('sudoku-grid');
const timerEl = document.getElementById('timer');
const mistakesEl = document.getElementById('mistakes-count');
const difficultyBadge = document.getElementById('difficulty-badge');
const notesIndicator = document.getElementById('notes-indicator');
const notesBtn = document.getElementById('notes-btn');
const notesText = document.getElementById('notes-text');
const pauseOverlay = document.getElementById('pause-overlay');
const resumeBtn = document.getElementById('resume-btn');
const pauseBtn = document.getElementById('pause-btn');
const pauseIcon = document.getElementById('pause-icon');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const closeHelpBtn = document.getElementById('close-help-btn');
const helpModalOk = document.getElementById('help-modal-ok');
const statusModal = document.getElementById('status-modal');
const modalIconContainer = document.getElementById('modal-icon-container');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTimeSpent = document.getElementById('modal-time-spent');
const modalErrorsMade = document.getElementById('modal-errors-made');
const modalActionBtn = document.getElementById('modal-action-btn');
const langSelect = document.getElementById('lang-select');

// --- App Initialization and Setup ---
function initApp() {
    detectAndSetLanguage();
    loadStats();
    setupTheme();
    bindEvents();

    const saved = loadSavedGame();
    if (saved) {
        restoreGame(saved);
    } else {
        startNewGame();
    }
}

// --- SAVED GAME (progress persisted in localStorage) ---
const SAVE_KEY = 'sudoku_zen_saved_game';

function saveGameProgress() {
    try {
        const payload = {
            solvedBoard: state.solvedBoard,
            initialBoard: state.initialBoard,
            currentBoard: state.currentBoard,
            notesBoard: state.notesBoard,
            history: state.history,
            difficulty: state.difficulty,
            mistakes: state.mistakes,
            secondsElapsed: state.secondsElapsed,
            hintsLeft: state.hintsLeft,
            notesMode: state.notesMode,
            selectedCell: state.selectedCell,
            savedAt: Date.now()
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    } catch (e) {
        // localStorage dolu ya da erişilemiyor olabilir; sessizce yoksay.
    }
}

function clearSavedGame() {
    try {
        localStorage.removeItem(SAVE_KEY);
    } catch (e) {}
}

function loadSavedGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || !Array.isArray(data.solvedBoard) || data.solvedBoard.length !== 81) return null;
        if (!Array.isArray(data.currentBoard) || data.currentBoard.length !== 81) return null;

        // Zaten çözülmüş bir bulmaca kaydedilmişse yeni oyuna geç.
        const alreadySolved = data.solvedBoard.every((v, i) => v === data.currentBoard[i]);
        if (alreadySolved) return null;

        return data;
    } catch (e) {
        return null;
    }
}

function restoreGame(data) {
    clearInterval(state.timerInterval);

    state.solvedBoard = data.solvedBoard;
    state.initialBoard = data.initialBoard;
    state.currentBoard = data.currentBoard;
    state.notesBoard = Array.isArray(data.notesBoard) ? data.notesBoard : Array(81).fill(null).map(() => []);
    state.history = Array.isArray(data.history) ? data.history : [];
    state.difficulty = data.difficulty === 'easy' || data.difficulty === 'hard' ? data.difficulty : 'medium';
    state.mistakes = data.mistakes || 0;
    state.secondsElapsed = data.secondsElapsed || 0;
    state.hintsLeft = typeof data.hintsLeft === 'number' ? data.hintsLeft : state.maxHints;
    state.notesMode = !!data.notesMode;
    state.selectedCell = typeof data.selectedCell === 'number' ? data.selectedCell : null;
    state.isPaused = false;
    state.justGenerated = false;

    // Zorluk seçici butonlarının görünümünü kaydedilen zorlukla eşitle
    document.querySelectorAll('.diff-selector').forEach(b => {
        if (b.dataset.diff === state.difficulty) {
            b.className = "diff-selector py-2 px-3 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900";
        } else {
            b.className = "diff-selector py-2 px-3 rounded-xl text-xs font-bold border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50";
        }
    });

    updateDifficultyBadge();
    updateNotesUI();

    mistakesEl.innerText = `${state.mistakes} / ${state.maxMistakes}`;
    if (state.mistakes >= state.maxMistakes - 1) {
        mistakesEl.classList.add('mistakes-warning');
    } else {
        mistakesEl.classList.remove('mistakes-warning');
    }
    timerEl.innerText = formatTime(state.secondsElapsed);

    pauseOverlay.classList.add('hidden');
    pauseOverlay.style.opacity = '0';
    pauseIcon.className = "fa-solid fa-pause";

    updateHintButtonUI();
    renderBoard();
    startTimer();
}

// Auto Language Detection
function detectAndSetLanguage() {
    const savedLang = localStorage.getItem('sudoku_lang');
    if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
        state.language = savedLang;
    } else {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang && userLang.toLowerCase().startsWith('tr')) {
            state.language = 'tr';
        } else {
            state.language = 'en';
        }
    }
    langSelect.value = state.language;
    applyTranslations();
}

// Apply selected language translations to all elements with data-translate attribute
function applyTranslations() {
    const currentTranslations = translations[state.language];

    document.querySelectorAll('[data-translate]').forEach(el => {
        const translationKey = el.getAttribute('data-translate');
        if (currentTranslations[translationKey]) {
            el.innerText = currentTranslations[translationKey];
        }
    });

    updateNotesUI();
    updateDifficultyBadge();
    updateStatsUI();
    updateHintButtonUI();
}

// --- STATS (per-difficulty best time, with migration from the old single-value format) ---
function loadStats() {
    const savedStats = localStorage.getItem('sudoku_zen_stats');
    if (savedStats) {
        const parsed = JSON.parse(savedStats);
        if (parsed && parsed.bestTimes) {
            state.stats = parsed;
        } else if (parsed) {
            // Migrate legacy format { gamesWon, bestTime } -> per-difficulty
            state.stats = {
                gamesWon: parsed.gamesWon || 0,
                bestTimes: {
                    easy: '--:--',
                    medium: parsed.bestTime || '--:--',
                    hard: '--:--'
                }
            };
        }
        updateStatsUI();
    }
}

function saveStats() {
    localStorage.setItem('sudoku_zen_stats', JSON.stringify(state.stats));
    updateStatsUI();
}

function updateStatsUI() {
    document.getElementById('stats-games-won').innerText = state.stats.gamesWon;

    const bestTimeLabel = document.getElementById('stats-best-time-label');
    const diffKey = state.difficulty === 'easy' ? 'diff_easy' : state.difficulty === 'hard' ? 'diff_hard' : 'diff_medium';
    const diffLabel = translations[state.language][diffKey];
    bestTimeLabel.innerText = `${translations[state.language].stats_best_time_label} (${diffLabel})`;
    document.getElementById('stats-best-time').innerText = state.stats.bestTimes[state.difficulty] || '--:--';
}

// --- THEME ---
function setupTheme() {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeIcon.className = 'fa-solid fa-sun text-lg text-amber-400';
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.className = 'fa-solid fa-moon text-lg';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        themeIcon.className = 'fa-solid fa-moon text-lg theme-icon-spin';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.className = 'fa-solid fa-sun text-lg text-amber-400 theme-icon-spin';
    }
    themeIcon.addEventListener('animationend', () => {
        themeIcon.classList.remove('theme-icon-spin');
    }, { once: true });
}

// --- MODAL HELPERS (animated open/close) ---
function showModal(modalEl) {
    modalEl.classList.remove('hidden');
    // Force a reflow so the transition triggers on the next frame
    void modalEl.offsetWidth;
    requestAnimationFrame(() => modalEl.classList.remove('is-hidden'));
}

function hideModal(modalEl) {
    modalEl.classList.add('is-hidden');
    setTimeout(() => modalEl.classList.add('hidden'), 260);
}

function isAnyModalOpen() {
    return !helpModal.classList.contains('hidden') || !statusModal.classList.contains('hidden');
}

// --- EVENTS ---
function bindEvents() {
    langSelect.addEventListener('change', (e) => {
        state.language = e.target.value;
        localStorage.setItem('sudoku_lang', state.language);
        applyTranslations();
    });

    // Difficulty selectors (border width reserved via CSS so nothing jumps on selection)
    document.querySelectorAll('.diff-selector').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.diff-selector').forEach(b => {
                b.className = "diff-selector py-2 px-3 rounded-xl text-xs font-bold border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50";
            });
            e.currentTarget.className = "diff-selector py-2 px-3 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900";
            state.difficulty = e.currentTarget.dataset.diff;
            updateStatsUI();
        });
    });

    document.getElementById('new-game-btn').addEventListener('click', () => startNewGame());
    document.getElementById('undo-btn').addEventListener('click', undoAction);
    document.getElementById('erase-btn').addEventListener('click', eraseCell);
    notesBtn.addEventListener('click', toggleNotesMode);
    document.getElementById('hint-btn').addEventListener('click', giveHint);

    document.querySelectorAll('.num-pad-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            inputNumber(parseInt(e.currentTarget.dataset.num));
        });
    });

    document.addEventListener('keydown', handleKeyPress);

    pauseBtn.addEventListener('click', togglePause);
    resumeBtn.addEventListener('click', togglePause);

    themeToggle.addEventListener('click', toggleTheme);

    helpBtn.addEventListener('click', () => showModal(helpModal));
    closeHelpBtn.addEventListener('click', () => hideModal(helpModal));
    helpModalOk.addEventListener('click', () => hideModal(helpModal));
    // Click on the dark backdrop closes the help modal (status modal stays deliberate)
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) hideModal(helpModal);
    });

    modalActionBtn.addEventListener('click', () => {
        hideModal(statusModal);
        startNewGame();
    });
}

function handleKeyPress(e) {
    if (state.isPaused) return;

    // Escape closes an open modal instead of leaking keystrokes into the game
    if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) hideModal(helpModal);
        return;
    }

    // Ignore game input while any modal is open
    if (isAnyModalOpen()) return;

    if (e.key >= '1' && e.key <= '9') {
        inputNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        eraseCell();
    } else if (e.key.toLowerCase() === 'n') {
        toggleNotesMode();
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (state.selectedCell === null) {
            selectCell(0);
            return;
        }
        let index = state.selectedCell;
        let row = Math.floor(index / 9);
        let col = index % 9;

        if (e.key === 'ArrowUp' && row > 0) row--;
        if (e.key === 'ArrowDown' && row < 8) row++;
        if (e.key === 'ArrowLeft' && col > 0) col--;
        if (e.key === 'ArrowRight' && col < 8) col++;

        selectCell(row * 9 + col);
    }
}

// --- GAME FLOW ---
function startNewGame() {
    clearInterval(state.timerInterval);

    state.solvedBoard = generator.generate().flat();
    state.initialBoard = generator.createPuzzle(chunk(state.solvedBoard, 9), state.difficulty).flat();
    state.currentBoard = [...state.initialBoard];
    state.notesBoard = Array(81).fill(null).map(() => []);
    state.history = [];
    state.selectedCell = null;
    state.mistakes = 0;
    state.secondsElapsed = 0;
    state.isPaused = false;
    state.notesMode = false;
    state.hintsLeft = state.maxHints;
    state.justGenerated = true;

    updateDifficultyBadge();
    updateNotesUI();

    mistakesEl.innerText = `${state.mistakes} / ${state.maxMistakes}`;
    mistakesEl.classList.remove('mistakes-warning');
    timerEl.innerText = "00:00";

    pauseOverlay.classList.add('hidden');
    pauseIcon.className = "fa-solid fa-pause";

    updateHintButtonUI();
    renderBoard();
    startTimer();
    saveGameProgress();
}

function updateDifficultyBadge() {
    let difficultyText = '';
    if (state.difficulty === 'easy') {
        difficultyText = translations[state.language].diff_easy;
        difficultyBadge.className = "text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 transition-colors";
    } else if (state.difficulty === 'medium') {
        difficultyText = translations[state.language].diff_medium;
        difficultyBadge.className = "text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 transition-colors";
    } else {
        difficultyText = translations[state.language].diff_hard;
        difficultyBadge.className = "text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 transition-colors";
    }
    difficultyBadge.innerText = difficultyText;
}

function updateHintButtonUI() {
    const hintText = document.getElementById('hint-text');
    const hintBtn = document.getElementById('hint-btn');
    if (hintText && hintBtn) {
        const hintWord = translations[state.language].control_hint;
        hintText.innerText = `${hintWord} (${state.hintsLeft})`;
        if (state.hintsLeft <= 0) {
            hintBtn.disabled = true;
            hintBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            hintBtn.disabled = false;
            hintBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

function renderBoard() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cellVal = state.currentBoard[i];
        const initVal = state.initialBoard[i];
        const cellNotes = state.notesBoard[i];

        const cellElement = document.createElement('div');
        cellElement.dataset.index = i;
        cellElement.className = getCellClasses(i, cellVal, initVal);

        if (state.justGenerated) {
            cellElement.classList.add('cell-enter');
            cellElement.style.animationDelay = `${(i % 9) * 12 + Math.floor(i / 9) * 12}ms`;
        }

        if (cellVal !== 0) {
            const valSpan = document.createElement('span');
            valSpan.className = "text-xl md:text-2xl font-bold value-enter";
            valSpan.innerText = cellVal;
            cellElement.appendChild(valSpan);
        } else if (cellNotes.length > 0) {
            const notesGrid = document.createElement('div');
            notesGrid.className = "grid grid-cols-3 gap-[1px] w-full h-full p-[2px] pointer-events-none notes-enter";
            for (let n = 1; n <= 9; n++) {
                const noteCell = document.createElement('div');
                noteCell.className = "text-[9px] leading-none text-slate-400 dark:text-slate-500 font-semibold flex items-center justify-center";
                noteCell.innerText = cellNotes.includes(n) ? n : '';
                notesGrid.appendChild(noteCell);
            }
            cellElement.appendChild(notesGrid);
        }

        cellElement.addEventListener('click', () => selectCell(i));
        gridContainer.appendChild(cellElement);
    }
    state.justGenerated = false;
}

function getCellClasses(index, val, initVal) {
    let classes = "relative flex items-center justify-center aspect-square cursor-pointer select-none bg-white dark:bg-slate-800 ";

    const row = Math.floor(index / 9);
    const col = index % 9;

    if (col === 2 || col === 5) classes += "border-r-2 border-slate-800 dark:border-slate-600 ";
    if (row === 2 || row === 5) classes += "border-b-2 border-slate-800 dark:border-slate-600 ";

    const selectedIdx = state.selectedCell;
    if (selectedIdx !== null) {
        const selRow = Math.floor(selectedIdx / 9);
        const selCol = selectedIdx % 9;

        if (index === selectedIdx) {
            classes += "bg-indigo-100 dark:bg-indigo-900/60 ring-2 ring-indigo-500 ring-inset ";
        } else if (row === selRow || col === selCol || (Math.floor(row / 3) === Math.floor(selRow / 3) && Math.floor(col / 3) === Math.floor(selCol / 3))) {
            classes += "bg-indigo-50/50 dark:bg-slate-700/30 ";
        }
    }

    if (selectedIdx !== null && val !== 0 && val === state.currentBoard[selectedIdx] && index !== selectedIdx) {
        classes += "bg-indigo-100/75 dark:bg-indigo-900/40 font-black ";
    }

    if (initVal !== 0) {
        classes += "text-slate-800 dark:text-slate-100 font-extrabold ";
    } else if (val !== 0) {
        if (val === state.solvedBoard[index]) {
            classes += "text-indigo-600 dark:text-indigo-400 font-semibold ";
        } else {
            classes += "text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/20 ";
        }
    }

    return classes;
}

function selectCell(index) {
    if (state.isPaused) return;
    state.selectedCell = index;
    renderBoard();
}

function inputNumber(number) {
    if (state.selectedCell === null || state.isPaused || isAnyModalOpen()) return;
    const index = state.selectedCell;

    if (state.initialBoard[index] !== 0) return;

    // Guard: don't let Notes mode silently erase an already-correct answer
    if (state.notesMode && state.currentBoard[index] !== 0 && state.currentBoard[index] === state.solvedBoard[index]) {
        return;
    }

    saveToHistory();

    if (state.notesMode) {
        state.currentBoard[index] = 0;
        const draftNotes = state.notesBoard[index];
        if (draftNotes.includes(number)) {
            state.notesBoard[index] = draftNotes.filter(n => n !== number);
        } else {
            state.notesBoard[index].push(number);
        }
    } else {
        state.notesBoard[index] = [];
        state.currentBoard[index] = number;

        if (number !== state.solvedBoard[index]) {
            state.mistakes++;
            mistakesEl.innerText = `${state.mistakes} / ${state.maxMistakes}`;
            if (state.mistakes >= state.maxMistakes - 1) {
                mistakesEl.classList.add('mistakes-warning');
            }

            renderBoard();
            const targetCell = gridContainer.children[index];
            if (targetCell) {
                targetCell.classList.add('shake-error');
                setTimeout(() => targetCell.classList.remove('shake-error'), 500);
            }

            if (state.mistakes >= state.maxMistakes) {
                endGame(false);
            }
            saveGameProgress();
            return;
        } else {
            checkWinCondition();
        }
    }
    renderBoard();
    saveGameProgress();
}

function eraseCell() {
    if (state.selectedCell === null || state.isPaused) return;
    const index = state.selectedCell;

    if (state.initialBoard[index] !== 0) return;

    saveToHistory();
    state.currentBoard[index] = 0;
    state.notesBoard[index] = [];
    renderBoard();
    saveGameProgress();
}

function toggleNotesMode() {
    state.notesMode = !state.notesMode;
    updateNotesUI();
}

function updateNotesUI() {
    if (state.notesMode) {
        notesIndicator.className = "absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse";
        notesText.innerText = translations[state.language].control_notes_on;
    } else {
        notesIndicator.className = "absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600";
        notesText.innerText = translations[state.language].control_notes_off;
    }
}

function giveHint() {
    if (state.selectedCell === null || state.isPaused) return;
    if (state.hintsLeft <= 0) return;

    const index = state.selectedCell;

    if (state.initialBoard[index] !== 0) return;
    if (state.currentBoard[index] === state.solvedBoard[index]) return;

    saveToHistory();
    const correctValue = state.solvedBoard[index];
    state.currentBoard[index] = correctValue;
    state.notesBoard[index] = [];

    state.hintsLeft--;
    updateHintButtonUI();

    renderBoard();
    checkWinCondition();
    saveGameProgress();
}

function saveToHistory() {
    if (state.history.length > 20) state.history.shift();
    state.history.push({
        currentBoard: [...state.currentBoard],
        notesBoard: state.notesBoard.map(arr => [...arr])
    });
}

function undoAction() {
    if (state.history.length === 0 || state.isPaused) return;
    const previousState = state.history.pop();
    state.currentBoard = previousState.currentBoard;
    state.notesBoard = previousState.notesBoard;
    renderBoard();
    saveGameProgress();
}

function startTimer() {
    state.timerInterval = setInterval(() => {
        if (!state.isPaused) {
            state.secondsElapsed++;
            timerEl.innerText = formatTime(state.secondsElapsed);
            if (state.secondsElapsed % 5 === 0) {
                saveGameProgress();
            }
        }
    }, 1000);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function togglePause() {
    state.isPaused = !state.isPaused;
    if (state.isPaused) {
        pauseOverlay.classList.remove('hidden');
        requestAnimationFrame(() => pauseOverlay.style.opacity = '1');
        pauseIcon.className = "fa-solid fa-play";
    } else {
        pauseOverlay.style.opacity = '0';
        setTimeout(() => pauseOverlay.classList.add('hidden'), 200);
        pauseIcon.className = "fa-solid fa-pause";
    }
}

function checkWinCondition() {
    const solvedFlat = state.solvedBoard;
    const currentFlat = state.currentBoard;

    const isSolved = solvedFlat.every((val, index) => val === currentFlat[index]);
    if (isSolved) {
        endGame(true);
    }
}

function endGame(won) {
    clearInterval(state.timerInterval);
    clearSavedGame();

    modalTimeSpent.innerText = formatTime(state.secondsElapsed);
    modalErrorsMade.innerText = `${state.mistakes} / ${state.maxMistakes}`;

    const langObj = translations[state.language];

    if (won) {
        modalIconContainer.className = "w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400";
        modalIconContainer.innerHTML = '<i class="fa-solid fa-trophy"></i>';
        modalTitle.innerText = langObj.win_title;
        modalDesc.innerText = langObj.win_desc;

        state.stats.gamesWon++;

        const currentTimeStr = formatTime(state.secondsElapsed);
        const bestForDiff = state.stats.bestTimes[state.difficulty];
        if (bestForDiff === '--:--' || currentTimeStr < bestForDiff) {
            state.stats.bestTimes[state.difficulty] = currentTimeStr;
        }
        saveStats();

    } else {
        modalIconContainer.className = "w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400";
        modalIconContainer.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        modalTitle.innerText = langObj.gameover_title;
        modalDesc.innerText = langObj.gameover_desc;
    }

    showModal(statusModal);
}

function chunk(array, size) {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
}

// Launch Application
window.onload = initApp;
