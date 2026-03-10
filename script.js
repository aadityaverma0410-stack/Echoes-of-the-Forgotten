/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 1: Core Configuration, Data Dictionaries, and State Management
 */

// ==========================================
// 1. ENGINE CONFIGURATION
// ==========================================
const EngineConfig = {
    version: "1.0.0",
    debugMode: false,
    timings: {
        timelineTransitionMs: 2500,
        dialogueSpeedMs: 40,
        fadeDurationMs: 800,
        autosaveIntervalMs: 60000
    },
    audio: {
        masterVolume: 0.8,
        musicVolume: 0.7,
        sfxVolume: 0.9,
        ambientVolume: 0.6
    },
    ui: {
        inventoryMaxSlots: 15,
        maxDialogueHistory: 50
    }
};

// ==========================================
// 2. MASTER DATA DICTIONARIES
// ==========================================
const GameData = {
    
    // --------------------------------------
    // ITEM DATABASE
    // --------------------------------------
    items: {
        // Keys & Hardware
        'heart_key_left': {
            id: 'heart_key_left',
            name: 'Broken Heart Key (Left)',
            description: 'The left half of a heavy iron key shaped like an anatomical heart. The edge is jagged.',
            type: 'component',
            combinableWith: 'heart_key_right',
            resultItem: 'heart_key_complete',
            sprite: 'assets/objects/key_left.png'
        },
        'heart_key_right': {
            id: 'heart_key_right',
            name: 'Broken Heart Key (Right)',
            description: 'The right half of a heavy iron key. It feels strangely warm.',
            type: 'component',
            combinableWith: 'heart_key_left',
            resultItem: 'heart_key_complete',
            sprite: 'assets/objects/key_right.png'
        },
        'heart_key_complete': {
            id: 'heart_key_complete',
            name: 'Heart Key',
            description: 'A complete iron key shaped like a heart. The seam where it was joined is invisible.',
            type: 'key',
            sprite: 'assets/objects/key_complete.png'
        },
        
        // Puzzle Components
        'porcelain_mask': {
            id: 'porcelain_mask',
            name: 'Porcelain Mask',
            description: 'A smooth, featureless white mask. Looking at it makes your eyes water.',
            type: 'mechanism_part',
            sprite: 'assets/objects/mask.png'
        },
        'photograph_1952': {
            id: 'photograph_1952',
            name: 'Faded Photograph',
            description: 'A picture of a young child standing next to a grandfather clock. The date 1952 is written on the back.',
            type: 'mechanism_part',
            sprite: 'assets/objects/photo_52.png'
        },
        'photograph_1998': {
            id: 'photograph_1998',
            name: 'Distorted Photograph',
            description: 'The child from the 1952 photo, but an adult figure is blurring into the frame beside them.',
            type: 'document',
            sprite: 'assets/objects/photo_98.png'
        },
        'sheet_music': {
            id: 'sheet_music',
            name: 'Torn Sheet Music',
            description: 'A sequence of notes. C, E, G, B. The rest of the page is covered in frantic scribbles.',
            type: 'clue',
            sprite: 'assets/objects/sheet_music.png'
        },
        'fuse_15a': {
            id: 'fuse_15a',
            name: '15A Fuse',
            description: 'An intact electrical fuse. Glass is slightly smudged.',
            type: 'hardware',
            sprite: 'assets/objects/fuse.png'
        },
        
        // Audio Logs (Archivist)
        'tape_1': {
            id: 'tape_1',
            name: 'Audio Tape: Trial 1',
            description: 'A standard magnetic cassette tape. The label is peeling.',
            type: 'audio_log',
            audioId: 'snd_tape_1',
            sprite: 'assets/objects/tape.png'
        },
        'tape_2': {
            id: 'tape_2',
            name: 'Audio Tape: Trial 14',
            description: 'The magnetic ribbon is slightly tangled, but it looks playable.',
            type: 'audio_log',
            audioId: 'snd_tape_2',
            sprite: 'assets/objects/tape.png'
        },
        'tape_3': {
            id: 'tape_3',
            name: 'Audio Tape: Final Entry',
            description: 'The label is covered in dark, dried stains. It feels heavy.',
            type: 'audio_log',
            audioId: 'snd_tape_3',
            sprite: 'assets/objects/tape.png'
        }
    },

    // --------------------------------------
    // DIALOGUE TREES
    // --------------------------------------
    dialogues: {
        // Hallway Intro
        'intro_archivist_98': [
            { id: 'ia1', speaker: 'The Archivist', text: 'The dust here is completely undisturbed. No one has set foot in the Hollow house for decades.', timeline: 1998 },
            { id: 'ia2', speaker: 'The Archivist', text: 'Yet... I can still hear the grandfather clock ticking from somewhere deep inside.', timeline: 1998 },
            { id: 'ia3', speaker: 'The Archivist', text: 'I need to find the main chamber. The mechanism should still be intact.', timeline: 1998 }
        ],
        'intro_child_52': [
            { id: 'ic1', speaker: 'The Child', text: 'Is someone there? The walls feel cold today.', timeline: 1952 },
            { id: 'ic2', speaker: 'The Child', text: 'I keep seeing a tall shadow in the mirrors. It looks sad.', timeline: 1952 },
            { id: 'ic3', speaker: 'The Child', text: 'The clock has been ticking louder lately. It makes my head hurt.', timeline: 1952 }
        ],
        
        // Object Inspections
        'inspect_portrait_98': [
            { id: 'ip1', speaker: 'The Archivist', text: 'A portrait of the Hollow family. The faces are scratched out. Deliberately.', timeline: 1998 }
        ],
        'inspect_portrait_52': [
            { id: 'ip2', speaker: 'The Child', text: 'Mother and Father look so stern in this picture. I don\'t like looking at it.', timeline: 1952 }
        ],
        
        // Mid-Game Revelations
        'tape_1_playback': [
            { id: 't1_1', speaker: 'Voice on Tape', text: '"Subject 1 is showing signs of temporal displacement. Memories are bleeding across the divide."', timeline: 1998 },
            { id: 't1_2', speaker: 'The Archivist', text: 'That voice... it sounds exactly like mine. But I never recorded this.', timeline: 1998 }
        ],
        'mirror_event': [
            { id: 'me1', speaker: 'The Child', text: 'Who are you? Why are you wearing my face?', timeline: 1952 },
            { id: 'me2', speaker: 'The Archivist', text: 'If you are hearing this, then the process has already begun.', timeline: 1998 },
            { id: 'me3', speaker: 'The Child', text: 'Please... I don\'t want to disappear.', timeline: 1952 }
        ],
        
        // Final Ending Sequence
        'final_confrontation': [
            { id: 'fc1', speaker: 'The Child', text: 'Will I grow up to become you?', timeline: 1952 },
            { id: 'fc2', speaker: 'The Archivist', text: '...I don\'t know anymore.', timeline: 1998 },
            { id: 'fc3', speaker: 'The Child', text: 'Why are there so many pictures of me inside the clock?', timeline: 1952 },
            { id: 'fc4', speaker: 'The Archivist', text: 'Because a person is only complete when someone else is forgotten.', timeline: 1998 }
        ]
    },

    // --------------------------------------
    // DOCUMENT TEXTS
    // --------------------------------------
    documents: {
        'doc_experiment_log_1': {
            title: 'Research Log - Day 14',
            content: `
                <p>The mechanism inside the grandfather clock is fully operational.</p>
                <p>The temporal splitting functions as theorized. Consciousness can exist at two distinct points on the chronological axis simultaneously.</p>
                <p>However, the tether degrades. When the ritual completes, the stronger temporal footprint absorbs the weaker one.</p>
                <p class="handwriting">The past must be erased to secure the future.</p>
            `
        },
        'doc_experiment_log_2': {
            title: 'Research Log - Day 89',
            content: `
                <p>The physical toll is immense. My hands are shaking. The bleeding hasn't stopped.</p>
                <p>I need a vessel. Someone with identical biological and psychological markers to minimize rejection during the merge.</p>
                <p>There is only one logical subject.</p>
                <p class="blood-stain">Myself.</p>
            `
        }
    }
};

// ==========================================
// 3. CORE STATE MANAGER
// ==========================================
class StateManager {
    constructor() {
        this.resetState();
    }

    resetState() {
        this.state = {
            // Core Progress
            timeline: 1998, // 1952 or 1998
            currentRoom: 'hallway',
            playtime: 0,
            
            // Inventory
            inventory: [],
            
            // Event Flags (Extensive tracking for a 2-hour game)
            flags: {
                // Room Access
                studyUnlocked: false,
                kitchenUnlocked: false,
                basementUnlocked: false,
                musicRoomUnlocked: false,
                atticUnlocked: false,
                chamberUnlocked: false,
                
                // Puzzles Solved
                deskLockSolved: false,
                pianoMelodyPlayed: false,
                fuseboxRepaired: false,
                clockMechanismReady: false,
                
                // Story Milestones
                heardFirstTape: false,
                sawMirrorAnomaly: false,
                foundTruthDocument: false,
                
                // Dynamic States
                basementFlooded: true,
                powerOn: false,
                musicBoxPlaying: false
            },
            
            // Puzzle States
            puzzleStates: {
                fusebox: [false, false, false, false], // State of 4 fuses
                symbolLock: [0, 0, 0] // Current index of 3 dials
            }
        };
    }

    // Timeline Operations
    getTimeline() {
        return this.state.timeline;
    }

    switchTimeline() {
        if (this.state.timeline === 1998) {
            this.state.timeline = 1952;
        } else {
            this.state.timeline = 1998;
        }
        return this.state.timeline;
    }

    // Flag Operations
    getFlag(flagName) {
        if (this.state.flags.hasOwnProperty(flagName)) {
            return this.state.flags[flagName];
        }
        console.warn(`[StateManager] Attempted to read undefined flag: ${flagName}`);
        return false;
    }

    setFlag(flagName, value) {
        if (this.state.flags.hasOwnProperty(flagName)) {
            this.state.flags[flagName] = value;
            console.log(`[StateManager] Flag '${flagName}' set to ${value}`);
        } else {
            console.warn(`[StateManager] Attempted to set undefined flag: ${flagName}`);
        }
    }

    // Puzzle State Operations
    getPuzzleState(puzzleId) {
        return this.state.puzzleStates[puzzleId] || null;
    }

    updatePuzzleState(puzzleId, newState) {
        this.state.puzzleStates[puzzleId] = newState;
    }

    // Save / Load System
    saveGame(slot = 1) {
        try {
            const saveData = JSON.stringify(this.state);
            localStorage.setItem(`hollowClock_save_${slot}`, saveData);
            console.log(`[StateManager] Game saved successfully to slot ${slot}.`);
            return true;
        } catch (error) {
            console.error(`[StateManager] Failed to save game:`, error);
            return false;
        }
    }

    loadGame(slot = 1) {
        try {
            const saveData = localStorage.getItem(`hollowClock_save_${slot}`);
            if (saveData) {
                this.state = JSON.parse(saveData);
                console.log(`[StateManager] Game loaded successfully from slot ${slot}.`);
                return true;
            }
            console.log(`[StateManager] No save data found in slot ${slot}.`);
            return false;
        } catch (error) {
            console.error(`[StateManager] Failed to load game:`, error);
            return false;
        }
    }
}

// Instantiate Global State
const GameState = new StateManager();

// ==========================================
// 4. INVENTORY MANAGER
// ==========================================
class InventoryManager {
    constructor(stateManager) {
        this.state = stateManager;
        this.onInventoryChanged = null; // Callback for UI updates
    }

    // Retrieve full item object from Database
    getItemData(itemId) {
        return GameData.items[itemId] || null;
    }

    // Add item to inventory array
    addItem(itemId) {
        const item = this.getItemData(itemId);
        if (!item) {
            console.error(`[InventoryManager] Item ${itemId} does not exist in Database.`);
            return false;
        }

        const currentInv = this.state.state.inventory;
        if (currentInv.length >= EngineConfig.ui.inventoryMaxSlots) {
            console.warn(`[InventoryManager] Inventory full. Cannot add ${itemId}.`);
            return false;
        }

        if (!currentInv.includes(itemId)) {
            currentInv.push(itemId);
            console.log(`[InventoryManager] Added ${itemId} to inventory.`);
            this._triggerUpdate();
            return true;
        }
        return false;
    }

    // Remove item from inventory array
    removeItem(itemId) {
        const currentInv = this.state.state.inventory;
        const index = currentInv.indexOf(itemId);
        
        if (index > -1) {
            currentInv.splice(index, 1);
            console.log(`[InventoryManager] Removed ${itemId} from inventory.`);
            this._triggerUpdate();
            return true;
        }
        return false;
    }

    // Check if item exists in inventory
    hasItem(itemId) {
        return this.state.state.inventory.includes(itemId);
    }

    // Attempt to combine two items
    combineItems(itemId1, itemId2) {
        const item1 = this.getItemData(itemId1);
        const item2 = this.getItemData(itemId2);

        if (!item1 || !item2) return false;

        // Check combination logic based on Database
        if (item1.combinableWith === itemId2 && item2.combinableWith === itemId1) {
            const resultId = item1.resultItem;
            
            this.removeItem(itemId1);
            this.removeItem(itemId2);
            this.addItem(resultId);
            
            console.log(`[InventoryManager] Combined ${itemId1} and ${itemId2} into ${resultId}.`);
            return true;
        }
        
        console.log(`[InventoryManager] ${itemId1} and ${itemId2} cannot be combined.`);
        return false;
    }

    // Get array of full item objects currently in inventory
    getInventoryList() {
        return this.state.state.inventory.map(id => this.getItemData(id));
    }

    // Internal UI update trigger
    _triggerUpdate() {
        if (typeof this.onInventoryChanged === 'function') {
            this.onInventoryChanged(this.getInventoryList());
        }
    }
}

// Instantiate Global Inventory
const PlayerInventory = new InventoryManager(GameState);
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 2: Room Configurations, Environment Management, and Dialogue Processing
 */

