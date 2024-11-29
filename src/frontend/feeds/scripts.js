
function createThread(threadContent) {
    const $thread = document.querySelector('.thread').cloneNode(true);
    console.log($thread);
    const $threadText = $thread.querySelector('.thread-text');
    $threadText.textContent = threadContent;
    const $feed = document.querySelector('.feed');
    $feed.prepend($thread); 
}

// Like functionality
document.querySelectorAll('.like-button').forEach(button => {
    if (true) {
        button.addEventListener('click', function() {
            const currentLikes = parseInt(this.childNodes[1].textContent);
            const isLiked = this.style.color === 'rgb(255, 255, 255)';
            
            this.textContent = `♡ ${isLiked ? currentLikes - 1 : currentLikes + 1}`;
            this.style.color = isLiked ? '#888' : '#fff';
        });
    }
});

// Post functionality
const $postCancel = document.querySelector('#cancelButton');
$postCancel.addEventListener('click', () => {
    const $mainContainer = document.querySelector('.main-container');
    const $popupOverlay = document.querySelector('.popup-overlay');
    $popupOverlay.style.display = 'none';
    $mainContainer.style.display = 'block'; 
})

const textarea = document.querySelector('.thread-input');
textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});