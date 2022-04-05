import '../assets/styles/styles.scss';
import './form.scss';

const form = document.querySelector('form');
const errorElement = document.getElementById('errors');
const btnCancel = document.querySelector('.btn-secondary');
let articleId;
let errors = [];

const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const img = document.querySelector('input[name="img"]');
  const category = document.querySelector('input[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector('textarea');

  author.value = article.author || '';
  img.value = article.img || '';
  category.value = article.category || '';
  title.value = article.title || '';
  content.value = article.content || '';
};

const initForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get('id');

  if (articleId) {
    const response = await fetch('https://restapi.fr/api/article/' + articleId);
    if (response.status < 300) {
      const article = await response.json();
      fillForm(article);
    }
  }
};

initForm();

btnCancel.addEventListener('click', () => {
  location.assign('./index.html');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const entries = formData.entries();

  // const article = Array.from(entries).reduce((acc, current) => {
  //   acc[current[0]] = current[1]
  //   return acc;
  // }, {});

  const article = Object.fromEntries(entries); // Façon optimisée

  if (formIsValid(article)) {
    try {
      const json = JSON.stringify(article);
      let response;
      if (articleId) {
        response = await fetch('https://restapi.fr/api/article/' + articleId, {
          method: 'PATCH',
          body: json,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        response = await fetch('https://restapi.fr/api/article', {
          method: 'POST',
          body: json,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      if (response.status < 299) {
        location.assign('./index.html');
      }
    } catch (error) {
      console.error(error);
    }
  }
});

const formIsValid = (article) => {
  errors = [];
  if (
    !article.author ||
    !article.category ||
    !article.content ||
    !article.title ||
    !article.img
  ) {
    errors.push('Vous devez renseigner tous les champs');
  } else {
    errors = [];
  }

  if (errors.length) {
    let errorHtml = '';
    errors.forEach((err) => {
      errorHtml += `<li>${err}</li>`;
    });
    errorElement.innerHTML = errorHtml;
    return false;
  } else {
    errorElement.innerHTML = '';
    return true;
  }
};
