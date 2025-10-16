// Firebase configuration for KURD DOWN
const firebaseConfig = {
  apiKey: "AIzaSyDrhCl3WrlF70bDCslUyl0i-EhRkw0rlLY",
  authDomain: "program-site.firebaseapp.com",
  projectId: "program-site",
  storageBucket: "program-site.firebasestorage.app",
  messagingSenderId: "893265540999",
  appId: "1:893265540999:web:55c95ff45e2e1cbd8f0522",
  measurementId: "G-95N9P2QG2C"
};

// Initialize Firebase (compat version for easier use)
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Make Firebase available globally
window.firebase = firebase;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;

console.log('Firebase initialized successfully');

// Initialize managers after Firebase is ready
function initializeManagers() {
    window.dbManager = new DatabaseManager();
    window.authManager = new AuthManager();
    console.log('Firebase managers initialized');
}

// Database operations
class DatabaseManager {
    constructor() {
        this.db = db;
        this.programsCollection = 'programs';
    }

    // Get all programs
    async getAllPrograms() {
        try {
            const querySnapshot = await getDocs(collection(this.db, this.programsCollection));
            const programs = [];
            
            querySnapshot.forEach((doc) => {
                programs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return programs;
        } catch (error) {
            console.error("Error getting programs:", error);
            throw error;
        }
    }

    // Get programs by platform
    async getProgramsByPlatform(platform) {
        try {
            const q = query(
                collection(this.db, this.programsCollection),
                where("platform", "==", platform),
                orderBy("name")
            );
            
            const querySnapshot = await getDocs(q);
            const programs = [];
            
            querySnapshot.forEach((doc) => {
                programs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return programs;
        } catch (error) {
            console.error("Error getting programs by platform:", error);
            throw error;
        }
    }

    // Get programs by category
    async getProgramsByCategory(category) {
        try {
            const q = query(
                collection(this.db, this.programsCollection),
                where("category", "==", category),
                orderBy("name")
            );
            
            const querySnapshot = await getDocs(q);
            const programs = [];
            
            querySnapshot.forEach((doc) => {
                programs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return programs;
        } catch (error) {
            console.error("Error getting programs by category:", error);
            throw error;
        }
    }

    // Get single program by ID
    async getProgramById(id) {
        try {
            const docRef = doc(this.db, this.programsCollection, id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                };
            } else {
                throw new Error("Program not found");
            }
        } catch (error) {
            console.error("Error getting program:", error);
            throw error;
        }
    }

    // Add new program
    async addProgram(programData) {
        try {
            const docRef = await addDoc(collection(this.db, this.programsCollection), {
                ...programData,
                createdAt: new Date(),
                updatedAt: new Date(),
                downloads: 0 // Initialize downloads to 0
            });
            
            return docRef.id;
        } catch (error) {
            console.error("Error adding program:", error);
            throw error;
        }
    }

    // Update program
    async updateProgram(id, programData) {
        try {
            const docRef = doc(this.db, this.programsCollection, id);
            await updateDoc(docRef, {
                ...programData,
                updatedAt: new Date()
            });
            
            return true;
        } catch (error) {
            console.error("Error updating program:", error);
            throw error;
        }
    }

    // Delete program
    async deleteProgram(id) {
        try {
            const docRef = doc(this.db, this.programsCollection, id);
            await deleteDoc(docRef);
            
            return true;
        } catch (error) {
            console.error("Error deleting program:", error);
            throw error;
        }
    }

    // Increment download count
    async incrementDownloadCount(programId) {
        try {
            const programRef = doc(this.db, this.programsCollection, programId);
            const programSnap = await getDoc(programRef);
            if (programSnap.exists()) {
                const currentDownloads = programSnap.data().downloads || 0;
                await updateDoc(programRef, { downloads: currentDownloads + 1 });
                return true;
            } else {
                console.warn("Program not found for download increment:", programId);
                return false;
            }
        } catch (error) {
            console.error("Error incrementing download count:", error);
            throw error;
        }
    }

    // Get total programs count
    async getTotalProgramsCount() {
        try {
            const querySnapshot = await getDocs(collection(this.db, this.programsCollection));
            return querySnapshot.size;
        } catch (error) {
            console.error("Error getting total programs count:", error);
            throw error;
        }
    }

    // Get total downloads count
    async getTotalDownloadsCount() {
        try {
            const querySnapshot = await getDocs(collection(this.db, this.programsCollection));
            let totalDownloads = 0;
            querySnapshot.forEach(doc => {
                totalDownloads += doc.data().downloads || 0;
            });
            return totalDownloads;
        } catch (error) {
            console.error("Error getting total downloads count:", error);
            throw error;
        }
    }

    // Search programs
    async searchPrograms(searchTerm) {
        try {
            // Note: Firestore doesn't support full-text search natively
            // This is a basic implementation that gets all programs and filters client-side
            const allPrograms = await this.getAllPrograms();
            
            return allPrograms.filter(program => 
                program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error("Error searching programs:", error);
            throw error;
        }
    }

    // Get featured programs
    async getFeaturedPrograms(limitCount = 6) {
        try {
            const q = query(
                collection(this.db, this.programsCollection),
                where("featured", "==", true),
                orderBy("createdAt", "desc"), // Order by creation date for featured
                limit(limitCount)
            );
            
            const querySnapshot = await getDocs(q);
            const programs = [];
            
            querySnapshot.forEach((doc) => {
                programs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return programs;
        } catch (error) {
            console.error("Error getting featured programs:", error);
            // If no featured programs, return recent programs
            return this.getRecentPrograms(limitCount);
        }
    }

    // Get recent programs
    async getRecentPrograms(limitCount = 6) {
        try {
            const q = query(
                collection(this.db, this.programsCollection),
                orderBy("createdAt", "desc"),
                limit(limitCount)
            );
            
            const querySnapshot = await getDocs(q);
            const programs = [];
            
            querySnapshot.forEach((doc) => {
                programs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return programs;
        } catch (error) {
            console.error("Error getting recent programs:", error);
            throw error;
        }
    }
}

// Authentication operations
class AuthManager {
    constructor() {
        this.auth = auth;
    }

    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    }

    async signOut() {
        try {
            await signOut(this.auth);
            return true;
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    }

    onAuthStateChanged(callback) {
        return this.auth.onAuthStateChanged(callback);
    }
}

// Storage operations
class StorageManager {
    constructor() {
        this.storage = storage;
    }

    async uploadFile(file, path) {
        try {
            const storageRef = ref(this.storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

    async deleteFile(url) {
        try {
            const fileRef = ref(this.storage, url);
            await deleteObject(fileRef);
            return true;
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
}

// Create manager instances
const dbManager = new DatabaseManager();
window.authManager = new AuthManager();
const storageManager = new StorageManager();

// Load programs on page load
document.addEventListener("DOMContentLoaded", async () => {
    
    if (programsGrid) {
        try {
            // Show loading state
            window.KURDIN?.showLoading();
            
            // Load featured programs for home page
            const programs = await dbManager.getFeaturedPrograms(12);
            
            // Hide loading state
            window.KURDIN?.hideLoading();
            
            // Display programs
            displayPrograms(programs);
            
        } catch (error) {
            console.error('Error loading programs:', error);
            window.KURDIN?.showError("حدث خطأ أثناء تحميل البرامج. يرجى المحاولة مرة أخرى.");
        }
    }

    // Update hero section stats with real data
    await updateHeroStats();
});

// Update hero section statistics with real data
async function updateHeroStats() {
    try {
        if (!window.dbManager) return;
        
        // Get total programs count
        const totalPrograms = await window.dbManager.getTotalProgramsCount();
        const totalProgramsElement = document.getElementById('heroTotalPrograms');
        if (totalProgramsElement) {
            totalProgramsElement.textContent = totalPrograms > 0 ? `${totalPrograms}+` : '0';
        }
        
        // Get total downloads count
        const totalDownloads = await window.dbManager.getTotalDownloadsCount();
        const totalDownloadsElement = document.getElementById('heroTotalDownloads');
        if (totalDownloadsElement) {
            totalDownloadsElement.textContent = totalDownloads > 0 ? `${totalDownloads.toLocaleString('ar-SA')}+` : '0';
        }
        
        // Update platform counts in quick access section
        const allPrograms = await window.dbManager.getAllPrograms();
        
        const windowsCount = allPrograms.filter(p => p.platform === 'windows').length;
        const androidCount = allPrograms.filter(p => p.platform === 'android').length;
        const iosCount = allPrograms.filter(p => p.platform === 'ios').length;
        
        // Update platform cards
        const windowsCountElement = document.getElementById('windowsPlatformCount');
        if (windowsCountElement) {
            windowsCountElement.textContent = windowsCount > 0 ? `${windowsCount}+ برنامج` : '0 برنامج';
        }
        
        const androidCountElement = document.getElementById('androidPlatformCount');
        if (androidCountElement) {
            androidCountElement.textContent = androidCount > 0 ? `${androidCount}+ تطبيق` : '0 تطبيق';
        }
        
        const iosCountElement = document.getElementById('iosPlatformCount');
        if (iosCountElement) {
            iosCountElement.textContent = iosCount > 0 ? `${iosCount}+ تطبيق` : '0 تطبيق';
        }
        
    } catch (error) {
        console.error('Error updating hero stats:', error);
    }
}

// Display programs in grid
function displayPrograms(programs) {
    const programsGrid = document.getElementById('programsGrid');
    
    if (!programsGrid) return;
    
    if (programs.length === 0) {
        programsGrid.innerHTML = `
            <div class="no-programs">
                <i class="fas fa-search"></i>
                <h3>لا توجد برامج</h3>
                <p>لم يتم العثور على برامج تطابق البحث</p>
            </div>
        `;
        return;
    }
    
    programsGrid.innerHTML = programs.map(program => 
        window.KURDIN?.createProgramCard(program) || createBasicProgramCard(program)
    ).join('');
}

// Basic program card creation (fallback)
function createBasicProgramCard(program) {
    return `
        <div class="program-card" data-platform="${program.platform}" data-category="${program.category}">
            <div class="program-image" onclick="goToDownloadPage('${program.id}')" style="cursor: pointer;">
                <img src="${program.image || '/images/default-app.png'}" alt="${program.name}" loading="lazy">
                <div class="program-overlay">
                    <i class="fas fa-download"></i>
                </div>
            </div>
            <div class="program-info">
                <h3 class="program-title">${program.name}</h3>
                <p class="program-description">${program.description}</p>
                <div class="program-meta">
                    <div class="program-platform">
                        <i class="fab fa-${getPlatformIcon(program.platform)}"></i>
                        <span>${getPlatformName(program.platform)}</span>
                    </div>
                    <div class="program-downloads">
                        <i class="fas fa-download"></i>
                        <span>${formatDownloads(program.downloads || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Navigate to download page
function goToDownloadPage(programId) {
    window.location.href = `download.html?id=${programId}`;
}

// Format downloads count
function formatDownloads(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Helper functions
function getPlatformIcon(platform) {
    const icons = {
        'windows': 'windows',
        'android': 'android',
        'ios': 'apple'
    };
    return icons[platform] || 'desktop';
}

function getPlatformName(platform) {
    const names = {
        'windows': 'ويندوز',
        'android': 'أندرويد',
        'ios': 'آيفون'
    };
    return names[platform] || platform;
}

// Download program function
async function downloadProgram(programId) {
    await dbManager.incrementDownloadCount(programId);
    const program = await dbManager.getProgramById(programId);
    if (program && program.downloadUrl) {
        window.open(program.downloadUrl, '_blank');
    } else {
        console.error("Download URL not found for program:", programId);
        alert("عذراً، رابط التحميل غير متوفر.");
    }
}

// Load programs data for specific platform
async function loadProgramsData(platform = null, featuredOnly = false) {
    try {
        let programs;
        if (featuredOnly) {
            programs = await dbManager.getFeaturedPrograms(12);
        } else if (platform) {
            programs = await dbManager.getProgramsByPlatform(platform);
        } else {
            // Default to featured programs if no platform is specified and not explicitly asking for all
            programs = await dbManager.getFeaturedPrograms(12);
        }
        
        return programs;
        
    } catch (error) {
        console.error("Error loading programs:", error);
        throw error;
    }
}

// Export for global use
window.dbManager = dbManager;
window.authManager = authManager;
window.storageManager = storageManager;
window.displayPrograms = displayPrograms;
window.updateHeroStats = updateHeroStats;
window.downloadProgram = downloadProgram;
window.loadProgramsData = loadProgramsData;




// Load sample data if database is empty
async function loadSampleDataIfEmpty() {
    try {
        const programs = await dbManager.getAllPrograms();
        
        if (programs.length === 0) {
            console.log('Database is empty, loading sample data...');
            
            // Import sample data
            if (typeof samplePrograms !== 'undefined') {
                const allPrograms = [
                    ...samplePrograms.windows,
                    ...samplePrograms.android,
                    ...samplePrograms.ios
                ];
                
                for (const program of allPrograms) {
                    try {
                        await dbManager.addProgram(program);
                        console.log(`Added sample program: ${program.name}`);
                    } catch (error) {
                        console.error(`Error adding sample program ${program.name}:`, error);
                    }
                }
                
                console.log('Sample data loaded successfully');
            }
        }
    } catch (error) {
        console.error('Error checking/loading sample data:', error);
    }
}

// Initialize sample data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase to initialize
    setTimeout(loadSampleDataIfEmpty, 2000);
});

// Make function globally available
window.loadSampleDataIfEmpty = loadSampleDataIfEmpty;

