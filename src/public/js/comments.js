import axiosInstance from "./axiosInstance.js";
import displayToast from './toastHandler.js'

document.querySelector('form#commemt').addEventListener('submit', async (e) => {
  console.log('post a comment')
  e.preventDefault();
  const content = e.target.content.value;
  const threadId = e.target.dataset.threadId;
  await axiosInstance
    .post('/auth/comments', {content, threadId})
    .then(async (res) => {
      console.log(res.data);
      await axiosInstance.post('/auth-header/notifications', {user_id: res.data.ownerId, type: 'comment', post_id: threadId});
      window.location.href = `/auth/comments?id=${threadId}`;
    })
    .catch((err) => {
      let msg = '';
      if (err.request) {
        msg = err.message;
      } else if (err.response) {
        msg= err.response.data.message;
      }
      console.error(msg);
      displayToast(msg);
    });
});