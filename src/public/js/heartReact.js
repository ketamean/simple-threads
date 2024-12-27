import axiosInstance from "./axiosInstance.js";
const main = document.querySelector('main');

main.addEventListener('click', async (e) => {
  const target = e.target;
  const arrClassList = Array.from(target.classList);
  if (target.dataset.threadid && arrClassList.includes('heartReact')) {
    // a heartReact icon is clicked
    const threadId = target.dataset.threadid;
    if (arrClassList.includes('iconoir-heart')) {
      target.classList.remove('iconoir-heart');
      target.classList.add('iconoir-heart-solid');
    } else if (arrClassList.includes('iconoir-heart-solid')) {
      target.classList.remove('iconoir-heart-solid');
      target.classList.add('iconoir-heart');
    }
    await axiosInstance
      .post(`/auth/like`, {threadId})
      .then((res) => {
        console.log(res);
        if (res.data.liked == true) {
          target.classList.remove('iconoir-heart');
          target.classList.add('iconoir-heart-solid');
        } else if (res.data.liked == false) {
          target.classList.remove('iconoir-heart-solid');
          target.classList.add('iconoir-heart');
        } else {
          throw new Error('Clicking like error');
        }
        window.location.reload();
      }).
      catch((err) => {
        console.error(err);
      });
  }
});