// ==========================================
// 5. ROOM DATA CONFIGURATION
// ==========================================
const RoomData = {
    'room-hallway': {
        id: 'room-hallway',
        name: 'Main Hallway',
        bg_1998: 'assets/rooms/hallway_98.png',
        bg_1952: 'assets/rooms/hallway_52.png',
        hotspots: [
            {
                id: 'hs-hallway-study',
                type: 'door',
                target: 'room-study',
                timeline: 'both',
                x: 15, y: 30, w: 12, h: 50,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-study')
            },
            {
                id: 'hs-hallway-kitchen',
                type: 'door',
                target: 'room-kitchen',
                timeline: 'both',
                x: 80, y: 35, w: 10, h: 45,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-kitchen')
            },
            {
                id: 'hs-hallway-portrait',
                type: 'inspect',
                timeline: 'both',
                x: 45, y: 20, w: 15, h: 25,
                condition: () => true,
                onInteract: () => {
                    const dialogId = GameState.getTimeline() === 1998 ? 'inspect_portrait_98' : 'inspect_portrait_52';
                    Narrative.startDialogue(dialogId);
                }
            },
            {
                id: 'hs-hallway-tape1',
                type: 'item',
                itemId: 'tape_1',
                timeline: 1998,
                x: 50, y: 85, w: 5, h: 5,
                condition: () => !PlayerInventory.hasItem('tape_1') && !GameState.getFlag('heardFirstTape'),
                onInteract: function() {
                    PlayerInventory.addItem(this.itemId);
                    Environment.refreshHotspots();
                }
            }
        ]
    },
    'room-study': {
        id: 'room-study',
        name: 'Study Room',
        bg_1998: 'assets/rooms/study_98.png',
        bg_1952: 'assets/rooms/study_52.png',
        hotspots: [
            {
                id: 'hs-study-hallway',
                type: 'door',
                target: 'room-hallway',
                timeline: 'both',
                x: 5, y: 40, w: 8, h: 50,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-hallway')
            },
            {
                id: 'hs-study-desk',
                type: 'puzzle',
                puzzleId: 'puzzle-symbol-lock',
                timeline: 1998,
                x: 40, y: 60, w: 25, h: 20,
                condition: () => !GameState.getFlag('deskLockSolved'),
                onInteract: () => PuzzleController.openPuzzle('puzzle-symbol-lock')
            },
            {
                id: 'hs-study-document',
                type: 'item',
                itemId: 'doc_experiment_log_1',
                timeline: 1998,
                x: 45, y: 55, w: 8, h: 6,
                condition: () => !GameState.getFlag('foundTruthDocument'),
                onInteract: () => DocumentViewer.openDocument('doc_experiment_log_1')
            }
        ]
    },
    'room-chamber': {
        id: 'room-chamber',
        name: 'Clock Chamber',
        bg_1998: 'assets/rooms/chamber_98.png',
        bg_1952: 'assets/rooms/chamber_52.png',
        hotspots: [
            {
                id: 'hs-chamber-attic',
                type: 'door',
                target: 'room-attic',
                timeline: 'both',
                x: 5, y: 30, w: 10, h: 60,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-attic')
            },
            {
                id: 'hs-chamber-clock',
                type: 'interact',
                timeline: 'both',
                x: 35, y: 5, w: 30, h: 90,
                condition: () => true,
                onInteract: () => {
                    if (GameState.getTimeline() === 1998) {
                        PuzzleController.openPuzzle('puzzle-clock-mechanism');
                    } else {
                        Narrative.startDialogue('intro_child_52'); // The child interacts differently
                    }
                }
            }
        ]
    }
    // Note: Kitchen, Music Room, Basement, and Attic definitions follow the exact same structural pattern.
};

// ==========================================
// 6. ROOM MANAGER (ENVIRONMENT)
// ==========================================
class RoomManager {
    constructor() {
        this.currentRoomId = null;
        this.viewportLayers = document.querySelectorAll('.room-scene');
        this.locationDisplay = document.getElementById('location-display');
        this.appContainer = document.getElementById('game-container');
    }

    // Load a room by ID
    loadRoom(roomId) {
        if (!RoomData[roomId]) {
            console.error(`[RoomManager] Room ID ${roomId} not found in RoomData.`);
            return;
        }

        const roomConfig = RoomData[roomId];
        this.currentRoomId = roomId;
        
        // Update Game State
        GameState.state.currentRoom = roomId;

        // Update UI Text
        if (this.locationDisplay) {
            this.locationDisplay.innerText = roomConfig.name;
        }

        // Handle DOM switching
        this.viewportLayers.forEach(layer => {
            layer.classList.remove('active');
            if (layer.id === roomId) {
                layer.classList.add('active');
            }
        });

        this.applyTimelineVisuals(roomId);
        this.refreshHotspots();
        console.log(`[RoomManager] Loaded room: ${roomConfig.name}`);
    }

    // Apply specific background image based on current timeline
    applyTimelineVisuals(roomId) {
        const roomConfig = RoomData[roomId];
        const roomElement = document.getElementById(roomId);
        if (!roomElement) return;

        const bgImage = roomElement.querySelector('.room-background');
        const currentTimeline = GameState.getTimeline();

        if (bgImage) {
            bgImage.src = currentTimeline === 1998 ? roomConfig.bg_1998 : roomConfig.bg_1952;
        }

        // Apply global CSS filter class
        if (currentTimeline === 1998) {
            this.appContainer.classList.remove('timeline-1952');
            this.appContainer.classList.add('timeline-1998');
        } else {
            this.appContainer.classList.remove('timeline-1998');
            this.appContainer.classList.add('timeline-1952');
        }
    }

    // Clear and rebuild hotspots based on conditions and timeline
    refreshHotspots() {
        if (!this.currentRoomId) return;

        const roomConfig = RoomData[this.currentRoomId];
        const roomElement = document.getElementById(this.currentRoomId);
        const hotspotLayer = roomElement.querySelector('.hotspot-layer');
        
        if (!hotspotLayer) return;

        // Clear existing generated hotspots
        hotspotLayer.innerHTML = '';

        const currentTimeline = GameState.getTimeline();

        roomConfig.hotspots.forEach(spot => {
            // Check timeline constraint
            if (spot.timeline !== 'both' && spot.timeline !== currentTimeline) return;
            
            // Check narrative/logic constraint
            if (typeof spot.condition === 'function' && !spot.condition()) return;

            // Generate DOM element
            const el = document.createElement('div');
            el.className = `hotspot type-${spot.type}`;
            el.id = spot.id;
            el.style.left = `${spot.x}%`;
            el.style.top = `${spot.y}%`;
            el.style.width = `${spot.w}%`;
            el.style.height = `${spot.h}%`;

            // Bind interaction
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof spot.onInteract === 'function') {
                    spot.onInteract();
                }
            });

            hotspotLayer.appendChild(el);
        });
    }

    // Trigger a timeline shift within the current room
    shiftTimeline() {
        GameState.switchTimeline();
        document.getElementById('current-year-display').innerText = GameState.getTimeline();
        
        // Reload visuals and logic for the new timeline
        this.applyTimelineVisuals(this.currentRoomId);
        this.refreshHotspots();
        
        console.log(`[RoomManager] Timeline shifted to ${GameState.getTimeline()}`);
    }
}

// Instantiate Global Environment
const Environment = new RoomManager();

// ==========================================
// 7. DIALOGUE MANAGER
// ==========================================
class DialogueManager {
    constructor() {
        this.ui = {
            footer: document.getElementById('dialogue-footer'),
            portrait: document.getElementById('dialogue-portrait'),
            speaker: document.getElementById('dialogue-speaker'),
            text: document.getElementById('dialogue-text')
        };
        
        this.currentSequence = [];
        this.currentIndex = 0;
        this.isTyping = false;
        this.typeInterval = null;
        this.active = false;

        this.bindEvents();
    }

    bindEvents() {
        if (this.ui.footer) {
            this.ui.footer.addEventListener('click', () => this.advance());
        }
    }

    startDialogue(dialogueId) {
        const sequence = GameData.dialogues[dialogueId];
        if (!sequence || sequence.length === 0) {
            console.error(`[DialogueManager] Dialogue ID ${dialogueId} not found.`);
            return;
        }

        this.currentSequence = sequence;
        this.currentIndex = 0;
        this.active = true;
        
        if (this.ui.footer) {
            this.ui.footer.classList.remove('hidden');
        }
        
        this.renderLine();
    }

    renderLine() {
        if (this.currentIndex >= this.currentSequence.length) {
            this.endDialogue();
            return;
        }

        const lineData = this.currentSequence[this.currentIndex];
        
        // Update Portrait
        if (this.ui.portrait) {
            const imgSrc = lineData.speaker === 'The Archivist' 
                ? 'assets/characters/archivist.png' 
                : 'assets/characters/child.png';
            this.ui.portrait.src = imgSrc;
        }

        // Update Speaker Name
        if (this.ui.speaker) {
            this.ui.speaker.innerText = lineData.speaker;
        }

        // Execute Typing Effect
        this.typeText(lineData.text);
    }

    typeText(fullText) {
        if (this.typeInterval) clearInterval(this.typeInterval);
        
        this.isTyping = true;
        this.ui.text.innerText = '';
        let charIndex = 0;

        this.typeInterval = setInterval(() => {
            if (charIndex < fullText.length) {
                this.ui.text.innerText += fullText.charAt(charIndex);
                charIndex++;
            } else {
                this.finishTyping();
            }
        }, EngineConfig.timings.dialogueSpeedMs);
    }

    finishTyping() {
        clearInterval(this.typeInterval);
        this.isTyping = false;
        const currentLine = this.currentSequence[this.currentIndex];
        this.ui.text.innerText = currentLine.text;
    }

    advance() {
        if (!this.active) return;

        if (this.isTyping) {
            // Skip typing animation
            this.finishTyping();
        } else {
            // Next line
            this.currentIndex++;
            this.renderLine();
        }
    }

    endDialogue() {
        this.active = false;
        this.currentSequence = [];
        this.currentIndex = 0;
        
        if (this.ui.footer) {
            this.ui.footer.classList.add('hidden');
        }
        
        // Optional: Trigger narrative flags based on completed dialogue
        console.log(`[DialogueManager] Dialogue sequence completed.`);
    }
}

// Instantiate Global Narrative Manager
const Narrative = new DialogueManager();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 3: Document Viewer, Puzzle Controllers, and Initialization
 */

// ==========================================
// 8. DOCUMENT VIEWER
// ==========================================
class DocumentManager {
    constructor() {
        this.overlay = document.getElementById('overlay-document');
        this.titleEl = document.getElementById('doc-title');
        this.contentEl = document.getElementById('doc-content');
        this.closeBtn = document.querySelector('.btn-close-modal[data-target="overlay-document"]');
        
        this.bindEvents();
    }

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeDocument());
        }
    }

    openDocument(docId) {
        const docData = GameData.documents[docId];
        if (!docData) {
            console.error(`[DocumentManager] Document ID ${docId} not found.`);
            return;
        }

        // Set content
        if (this.titleEl) this.titleEl.innerText = docData.title;
        if (this.contentEl) this.contentEl.innerHTML = docData.content;

        // Show overlay
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            this.overlay.classList.add('active');
        }

        // Flag tracking for narrative progression
        if (docId === 'doc_experiment_log_1') {
            GameState.setFlag('foundTruthDocument', true);
        }

        console.log(`[DocumentManager] Opened document: ${docData.title}`);
    }

    closeDocument() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            this.overlay.classList.add('hidden');
        }
        
        // Clear content to prevent ghost rendering
        if (this.titleEl) this.titleEl.innerText = '';
        if (this.contentEl) this.contentEl.innerHTML = '';
    }
}

const DocumentViewer = new DocumentManager();

// ==========================================
// 9. PUZZLE CONTROLLER
// ==========================================
class PuzzleManager {
    constructor() {
        this.activePuzzle = null;
        
        // Overlay Elements
        this.overlays = {
            'puzzle-symbol-lock': document.getElementById('overlay-puzzle-symbol'),
            'puzzle-melody': document.getElementById('overlay-puzzle-melody'),
            'puzzle-clock-mechanism': document.getElementById('overlay-final-mechanism')
        };

        // Puzzle Specific States
        this.symbolLockState = [0, 0, 0]; // 3 dials
        this.melodySequence = [];
        this.melodySolution = ['C', 'E', 'G', 'B']; // Standard solution

        this.bindGlobalEvents();
        this.initSymbolLock();
        this.initPianoPuzzle();
    }

    bindGlobalEvents() {
        // Bind all close buttons for puzzle modals
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-target');
                this.closePuzzle(targetId);
            });
        });
    }

    openPuzzle(puzzleId) {
        if (!this.overlays[puzzleId]) {
            console.error(`[PuzzleManager] Overlay for ${puzzleId} not found in DOM.`);
            return;
        }

        this.activePuzzle = puzzleId;
        const overlay = this.overlays[puzzleId];
        
        overlay.classList.remove('hidden');
        overlay.classList.add('active');
        
        console.log(`[PuzzleManager] Opened puzzle: ${puzzleId}`);
    }

    closePuzzle(overlayId) {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('hidden');
        }
        this.activePuzzle = null;
    }

    // --- Specific Puzzle Logic: Symbol Lock ---
    initSymbolLock() {
        const dials = document.querySelectorAll('.symbol-dial');
        const submitBtn = document.getElementById('btn-submit-symbol');
        const feedback = document.getElementById('feedback-symbol');

        if (!dials.length || !submitBtn) return;

        const symbols = ['☀️', '🌙', '⭐', '👁️', '💀'];
        const solution = [3, 1, 4]; // 👁️, 🌙, 💀

        dials.forEach((dial, index) => {
            const upBtn = dial.querySelector('.btn-dial-up');
            const downBtn = dial.querySelector('.btn-dial-down');
            const display = dial.querySelector('.symbol-display');

            const updateDial = () => {
                display.innerText = symbols[this.symbolLockState[index]];
            };

            upBtn.addEventListener('click', () => {
                this.symbolLockState[index] = (this.symbolLockState[index] + 1) % symbols.length;
                updateDial();
            });

            downBtn.addEventListener('click', () => {
                this.symbolLockState[index] = (this.symbolLockState[index] - 1 + symbols.length) % symbols.length;
                updateDial();
            });
        });

        submitBtn.addEventListener('click', () => {
            if (this.symbolLockState.join(',') === solution.join(',')) {
                feedback.innerText = "The drawer clicks open.";
                feedback.style.color = "var(--color-gold-tarnished)";
                GameState.setFlag('deskLockSolved', true);
                PlayerInventory.addItem('heart_key_left');
                
                setTimeout(() => this.closePuzzle('overlay-puzzle-symbol'), 2000);
            } else {
                feedback.innerText = "The mechanism remains locked.";
                feedback.style.color = "var(--color-ui-text-secondary)";
            }
        });
    }

    // --- Specific Puzzle Logic: Piano Melody ---
    initPianoPuzzle() {
        const keys = document.querySelectorAll('.piano-key');
        const resetBtn = document.getElementById('btn-reset-melody');
        const feedback = document.getElementById('feedback-melody');

        if (!keys.length) return;

        keys.forEach(key => {
            key.addEventListener('click', (e) => {
                const note = e.target.getAttribute('data-note');
                this.melodySequence.push(note);
                
                // Keep sequence to last 4 notes
                if (this.melodySequence.length > 4) {
                    this.melodySequence.shift();
                }

                // Check sequence
                if (this.melodySequence.join(',') === this.melodySolution.join(',')) {
                    feedback.innerText = "A hidden compartment opens.";
                    GameState.setFlag('pianoMelodyPlayed', true);
                    PlayerInventory.addItem('fuse_15a');
                    setTimeout(() => this.closePuzzle('overlay-puzzle-melody'), 2000);
                } else {
                    feedback.innerText = `Notes played: ${this.melodySequence.join(' - ')}`;
                }
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.melodySequence = [];
                feedback.innerText = "";
            });
        }
    }
}

const PuzzleController = new PuzzleManager();

// ==========================================
// 10. GAME INITIALIZATION & MAIN LOOP
// ==========================================
class MainGameLoop {
    constructor() {
        this.menu = {
            overlay: document.getElementById('main-menu'),
            btnNew: document.getElementById('btn-new-game'),
            btnLoad: document.getElementById('btn-load-game')
        };
        
        this.app = document.getElementById('game-container');
        
        this.init();
    }

    init() {
        // Bind Main Menu actions
        if (this.menu.btnNew) {
            this.menu.btnNew.addEventListener('click', () => this.startNewGame());
        }

        if (this.menu.btnLoad) {
            // Check if save exists to enable button
            if (localStorage.getItem('hollowClock_save_1')) {
                this.menu.btnLoad.removeAttribute('disabled');
                this.menu.btnLoad.addEventListener('click', () => this.loadExistingGame());
            }
        }

        // Bind global UI elements
        const timelineBtn = document.getElementById('timeline-indicator');
        if (timelineBtn) {
            // Secret dev shortcut for testing. In actual game, this is triggered by the clock.
            timelineBtn.addEventListener('dblclick', () => {
                if (EngineConfig.debugMode) Environment.shiftTimeline();
            });
        }
    }

