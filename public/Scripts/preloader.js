document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 767.98) {
      const preloader = document.querySelector('.preloader');
      const formContainer = document.querySelector('.form-container');
      const formDesign = formContainer.querySelector('.form-design');
      const logo = formContainer.querySelector('.logo');
  
      logo.addEventListener('animationend', function() {
        preloader.style.display = 'none';
        formContainer.style.display = 'flex';
        formDesign.style.opacity = '1';
        formDesign.style.visibility = 'visible';
      });
    }
  });