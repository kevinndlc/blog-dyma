import './assets/styles/styles.scss';
import './index.scss';

const articlesContainerElement = document.querySelector('.articles-container');

const createArticles = (articles) => {
  const articlesDOM = articles.map((article) => {
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
  const editButtons =
    articlesContainerElement.querySelectorAll('.btn-primary');

  editButtons.forEach(button => {
    button.addEventListener('click', e => {
      const target = e.target;
      const articleId = target.dataset.id;
      location.assign('/form.html?id=' + articleId)
    })
  })
  
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
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
        console.log(body);
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const fetchArticles = async () => {
  try {
    const response = await fetch('https://restapi.fr/api/article');
    const articles = await response.json();
    createArticles(articles);
  } catch (error) {
    console.error(error);
  }
};

window.onload = fetchArticles;