    startNewGame() {
        console.log(`[MainGameLoop] Starting new game...`);
        
        // Hide menu
        this.menu.overlay.classList.remove('active');
        this.menu.overlay.classList.add('hidden');
        
        // Show app container
        this.app.classList.remove('hidden');
        
        // Reset state
        GameState.resetState();
        GameState.state.timeline = 1998; // Archivist starts
        
        // Initialize first room
        Environment.loadRoom('room-hallway');
        
        // Start introductory narrative
        setTimeout(() => {
            Narrative.startDialogue('intro_archivist_98');
        }, 1500);
    }

    loadExistingGame() {
        console.log(`[MainGameLoop] Loading saved game...`);
        
        if (GameState.loadGame(1)) {
            this.menu.overlay.classList.remove('active');
            this.menu.overlay.classList.add('hidden');
            this.app.classList.remove('hidden');
            
            // Re-render UI based on loaded state
            Environment.loadRoom(GameState.state.currentRoom);
            PlayerInventory._triggerUpdate();
            
            // Update timeline visual
            document.getElementById('current-year-display').innerText = GameState.getTimeline();
        }
    }
}

// Boot the engine once DOM is fully parsed
window.addEventListener('DOMContentLoaded', () => {
    const Engine = new MainGameLoop();
    console.log(`[Engine] Initialized version ${EngineConfig.version}`);
});
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 4: Audio Manager, Inventory UI, and Final Sequences
 */

// ==========================================
// 11. AUDIO MANAGER
// ==========================================
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentBGM = null;
        this.isMuted = false;

        this.audioData = {
            bgm: {
                'theme_1998': 'assets/sounds/bgm_1998_ambient.mp3',
                'theme_1952': 'assets/sounds/bgm_1952_musicbox.mp3',
                'theme_ending': 'assets/sounds/bgm_ending_drone.mp3'
            },
            sfx: {
                'ui_click': 'assets/sounds/sfx_click.wav',
                'item_pickup': 'assets/sounds/sfx_pickup.wav',
                'door_locked': 'assets/sounds/sfx_locked.wav',
                'door_open': 'assets/sounds/sfx_door_open.wav',
                'timeline_shift': 'assets/sounds/sfx_clock_chime.wav',
                'clock_tick': 'assets/sounds/sfx_heavy_tick.wav'
            }
        };

        this.initAudioElements();
    }

    initAudioElements() {
        // Preload HTMLAudioElements in memory
        for (const [key, src] of Object.entries(this.audioData.sfx)) {
            const audio = new Audio(src);
            audio.volume = EngineConfig.audio.sfxVolume;
            this.sounds[key] = audio;
        }

        for (const [key, src] of Object.entries(this.audioData.bgm)) {
            const audio = new Audio(src);
            audio.volume = EngineConfig.audio.musicVolume;
            audio.loop = true;
            this.music[key] = audio;
        }
    }

    playSound(soundId) {
        if (this.isMuted || !this.sounds[soundId]) return;
        
        // Clone node to allow overlapping sounds of the same type
        const soundClone = this.sounds[soundId].cloneNode();
        soundClone.volume = EngineConfig.audio.sfxVolume;
        soundClone.play().catch(e => console.warn(`[AudioManager] Audio play failed:`, e));
    }

    playMusic(musicId) {
        if (this.isMuted || !this.music[musicId]) return;

        if (this.currentBGM) {
            this.fadeOut(this.currentBGM);
        }

        this.currentBGM = this.music[musicId];
        this.currentBGM.currentTime = 0;
        this.currentBGM.play().catch(e => console.warn(`[AudioManager] Music play failed:`, e));
    }

    fadeOut(audioElement) {
        const fadeAudio = setInterval(() => {
            if (audioElement.volume > 0.05) {
                audioElement.volume -= 0.05;
            } else {
                audioElement.pause();
                audioElement.volume = EngineConfig.audio.musicVolume; // Reset for next play
                clearInterval(fadeAudio);
            }
        }, 100);
    }

    setMasterVolume(value) {
        EngineConfig.audio.masterVolume = value / 100;
        // In a full implementation, this would dynamically adjust all active audio nodes.
    }
}

const AudioController = new AudioManager();

// ==========================================
// 12. INVENTORY UI CONTROLLER
// ==========================================
class InventoryUIController {
    constructor(inventoryManager) {
        this.inventoryManager = inventoryManager;
        this.selectedItemId = null;
        this.combineTargetId = null;

        // DOM Elements
        this.gridContainer = document.getElementById('inventory-grid');
        this.inspectPanel = {
            image: document.getElementById('inspect-image'),
            name: document.getElementById('inspect-name'),
            desc: document.getElementById('inspect-desc'),
            btnUse: document.getElementById('btn-use-item'),
            btnCombine: document.getElementById('btn-combine-item')
        };

        this.bindEvents();
    }

    bindEvents() {
        // Subscribe to data changes
        this.inventoryManager.onInventoryChanged = (items) => this.renderGrid(items);

        // Bind Action Buttons
        if (this.inspectPanel.btnUse) {
            this.inspectPanel.btnUse.addEventListener('click', () => this.handleUseItem());
        }

        if (this.inspectPanel.btnCombine) {
            this.inspectPanel.btnCombine.addEventListener('click', () => this.handleCombineItem());
        }
    }

    renderGrid(items) {
        if (!this.gridContainer) return;
        
        this.gridContainer.innerHTML = ''; // Clear current grid

        // Render filled slots
        items.forEach(itemData => {
            const slot = document.createElement('div');
            slot.className = `inv-slot ${this.selectedItemId === itemData.id ? 'active-item' : ''}`;
            slot.dataset.id = itemData.id;
            
            const icon = document.createElement('img');
            icon.className = 'item-icon';
            icon.src = itemData.sprite;
            icon.alt = itemData.name;
            
            slot.appendChild(icon);
            slot.addEventListener('click', () => this.selectItem(itemData.id));
            
            this.gridContainer.appendChild(slot);
        });

        // Render empty filler slots up to max capacity
        const emptySlotsNeeded = EngineConfig.ui.inventoryMaxSlots - items.length;
        for (let i = 0; i < emptySlotsNeeded; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'inv-slot empty';
            this.gridContainer.appendChild(emptySlot);
        }

        AudioController.playSound('ui_click');
    }

    selectItem(itemId) {
        if (this.combineTargetId) {
            // We are in combination mode
            this.attemptCombination(this.combineTargetId, itemId);
            this.combineTargetId = null;
            this.inspectPanel.btnCombine.innerText = "Combine";
            return;
        }

        this.selectedItemId = itemId;
        const itemData = this.inventoryManager.getItemData(itemId);

        if (itemData) {
            this.inspectPanel.image.src = itemData.sprite;
            this.inspectPanel.image.style.display = 'block';
            this.inspectPanel.name.innerText = itemData.name;
            this.inspectPanel.desc.innerText = itemData.description;
            
            this.inspectPanel.btnUse.disabled = false;
            
            if (itemData.type === 'component') {
                this.inspectPanel.btnCombine.disabled = false;
            } else {
                this.inspectPanel.btnCombine.disabled = true;
            }
        }

        // Re-render to show active selection border
        this.renderGrid(this.inventoryManager.getInventoryList());
    }

    handleUseItem() {
        if (!this.selectedItemId) return;
        
        const itemData = this.inventoryManager.getItemData(this.selectedItemId);
        console.log(`[InventoryUI] Attempting to use: ${itemData.name}`);
        
        // Contextual logic for using an item in the current room
        if (itemData.type === 'audio_log') {
            AudioController.playSound(itemData.audioId);
            if (itemData.id === 'tape_1') {
                Narrative.startDialogue('tape_1_playback');
                GameState.setFlag('heardFirstTape', true);
            }
        }
    }

    handleCombineItem() {
        if (!this.selectedItemId) return;
        this.combineTargetId = this.selectedItemId;
        this.inspectPanel.btnCombine.innerText = "Select Target...";
        this.inspectPanel.desc.innerText = "Select another item to combine with...";
    }

    attemptCombination(id1, id2) {
        const success = this.inventoryManager.combineItems(id1, id2);
        if (success) {
            this.selectedItemId = null; // Clear selection after combining
            this.inspectPanel.name.innerText = "Combination Successful";
            this.inspectPanel.desc.innerText = "";
            this.inspectPanel.image.style.display = 'none';
            this.inspectPanel.btnUse.disabled = true;
            this.inspectPanel.btnCombine.disabled = true;
        } else {
            this.inspectPanel.name.innerText = "Cannot Combine";
            this.inspectPanel.desc.innerText = "These items do not fit together.";
        }
    }
}

const UIController = new InventoryUIController(PlayerInventory);

// ==========================================
// 13. FINAL MECHANISM & ENDING CONTROLLER
// ==========================================
class EndingController {
    constructor() {
        this.ui = {
            mechanismOverlay: document.getElementById('overlay-final-mechanism'),
            slotMask: document.getElementById('slot-mask'),
            slotPhoto: document.getElementById('slot-photo'),
            slotKey: document.getElementById('slot-key'),
            btnActivate: document.getElementById('btn-activate-machine'),
            
            endingScreen: document.getElementById('ending-sequence'),
            endingPhoto: document.getElementById('ending-photo'),
            endingText: document.getElementById('ending-text'),
            endingQuote: document.getElementById('ending-quote')
        };

        this.mechanismState = {
            maskInserted: false,
            photoInserted: false,
            keyInserted: false
        };

        this.bindMechanismEvents();
    }

    bindMechanismEvents() {
        if (!this.ui.slotMask) return;

        // Mask Slot
        this.ui.slotMask.addEventListener('click', () => {
            if (UIController.selectedItemId === 'porcelain_mask') {
                this.insertComponent('maskInserted', this.ui.slotMask, 'porcelain_mask');
            }
        });

        // Photo Slot
        this.ui.slotPhoto.addEventListener('click', () => {
            if (UIController.selectedItemId === 'photograph_1952' || UIController.selectedItemId === 'photograph_1998') {
                this.insertComponent('photoInserted', this.ui.slotPhoto, UIController.selectedItemId);
            }
        });

        // Key Slot
        this.ui.slotKey.addEventListener('click', () => {
            if (UIController.selectedItemId === 'heart_key_complete') {
                this.insertComponent('keyInserted', this.ui.slotKey, 'heart_key_complete');
            }
        });

        // Activation Button
        this.ui.btnActivate.addEventListener('click', () => this.initiateFinalSequence());
    }

    insertComponent(stateKey, slotElement, itemId) {
        this.mechanismState[stateKey] = true;
        
        // Update DOM visually
        slotElement.classList.add('filled');
        const statusEl = slotElement.querySelector('.slot-status');
        if (statusEl) statusEl.innerText = "Locked";
        
        // Remove from inventory
        PlayerInventory.removeItem(itemId);
        AudioController.playSound('clock_tick');

        this.checkMechanismReady();
    }

    checkMechanismReady() {
        if (this.mechanismState.maskInserted && this.mechanismState.photoInserted && this.mechanismState.keyInserted) {
            this.ui.btnActivate.disabled = false;
            GameState.setFlag('clockMechanismReady', true);
        }
    }

    initiateFinalSequence() {
        console.log(`[EndingController] Final sequence initiated.`);
        
        // Hide puzzle UI
        this.ui.mechanismOverlay.classList.remove('active');
        this.ui.mechanismOverlay.classList.add('hidden');
        
        // Start final dialogue
        Narrative.startDialogue('final_confrontation');
        AudioController.playMusic('theme_ending');

        // Hook into DialogueManager to trigger ending screen when dialogue finishes
        const originalEndDialogue = Narrative.endDialogue.bind(Narrative);
        Narrative.endDialogue = () => {
            originalEndDialogue();
            this.playEndingCinematic();
        };
    }

    playEndingCinematic() {
        // Show black screen overlay
        this.ui.endingScreen.classList.remove('hidden');
        this.ui.endingScreen.classList.add('active');
        
        // Delay and fade in the final image
        setTimeout(() => {
            this.ui.endingPhoto.src = 'assets/objects/photo_final_hundreds.png';
            document.getElementById('ending-image-container').classList.add('reveal');
            
            // Display closing text
            setTimeout(() => {
                this.ui.endingQuote.classList.remove('hidden');
                this.ui.endingQuote.classList.add('fade-in');
            }, 3000);
            
        }, 2000);
    }
}

const FinalSequence = new EndingController();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 5: Event Dispatcher, Advanced Interactions, and Extended Puzzles
 */

// ==========================================
// 14. GLOBAL EVENT DISPATCHER
// ==========================================
class EventDispatcher {
    constructor() {
        this.events = {};
    }

    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    unsubscribe(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }

