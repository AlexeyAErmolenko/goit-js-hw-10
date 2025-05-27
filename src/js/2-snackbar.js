import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let formData = { delayValue: '', stateValue: '' };

const refs = {
  delay: document.querySelector('input[type="number"]'),
  state: document.getElementsByName('state'),
  form: document.querySelector('.form'),
};
const { delay, state, form } = refs;

state.forEach(state => {
  state.addEventListener('change', () => {
    if (state.checked) {
      formData.stateValue = state.value;
      // console.log('🚀 ~ state.addEventListener:', formData);
    }
  });
});

function onInput(event) {
  formData.delayValue = event.target.value;
  // console.log('🚀 ~ delay.addEventListener:', formData);
}
delay.addEventListener('input', onInput);

function onFormSubmit(event) {
  event.preventDefault();
  // console.log('🚀 ~ onButtonSubmit:', formData);
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.stateValue === 'fulfilled') {
        resolve(
          iziToast.success({
            title: 'OK',
            message: `✅ Fulfilled promise in ${formData.delayValue}ms`,
            position: 'topRight',
          })
        );
      } else {
        reject(
          iziToast.error({
            title: 'Error',
            message: `❌ Rejected promise in ${formData.delayValue}ms`,
            position: 'topRight',
          })
        );
      }
    }, formData.delayValue);
  });

  promise.finally(() => {
    // formData = { delayValue: 0, stateValue: '' };
    // console.log('🚀 ~ promise.finally ~ formData:', formData);
    reset();
  });
}
form.addEventListener('submit', onFormSubmit);

function reset() {
  delay.value = '';
  state.forEach(state => {
    if (state.checked) {
      state.checked = false;
    }
  });
}
