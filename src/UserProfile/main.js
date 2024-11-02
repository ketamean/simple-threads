let love = document.querySelectorAll('.love');
let loveIcon = document.querySelectorAll('.iconoir-heart');
let likeNum = document.querySelectorAll('.like-number');
for (let i = 0; i < love.length; i++) {
    love[i].addEventListener('click', () => {
        if (loveIcon[i].classList.contains('iconoir-heart-solid')) {
            likeNum[i].textContent = parseInt(likeNum[i].textContent) - 1;
            loveIcon[i].classList.remove('iconoir-heart-solid');
            loveIcon[i].classList.add('iconoir-heart');
            love[i].style.color = '#CCCCCC';
        } else {
            likeNum[i].textContent = parseInt(likeNum[i].textContent) + 1;
            loveIcon[i].classList.remove('iconoir-heart');
            loveIcon[i].classList.add('iconoir-heart-solid');
            love[i].style.color = '#fe0034';
        }
    });
}