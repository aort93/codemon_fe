var btn = document.getElementById('modal_opener');
var modal = document.querySelector('.modal');

function attachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').addEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').addEventListener('click', toggleModal);
}

function detachModalListeners(modalElm) {
  modalElm.querySelector('.close_modal').removeEventListener('click', toggleModal);
  modalElm.querySelector('.overlay').removeEventListener('click', toggleModal);
}

function toggleModal() {
  var currentState = modal.style.display;

  // If modal is visible, hide it. Else, display it.
  if (currentState === 'block') {
    modal.style.display = 'none';
    attachModalListeners(modal);
  } else {
    modal.style.display = 'block';
    detachModalListeners(modal);
  }
}

btn.addEventListener('click', toggleModal);
