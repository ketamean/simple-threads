
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

const $bottomNav = document.querySelector('.bottom-nav');
$bottomNav.addEventListener('click', function(event) {
    if (event.target.id === 'post') {
        console.log('post');
    }
})