    emit(eventName, data = {}) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[EventDispatcher] Error in event '${eventName}':`, error);
            }
        });
    }
}

const GameEvents = new EventDispatcher();

// ==========================================
// 15. ADVANCED INTERACTION MANAGER
// ==========================================
class InteractionManager {
    constructor() {
        this.activeItemId = null;
        this.bindGlobalListeners();
    }

    bindGlobalListeners() {
        // Listen for item selection from the UI
        GameEvents.subscribe('itemSelected', (data) => {
            this.activeItemId = data.itemId;
        });

        GameEvents.subscribe('itemDeselected', () => {
            this.activeItemId = null;
        });
    }

    handleEnvironmentInteraction(hotspotId, requiredItemId, successCallback, failCallback) {
        if (this.activeItemId === requiredItemId) {
            console.log(`[InteractionManager] Successfully used ${requiredItemId} on ${hotspotId}.`);
            PlayerInventory.removeItem(this.activeItemId);
            this.activeItemId = null;
            
            // Dispatch event to clear UI selection
            GameEvents.emit('forceClearSelection');
            
            if (typeof successCallback === 'function') successCallback();
        } else {
            console.log(`[InteractionManager] Interaction failed. ${this.activeItemId} cannot be used here.`);
            if (typeof failCallback === 'function') failCallback();
        }
    }

    // Specific interactions for the 1952/1998 crossover mechanics
    processTemporalInteraction(targetTimeline, objectId) {
        const currentTimeline = GameState.getTimeline();
        
        if (currentTimeline !== targetTimeline) {
            Narrative.startDialogue('temporal_mismatch_error');
            return false;
        }

        // Add logic for objects that change state across time
        GameState.setFlag(`${objectId}_manipulated_in_${currentTimeline}`, true);
        return true;
    }
}

const Interactions = new InteractionManager();

// ==========================================
// 16. EXTENDED PUZZLE CONTROLLERS
// ==========================================

// --- Puzzle 3: Hidden Code (Attic Safe) ---
class HiddenCodePuzzle {
    constructor() {
        this.overlay = document.getElementById('overlay-puzzle-code');
        this.inputField = document.getElementById('safe-code-input');
        this.submitBtn = document.getElementById('btn-submit-code');
        this.feedback = document.getElementById('feedback-code');
        
        this.correctCode = "1952"; // Tied to the timeline mechanic

        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => this.verifyCode());
        }
    }

    verifyCode() {
        if (!this.inputField) return;

        const userInput = this.inputField.value.trim();
        
        if (userInput === this.correctCode) {
            this.feedback.innerText = "The heavy iron door swings open.";
            this.feedback.style.color = "var(--color-gold-tarnished)";
            GameState.setFlag('atticSafeUnlocked', true);
            PlayerInventory.addItem('photograph_1952');
            AudioController.playSound('door_open');
            
            setTimeout(() => {
                PuzzleController.closePuzzle('overlay-puzzle-code');
                Environment.refreshHotspots();
            }, 2000);
        } else {
            this.feedback.innerText = "Incorrect sequence.";
            this.feedback.style.color = "var(--color-blood)";
            this.inputField.value = "";
        }
    }
}

// --- Puzzle 4: Time Synchronization (Music Room Clocks) ---
class TimeSyncPuzzle {
    constructor() {
        this.clock1952 = { hour: 12, minute: 0 };
        this.clock1998 = { hour: 3, minute: 15 };
        this.targetTime = { hour: 8, minute: 45 };

        this.btnAdvance = document.getElementById('btn-sync-advance');
        this.btnRewind = document.getElementById('btn-sync-rewind');
        this.feedback = document.getElementById('feedback-sync');

        this.bindEvents();
    }

    bindEvents() {
        if (this.btnAdvance) {
            this.btnAdvance.addEventListener('click', () => this.adjustTime(15));
        }
        if (this.btnRewind) {
            this.btnRewind.addEventListener('click', () => this.adjustTime(-15));
        }
    }

    adjustTime(minutes) {
        const currentTimeline = GameState.getTimeline();
        let activeClock = currentTimeline === 1952 ? this.clock1952 : this.clock1998;

        // Calculate new time
        let totalMinutes = activeClock.hour * 60 + activeClock.minute + minutes;
        
        if (totalMinutes < 0) totalMinutes += 12 * 60; // Handle 12-hour wrap around
        
        activeClock.hour = Math.floor(totalMinutes / 60) % 12;
        if (activeClock.hour === 0) activeClock.hour = 12;
        activeClock.minute = totalMinutes % 60;

        this.updateDisplay();
        this.checkSolution();
    }

    updateDisplay() {
        // Logic to rotate CSS hands on the clock face UI based on activeClock.hour and activeClock.minute
        // Implementation omitted for brevity, assumes DOM rotation transforms
        AudioController.playSound('clock_tick');
    }

    checkSolution() {
        if (this.clock1952.hour === this.targetTime.hour && 
            this.clock1952.minute === this.targetTime.minute &&
            this.clock1998.hour === this.targetTime.hour && 
            this.clock1998.minute === this.targetTime.minute) {
            
            if (this.feedback) {
                this.feedback.innerText = "The timelines align. A passage opens.";
            }
            GameState.setFlag('musicRoomPassageOpen', true);
            setTimeout(() => PuzzleController.closePuzzle('overlay-puzzle-sync'), 2000);
        }
    }
}

// Initialize extended puzzles
const CodePuzzle = new HiddenCodePuzzle();
const SyncPuzzle = new TimeSyncPuzzle();

// ==========================================
// 17. SAVE / LOAD MENU INTEGRATION
// ==========================================
class SaveLoadUI {
    constructor() {
        this.btnSave = document.getElementById('btn-save-game');
        this.btnLoad = document.getElementById('btn-load-game');
        this.bindEvents();
    }

    bindEvents() {
        if (this.btnSave) {
            this.btnSave.addEventListener('click', () => {
                const success = GameState.saveGame(1);
                if (success) {
                    // Provide UI feedback
                    const originalText = this.btnSave.innerText;
                    this.btnSave.innerText = "Saved Successfully";
                    setTimeout(() => this.btnSave.innerText = originalText, 2000);
                }
            });
        }
    }
}

const SaveMenu = new SaveLoadUI();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 6: Mobile Inputs, Utilities, and Final Assembly
 */

// ==========================================
// 18. MOBILE INPUT & TOUCH HANDLING
// ==========================================
class MobileInputHandler {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeThreshold = 50;

        this.bindTouchEvents();
    }

    bindTouchEvents() {
        // Prevent default double-tap zooming on game elements
        document.addEventListener('dblclick', (e) => {
            e.preventDefault();
        }, { passive: false });

        // Swipe detection for closing overlays or opening inventory
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchEndX, touchEndY);
        }, { passive: true });
    }

    handleSwipe(endX, endY) {
        const deltaX = endX - this.touchStartX;
        const deltaY = endY - this.touchStartY;

        // Determine if swipe is primarily horizontal or vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal Swipe
            if (Math.abs(deltaX) > this.swipeThreshold) {
                if (deltaX > 0) {
                    this.onSwipeRight();
                } else {
                    this.onSwipeLeft();
                }
            }
        } else {
            // Vertical Swipe
            if (Math.abs(deltaY) > this.swipeThreshold) {
                if (deltaY > 0) {
                    this.onSwipeDown();
                } else {
                    this.onSwipeUp();
                }
            }
        }
    }

    onSwipeDown() {
        // Example: Swipe down to close active document or puzzle modal
        const activeModals = document.querySelectorAll('.screen-overlay.active:not(#main-menu)');
        if (activeModals.length > 0) {
            activeModals.forEach(modal => {
                modal.classList.remove('active');
                modal.classList.add('hidden');
            });
            AudioController.playSound('ui_click');
        }
    }

    onSwipeUp() {
        // Custom logic for swipe up (e.g., toggling inventory on smaller screens)
    }

    onSwipeLeft() {}
    onSwipeRight() {}
}

const MobileInput = new MobileInputHandler();

// ==========================================
// 19. UTILITY FUNCTIONS
// ==========================================
const Utils = {
    /**
     * Preloads an array of image URLs to prevent flickering during gameplay.
     * @param {Array<string>} imageUrls 
     */
    preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
        console.log(`[Utils] Preloaded ${imageUrls.length} image assets.`);
    },

    /**
     * Halts execution for a specified duration. Useful for narrative pacing.
     * @param {number} ms - Milliseconds to wait.
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Generates a random integer between min and max (inclusive).
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

// ==========================================
// 20. SYSTEM BOOTSTRAPPER & EVENT BINDING
// ==========================================
class Bootstrapper {
    constructor() {
        this.resizeTimer = null;
        this.initGlobalBindings();
    }

    initGlobalBindings() {
        // Handle window resizing to maintain aspect ratio safely
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.handleResize(), 200);
        });

        // Trigger initial resize check
        this.handleResize();

        // Preload critical assets immediately
        this.preloadCriticalAssets();
    }

    handleResize() {
        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const baseWidth = 1280;
        const baseHeight = 720;
        
        // Calculate scale factor to fit window while maintaining aspect ratio
        const scaleX = windowWidth / baseWidth;
        const scaleY = windowHeight / baseHeight;
        const scale = Math.min(scaleX, scaleY) * 0.95; // 0.95 adds a slight margin

        if (scale < 1) {
            appContainer.style.transform = `scale(${scale})`;
            appContainer.style.transformOrigin = 'center center';
        } else {
            appContainer.style.transform = 'none';
        }
    }

    preloadCriticalAssets() {
        // Collect all room backgrounds from the RoomData dictionary
        const backgroundsToPreload = [];
        for (const roomId in RoomData) {
            backgroundsToPreload.push(RoomData[roomId].bg_1998);
            backgroundsToPreload.push(RoomData[roomId].bg_1952);
        }

        // Collect item sprites
        for (const itemId in GameData.items) {
            backgroundsToPreload.push(GameData.items[itemId].sprite);
        }

        // Remove undefined/null entries and preload
        const cleanList = backgroundsToPreload.filter(url => url);
        Utils.preloadImages(cleanList);
    }
}

// Final execution sequence once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[Bootstrapper] DOM parsed. Initializing final systems.`);
    const AppBootstrapper = new Bootstrapper();
    
    // Dispatch a global event indicating the engine is fully loaded
    GameEvents.emit('engineReady', { timestamp: Date.now() });
});
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 7: Mid-Game Rooms, Items, Dialogues, and Additional Puzzles
 */

// ==========================================
// 21. EXTENDING DATA DICTIONARIES
// ==========================================

// Inject additional items into the existing GameData
Object.assign(GameData.items, {
    'rusty_knife': {
        id: 'rusty_knife',
        name: 'Rusty Knife',
        description: 'An old kitchen knife. The edge is dull and coated in dried, dark residue.',
        type: 'tool',
        sprite: 'assets/objects/knife.png'
    },
    'matches': {
        id: 'matches',
        name: 'Box of Matches',
        description: 'Only three matches remain inside. The cardboard is slightly damp.',
        type: 'consumable',
        sprite: 'assets/objects/matches.png'
    },
    'fuse_10a': {
        id: 'fuse_10a',
        name: '10A Fuse',
        description: 'A glass cylindrical fuse. The wire inside is intact.',
        type: 'hardware',
        sprite: 'assets/objects/fuse_10.png'
    },
    'fuse_20a': {
        id: 'fuse_20a',
        name: '20A Fuse',
        description: 'A heavy-duty fuse. It smells faintly of ozone.',
        type: 'hardware',
        sprite: 'assets/objects/fuse_20.png'
    }
});

// Inject additional dialogues
Object.assign(GameData.dialogues, {
    'inspect_sink_98': [
        { id: 'is1', speaker: 'The Archivist', text: 'The pipes are completely rusted through. There is a thick, dark sludge pooling near the drain.', timeline: 1998 }
    ],
    'inspect_sink_52': [
        { id: 'is2', speaker: 'The Child', text: 'Mother told me never to look down the drain. She says things live in the pipes.', timeline: 1952 }
    ],
    'inspect_basement_water': [
        { id: 'bw1', speaker: 'The Archivist', text: 'The lower level is completely flooded with stagnant water. I cannot cross until the pump is activated.', timeline: 1998 }
    ],
    'temporal_mismatch_error': [
        { id: 'tme1', speaker: 'System', text: 'This object does not exist in the current timeline.', timeline: 'both' }
    ]
});

// Inject mid-game room configurations
Object.assign(RoomData, {
    'room-kitchen': {
        id: 'room-kitchen',
        name: 'Abandoned Kitchen',
        bg_1998: 'assets/rooms/kitchen_98.png',
        bg_1952: 'assets/rooms/kitchen_52.png',
        hotspots: [
            {
                id: 'hs-kitchen-hallway',
                type: 'door',
                target: 'room-hallway',
                timeline: 'both',
                x: 10, y: 30, w: 12, h: 60,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-hallway')
            },
            {
                id: 'hs-kitchen-basement',
                type: 'door',
                target: 'room-basement',
                timeline: 'both',
                x: 85, y: 30, w: 10, h: 60,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-basement')
            },
            {
                id: 'hs-kitchen-sink',
                type: 'inspect',
                timeline: 'both',
                x: 40, y: 50, w: 15, h: 15,
                condition: () => true,
                onInteract: () => {
                    const dialogId = GameState.getTimeline() === 1998 ? 'inspect_sink_98' : 'inspect_sink_52';
                    Narrative.startDialogue(dialogId);
                }
            },
            {
                id: 'hs-kitchen-cabinet',
                type: 'puzzle',
                puzzleId: 'puzzle-pattern',
                timeline: 1952, // Puzzle only solvable in the past
                x: 60, y: 20, w: 15, h: 30,
                condition: () => !GameState.getFlag('cabinetUnlocked'),
                onInteract: () => PuzzleController.openPuzzle('puzzle-pattern')
            }
        ]
    },
    'room-music': {
        id: 'room-music',
        name: 'Music Room',
        bg_1998: 'assets/rooms/music_98.png',
        bg_1952: 'assets/rooms/music_52.png',
        hotspots: [
            {
                id: 'hs-music-hallway',
                type: 'door',
                target: 'room-hallway',
                timeline: 'both',
                x: 5, y: 35, w: 10, h: 55,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-hallway')
            },
            {
                id: 'hs-music-piano',
                type: 'puzzle',
                puzzleId: 'puzzle-melody',
                timeline: 'both',
                x: 30, y: 40, w: 40, h: 35,
                condition: () => !GameState.getFlag('pianoMelodyPlayed'),
                onInteract: () => PuzzleController.openPuzzle('puzzle-melody')
            },
            {
                id: 'hs-music-sheet',
                type: 'item',
                itemId: 'sheet_music',
                timeline: 1998,
                x: 45, y: 30, w: 10, h: 10,
                condition: () => !PlayerInventory.hasItem('sheet_music') && !GameState.getFlag('pianoMelodyPlayed'),
                onInteract: function() {
                    PlayerInventory.addItem(this.itemId);
                    Environment.refreshHotspots();
                }
            }
        ]
    },
    'room-basement': {
        id: 'room-basement',
        name: 'Flooded Basement',
        bg_1998: 'assets/rooms/basement_98.png',
        bg_1952: 'assets/rooms/basement_52.png',
        hotspots: [
            {
                id: 'hs-basement-kitchen',
                type: 'door',
                target: 'room-kitchen',
                timeline: 'both',
                x: 10, y: 20, w: 15, h: 70,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-kitchen')
            },
            {
                id: 'hs-basement-fusebox',
                type: 'puzzle',
                puzzleId: 'puzzle-fusebox',
                timeline: 1998,
                x: 60, y: 30, w: 12, h: 25,
                condition: () => !GameState.getFlag('fuseboxRepaired'),
                onInteract: () => PuzzleController.openPuzzle('puzzle-fusebox')
            },
            {
                id: 'hs-basement-water',
                type: 'inspect',
                timeline: 1998,
                x: 30, y: 85, w: 40, h: 15,
                condition: () => GameState.getFlag('basementFlooded'),
                onInteract: () => Narrative.startDialogue('inspect_basement_water')
            },
            {
                id: 'hs-basement-key',
                type: 'item',
                itemId: 'heart_key_right',
                timeline: 1952, // Key is only visible before the flood
                x: 75, y: 80, w: 5, h: 5,
                condition: () => !PlayerInventory.hasItem('heart_key_right'),
                onInteract: function() {
                    PlayerInventory.addItem(this.itemId);
                    Environment.refreshHotspots();
                }
            }
        ]
    }
});

// ==========================================
// 22. NEW PUZZLE CONTROLLERS
// ==========================================

// --- Puzzle 5: Cabinet Pattern Puzzle (Kitchen) ---
class PatternPuzzle {
    constructor() {
        this.overlay = document.getElementById('overlay-puzzle-pattern');
        this.tiles = document.querySelectorAll('.pattern-tile');
        this.feedback = document.getElementById('feedback-pattern');
        
        // 3x3 Grid State
        this.gridState = [
            false, false, false,
            false, false, false,
            false, false, false
        ];
        
        // Target pattern (X shape)
        this.targetPattern = [
            true, false, true,
            false, true, false,
            true, false, true
        ];

        this.bindEvents();
    }

    bindEvents() {
        if (!this.tiles || this.tiles.length === 0) return;

        this.tiles.forEach((tile, index) => {
            tile.addEventListener('click', () => {
                this.toggleTile(index);
                this.checkSolution();
            });
        });
    }

    toggleTile(index) {
        this.gridState[index] = !this.gridState[index];
        const tileEl = this.tiles[index];
        
        if (this.gridState[index]) {
            tileEl.classList.add('active');
        } else {
            tileEl.classList.remove('active');
        }
        
        AudioController.playSound('ui_click');
    }

    checkSolution() {
        const isSolved = this.gridState.every((val, index) => val === this.targetPattern[index]);
        
        if (isSolved) {
            if (this.feedback) {
                this.feedback.innerText = "The cabinet unlocks with a sharp click.";
                this.feedback.style.color = "var(--color-gold-tarnished)";
            }
            GameState.setFlag('cabinetUnlocked', true);
            PlayerInventory.addItem('matches');
            AudioController.playSound('door_open');
            
            setTimeout(() => {
                PuzzleController.closePuzzle('overlay-puzzle-pattern');
                Environment.refreshHotspots();
            }, 2000);
        }
    }
}

// --- Puzzle 6: Fusebox Puzzle (Basement) ---
class FuseboxPuzzle {
    constructor() {
        this.overlay = document.getElementById('overlay-puzzle-fusebox');
        this.slots = document.querySelectorAll('.fuse-slot');
        this.btnPower = document.getElementById('btn-activate-power');
        this.feedback = document.getElementById('feedback-fusebox');
        
        this.activeFuses = {
            slot1: null,
            slot2: null,
            slot3: null
        };

        this.bindEvents();
    }

    bindEvents() {
        if (!this.slots || this.slots.length === 0) return;

        this.slots.forEach(slot => {
            slot.addEventListener('click', (e) => this.handleSlotClick(e.currentTarget));
        });

        if (this.btnPower) {
            this.btnPower.addEventListener('click', () => this.attemptPowerOn());
        }
    }

