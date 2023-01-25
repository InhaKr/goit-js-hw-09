import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {
  Notify
} from 'notiflix/build/notiflix-notify-aio';

// //мои ссылки
const refs = {
  body: document.querySelector('body'),

  dateInput: document.querySelector('input#datetime-picker'),
  btnStartTimer: document.querySelector('button[data-start-timer]'),
  daysRemaining: document.querySelector('[data-days]'),
  hoursRemaining: document.querySelector('[data-hours]'),
  minutesRemaining: document.querySelector('[data-minutes]'),
  secondsRemaining: document.querySelector('[data-seconds]'),
}

refs.body.style.backgroundColor = '#d6f2a5';

let timerId = null;
let remainingTime = 0;
let formatDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    onDateCheck(selectedDates[0]);
  }
}
refs.btnStartTimer.setAttribute('disabled', true);
// появление календаря
flatpickr(refs.dateInput, options);
refs.btnStartTimer.addEventListener('click', onBtnStart);

window.addEventListener('keydown', e => {
  if (e.code === 'Escape' && timerId) {
    clearInterval(timerId);

    refs.dateInput.removeAttribute('disabled');
    refs.btnStartTimer.setAttribute('disabled', true);

    refs.secondsRemaining.textContent = '00';
    refs.minutesRemaining.textContent = '00';
    refs.hoursRemaining.textContent = '00';
    refs.daysRemaining.textContent = '00';
  }
});

function onBtnStart() {
  timerId = setInterval(startTimer, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Оставшиеся дни
  const days = pad(Math.floor(ms / day));
  // Оставшиеся hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Оставшиеся minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Оставшиеся seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return {
    days,
    hours,
    minutes,
    seconds
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

// календарь для выбора
function onDateCheck(selectedDates) {
  const currentDate = Date.now();

  if (selectedDates < currentDate) {
    refs.btnStartTimer.setAttribute('disabled', true);
    return Notify.failure('Please choose a date in the future');
  };

  remainingTime = selectedDates.getTime() - currentDate;
  formatDate = convertMs(remainingTime);

  createMarkup(formatDate);
  refs.btnStartTimer.removeAttribute('disabled');

}

function startTimer() {

  refs.btnStartTimer.setAttribute('disabled', true);
  refs.dateInput.setAttribute('disabled', true);

  remainingTime -= 1000;

  if (refs.secondsRemaining.textContent <= 0 && refs.minutesRemaining.textContent <= 0) {
    Notify.success('Time end');
    clearInterval(timerId);
  } else {
    formatDate = convertMs(remainingTime);
    createMarkup(formatDate);
  }
}

function createMarkup(formatDate) {
  refs.secondsRemaining.textContent = formatDate.seconds;
  refs.minutesRemaining.textContent = formatDate.minutes;
  refs.hoursRemaining.textContent = formatDate.hours;
  refs.daysRemaining.textContent = formatDate.days;
}