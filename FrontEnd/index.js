// Déclaration des constantes pour les URLs des API
const apiUrl = 'http://localhost:5678/api/works';
const categoriesUrl = 'http://localhost:5678/api/categories';

// Récupération des éléments du DOM
const galleryContainer = document.querySelector('.gallery');
const categoryButtonsContainer = document.querySelector('.btns');

// Variable pour stocker les boutons de catégorie
const categoryButtons = [];

// Fonction pour effectuer une requête GET et retourner le résultat en JSON
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Fonctions liées à l'affichage
function displayWorks(works) {
  galleryContainer.innerHTML = '';

  works.forEach(work => {
    const figureElement = document.createElement('figure');
    figureElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `;
    galleryContainer.appendChild(figureElement);
  });
}

function highlightButton(clickedButton) {
  categoryButtons.forEach(button => {
    if (button !== clickedButton) {
      button.style.backgroundColor = '#FFFEF8';
      button.style.color = '#1D6154';
    } else {
      button.style.backgroundColor = '#1D6154';
      button.style.color = '#FFFEF8';
    }
  });
}

// Fonctions liées aux requêtes et à la gestion des boutons de catégorie
async function filterWorksByCategory(categoryId, clickedButton) {
  const data = await fetchData(apiUrl);
  const filteredWorks = categoryId === null ? data : data.filter(work => work.categoryId === categoryId);

  displayWorks(filteredWorks);
  highlightButton(clickedButton);
}

function createCategoryButton(category) {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = category.name;
  buttonElement.dataset.categoryId = category.id;
  buttonElement.addEventListener('click', () => {
    filterWorksByCategory(category.id === 'null' ? null : category.id, buttonElement);
  });
  return buttonElement;
}

// Fonction principale pour initialiser la page
async function initializePage() {
  // Création du bouton "Tous"
  const allButton = createCategoryButton({ id: 'null', name: 'Tous' });

  // Récupération des catégories depuis l'API
  const categories = await fetchData(categoriesUrl);

  // Création des boutons de catégorie
  categoryButtons.push(allButton); // Ajout du bouton "Tous" dans la variable categoryButtons
  categories.forEach(category => {
    const button = createCategoryButton(category);
    categoryButtons.push(button);
  });

  // Ajout des boutons à la page
  categoryButtons.forEach(button => {
    categoryButtonsContainer.appendChild(button);
  });

  // Appel à displayAllWorks() lors du chargement initial pour afficher tous les travaux
  await filterWorksByCategory(null, allButton);

  // Gestionnaire d'événements sur le document pour réinitialiser le style des boutons
  document.addEventListener('click', (event) => {
    if (!categoryButtonsContainer.contains(event.target)) {
      // Réinitialise le style de tous les boutons
      categoryButtons.forEach(button => {
        button.style.backgroundColor = '#FFFEF8';
        button.style.color = '#1D6154';
      });
    }
  });
}

// Appel de la fonction principale pour initialiser la page
initializePage();
