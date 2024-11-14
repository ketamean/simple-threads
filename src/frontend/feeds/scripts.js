
function createThread(threadContent) {
    const $thread = document.querySelector('.thread').cloneNode(true);
    console.log($thread);
    const $threadText = $thread.querySelector('.thread-text');
    $threadText.textContent = threadContent;
    const $feed = document.querySelector('.feed');
    $feed.prepend($thread); 
}

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

const $mainContainer = document.querySelector('.main-container');
const $popupOverlay = document.querySelector('.popup-overlay');

const $bottomNav = document.querySelector('.bottom-nav');
$bottomNav.addEventListener('click', (event) => {
    if (event.target.id === 'post') {

        $popupOverlay.style.display = 'block';
        $mainContainer.style.display = 'none'; 
    }
})

const $postCancel = document.querySelector('#cancelButton');
$postCancel.addEventListener('click', () => {
    $popupOverlay.style.display = 'none';
    $mainContainer.style.display = 'block'; 
})

const textarea = document.querySelector('.thread-input');

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

textarea.addEventListener('input', autoResize);
