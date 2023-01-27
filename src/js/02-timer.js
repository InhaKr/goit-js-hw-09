import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

// //мои ссылки
const refs = {
  body: document.querySelector('body'),

  btnStartTimer: document.querySelector('button[data-start-timer]'),
  daysRemaining: document.querySelector('[data-days]'),
  hoursRemaining: document.querySelector('[data-hours]'),
  minutesRemaining: document.querySelector('[data-minutes]'),
  secondsRemaining: document.querySelector('[data-seconds]'),
}

refs.body.style.backgroundColor = '#d6f2a5';

let selectedTime = null;
refs.btnStartTimer.disabled = true;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedTime = selectedDates[0].getTime();

    Notiflix.Notify.init({
      clickToClose: true
    });
    if (selectedTime < options.defaultDate) {

      Notiflix.Notify.failure('Please choose a date in the future')

    } else {
      Notiflix.Notify.success("Success");
      refs.btnStartTimer.disabled = false;
    }
    refs.btnStartTimer.addEventListener('click', onStartButtonElClick);
  }
};

flatpickr('#datetime-picker', options);

function onStartButtonElClick() {
  refs.btnStartTimer.disabled = true;
  const timerId = setInterval(() => {
    const currentTime = new Date().getTime();
    const timeDifference = selectedTime - currentTime;
    const convertedTime = convertMs(timeDifference);
    const {
      days,
      hours,
      minutes,
      seconds
    } = convertedTime;

    refs.secondsRemaining.innerHTML = createMarkup(seconds);
    refs.minutesRemaining.innerHTML = createMarkup(minutes);
    refs.hoursRemaining.innerHTML = createMarkup(hours);
    refs.daysRemaining.innerHTML = createMarkup(days);

    if (timeDifference < 1000) {
      clearInterval(timerId);
    }
    if (refs.secondsRemaining.textContent <= 0 && refs.minutesRemaining.textContent <= 0) {
      Notiflix.Notify.success('Time end');
    }
  }, 1000);
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Оставшиеся дни
  const days = Math.floor(ms / day);
  // Оставшиеся hours
  const hours = Math.floor((ms % day) / hour);
  // Оставшиеся minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Оставшиеся seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return {
    days,
    hours,
    minutes,
    seconds
  };
}

function createMarkup(value) {
  console.log(value)
  return String(value).padStart(2, '0')
}