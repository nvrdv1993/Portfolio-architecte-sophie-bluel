// Déclaration des constantes pour les URLs des API
const apiUrl = 'http://localhost:5678/api/works';
const categoriesUrl = 'http://localhost:5678/api/categories';

// Fonction pour effectuer une requête GET et retourner le résultat en JSON
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Fonction pour mettre en surbrillance le bouton actuel
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

// Fonction pour afficher les travaux en fonction des filtres
function displayWorks(works) {
  const galleryContainer = document.querySelector('.gallery');
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

// Fonction pour filtrer les travaux par catégorie
async function filterWorksByCategory(categoryId, clickedButton) {
  const data = await fetchData(apiUrl);
  let filteredWorks;

  if (categoryId === null) {
    // Si la catégorie est null, afficher tous les travaux
    filteredWorks = data;
  } else {
    // Sinon, filtrer par catégorie
    filteredWorks = data.filter(work => work.categoryId === categoryId);
  }

  displayWorks(filteredWorks);
  highlightButton(clickedButton);
}

// Fonction pour créer un bouton de catégorie
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
  const categoryButtonsContainer = document.querySelector('.btns');
  const categoryButtons = categories.map(createCategoryButton);

  // Ajout des boutons à la page
  categoryButtons.unshift(allButton); // Ajout du bouton "Tous" en premier
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
