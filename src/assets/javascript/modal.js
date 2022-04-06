const body = document.body;
let backdrop;
let modal;
let cancel;
let confirm;

const createBackdrop = () => {
  backdrop = document.createElement('div');
  backdrop.classList.add('backdrop');
};

const createModal = (question) => {
  modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <p>${question}</p>
  `;
  cancel = document.createElement('button');
  cancel.innerText = 'Annuler'
  cancel.classList.add('btn', 'btn-secondary')
  confirm = document.createElement('button');
  confirm.innerText = 'Confirmer'
  confirm.classList.add('btn', 'btn-primary');
  modal.addEventListener('click', (e) => {
    e.stopPropagation();
  }); 
  modal.append(cancel, confirm)
};

export function openModal(question) {
  createBackdrop();
  createModal(question);
  backdrop.append(modal);
  body.append(backdrop);
  return new Promise((resolve, reject) => {
    backdrop.addEventListener('click', () => {
      resolve(false)
      backdrop.remove();
    });

    cancel.addEventListener('click', () => {
      resolve(false);
      backdrop.remove()
    })

    confirm.addEventListener('click', () => {
      resolve(true);
      backdrop.remove()
    })
  });
}
