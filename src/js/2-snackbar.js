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
    }
  });
});

function onInput(event) {
  formData.delayValue = event.target.value;
}
delay.addEventListener('input', onInput);

function onFormSubmit(event) {
  event.preventDefault();
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.stateValue === 'fulfilled') {
        resolve(`promise in ${formData.delayValue}ms`);
      } else {
        reject(`promise in ${formData.delayValue}ms`);
      }
    }, formData.delayValue);
  });

  promise
    .then(value =>
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled ` + value,
        position: 'topRight',
      })
    )
    .catch(error =>
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected ` + error,
        position: 'topRight',
      })
    )
    .finally(() => {
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