    handleSlotClick(slotEl) {
        const slotId = slotEl.id;
        const requiredAmps = parseInt(slotEl.dataset.requiredAmps, 10);
        const selectedItem = UIController.selectedItemId;

        // If slot is already filled, remove it
        if (this.activeFuses[slotId]) {
            const removedItemId = this.activeFuses[slotId];
            PlayerInventory.addItem(removedItemId);
            this.activeFuses[slotId] = null;
            slotEl.classList.remove('filled');
            slotEl.innerText = `${requiredAmps}A`;
            AudioController.playSound('ui_click');
            return;
        }

        // Check if selected item is a fuse
        if (selectedItem && selectedItem.startsWith('fuse_')) {
            const fuseData = GameData.items[selectedItem];
            this.activeFuses[slotId] = selectedItem;
            PlayerInventory.removeItem(selectedItem);
            
            slotEl.classList.add('filled');
            slotEl.innerText = fuseData.name;
            AudioController.playSound('ui_click');
            
            // Dispatch event to clear selection
            GameEvents.emit('forceClearSelection');
        }
    }

    attemptPowerOn() {
        // Logic: specific slots need specific fuses
        const isCorrect = 
            this.activeFuses['slot1'] === 'fuse_10a' &&
            this.activeFuses['slot2'] === 'fuse_15a' &&
            this.activeFuses['slot3'] === 'fuse_20a';

        if (isCorrect) {
            if (this.feedback) {
                this.feedback.innerText = "Power restored. The water pump activates.";
                this.feedback.style.color = "var(--color-gold-tarnished)";
            }
            GameState.setFlag('fuseboxRepaired', true);
            GameState.setFlag('basementFlooded', false); // Drains the water
            AudioController.playSound('clock_tick'); // Placeholder for mechanical sound
            
            setTimeout(() => {
                PuzzleController.closePuzzle('overlay-puzzle-fusebox');
                Environment.refreshHotspots();
            }, 2500);
        } else {
            if (this.feedback) {
                this.feedback.innerText = "The breaker trips immediately. Incorrect voltage.";
                this.feedback.style.color = "var(--color-blood)";
            }
        }
    }
}

// Initialize the new mid-game puzzles
const CabinetPuzzle = new PatternPuzzle();
const PowerPuzzle = new FuseboxPuzzle();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 8: Attic Configuration, Final Items, and Temporal Synchronization
 */

// ==========================================
// 23. FINAL ITEM & DIALOGUE INJECTIONS
// ==========================================

Object.assign(GameData.items, {
    'mirror_shard': {
        id: 'mirror_shard',
        name: 'Mirror Shard',
        description: 'A jagged piece of reflective glass. The reflection seems slightly delayed.',
        type: 'tool',
        sprite: 'assets/objects/shard.png'
    },
    'attic_safe_key': {
        id: 'attic_safe_key',
        name: 'Brass Key',
        description: 'A small, heavy brass key covered in decades of dust.',
        type: 'key',
        sprite: 'assets/objects/key_brass.png'
    }
});

Object.assign(GameData.dialogues, {
    'inspect_attic_mirror_98': [
        { id: 'am1', speaker: 'The Archivist', text: 'The silvering on this mirror has completely degraded. I can barely see my own reflection.', timeline: 1998 },
        { id: 'am2', speaker: 'The Archivist', text: 'Wait. The shadow behind me... it is not moving when I do.', timeline: 1998 }
    ],
    'inspect_attic_mirror_52': [
        { id: 'am3', speaker: 'The Child', text: 'This is the mirror where the tall man watches me. He looks tired.', timeline: 1952 },
        { id: 'am4', speaker: 'The Child', text: 'Sometimes, if I touch the glass, it feels warm on the other side.', timeline: 1952 }
    ],
    'door_locked_chamber': [
        { id: 'dlc1', speaker: 'System', text: 'The door to the Clock Chamber is sealed shut. A heavy mechanical lock secures it.', timeline: 'both' }
    ]
});

// ==========================================
// 24. ATTIC ROOM CONFIGURATION
// ==========================================

Object.assign(RoomData, {
    'room-attic': {
        id: 'room-attic',
        name: 'Dusty Attic',
        bg_1998: 'assets/rooms/attic_98.png',
        bg_1952: 'assets/rooms/attic_52.png',
        hotspots: [
            {
                id: 'hs-attic-hallway',
                type: 'door',
                target: 'room-hallway',
                timeline: 'both',
                x: 80, y: 40, w: 10, h: 50,
                condition: () => true,
                onInteract: () => Environment.loadRoom('room-hallway')
            },
            {
                id: 'hs-attic-mirror',
                type: 'inspect',
                timeline: 'both',
                x: 15, y: 20, w: 15, h: 45,
                condition: () => true,
                onInteract: () => {
                    const dialogId = GameState.getTimeline() === 1998 ? 'inspect_attic_mirror_98' : 'inspect_attic_mirror_52';
                    Narrative.startDialogue(dialogId);
                    if (GameState.getTimeline() === 1952) GameState.setFlag('sawMirrorAnomaly', true);
                }
            },
            {
                id: 'hs-attic-safe',
                type: 'puzzle',
                puzzleId: 'puzzle-code', // The Hidden Code Puzzle created in Part 5
                timeline: 1998,
                x: 50, y: 65, w: 10, h: 15,
                condition: () => !GameState.getFlag('atticSafeUnlocked'),
                onInteract: () => PuzzleController.openPuzzle('puzzle-code')
            },
            {
                id: 'hs-attic-mask',
                type: 'item',
                itemId: 'porcelain_mask',
                timeline: 1952, // Must be found in the past
                x: 30, y: 50, w: 8, h: 12,
                condition: () => !PlayerInventory.hasItem('porcelain_mask'),
                onInteract: function() {
                    PlayerInventory.addItem(this.itemId);
                    Environment.refreshHotspots();
                }
            },
            {
                id: 'hs-attic-chamber',
                type: 'door',
                target: 'room-chamber',
                timeline: 'both',
                x: 40, y: 20, w: 20, h: 60,
                condition: () => true,
                onInteract: () => {
                    if (GameState.getFlag('atticSafeUnlocked') && PlayerInventory.hasItem('attic_safe_key')) {
                        Environment.loadRoom('room-chamber');
                    } else {
                        Narrative.startDialogue('door_locked_chamber');
                        AudioController.playSound('door_locked');
                    }
                }
            }
        ]
    }
});

// ==========================================
// 25. TEMPORAL SYNCHRONIZATION LOGIC
// ==========================================

class TemporalSyncController {
    constructor() {
        this.persistentObjects = [
            'porcelain_mask',
            'heart_key_complete'
        ];
        this.bindEvents();
    }

    bindEvents() {
        // Listen for timeline shifts to update environment logic dynamically
        GameEvents.subscribe('timelineShifted', (data) => {
            this.verifyTemporalIntegrity(data.newTimeline);
        });
    }

    /**
     * Ensures objects manipulated in 1952 properly reflect their state in 1998.
     * If an object is moved or destroyed in the past, it alters the future state.
     */
    verifyTemporalIntegrity(currentTimeline) {
        if (currentTimeline !== 1998) return;

        // Example logic: If the safe is opened in 1952 (hypothetical action),
        // it must remain open when shifting to 1998.
        if (GameState.getFlag('safe_opened_in_1952') && !GameState.getFlag('atticSafeUnlocked')) {
            GameState.setFlag('atticSafeUnlocked', true);
            console.log(`[TemporalSync] Temporal change detected. State updated for 1998.`);
            Environment.refreshHotspots();
        }

        // Check inventory paradoxes
        this.persistentObjects.forEach(itemId => {
            if (PlayerInventory.hasItem(itemId) && GameState.getFlag(`${itemId}_destroyed_in_past`)) {
                PlayerInventory.removeItem(itemId);
                console.warn(`[TemporalSync] Paradox resolved: ${itemId} ceased to exist.`);
            }
        });
    }

    /**
     * Method to process placing an item in the past to retrieve it in the future.
     */
    plantItemInPast(itemId, containerId) {
        if (GameState.getTimeline() !== 1952) {
            console.warn(`[TemporalSync] Cannot plant item outside of 1952.`);
            return false;
        }

        PlayerInventory.removeItem(itemId);
        GameState.setFlag(`planted_${itemId}_in_${containerId}`, true);
        AudioController.playSound('item_pickup');
        console.log(`[TemporalSync] Item ${itemId} planted in ${containerId} in 1952.`);
        
        return true;
    }

    /**
     * Method to retrieve an item planted in the past.
     */
    retrieveItemInFuture(itemId, containerId) {
        if (GameState.getTimeline() !== 1998) {
            console.warn(`[TemporalSync] Cannot retrieve planted item outside of 1998.`);
            return false;
        }

        if (GameState.getFlag(`planted_${itemId}_in_${containerId}`)) {
            PlayerInventory.addItem(itemId);
            GameState.setFlag(`planted_${itemId}_in_${containerId}`, false); // Remove it from the container
            AudioController.playSound('item_pickup');
            console.log(`[TemporalSync] Item ${itemId} retrieved from ${containerId} in 1998.`);
            return true;
        }

        return false;
    }
}

const TemporalMechanics = new TemporalSyncController();

// Modify the core RoomManager's shiftTimeline method to emit the temporal event
RoomManager.prototype.shiftTimeline = function() {
    GameState.switchTimeline();
    const newTimeline = GameState.getTimeline();
    document.getElementById('current-year-display').innerText = newTimeline;
    
    // Reload visuals and logic for the new timeline
    this.applyTimelineVisuals(this.currentRoomId);
    this.refreshHotspots();
    AudioController.playSound('timeline_shift');
    
    // Dispatch event for systems relying on timeline state
    GameEvents.emit('timelineShifted', { newTimeline: newTimeline });
    
    console.log(`[RoomManager] Timeline shifted to ${newTimeline}`);
};
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 9: Objective Tracking, Advanced Serialization, and Final Data
 */

// ==========================================
// 26. OBJECTIVE MANAGER
// ==========================================
class ObjectiveManager {
    constructor() {
        this.currentObjectiveId = null;
        this.objectives = {
            'obj_start': { text: "Investigate the ticking sound." },
            'obj_study': { text: "Find a way into the locked study." },
            'obj_power': { text: "Restore power to the flooded basement." },
            'obj_clock': { text: "Locate the three components for the mechanism." },
            'obj_final': { text: "Initiate the sequence." }
        };
        
        this.uiElement = document.getElementById('current-objective-text'); // Assumes this was added to HTML
        
        this.bindEvents();
    }

    bindEvents() {
        GameEvents.subscribe('engineReady', () => {
            this.setObjective('obj_start');
        });

        GameEvents.subscribe('timelineShifted', () => {
            this.evaluateObjectives();
        });
    }

    setObjective(objectiveId) {
        if (!this.objectives[objectiveId]) return;
        
        this.currentObjectiveId = objectiveId;
        const objectiveText = this.objectives[objectiveId].text;
        
        console.log(`[ObjectiveManager] New Objective: ${objectiveText}`);
        
        if (this.uiElement) {
            this.uiElement.innerText = objectiveText;
            // Trigger a brief UI flash to notify the player
            this.uiElement.classList.add('flash-update');
            setTimeout(() => this.uiElement.classList.remove('flash-update'), 1500);
        }
    }

    evaluateObjectives() {
        // Evaluate state flags to automatically progress objectives
        if (this.currentObjectiveId === 'obj_start' && GameState.getFlag('heardFirstTape')) {
            this.setObjective('obj_study');
        } else if (this.currentObjectiveId === 'obj_study' && GameState.getFlag('deskLockSolved')) {
            this.setObjective('obj_power');
        } else if (this.currentObjectiveId === 'obj_power' && GameState.getFlag('fuseboxRepaired')) {
            this.setObjective('obj_clock');
        } else if (this.currentObjectiveId === 'obj_clock' && GameState.getFlag('clockMechanismReady')) {
            this.setObjective('obj_final');
        }
    }
}

const Objectives = new ObjectiveManager();

// ==========================================
// 27. ADVANCED STATE SERIALIZATION
// ==========================================
// This extends the GameState from Part 1 to handle complex nested objects.

StateManager.prototype.exportSaveData = function() {
    // Generate a secure, base64 encoded save string
    const rawState = {
        version: EngineConfig.version,
        timestamp: Date.now(),
        data: this.state
    };
    
    try {
        const jsonString = JSON.stringify(rawState);
        const encodedString = btoa(unescape(encodeURIComponent(jsonString)));
        return encodedString;
    } catch (error) {
        console.error(`[StateManager] Failed to encode save data:`, error);
        return null;
    }
};

StateManager.prototype.importSaveData = function(encodedString) {
    try {
        const jsonString = decodeURIComponent(escape(atob(encodedString)));
        const parsedState = JSON.parse(jsonString);
        
        // Version checking
        if (parsedState.version !== EngineConfig.version) {
            console.warn(`[StateManager] Save version mismatch. Expected ${EngineConfig.version}, got ${parsedState.version}. Attempting to load anyway.`);
        }
        
        this.state = parsedState.data;
        console.log(`[StateManager] Save data imported successfully. Timestamp: ${new Date(parsedState.timestamp).toLocaleString()}`);
        return true;
    } catch (error) {
        console.error(`[StateManager] Failed to decode save data:`, error);
        return false;
    }
};

// Update the Save/Load UI to use the new serialization
SaveLoadUI.prototype.bindEvents = function() {
    if (this.btnSave) {
        this.btnSave.addEventListener('click', () => {
            const saveData = GameState.exportSaveData();
            if (saveData) {
                localStorage.setItem('hollowClock_save_slot1', saveData);
                const originalText = this.btnSave.innerText;
                this.btnSave.innerText = "Data Serialized & Saved";
                AudioController.playSound('ui_click');
                setTimeout(() => this.btnSave.innerText = originalText, 2000);
            }
        });
    }

    if (this.btnLoad) {
        this.btnLoad.addEventListener('click', () => {
            const encodedData = localStorage.getItem('hollowClock_save_slot1');
            if (encodedData && GameState.importSaveData(encodedData)) {
                // Re-initialize environment based on loaded state
                Environment.loadRoom(GameState.state.currentRoom);
                PlayerInventory._triggerUpdate();
                Objectives.evaluateObjectives();
                document.getElementById('current-year-display').innerText = GameState.getTimeline();
                
                // Hide main menu
                document.getElementById('main-menu').classList.remove('active');
                document.getElementById('main-menu').classList.add('hidden');
                document.getElementById('game-container').classList.remove('hidden');
            }
        });
    }
};

// Re-bind the updated SaveLoadUI events
SaveMenu.bindEvents();

// ==========================================
// 28. PUZZLE 7: MUSIC BOX (COMBINATION MECHANIC)
// ==========================================
class MusicBoxPuzzle {
    constructor() {
        this.overlay = document.getElementById('overlay-puzzle-musicbox');
        this.cylinderInput = document.getElementById('musicbox-cylinder-input'); // Drop zone for items
        this.btnCrank = document.getElementById('btn-crank-musicbox');
        this.feedback = document.getElementById('feedback-musicbox');
        
        this.cylinderInserted = false;
        
        this.bindEvents();
    }

