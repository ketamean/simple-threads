import axiosInstance from "./axiosInstance.js";
import displayToast from './toastHandler.js'

document.querySelector('form#commemt').addEventListener('submit', async (e) => {
  console.log('post a comment')
  e.preventDefault();
  const content = e.target.content.value;
  const threadId = e.target.dataset.threadId;
  await axiosInstance
    .post('/auth/comments', {content, threadId})
    .then((res) => {
      console.log(res);
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