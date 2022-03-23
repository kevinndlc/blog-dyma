const iconMobile = document.querySelector('.header-menu-icon');
const headerMenu = document.querySelector('.header-menu')
console.log(headerMenu);
let isMenuOpen = false;
let mobileMenuDOM;

const createMobileMenu = () => {
  mobileMenuDOM = document.createElement('div');
  mobileMenuDOM.classList.add('mobile-menu');
  mobileMenuDOM.addEventListener('click', e => e.stopPropagation())
  mobileMenuDOM.append(headerMenu.querySelector('ul').cloneNode(true))
  headerMenu.appendChild(mobileMenuDOM)
};

const openMenu = () => {
  if (mobileMenuDOM) {
  } else {
    createMobileMenu();
  }
  mobileMenuDOM.classList.add('open')
};

const closeMenu = () => {
  mobileMenuDOM.classList.remove('open');
};

const toggleMobileMenu = (e) => {
  e.stopPropagation();

  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }

  isMenuOpen = !isMenuOpen
};

iconMobile.addEventListener('click', toggleMobileMenu);

window.addEventListener('click', (e) => {
  if (isMenuOpen) {
    toggleMobileMenu(e)
  }
})