    bindEvents() {
        if (!this.cylinderInput || !this.btnCrank) return;

        this.cylinderInput.addEventListener('click', () => {
            const selectedItem = UIController.selectedItemId;
            
            // Requires a specific combined item from the inventory
            if (selectedItem === 'music_box_cylinder') {
                this.cylinderInserted = true;
                this.cylinderInput.classList.add('filled');
                this.cylinderInput.innerText = "Cylinder Inserted";
                
                PlayerInventory.removeItem('music_box_cylinder');
                GameEvents.emit('forceClearSelection');
                AudioController.playSound('ui_click');
            }
        });

        this.btnCrank.addEventListener('click', () => {
            if (this.cylinderInserted) {
                AudioController.playSound('theme_1952'); // Plays the music box theme
                if (this.feedback) {
                    this.feedback.innerText = "The music box plays a haunting melody. A compartment underneath slides open.";
                    this.feedback.style.color = "var(--color-gold-tarnished)";
                }
                
                // Rewards the player with the final mechanism part if in the correct timeline
                if (!PlayerInventory.hasItem('porcelain_mask') && GameState.getTimeline() === 1952) {
                    PlayerInventory.addItem('porcelain_mask');
                    GameState.setFlag('musicBoxSolved', true);
                }
                
                setTimeout(() => {
                    PuzzleController.closePuzzle('overlay-puzzle-musicbox');
                    Environment.refreshHotspots();
                }, 3500);
            } else {
                if (this.feedback) {
                    this.feedback.innerText = "The crank turns, but nothing happens. A cylinder is missing.";
                    this.feedback.style.color = "var(--color-ui-text-secondary)";
                }
                AudioController.playSound('clock_tick');
            }
        });
    }
}

const FinalMusicBoxPuzzle = new MusicBoxPuzzle();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 10: Cinematic Sequences, Ambient Tension, and Engine Export
 */

// ==========================================
// 29. CINEMATIC & EVENT MANAGER
// ==========================================
class CinematicManager {
    constructor() {
        this.overlay = document.getElementById('cinematic-overlay'); // Assumes HTML inclusion
        this.imageEl = document.getElementById('cinematic-image');
        this.textEl = document.getElementById('cinematic-text');
        this.isPlaying = false;
        
        this.bindEvents();
    }

    bindEvents() {
        GameEvents.subscribe('triggerMidGameRevelation', () => {
            this.playRevelationSequence();
        });
    }

    playSequence(sequenceData) {
        if (!this.overlay || this.isPlaying) return;
        this.isPlaying = true;

        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('active');
        
        // Handle sequence steps via async/await for precise timing
        this.executeSteps(sequenceData);
    }

    async executeSteps(steps) {
        for (const step of steps) {
            if (step.image) {
                this.imageEl.src = step.image;
                this.imageEl.classList.add('fade-in');
            }
            if (step.text) {
                this.textEl.innerText = step.text;
                this.textEl.classList.add('fade-in');
            }
            if (step.sound) {
                AudioController.playSound(step.sound);
            }
            
            await Utils.sleep(step.durationMs);
            
            // Clear current step visuals
            this.imageEl.classList.remove('fade-in');
            this.textEl.classList.remove('fade-in');
            await Utils.sleep(500); // Brief pause between steps
        }

        this.endSequence();
    }

    endSequence() {
        this.overlay.classList.remove('active');
        this.overlay.classList.add('hidden');
        this.isPlaying = false;
        
        // Clear DOM
        this.imageEl.src = '';
        this.textEl.innerText = '';
        
        GameEvents.emit('cinematicComplete');
    }

    // Specific Mid-Game Event: The Changing Photographs
    playRevelationSequence() {
        const sequence = [
            {
                image: 'assets/objects/photo_52_close.png',
                text: "The photograph feels cold. The child's face is clear.",
                sound: 'clock_tick',
                durationMs: 3000
            },
            {
                image: 'assets/objects/photo_glitch.png',
                text: "Wait... the emulsion is shifting.",
                sound: 'ui_error',
                durationMs: 2000
            },
            {
                image: 'assets/objects/photo_98_close.png',
                text: "It's me. I am replacing them.",
                sound: 'heavy_thud',
                durationMs: 4000
            }
        ];
        
        AudioController.playMusic('theme_ending'); // Shift music tone
        this.playSequence(sequence);
        GameState.setFlag('sawPhotographAnomaly', true);
    }
}

const Cinematics = new CinematicManager();

// ==========================================
// 30. AMBIENT TENSION & TIME TICK SYSTEM
// ==========================================
class TensionSystem {
    constructor() {
        this.tickInterval = null;
        this.tensionLevel = 0; // 0 to 100
        this.maxTension = 100;
        
        // Start the background tension loop
        this.startTensionLoop();
    }

    startTensionLoop() {
        // Fires every 60 seconds
        this.tickInterval = setInterval(() => {
            if (GameState.state.currentRoom === 'main-menu') return;
            this.increaseTension();
        }, 60000);
    }

    increaseTension() {
        this.tensionLevel += 5;
        
        if (this.tensionLevel > this.maxTension) {
            this.tensionLevel = this.maxTension;
        }

        this.triggerAmbientEvent();
    }

    triggerAmbientEvent() {
        const roll = Utils.getRandomInt(1, 100);
        
        // Higher tension increases the chance of psychological horror events
        if (roll < this.tensionLevel) {
            this.executeRandomEvent();
            // Reset tension slightly after an event to pace the experience
            this.tensionLevel = Math.max(0, this.tensionLevel - 20);
        }
    }

    executeRandomEvent() {
        const events = [
            () => AudioController.playSound('distant_footsteps'),
            () => AudioController.playSound('clock_chime_distorted'),
            () => {
                // Subtle visual distortion on the room background
                const bg = document.querySelector('.room-scene.active .room-background');
                if (bg) {
                    bg.style.filter = 'contrast(1.5) hue-rotate(10deg)';
                    setTimeout(() => bg.style.filter = '', 200);
                }
            }
        ];

        const selectedEvent = events[Utils.getRandomInt(0, events.length - 1)];
        selectedEvent();
        console.log(`[TensionSystem] Ambient psychological event triggered.`);
    }

    resetTension() {
        this.tensionLevel = 0;
    }
}

const AmbientTension = new TensionSystem();

// ==========================================
// 31. ENGINE ENCAPSULATION & EXPORT
// ==========================================
// Expose only necessary modules to the global scope for debugging or external hooks.

window.HollowClockEngine = {
    Version: EngineConfig.version,
    State: GameState,
    Inventory: PlayerInventory,
    Environment: Environment,
    Narrative: Narrative,
    Audio: AudioController,
    Events: GameEvents,
    
    // Developer Utility: Force Timeline Shift
    debugShiftTimeline: () => {
        if (EngineConfig.debugMode) {
            Environment.shiftTimeline();
        } else {
            console.warn("Debug mode is disabled.");
        }
    },
    
    // Developer Utility: Grant All Items
    debugGrantItems: () => {
        if (EngineConfig.debugMode) {
            Object.keys(GameData.items).forEach(itemId => PlayerInventory.addItem(itemId));
        }
    }
};

console.log(`[Engine] Hollow Clock System Assembly Complete. Global namespace exposed as window.HollowClockEngine.`);
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 11: VFX, Settings, Advanced Saving, and Mask Assembly
 */

// ==========================================
// 32. VISUAL EFFECTS (VFX) MANAGER
// ==========================================
class VFXManager {
    constructor() {
        this.container = document.getElementById('room-viewport');
        this.activeParticles = [];
        this.maxParticles = 30;
        
        this.bindEvents();
    }

    bindEvents() {
        // Trigger glitch effect when timeline shifts
        GameEvents.subscribe('timelineShifted', () => {
            this.triggerScreenGlitch();
            this.spawnTemporalSparks();
        });
        
        // Start ambient dust loop for 1998 timeline
        setInterval(() => this.spawnAmbientDust(), 2000);
    }

    triggerScreenGlitch() {
        if (!this.container) return;
        
        this.container.style.animation = 'glitch-skew 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both';
        setTimeout(() => {
            this.container.style.animation = '';
        }, 400);
    }

    spawnTemporalSparks() {
        for (let i = 0; i < 15; i++) {
            this.createParticle('spark');
        }
    }

    spawnAmbientDust() {
        // Only spawn dust in the abandoned 1998 timeline
        if (GameState.getTimeline() !== 1998 || this.activeParticles.length >= this.maxParticles) return;
        
        this.createParticle('dust');
    }

