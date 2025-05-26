import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = Date.now();
let deltaTime = {};
let idInterval = null;

const refs = {
  input: document.querySelector('#datetime-picker'),
  button: document.querySelector('[data-start]'),
};
refs.button.setAttribute('disabled', ' ');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (isFutureDate(selectedDates[0])) {
      userSelectedDate = selectedDates[0];
    }
  },
};
flatpickr(refs.input, options);

function isFutureDate(userSelectedDate) {
  if (userSelectedDate - Date.now() < 0 && idInterval === null) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: 'Please choose a date in the future',
    });
    refs.button.setAttribute('disabled', ' ');
    refs.input.removeAttribute('disabled', ' ');
    return false;
  } else {
    refs.button.removeAttribute('disabled');
    refs.input.setAttribute('disabled', ' ');
    return true;
  }
}

refs.button.addEventListener('click', () => {
  if (isFutureDate(userSelectedDate)) {
    refs.button.setAttribute('disabled', ' ');
    countdown.start();
  }
});

const countdown = {
  start() {
    idInterval = setInterval(() => {
      deltaTime = convertMs(userSelectedDate - Date.now());
      if (deltaTime.days < 0) {
        return this.stop();
      }
      updateTimerFace(deltaTime);
    }, 1000);
  },
  stop() {
    clearInterval(idInterval);
    idInterval = null;
    refs.input.removeAttribute('disabled', ' ');
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = deltaTime.days;
  document.querySelector('[data-hours]').textContent = deltaTime.hours;
  document.querySelector('[data-minutes]').textContent = deltaTime.minutes;
  document.querySelector('[data-seconds]').textContent = deltaTime.seconds;
}

// class Countdown {
//   constructor(onTick) {
//     let idInterval = null;
//     this.onTick = onTick;
//   }

//   init() {
//     const deltaTime = this.convertMs(userSelectedDate - Date.now());
//     this.onTick(deltaTime);
//   }

//   start() {
//     this.idInterval = setInterval(() => {
//       this.deltaTime = this.convertMs(userSelectedDate - Date.now());
//       if (deltaTime.days < 0) {
//         return this.stop();
//       }
//       updateTimerFace(this.deltaTime);
//     }, 1000);
//   }
//   stop() {
//     clearInterval(this.idInterval);
//     idInterval = null;
//     refs.input.removeAttribute('disabled', ' ');
//   }

//   // Helpers
//   convertMs(ms) {
//     // Number of milliseconds per unit of time
//     const second = 1000;
//     const minute = second * 60;
//     const hour = minute * 60;
//     const day = hour * 24;

//     // Remaining days
//     const days = this.addLeadingZero(Math.floor(ms / day));
//     // Remaining hours
//     const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
//     // Remaining minutes
//     const minutes = this.addLeadingZero(
//       Math.floor(((ms % day) % hour) / minute)
//     );
//     // Remaining seconds
//     const seconds = this.addLeadingZero(
//       Math.floor((((ms % day) % hour) % minute) / second)
//     );

//     return { days, hours, minutes, seconds };
//   }
//   addLeadingZero(value) {
//     return String(value).padStart(2, '0');
//   }
// }

// const timerInstance = new Countdown({ onTick: updateTimerFace });
