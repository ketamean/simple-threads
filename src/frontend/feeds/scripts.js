// Like functionality
document.querySelectorAll('.action-button').forEach(button => {
    if (button.id === "likes") {
        button.addEventListener('click', function() {
            $stat = button.querySelector('.stats');
            let num = parseInt($stat.textContent);
            $heart = button.querySelector('.iconoir-heart');
            if ($heart) {
                num += 1;
                $heart.classList.remove('iconoir-heart');
                $heart.classList.add('iconoir-heart-solid');
            } else {
                num -= 1;
                $heart = document.querySelector('.iconoir-heart-solid');
                $heart.classList.remove('iconoir-heart-solid');
                $heart.classList.add('iconoir-heart');
            }
            $stat.textContent = num;
        });
    }
});

const textarea = document.querySelector('.thread-input');
textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});