    createParticle(type) {
        if (!this.container) return;

        const particle = document.createElement('div');
        particle.className = `vfx-particle vfx-${type}`;
        
        // Randomize starting position
        const startX = Utils.getRandomInt(0, 100);
        const startY = Utils.getRandomInt(0, 100);
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;

        if (type === 'dust') {
            particle.style.width = `${Utils.getRandomInt(2, 5)}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = 'rgba(200, 200, 200, 0.3)';
            particle.style.animation = `float-dust ${Utils.getRandomInt(5, 10)}s linear forwards`;
        } else if (type === 'spark') {
            particle.style.width = '3px';
            particle.style.height = '15px';
            particle.style.backgroundColor = 'var(--color-gold-tarnished)';
            particle.style.boxShadow = '0 0 5px var(--color-gold-tarnished)';
            particle.style.animation = `spark-fall ${Utils.getRandomInt(1, 3)}s ease-in forwards`;
        }

        this.container.appendChild(particle);
        this.activeParticles.push(particle);

        // Cleanup after animation completes
        particle.addEventListener('animationend', () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            this.activeParticles = this.activeParticles.filter(p => p !== particle);
        });
    }
}

const VisualEffects = new VFXManager();

// ==========================================
// 33. SETTINGS & ACCESSIBILITY MANAGER
// ==========================================
class SettingsManager {
    constructor() {
        this.ui = {
            menu: document.getElementById('settings-menu'),
            btnOpen: document.getElementById('btn-settings'),
            btnClose: document.getElementById('btn-close-settings'),
            volMaster: document.getElementById('vol-master'),
            volMusic: document.getElementById('vol-music'),
            volSfx: document.getElementById('vol-sfx'),
            textToggle: document.getElementById('toggle-large-text') // Assuming HTML addition
        };
        
        this.bindEvents();
    }

    bindEvents() {
        if (this.ui.btnOpen) {
            this.ui.btnOpen.addEventListener('click', () => this.openMenu());
        }
        
        if (this.ui.btnClose) {
            this.ui.btnClose.addEventListener('click', () => this.closeMenu());
        }

        // Volume Sliders
        if (this.ui.volMaster) {
            this.ui.volMaster.addEventListener('input', (e) => {
                AudioController.setMasterVolume(e.target.value);
            });
        }
        
        if (this.ui.volMusic) {
            this.ui.volMusic.addEventListener('input', (e) => {
                EngineConfig.audio.musicVolume = e.target.value / 100;
                if (AudioController.currentBGM) {
                    AudioController.currentBGM.volume = EngineConfig.audio.musicVolume * EngineConfig.audio.masterVolume;
                }
            });
        }
        
        if (this.ui.volSfx) {
            this.ui.volSfx.addEventListener('input', (e) => {
                EngineConfig.audio.sfxVolume = e.target.value / 100;
            });
        }
    }

    openMenu() {
        if (this.ui.menu) {
            this.ui.menu.classList.remove('hidden');
            this.ui.menu.classList.add('active');
        }
    }

    closeMenu() {
        if (this.ui.menu) {
            this.ui.menu.classList.remove('active');
            this.ui.menu.classList.add('hidden');
        }
    }
}

const GameSettings = new SettingsManager();

// ==========================================
// 34. ADVANCED SAVE SYSTEM (MULTI-SLOT & AUTOSAVE)
// ==========================================
class AdvancedSaveSystem {
    constructor() {
        this.autoSaveInterval = null;
        this.startAutoSave();
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            // Only autosave if the game is actively running (not in main menu)
            if (GameState.state.currentRoom !== 'main-menu' && !Cinematics.isPlaying) {
                this.performAutoSave();
            }
        }, EngineConfig.timings.autosaveIntervalMs);
    }

    performAutoSave() {
        const saveData = GameState.exportSaveData();
        if (saveData) {
            localStorage.setItem('hollowClock_autosave', saveData);
            console.log(`[SaveSystem] Autosave completed at ${new Date().toLocaleTimeString()}`);
            
            // Optional subtle UI indicator
            const indicator = document.getElementById('autosave-indicator');
            if (indicator) {
                indicator.classList.remove('hidden');
                indicator.classList.add('fade-in');
                setTimeout(() => {
                    indicator.classList.remove('fade-in');
                    indicator.classList.add('fade-out');
                    setTimeout(() => indicator.classList.add('hidden'), 800);
                }, 2000);
            }
        }
    }

    loadAutoSave() {
        const encodedData = localStorage.getItem('hollowClock_autosave');
        if (encodedData && GameState.importSaveData(encodedData)) {
            console.log(`[SaveSystem] Loaded from Autosave.`);
            return true;
        }
        return false;
    }
}

const SaveManager = new AdvancedSaveSystem();

// ==========================================
// 35. PUZZLE 8: MASK RESTORATION (ATTIC)
// ==========================================
class MaskRestorationPuzzle {
    constructor() {
        this.overlay = document.getElementById('overlay-puzzle-mask');
        this.dropZones = document.querySelectorAll('.mask-fragment-zone');
        this.feedback = document.getElementById('feedback-mask-puzzle');
        
        this.fragmentsPlaced = 0;
        this.totalFragments = 3; // Left, Right, Jaw

        this.bindEvents();
    }

    bindEvents() {
        if (!this.dropZones || this.dropZones.length === 0) return;

        this.dropZones.forEach(zone => {
            zone.addEventListener('click', (e) => this.handleFragmentPlacement(e.currentTarget));
        });
    }

    handleFragmentPlacement(zoneEl) {
        const requiredFragmentId = zoneEl.dataset.requiredFragment;
        const selectedItem = UIController.selectedItemId;

        if (zoneEl.classList.contains('filled')) return; // Already placed

        if (selectedItem === requiredFragmentId) {
            zoneEl.classList.add('filled');
            zoneEl.style.backgroundImage = `url(${GameData.items[selectedItem].sprite})`;
            
            PlayerInventory.removeItem(selectedItem);
            GameEvents.emit('forceClearSelection');
            AudioController.playSound('heavy_thud');
            
            this.fragmentsPlaced++;
            this.checkCompletion();
        } else if (selectedItem && selectedItem.includes('mask_fragment')) {
            if (this.feedback) {
                this.feedback.innerText = "That piece doesn't fit there.";
                this.feedback.style.color = "var(--color-ui-text-secondary)";
            }
        }
    }

    checkCompletion() {
        if (this.fragmentsPlaced === this.totalFragments) {
            if (this.feedback) {
                this.feedback.innerText = "The porcelain fuses together seamlessly. The mask is whole.";
                this.feedback.style.color = "var(--color-gold-tarnished)";
            }
            
            // Grant the complete mask
            PlayerInventory.addItem('porcelain_mask');
            GameState.setFlag('maskRestored', true);
            
            setTimeout(() => {
                PuzzleController.closePuzzle('overlay-puzzle-mask');
                Environment.refreshHotspots();
            }, 3000);
        }
    }
}

const MaskPuzzle = new MaskRestorationPuzzle();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 12: Final Documents, Room Entry Triggers, and Item Inspection
 */

// ==========================================
// 36. FINAL DOCUMENT INJECTIONS
// ==========================================

Object.assign(GameData.documents, {
    'doc_experiment_log_final': {
        title: 'Research Log - Day 104 (Final Entry)',
        content: `
            <p>The grandfather clock was never just a timepiece. It is an anchor.</p>
            <p>I have rebuilt the mechanism completely. The Hollow family failed because they lacked a suitable subject. They tried to merge two different minds. The rejection was catastrophic.</p>
            <p>To survive the temporal merge and achieve continuity, the minds must be identical. One must be the older, stronger vessel. The other must be the raw, malleable past.</p>
            <p class="blood-stain">I am sorry, little one. But you are me, and I must persist.</p>
        `
    },
    'doc_child_drawing': {
        title: 'A Child\'s Drawing',
        content: `
            <p class="handwriting" style="font-size: 32px; text-align: center;">He has my eyes.</p>
            <p style="text-align: center; margin-top: 40px;">
                <img src="assets/objects/drawing_monster.png" alt="A crude drawing of a tall man with a clock for a face." style="max-width: 80%; border: 1px solid #333;">
            </p>
            <p class="handwriting" style="font-size: 24px; text-align: center;">But he forgot how to cry.</p>
        `
    }
});

// Add the final items to trigger these documents
Object.assign(GameData.items, {
    'final_research_notes': {
        id: 'final_research_notes',
        name: 'Bloodstained Notes',
        description: 'The final pages of the experiment log. The handwriting is frantic.',
        type: 'document',
        sprite: 'assets/objects/notes_bloody.png'
    },
    'childs_drawing': {
        id: 'childs_drawing',
        name: 'Crumpled Drawing',
        description: 'A crayon drawing found under the floorboards.',
        type: 'document',
        sprite: 'assets/objects/drawing_item.png'
    }
});

// ==========================================
// 37. ROOM ENTRY NARRATIVE TRIGGERS
// ==========================================

class RoomEventTriggers {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Listen to the central event dispatcher for room changes
        GameEvents.subscribe('roomLoaded', (data) => {
            this.checkEntryEvents(data.roomId, data.timeline);
        });
    }

    checkEntryEvents(roomId, timeline) {
        const flagKey = `entered_${roomId}_${timeline}`;
        
        // Only trigger these events the very first time the room is entered in that specific timeline
        if (!GameState.getFlag(flagKey)) {
            GameState.setFlag(flagKey, true);
            this.executeEvent(roomId, timeline);
        }
    }

    executeEvent(roomId, timeline) {
        console.log(`[RoomEventTriggers] Executing first-entry event for ${roomId} in ${timeline}.`);

        if (roomId === 'room-attic' && timeline === 1998) {
            AudioController.playSound('heavy_thud');
            Narrative.startDialogue('first_entry_attic_98');
        } else if (roomId === 'room-chamber' && timeline === 1952) {
            AudioController.playMusic('theme_ending');
            Narrative.startDialogue('first_entry_chamber_52');
        } else if (roomId === 'room-basement' && timeline === 1998) {
            if (GameState.getFlag('basementFlooded')) {
                AudioController.playSound('water_drip');
            }
        }
    }
}

// Add these specific dialogues for the entry triggers
Object.assign(GameData.dialogues, {
    'first_entry_attic_98': [
        { id: 'fea1', speaker: 'The Archivist', text: 'It is freezing up here. And there are... hundreds of photographs scattered on the floor.', timeline: 1998 }
    ],
    'first_entry_chamber_52': [
        { id: 'fec1', speaker: 'The Child', text: 'The clock is so loud. It sounds like a heartbeat.', timeline: 1952 },
        { id: 'fec2', speaker: 'The Child', text: 'I think the tall man is inside it.', timeline: 1952 }
    ]
});

const RoomTriggers = new RoomEventTriggers();

// Modify RoomManager to emit the load event
const originalLoadRoom = RoomManager.prototype.loadRoom;
RoomManager.prototype.loadRoom = function(roomId) {
    originalLoadRoom.call(this, roomId);
    GameEvents.emit('roomLoaded', { roomId: roomId, timeline: GameState.getTimeline() });
};

// ==========================================
// 38. ADVANCED ITEM INSPECTION (3D ROTATION)
// ==========================================

class AdvancedItemInspector {
    constructor() {
        this.overlay = document.getElementById('overlay-item-3d'); // Needs HTML addition
        this.canvas = document.getElementById('item-3d-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        
        this.isDragging = false;
        this.previousX = 0;
        this.rotationY = 0;
        this.currentImageSequence = [];
        this.totalFrames = 36; // Assuming 36 frames for a full 360-degree rotation (10 degrees per frame)
        this.currentFrame = 0;

        this.bindEvents();
    }

    bindEvents() {
        if (!this.canvas) return;

        // Document overlay bindings
        const btnInspect3D = document.getElementById('btn-inspect-3d');
        if (btnInspect3D) {
            btnInspect3D.addEventListener('click', () => {
                const selectedItem = UIController.selectedItemId;
                if (selectedItem && GameData.items[selectedItem].has3DModel) {
                    this.openInspector(selectedItem);
                }
            });
        }

        const btnClose = document.getElementById('btn-close-3d');
        if (btnClose) {
            btnClose.addEventListener('click', () => this.closeInspector());
        }

        // Mouse/Touch Drag Events for Rotation
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e.clientX));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e.clientX));
        this.canvas.addEventListener('mouseup', () => this.endDrag());
        this.canvas.addEventListener('mouseleave', () => this.endDrag());

        this.canvas.addEventListener('touchstart', (e) => this.startDrag(e.touches[0].clientX), { passive: true });
        this.canvas.addEventListener('touchmove', (e) => this.drag(e.touches[0].clientX), { passive: true });
        this.canvas.addEventListener('touchend', () => this.endDrag());
    }

    openInspector(itemId) {
        if (!this.overlay) return;
        
        console.log(`[AdvancedItemInspector] Opening 3D view for ${itemId}.`);
        this.loadFrames(itemId);
        
        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('active');
        this.rotationY = 0;
        this.currentFrame = 0;
    }

    closeInspector() {
        if (!this.overlay) return;
        this.overlay.classList.remove('active');
        this.overlay.classList.add('hidden');
        this.currentImageSequence = [];
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    loadFrames(itemId) {
        this.currentImageSequence = [];
        let loadedCount = 0;

        for (let i = 0; i < this.totalFrames; i++) {
            const img = new Image();
            // Expected file structure: assets/objects/3d/heart_key_complete_00.png
            const frameNumber = i.toString().padStart(2, '0');
            img.src = `assets/objects/3d/${itemId}_${frameNumber}.png`;
            
            img.onload = () => {
                loadedCount++;
                if (loadedCount === this.totalFrames) {
                    this.renderFrame();
                }
            };
            this.currentImageSequence.push(img);
        }
    }

    startDrag(clientX) {
        this.isDragging = true;
        this.previousX = clientX;
        this.canvas.style.cursor = 'grabbing';
    }

    drag(clientX) {
        if (!this.isDragging) return;

        const deltaX = clientX - this.previousX;
        this.previousX = clientX;

        // Adjust rotation sensitivity
        if (Math.abs(deltaX) > 2) {
            if (deltaX > 0) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            } else {
                this.currentFrame = (this.currentFrame - 1 + this.totalFrames) % this.totalFrames;
            }
            this.renderFrame();
        }
    }

    endDrag() {
        this.isDragging = false;
        if (this.canvas) this.canvas.style.cursor = 'grab';
    }

    renderFrame() {
        if (!this.ctx || this.currentImageSequence.length !== this.totalFrames) return;
        
        const img = this.currentImageSequence[this.currentFrame];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Center the image in the canvas
        const x = (this.canvas.width - img.width) / 2;
        const y = (this.canvas.height - img.height) / 2;
        
        this.ctx.drawImage(img, x, y);
    }
}

// Mark specific items as having 3D inspection frames
GameData.items['heart_key_complete'].has3DModel = true;
GameData.items['porcelain_mask'].has3DModel = true;

const ItemInspector = new AdvancedItemInspector();

// ==========================================
// 39. FINAL INITIALIZATION CHECK
// ==========================================

GameEvents.subscribe('engineReady', () => {
    console.log(`[Engine] All systems confirmed operational.`);
    console.log(`[Engine] Total Items Loaded: ${Object.keys(GameData.items).length}`);
    console.log(`[Engine] Total Rooms Loaded: ${Object.keys(RoomData).length}`);
});
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 13: Map System, Achievements, and Gamepad Support
 */

// ==========================================
// 40. MAP & FAST TRAVEL SYSTEM
// ==========================================
class MapManager {
    constructor() {
        this.overlay = document.getElementById('overlay-map'); // Requires HTML addition
        this.container = document.getElementById('map-nodes-container');
        this.btnOpenMap = document.getElementById('btn-open-map');
        this.btnCloseMap = document.getElementById('btn-close-map');
        
        this.mapData = {
            'room-hallway': { x: 50, y: 70, label: 'Hallway' },
            'room-study': { x: 30, y: 70, label: 'Study' },
            'room-kitchen': { x: 70, y: 70, label: 'Kitchen' },
            'room-music': { x: 50, y: 50, label: 'Music Room' },
            'room-basement': { x: 70, y: 90, label: 'Basement' },
            'room-attic': { x: 50, y: 30, label: 'Attic' },
            'room-chamber': { x: 50, y: 10, label: 'Clock Chamber' }
        };

        this.bindEvents();
    }

    bindEvents() {
        if (this.btnOpenMap) {
            this.btnOpenMap.addEventListener('click', () => this.toggleMap());
        }

        if (this.btnCloseMap) {
            this.btnCloseMap.addEventListener('click', () => this.closeMap());
        }

        // Auto-unlock rooms on the map when entered
        GameEvents.subscribe('roomLoaded', (data) => {
            GameState.setFlag(`map_unlocked_${data.roomId}`, true);
        });
    }

    toggleMap() {
        if (!this.overlay) return;
        
        if (this.overlay.classList.contains('hidden')) {
            this.renderNodes();
            this.overlay.classList.remove('hidden');
            this.overlay.classList.add('active');
            AudioController.playSound('ui_click'); // Assume paper rustle sound
        } else {
            this.closeMap();
        }
    }

    closeMap() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            this.overlay.classList.add('hidden');
        }
    }

    renderNodes() {
        if (!this.container) return;
        this.container.innerHTML = '';

        for (const [roomId, coords] of Object.entries(this.mapData)) {
            // Only show rooms the player has visited
            if (!GameState.getFlag(`map_unlocked_${roomId}`)) continue;

            const node = document.createElement('div');
            node.className = `map-node ${GameState.state.currentRoom === roomId ? 'current-location' : ''}`;
            node.style.left = `${coords.x}%`;
            node.style.top = `${coords.y}%`;
            node.title = coords.label;

            const label = document.createElement('span');
            label.className = 'map-node-label';
            label.innerText = coords.label;
            node.appendChild(label);

            node.addEventListener('click', () => this.fastTravel(roomId));
            this.container.appendChild(node);
        }
    }

    fastTravel(roomId) {
        if (GameState.state.currentRoom === roomId) return;

        console.log(`[MapManager] Fast traveling to ${roomId}.`);
        this.closeMap();
        
        // Optional: Implement screen fade effect here
        Environment.loadRoom(roomId);
        AudioController.playSound('door_open');
    }
}

const NavigationMap = new MapManager();

// ==========================================
// 41. ACHIEVEMENT & TROPHY SYSTEM
// ==========================================
class AchievementManager {
    constructor() {
        this.uiContainer = document.getElementById('achievement-popups'); // Requires HTML addition
        
        this.achievements = {
            'ach_first_shift': { title: "Temporal Novice", desc: "Experience your first timeline shift.", icon: 'assets/ui/ach_time.png' },
            'ach_locksmith': { title: "Mechanic", desc: "Solve the study desk lock.", icon: 'assets/ui/ach_lock.png' },
            'ach_electrician': { title: "Let There Be Light", desc: "Restore power to the basement.", icon: 'assets/ui/ach_fuse.png' },
            'ach_mask_whole': { title: "A Familiar Face", desc: "Fully restore the porcelain mask.", icon: 'assets/ui/ach_mask.png' },
            'ach_truth': { title: "Ouroboros", desc: "Discover the truth behind the experiment.", icon: 'assets/ui/ach_truth.png' }
        };

        this.bindEvents();
    }

    bindEvents() {
        GameEvents.subscribe('timelineShifted', () => this.unlock('ach_first_shift'));
        GameEvents.subscribe('engineReady', () => {
            // Periodically check state for achievements that don't have explicit events
            setInterval(() => this.checkStateBasedAchievements(), 5000);
        });
    }

    checkStateBasedAchievements() {
        if (GameState.getFlag('deskLockSolved')) this.unlock('ach_locksmith');
        if (GameState.getFlag('fuseboxRepaired')) this.unlock('ach_electrician');
        if (GameState.getFlag('maskRestored')) this.unlock('ach_mask_whole');
        if (GameState.getFlag('foundTruthDocument')) this.unlock('ach_truth');
    }

    unlock(achievementId) {
        if (!this.achievements[achievementId]) return;
        
        const flagKey = `ach_unlocked_${achievementId}`;
        if (GameState.getFlag(flagKey)) return; // Already unlocked

        GameState.setFlag(flagKey, true);
        this.displayPopup(this.achievements[achievementId]);
        
        // Save state immediately to persist achievement
        GameState.saveGame(1);
    }

    displayPopup(achData) {
        if (!this.uiContainer) return;

        console.log(`[AchievementManager] Achievement Unlocked: ${achData.title}`);

        const popup = document.createElement('div');
        popup.className = 'achievement-popup fade-in-up';
        
        popup.innerHTML = `
            <img src="${achData.icon}" alt="Trophy" class="ach-icon" onerror="this.src='assets/ui/ach_default.png'">
            <div class="ach-text">
                <h4>Achievement Unlocked</h4>
                <h3>${achData.title}</h3>
                <p>${achData.desc}</p>
            </div>
        `;

        this.uiContainer.appendChild(popup);
        AudioController.playSound('achievement_chime'); // Assume positive chime sound

        setTimeout(() => {
            popup.classList.remove('fade-in-up');
            popup.classList.add('fade-out-up');
            setTimeout(() => {
                if (popup.parentNode) popup.parentNode.removeChild(popup);
            }, 500);
        }, 4000);
    }
}

const Achievements = new AchievementManager();

// ==========================================
// 42. GAMEPAD CONTROLLER MANAGER
// ==========================================
class GamepadController {
    constructor() {
        this.gamepads = {};
        this.pollingInterval = null;
        this.activeHotspotIndex = -1;
        this.currentHotspots = [];
        this.buttonStates = {
            A: false,
            B: false,
            X: false,
            Y: false,
            UP: false,
            DOWN: false,
            LEFT: false,
            RIGHT: false
        };

        this.init();
    }

    init() {
        window.addEventListener("gamepadconnected", (e) => {
            console.log(`[GamepadController] Gamepad connected: ${e.gamepad.id}`);
            this.gamepads[e.gamepad.index] = e.gamepad;
            this.startPolling();
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            console.log(`[GamepadController] Gamepad disconnected: ${e.gamepad.id}`);
            delete this.gamepads[e.gamepad.index];
            if (Object.keys(this.gamepads).length === 0) {
                this.stopPolling();
            }
        });
    }

    startPolling() {
        if (!this.pollingInterval) {
            this.pollingInterval = setInterval(() => this.pollGamepads(), 100); // 10Hz polling
        }
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    pollGamepads() {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < pads.length; i++) {
            if (pads[i]) {
                this.handleGamepadInput(pads[i]);
            }
        }
    }

    handleGamepadInput(pad) {
        // Standard mapping: 
        // 0 = A, 1 = B, 2 = X, 3 = Y
        // 12 = D-Pad Up, 13 = D-Pad Down, 14 = D-Pad Left, 15 = D-Pad Right

        // Handle D-Pad for hotspot cycling
        if (this.checkButton(pad, 14, 'LEFT') || this.checkButton(pad, 15, 'RIGHT')) {
            this.cycleHotspots(pad.buttons[15].pressed ? 1 : -1);
        }

        // Handle A button (Interact)
        if (this.checkButton(pad, 0, 'A')) {
            this.interactWithActiveHotspot();
        }

        // Handle B button (Cancel/Close/Menu)
        if (this.checkButton(pad, 1, 'B')) {
            this.handleCancelAction();
        }

        // Handle Y button (Open Inventory)
        if (this.checkButton(pad, 3, 'Y')) {
            // Implementation depends on UI overlay focus logic
            console.log("[GamepadController] Y button pressed - Open Inventory");
        }
    }

    checkButton(pad, buttonIndex, stateKey) {
        const isPressed = pad.buttons[buttonIndex].pressed;
        if (isPressed && !this.buttonStates[stateKey]) {
            this.buttonStates[stateKey] = true;
            return true; // Fired once on press down
        } else if (!isPressed) {
            this.buttonStates[stateKey] = false;
        }
        return false;
    }

    cycleHotspots(direction) {
        // Find all interactive elements currently in the DOM
        const hotspots = Array.from(document.querySelectorAll('.hotspot'));
        if (hotspots.length === 0) return;

        this.currentHotspots = hotspots;

        // Remove highlight from old
        if (this.activeHotspotIndex >= 0 && this.currentHotspots[this.activeHotspotIndex]) {
            this.currentHotspots[this.activeHotspotIndex].classList.remove('gamepad-focus');
        }

        // Increment/Decrement
        this.activeHotspotIndex += direction;
        if (this.activeHotspotIndex >= this.currentHotspots.length) {
            this.activeHotspotIndex = 0;
        } else if (this.activeHotspotIndex < 0) {
            this.activeHotspotIndex = this.currentHotspots.length - 1;
        }

        // Add highlight to new
        this.currentHotspots[this.activeHotspotIndex].classList.add('gamepad-focus');
        
        // Optional: Play a tiny click sound for feedback
        // AudioController.playSound('ui_click');
    }

    interactWithActiveHotspot() {
        if (Narrative.active) {
            // If dialogue is playing, A button advances it
            Narrative.advance();
            return;
        }

        if (this.activeHotspotIndex >= 0 && this.currentHotspots[this.activeHotspotIndex]) {
            // Simulate a mouse click on the focused hotspot
            this.currentHotspots[this.activeHotspotIndex].click();
        }
    }

    handleCancelAction() {
        // Close any active modal, puzzle, or document
        const activeModals = document.querySelectorAll('.screen-overlay.active:not(#main-menu)');
        if (activeModals.length > 0) {
            activeModals.forEach(modal => {
                modal.classList.remove('active');
                modal.classList.add('hidden');
            });
            AudioController.playSound('ui_click');
            PuzzleController.activePuzzle = null;
        }
    }
}

const GamepadInput = new GamepadController();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 14: Weather System, Localization, and Debug Console
 */

// ==========================================
// 43. WEATHER & ADVANCED PARTICLE SYSTEM
// ==========================================
class WeatherManager {
    constructor() {
        this.container = document.getElementById('weather-layer'); // Assumes HTML addition over viewport
        this.currentWeather = 'none';
        this.particles = [];
        this.maxParticles = 100;
        this.animationFrameId = null;

        if (!this.container) {
            this.createWeatherLayer();
        }
    }

    createWeatherLayer() {
        this.container = document.createElement('div');
        this.container.id = 'weather-layer';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '5'; // Above room, below UI
        this.container.style.overflow = 'hidden';
        
        const viewport = document.getElementById('room-viewport');
        if (viewport) viewport.appendChild(this.container);
    }

    setWeather(type) {
        this.currentWeather = type;
        this.clearParticles();

        if (type === 'rain') {
            this.maxParticles = 150;
            this.spawnRain();
        } else if (type === 'ash') {
            this.maxParticles = 50;
            this.spawnAsh();
        }
    }

    clearParticles() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        if (this.container) this.container.innerHTML = '';
        this.particles = [];
    }

    spawnRain() {
        for (let i = 0; i < this.maxParticles; i++) {
            const drop = document.createElement('div');
            drop.className = 'weather-drop rain';
            drop.style.left = `${Utils.getRandomInt(0, 100)}%`;
            drop.style.top = `${Utils.getRandomInt(-100, 0)}%`;
            drop.style.width = '2px';
            drop.style.height = `${Utils.getRandomInt(10, 25)}px`;
            drop.style.backgroundColor = 'rgba(150, 150, 180, 0.6)';
            drop.style.position = 'absolute';
            
            // Randomize fall speed
            const duration = Utils.getRandomInt(500, 1000) / 1000;
            drop.style.animation = `rain-fall ${duration}s linear infinite`;
            
            this.container.appendChild(drop);
            this.particles.push(drop);
        }

        // Add CSS keyframes dynamically if not present
        this.injectWeatherCSS();
    }

    spawnAsh() {
        for (let i = 0; i < this.maxParticles; i++) {
            const flake = document.createElement('div');
            flake.className = 'weather-drop ash';
            flake.style.left = `${Utils.getRandomInt(0, 100)}%`;
            flake.style.top = `${Utils.getRandomInt(-100, 100)}%`;
            flake.style.width = `${Utils.getRandomInt(3, 7)}px`;
            flake.style.height = flake.style.width;
            flake.style.backgroundColor = 'rgba(80, 80, 80, 0.8)';
            flake.style.borderRadius = '50%';
            flake.style.position = 'absolute';
            flake.style.filter = 'blur(1px)';
            
            const duration = Utils.getRandomInt(4000, 8000) / 1000;
            flake.style.animation = `ash-drift ${duration}s linear infinite`;
            
            this.container.appendChild(flake);
            this.particles.push(flake);
        }
    }

    injectWeatherCSS() {
        if (document.getElementById('weather-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'weather-styles';
        style.innerHTML = `
            @keyframes rain-fall {
                0% { transform: translateY(-10px) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(800px) translateX(-50px); opacity: 0; }
            }
            @keyframes ash-drift {
                0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
                20% { opacity: 0.8; }
                80% { opacity: 0.8; }
                100% { transform: translateY(400px) translateX(100px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

const EnvironmentWeather = new WeatherManager();

// ==========================================
// 44. LOCALIZATION & TRANSLATION ENGINE
// ==========================================
class LocalizationManager {
    constructor() {
        this.currentLanguage = 'en'; // Default
        this.dictionaries = {
            'en': {
                'ui_menu_new': 'New Game',
                'ui_menu_load': 'Continue',
                'ui_menu_settings': 'Settings',
                'ui_inv_empty': 'Empty',
                'ui_btn_use': 'Use',
                'ui_btn_combine': 'Combine',
                'room_hallway': 'Main Hallway',
                'room_study': 'Study Room',
                // Dialogues are typically structured dynamically, but UI is static
            },
            'es': {
                'ui_menu_new': 'Nueva Partida',
                'ui_menu_load': 'Continuar',
                'ui_menu_settings': 'Ajustes',
                'ui_inv_empty': 'Vacío',
                'ui_btn_use': 'Usar',
                'ui_btn_combine': 'Combinar',
                'room_hallway': 'Pasillo Principal',
                'room_study': 'Sala de Estudio',
            }
        };

        this.bindEvents();
    }

    bindEvents() {
        GameEvents.subscribe('languageChanged', (data) => {
            this.setLanguage(data.lang);
        });
    }

    setLanguage(langCode) {
        if (this.dictionaries[langCode]) {
            this.currentLanguage = langCode;
            console.log(`[LocalizationManager] Language switched to: ${langCode}`);
            this.refreshStaticUI();
        } else {
            console.warn(`[LocalizationManager] Language code '${langCode}' not found.`);
        }
    }

    // Translation lookup function
    t(key) {
        const dict = this.dictionaries[this.currentLanguage];
        if (dict && dict[key]) {
            return dict[key];
        }
        // Fallback to English, then to key itself
        return this.dictionaries['en'][key] || key;
    }

    refreshStaticUI() {
        // Find all elements with a data-i18n attribute and update their text
        const translatableElements = document.querySelectorAll('[data-i18n]');
        translatableElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (el.tagName === 'INPUT' && el.type === 'button') {
                el.value = this.t(key);
            } else {
                el.innerText = this.t(key);
            }
        });
    }
}

const Localization = new LocalizationManager();

// ==========================================
// 45. DEBUG CONSOLE OVERLAY
// ==========================================

class DebugConsole {
    constructor() {
        this.isVisible = false;
        this.history = [];
        this.historyIndex = -1;

        this.createConsoleUI();
        this.bindEvents();
    }

    createConsoleUI() {
        this.container = document.createElement('div');
        this.container.id = 'debug-console';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '40%';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        this.container.style.color = '#00ff00';
        this.container.style.fontFamily = 'monospace';
        this.container.style.zIndex = '9999';
        this.container.style.display = 'none';
        this.container.style.flexDirection = 'column';
        this.container.style.padding = '10px';
        this.container.style.boxSizing = 'border-box';

        this.outputArea = document.createElement('div');
        this.outputArea.style.flexGrow = '1';
        this.outputArea.style.overflowY = 'auto';
        this.outputArea.style.marginBottom = '10px';
        this.outputArea.style.whiteSpace = 'pre-wrap';

        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.style.width = '100%';
        this.inputField.style.backgroundColor = '#111';
        this.inputField.style.color = '#00ff00';
        this.inputField.style.border = '1px solid #333';
        this.inputField.style.padding = '5px';
        this.inputField.style.outline = 'none';

        this.container.appendChild(this.outputArea);
        this.container.appendChild(this.inputField);
        document.body.appendChild(this.container);
    }

    bindEvents() {
        // Toggle console with Backquote (`) key
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Backquote') {
                e.preventDefault();
                this.toggleConsole();
            }
        });

        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.inputField.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.history.push(command);
                    this.historyIndex = this.history.length;
                    this.inputField.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputField.value = this.history[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputField.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    this.inputField.value = '';
                }
            }
        });
    }

    toggleConsole() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.container.style.display = 'flex';
            this.inputField.focus();
            this.log('Debug Console Activated. Type "help" for commands.');
        } else {
            this.container.style.display = 'none';
        }
    }

    log(message, type = 'info') {
        const msgEl = document.createElement('div');
        msgEl.innerText = `> ${message}`;
        if (type === 'error') msgEl.style.color = '#ff4444';
        if (type === 'warn') msgEl.style.color = '#ffaa00';
        
        this.outputArea.appendChild(msgEl);
        this.outputArea.scrollTop = this.outputArea.scrollHeight;
    }

    executeCommand(cmdString) {
        this.log(cmdString);
        const args = cmdString.split(' ');
        const command = args[0].toLowerCase();

        try {
            switch (command) {
                case 'help':
                    this.log('Commands: help, give [itemId], flag set [flagId] [true/false], flag get [flagId], tp [roomId], timeline shift, weather [type]');
                    break;
                case 'give':
                    if (args[1] && GameData.items[args[1]]) {
                        PlayerInventory.addItem(args[1]);
                        this.log(`Gave item: ${args[1]}`);
                    } else {
                        this.log('Invalid item ID.', 'error');
                    }
                    break;
                case 'flag':
                    if (args[1] === 'set' && args[2] && args[3]) {
                        const val = args[3] === 'true';
                        GameState.setFlag(args[2], val);
                        this.log(`Flag ${args[2]} set to ${val}`);
                    } else if (args[1] === 'get' && args[2]) {
                        this.log(`Flag ${args[2]} = ${GameState.getFlag(args[2])}`);
                    } else {
                        this.log('Syntax: flag set [id] [bool] OR flag get [id]', 'error');
                    }
                    break;
                case 'tp':
                    if (args[1] && RoomData[args[1]]) {
                        Environment.loadRoom(args[1]);
                        this.log(`Teleported to ${args[1]}`);
                    } else {
                        this.log('Invalid room ID.', 'error');
                    }
                    break;
                case 'timeline':
                    if (args[1] === 'shift') {
                        Environment.shiftTimeline();
                        this.log('Timeline shifted.');
                    }
                    break;
                case 'weather':
                    if (args[1]) {
                        EnvironmentWeather.setWeather(args[1]);
                        this.log(`Weather set to: ${args[1]}`);
                    }
                    break;
                case 'clear':
                    this.outputArea.innerHTML = '';
                    break;
                default:
                    this.log(`Unknown command: ${command}`, 'error');
            }
        } catch (e) {
            this.log(`Execution error: ${e.message}`, 'error');
        }
    }
}

