
// Compose box functionality
const composeInput = document.querySelector('.compose-input');
const postButton = document.querySelector('.post-button');

composeInput.addEventListener('input', function() {
    postButton.disabled = !this.value.trim();
    postButton.classList.toggle('active', !postButton.disabled);
});

function createThread(threadContent) {
    const $thread = document.querySelector('.thread').cloneNode(true);
    console.log($thread);
    const $threadText = $thread.querySelector('.thread-text');
    $threadText.textContent = threadContent;
    const $feed = document.querySelector('.feed');
    $feed.prepend($thread); 
}

document.querySelector('.compose-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (composeInput.value.trim()) {
        composeInput.value = '';
        postButton.disabled = true;
        postButton.classList.remove('active');
        createThread(composeInput.value);
    }
});

// Like functionality
document.querySelectorAll('.action-button').forEach(button => {
    if (button.textContent.includes('♡')) {
        button.addEventListener('click', function() {
            const currentLikes = parseInt(this.textContent.split(' ')[1]);
            const isLiked = this.style.color === 'rgb(255, 255, 255)';
            
            this.textContent = `♡ ${isLiked ? currentLikes - 1 : currentLikes + 1}`;
            this.style.color = isLiked ? '#888' : '#fff';
        });
    }
});

const dropdownButton = document.querySelector('.dropdown-button');
const dropdownMenu = document.querySelector('.dropdown-menu');
const selectedText = document.querySelector('.selected-text');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// Toggle dropdown
dropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    dropdownMenu.classList.remove('active');
});

// Handle item selection
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Update selected text
        selectedText.textContent = item.textContent;
        
        // Update active state
        dropdownItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Close dropdown
        dropdownMenu.classList.remove('active');
        
        // Log selected value
        const selectedValue = item.dataset.value;
        console.log('Selected filter:', selectedValue);
    });
});