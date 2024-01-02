// gallery du backend

const apiUrl = 'http://localhost:5678/api/works';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Utilisez la classe "gallery" pour cibler votre conteneur de galerie
    const galleryContainer = document.querySelector('.gallery');

    // Ajoutez dynamiquement les nouveaux travaux sans supprimer les existants
    data.forEach(work => {
      const figureElement = document.createElement('figure');
      figureElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;
      galleryContainer.appendChild(figureElement);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des travaux:', error);
  });


// Utilisez la classe "btns" pour cibler votre conteneur de boutons
const categoryButtonsContainer = document.querySelector('.btns');

// Créez manuellement le bouton "Tous"
const allButton = document.createElement('button');
allButton.textContent = 'Tous';
allButton.addEventListener('click', () => {
  // Au clic du bouton "Tous", affichez tous les travaux
  displayAllWorks();
});
categoryButtonsContainer.appendChild(allButton);

// Récupérez les catégories depuis l'API
const categoriesUrl = 'http://localhost:5678/api/categories';

fetch(categoriesUrl)
  .then(response => response.json())
  .then(categories => {
    // Ajoutez dynamiquement les nouveaux boutons pour les catégories
    categories.forEach(category => {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = category.name;
      buttonElement.addEventListener('click', () => {
        // Au clic d'un bouton, filtrez les travaux par catégorie
        filterWorksByCategory(category.id);
      });
      categoryButtonsContainer.appendChild(buttonElement);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des catégories:', error);
  });

// Fonction pour afficher tous les travaux
function displayAllWorks() {
  const apiUrl = 'http://localhost:5678/api/works';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Utilisez la classe "gallery" pour cibler votre conteneur de galerie
      const galleryContainer = document.querySelector('.gallery');

      // Supprimez les travaux existants dans le conteneur de galerie
      galleryContainer.innerHTML = '';

      // Ajoutez dynamiquement tous les travaux
      data.forEach(work => {
        const figureElement = document.createElement('figure');
        figureElement.innerHTML = `
          <img src="${work.imageUrl}" alt="${work.title}">
          <figcaption>${work.title}</figcaption>
        `;
        galleryContainer.appendChild(figureElement);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des travaux:', error);
    });
}

// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(categoryId) {
  const apiUrl = 'http://localhost:5678/api/works';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Utilisez la classe "gallery" pour cibler votre conteneur de galerie
      const galleryContainer = document.querySelector('.gallery');

      // Supprimez les travaux existants dans le conteneur de galerie
      galleryContainer.innerHTML = '';

      // Filtrer les travaux par catégorie
      const filteredWorks = data.filter(work => work.categoryId === categoryId);

      // Ajoutez dynamiquement les nouveaux travaux
      filteredWorks.forEach(work => {
        const figureElement = document.createElement('figure');
        figureElement.innerHTML = `
          <img src="${work.imageUrl}" alt="${work.title}">
          <figcaption>${work.title}</figcaption>
        `;
        galleryContainer.appendChild(figureElement);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des travaux:', error);
    });
}