const Debug = new DebugConsole();
/**
 * ECHOES OF THE HOLLOW CLOCK - JAVASCRIPT ENGINE
 * Part 15: Asset Placeholder Generator & Final Boot Sequence
 */

// ==========================================
// 46. ASSET PLACEHOLDER GENERATOR (PROTOTYPING UTILITY)
// ==========================================
// This ensures your game runs even before you draw the actual art.
// It replaces broken image links with dynamically drawn canvas placeholders.

class AssetPlaceholderGenerator {
    constructor() {
        this.bindImageErrorHandling();
    }

    bindImageErrorHandling() {
        // Listen for image load errors globally
        document.addEventListener('error', (e) => {
            const target = e.target;
            if (target.tagName && target.tagName.toLowerCase() === 'img') {
                this.generatePlaceholder(target);
            }
        }, true); // Use capture phase to catch the error before it fails silently
    }

    generatePlaceholder(imgElement) {
        // Prevent infinite loops if the placeholder itself fails
        if (imgElement.dataset.placeholderGenerated) return;
        imgElement.dataset.placeholderGenerated = "true";

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Extract the filename from the broken URL to label the placeholder
        const srcPath = imgElement.src || imgElement.getAttribute('src');
        const filename = srcPath ? srcPath.split('/').pop() : 'Unknown Asset';

        // Set dimensions (defaults if the img tag doesn't specify)
        canvas.width = imgElement.clientWidth || 256;
        canvas.height = imgElement.clientHeight || 256;

        // Draw background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw border
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

        // Draw X in the middle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(0, canvas.height);
        ctx.strokeStyle = 'rgba(255, 68, 68, 0.3)';
        ctx.stroke();

        // Draw text label
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add a slight dark background behind the text for readability
        const textWidth = ctx.measureText(filename).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect((canvas.width - textWidth) / 2 - 5, (canvas.height / 2) - 10, textWidth + 10, 20);
        
        ctx.fillStyle = '#ffaa00';
        ctx.fillText(filename, canvas.width / 2, canvas.height / 2);

        // Replace the broken image source with the generated canvas data
        imgElement.src = canvas.toDataURL('image/png');
        console.warn(`[AssetGenerator] Created fallback placeholder for missing asset: ${filename}`);
    }
}

// Initialize the generator immediately so it catches errors during boot
const AssetGenerator = new AssetPlaceholderGenerator();

// ==========================================
// 47. AUDIO FALLBACK GENERATOR
// ==========================================
// Prevents the game from crashing if audio files are missing

const originalAudioPlay = Audio.prototype.play;
Audio.prototype.play = function() {
    return originalAudioPlay.call(this).catch(error => {
        if (error.name === 'NotSupportedError' || error.name === 'NotAllowedError') {
            // Usually means the browser blocked autoplay, which is normal
            console.log(`[Audio] Playback prevented by browser policy until user interacts.`);
        } else {
            console.warn(`[Audio] Missing or broken audio file: ${this.src}`);
        }
    });
};

// ==========================================
// 48. FINAL ASSEMBLED BOOT SEQUENCE
// ==========================================

// Ensure everything is bound and ready to go
window.addEventListener('load', () => {
    console.log(`=========================================`);
    console.log(` ECHOES OF THE HOLLOW CLOCK - BOOTING`);
    console.log(` Version: ${EngineConfig.version}`);
    console.log(`=========================================`);
    
    // Check if the user is on a mobile device and adjust UI slightly
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        console.log(`[System] Touch device detected. Enabling mobile input bindings.`);
        document.body.classList.add('mobile-device');
    }

    console.log(`[System] Engine is ready. Awaiting player to click 'New Game'.`);
});
