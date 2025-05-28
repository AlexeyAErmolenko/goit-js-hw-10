import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = Date.now();
let deltaTime = { days: '00', hours: '00', minutes: '00', seconds: '00' };

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
      refs.button.removeAttribute('disabled');
    } else {
      refs.button.setAttribute('disabled', ' ');
      iziToast.error({
        title: 'Error',
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
    }
  },
};
flatpickr(refs.input, options);

function isFutureDate(userSelectedDate) {
  return userSelectedDate - Date.now() < 0 ? false : true;
}

function isTimerZero(deltaTime) {
  for (const value of Object.values(deltaTime)) {
    if (Number(value) !== 0) {
      return false;
    }
  }
  return true;
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = days;
  document.querySelector('[data-hours]').textContent = hours;
  document.querySelector('[data-minutes]').textContent = minutes;
  document.querySelector('[data-seconds]').textContent = seconds;
}

class Countdown {
  constructor({ onTick }) {
    idInterval: null;
    this.onTick = onTick;
    this.init();
  }

  init() {
    this.onTick(deltaTime);
  }

  // Метод start() не враховує ситуацію, коли різниця у часі стає негативною після початкової перевірки обраного часу. Умовна перевірка повинна також відбуватися в циклі зворотного виклику інтервалу.
  // Не згоден! Другий рядок в методі не дає змогу запустить таймер, коли час стає негативним після початкової перевірки обраного часу. Для чого додаткова умовна перевірка в циклі зворотного виклику інтервалу, якщо така ситуація може виникнути один раз при старті?
  start() {
    refs.button.setAttribute('disabled', ' ');
    if (isFutureDate(userSelectedDate)) {
      refs.input.setAttribute('disabled', ' ');
      this.idInterval = setInterval(() => {
        deltaTime = this.convertMs(userSelectedDate - Date.now());
        this.onTick(deltaTime);
        if (isTimerZero(deltaTime)) {
          return this.stop();
        }
      }, 1000);
    }
  }
  stop() {
    clearInterval(this.idInterval);
    this.idInterval = null;
    refs.input.removeAttribute('disabled', ' ');
  }

  // Helpers
  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timerInstance = new Countdown({ onTick: updateTimerFace });
refs.button.addEventListener('click', timerInstance.start.bind(timerInstance));
