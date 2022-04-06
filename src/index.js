import './assets/styles/styles.scss';
import './index.scss';
import { openModal } from './assets/javascript/modal';

const articlesContainerElement = document.querySelector('.articles-container');
const categoriesContainerElement = document.querySelector('.categories');
const selectElement = document.querySelector('select');
let filter;
let articles;
let sortBy = 'desc';

selectElement.addEventListener('change', (e) => {
  sortBy = e.target.value
  fetchArticles()
})

const createArticles = () => {
  const articlesDOM = articles
    .filter((article) => {
      if (filter) {
        return article.category === filter;
      } else {
        return true;
      }
    })
    .map((article) => {
      const articleDOM = document.createElement('div');
      articleDOM.classList.add('article');
      articleDOM.innerHTML = `
      <img src="${article.img}" alt="Profile">
      <h2 class="article-title">${article.title}</h2>
      <p class="article-author">${article.author} - ${new Date(
        article.createdAt
      ).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        year: 'numeric',
        month: 'long',
      })}</p>
      <p class="article-content">${article.content}</p>
      <div class="article-actions">
        <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
        <button class="btn btn-primary" data-id=${article._id}>Modifier</button>
      </div>
    `;
      return articleDOM;
    });

  articlesContainerElement.innerHTML = '';
  articlesContainerElement.append(...articlesDOM);
  const deleteButtons =
    articlesContainerElement.querySelectorAll('.btn-danger');
  const editButtons = articlesContainerElement.querySelectorAll('.btn-primary');

  editButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const target = e.target;
      const articleId = target.dataset.id;
      location.assign('/form.html?id=' + articleId);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const result = await openModal('Etes-vous sûr de vouloir supprimer cet article ?')
      if (result) {
        const target = e.target;
        const articleId = target.dataset.id;

        try {
          const response = await fetch(
            'https://restapi.fr/api/article/' + articleId,
            {
              method: 'DELETE',
            }
          );
          const body = await response.json();
          await fetchArticles();
        } catch (error) {
        }
      }
    });
  });
};

const displayMenuCategories = (categoriesArr) => {
  const liElements = categoriesArr.map((categoryElem) => {
    const li = document.createElement('li');
    li.innerHTML = `${categoryElem[0]} (<strong>${categoryElem[1]}</strong>)`;
    if (categoryElem[0] === filter) {
      li.classList.add('active')
    }
    li.addEventListener('click', () => {
      if (filter === categoryElem[0]) {
        filter = null;
        li.classList.remove('active');
      } else {
        filter = categoryElem[0];
        liElements.forEach((li) => li.classList.remove('active'));
        li.classList.add('active');
      }
      createArticles();
    });
    return li;
  });

  categoriesContainerElement.innerHTML = '';
  categoriesContainerElement.append(...liElements);
};

const createMenuCategories = () => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArr = Object.keys(categories)
    .map((category) => {
      return [category, categories[category]];
    })
    .sort((c1, c2) => c1[0].localeCompare(c2[0]));

  displayMenuCategories(categoriesArr);
};

const fetchArticles = async () => {
  try {
    const response = await fetch(`https://restapi.fr/api/article?sort=createdAt:${sortBy}`);
    articles = await response.json();
    createArticles();
    createMenuCategories();
  } catch (error) {
    console.error(error);
  }
};

window.onload = fetchArticles;
