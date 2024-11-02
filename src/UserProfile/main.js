let love = document.querySelector('.love');
let loveIcon = document.querySelector('.iconoir-heart');
let likeNum = document.querySelector('.like-number');
love.addEventListener('click', () => {
    if (loveIcon.classList.contains('iconoir-heart-solid')) {
        likeNum.textContent = parseInt(likeNum.textContent) - 1;
        loveIcon.classList.remove('iconoir-heart-solid');
        loveIcon.classList.add('iconoir-heart');
        love.style.color = '#CCCCCC';
    } else {
        likeNum.textContent = parseInt(likeNum.textContent) + 1;
        loveIcon.classList.remove('iconoir-heart');
        loveIcon.classList.add('iconoir-heart-solid');
        love.style.color = '#fe0034';
    }
});