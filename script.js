// Motivation messages
const motivationMessages = [
    "Bạn có thể làm được! 💪",
    "Bạn mạnh mẽ hơn bạn nghĩ! 🔥",
    "Hãy tiếp tục, bạn đang làm rất tốt! ⚡",
    "Mỗi ngày là một chiến thắng! 🏆",
    "Sức mạnh thật sự đến từ bên trong! 💎",
    "Bạn đang xây dựng kỷ luật! 🧠",
    "Kiên trì là chìa khóa thành công! 🔑",
    "Hôm nay là một ngày tuyệt vời! ✨",
    "Bạn đang đi đúng hướng! 🎯",
    "Tự chủ là sức mạnh lớn nhất! 🛡️",
    "Bạn là một chiến binh! ⚔️",
    "Tiếp tục chiến đấu! 💥"
];

// Initialize app
const TOTAL_DAYS = 30;
const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth(); // 0-11, October is 9, November is 10

// Get saved data from localStorage
let savedData = JSON.parse(localStorage.getItem('nnnTracker')) || {
    completedDays: [],
    lastUpdate: null,
    userName: ''
};

// Initialize calendar
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    for (let day = 1; day <= TOTAL_DAYS; day++) {
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item';
        dayItem.dataset.day = day;
        
        // Check if this day is today (only if we're in November)
        if (currentMonth === 10 && day === currentDay) {
            dayItem.classList.add('today');
        }
        
        // Check if this day is completed
        if (savedData.completedDays.includes(day)) {
            dayItem.classList.add('completed');
        }
        
        // Check if this day is in the past (can be marked)
        const isPast = currentMonth === 10 && day < currentDay;
        const isToday = currentMonth === 10 && day === currentDay;
        
        if (isPast || isToday || currentMonth > 10) {
            dayItem.addEventListener('click', () => toggleDay(day));
        } else {
            dayItem.style.opacity = '0.5';
            dayItem.style.cursor = 'not-allowed';
        }

        dayItem.innerHTML = `
            <div class="checkmark">✓</div>
            <div class="day-number">${day}</div>
            <div class="day-label">Tháng 11</div>
        `;

        calendarGrid.appendChild(dayItem);
    }
}

// Toggle day completion
function toggleDay(day) {
    const dayIndex = savedData.completedDays.indexOf(day);
    
    if (dayIndex > -1) {
        // Uncomplete (remove from array)
        savedData.completedDays.splice(dayIndex, 1);
    } else {
        // Complete (add to array)
        savedData.completedDays.push(day);
        savedData.completedDays.sort((a, b) => a - b);
        
        // Play completion animation
        const dayElement = document.querySelector(`[data-day="${day}"]`);
        if (dayElement) {
            dayElement.classList.add('completed');
        }
    }
    
    // Update last update date
    savedData.lastUpdate = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('nnnTracker', JSON.stringify(savedData));
    
    // Update UI
    updateStats();
    updateMotivation();
}

// Update statistics
function updateStats() {
    const completedDays = savedData.completedDays.length;
    const totalDays = completedDays;
    const daysRemaining = TOTAL_DAYS - completedDays;
    
    // Calculate current streak (consecutive days from day 1)
    let currentStreak = 0;
    for (let i = 1; i <= TOTAL_DAYS; i++) {
        if (savedData.completedDays.includes(i)) {
            currentStreak++;
        } else {
            break;
        }
    }
    
    // Update streak display
    document.getElementById('currentStreak').textContent = currentStreak;
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('daysRemaining').textContent = daysRemaining;
    
    // Update progress bar
    const progress = (completedDays / TOTAL_DAYS) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.round(progress) + '%';
    
    // Update calendar visual
    initCalendar();
}

// Update motivation message
function updateMotivation() {
    const completedDays = savedData.completedDays.length;
    const userName = savedData.userName || 'bạn';
    let message;
    
    if (completedDays === 0) {
        message = `${userName}, bắt đầu hành trình của bạn ngay hôm nay! 🚀`;
    } else if (completedDays < 7) {
        message = `${userName}, khởi đầu tốt đẹp! Tiếp tục phát huy! 🌱`;
    } else if (completedDays < 14) {
        message = `${userName}, bạn đã hoàn thành tuần đầu tiên! Tuyệt vời! 🎉`;
    } else if (completedDays < 21) {
        message = `${userName}, nửa chặng đường đã qua! Bạn đang làm rất tốt! 🔥`;
    } else if (completedDays < 30) {
        message = `${userName}, sắp về đích rồi! Đừng bỏ cuộc! 💪`;
    } else {
        message = `CHÚC MỪNG ${userName.toUpperCase()}! Bạn đã hoàn thành thử thách! 🏆🎊`;
    }
    
    // Randomly select from motivation messages if not at milestones
    if (completedDays > 0 && completedDays !== 7 && completedDays !== 14 && completedDays !== 21 && completedDays !== 30) {
        const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        message = `${userName}, ${randomMessage}`;
    }
    
    document.getElementById('motivationText').textContent = message;
}

// Initialize name input
function initNameInput() {
    const nameInput = document.getElementById('userName');
    const editBtn = document.getElementById('editNameBtn');
    
    // Load saved name
    if (savedData.userName) {
        nameInput.value = savedData.userName;
        nameInput.disabled = true;
        editBtn.textContent = '✏️';
    } else {
        nameInput.disabled = false;
        editBtn.textContent = '💾';
    }
    
    // Handle edit button click
    editBtn.addEventListener('click', () => {
        if (nameInput.disabled) {
            // Enable editing
            nameInput.disabled = false;
            nameInput.focus();
            editBtn.textContent = '💾';
        } else {
            // Save name
            saveName();
        }
    });
    
    // Handle Enter key
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveName();
        }
    });
    
    // Handle blur (when clicking outside)
    nameInput.addEventListener('blur', () => {
        if (nameInput.value.trim()) {
            saveName();
        }
    });
}

// Save name to localStorage
function saveName() {
    const nameInput = document.getElementById('userName');
    const editBtn = document.getElementById('editNameBtn');
    const name = nameInput.value.trim();
    
    if (name) {
        savedData.userName = name;
        localStorage.setItem('nnnTracker', JSON.stringify(savedData));
        nameInput.disabled = true;
        editBtn.textContent = '✏️';
        
        // Update motivation with name
        updateMotivation();
    } else {
        // If empty, keep it enabled
        nameInput.focus();
    }
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    initNameInput();
    initCalendar();
    updateStats();
    updateMotivation();
    
    // Update today's indicator daily
    setInterval(() => {
        const today = new Date();
        if (today.getDate() !== currentDay) {
            location.reload(); // Reload to update "today" indicator
        }
    }, 60000); // Check every minute
});

