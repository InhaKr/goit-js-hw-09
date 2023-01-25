import {
  Notify
} from 'notiflix/build/notiflix-notify-aio';

const refs = {
  body: document.querySelector('body'),

  form: document.querySelector('form.form'),
  delay: document.querySelector('[name="delay"]'),
  step: document.querySelector('[name="step"]'),
  amount: document.querySelector('[name="amount"]'),
  btnCreatePromises: document.querySelector('button[data-create-promises]'),
}

refs.body.style.backgroundColor = '#bf170b';
refs.form.addEventListener('click', onPromiseCreate);

refs.btnCreatePromises.disabled = false;
refs.btnCreatePromises.style.backgroundColor = '#0bbf56';
// refs.btnCreatePromises.addEventListener('click', timerStart);

function onPromiseCreate(e) {
  e.preventDefault();

  const valueDelay = Number(refs.delay.value);
  const step = Number(refs.step.value);
  const amount = Number(refs.amount.value);

  for (let i = 1; i <= amount; i += 1) {
    let promiseDelay = valueDelay + step * i;

    createPromise(i, promiseDelay)
      .then(({
        position,
        delay
      }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({
        position,
        delay
      }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    if (createPromise) {
      refs.btnCreatePromises.disabled = true;
      refs.btnCreatePromises.style.backgroundColor = '#bfb60b';
    }

  }
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({
          position,
          delay
        });
      } else {
        reject({
          position,
          delay
        });
      }
    }, delay);
  });
}