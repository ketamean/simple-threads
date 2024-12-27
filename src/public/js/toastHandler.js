const toast = document.querySelector("#toast");
const toastContent = document.querySelector("#toast-content");

const showToast = (duration) => {
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(
    () => {hideToast();},
    duration
  );
};

const hideToast = () => {
  toast.classList.remove('flex');
  toast.classList.add('hidden');
};

const displayToast = (content, duration = 4000) => {
  console.log('show toast');
  toastContent.innerText = content;
  showToast(duration);
};

export default displayToast;