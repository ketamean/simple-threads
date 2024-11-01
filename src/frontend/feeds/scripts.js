
// Compose box functionality
const composeInput = document.querySelector('.compose-input');
const postButton = document.querySelector('.post-button');

composeInput.addEventListener('input', function() {
    postButton.disabled = !this.value.trim();
    postButton.classList.toggle('active', !postButton.disabled);
});

document.querySelector('.compose-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (composeInput.value.trim()) {
        // Here you would normally send the post to your backend
        alert('Post submitted: ' + composeInput.value);
        composeInput.value = '';
        postButton.disabled = true;
        postButton.classList.remove('active');
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
        
        // You can emit an event or call a function here to handle the filter change
        const selectedValue = item.dataset.value;
        console.log('Selected filter:', selectedValue);
    });
});