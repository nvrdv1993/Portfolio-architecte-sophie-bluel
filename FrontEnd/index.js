const apiUrl = 'http://localhost:5678/api/works';
const categoriesUrl = 'http://localhost:5678/api/categories';

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

// Fonction pour afficher les travaux en fonction de la catégorie
async function showWorksByCategory(categoryId) {
  galleryContainer.innerHTML = '';

  const works = await fetchData(apiUrl);
  const filteredWorks = categoryId === 0 ? works : works.filter(work => work.categoryId === categoryId);

  filteredWorks.forEach(work => {
    const figureElement = document.createElement('figure');
    figureElement.insertAdjacentHTML('beforeend', `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `);
    galleryContainer.appendChild(figureElement);
  });
}

// Fonction pour créer et afficher les boutons de catégorie
async function displayCategoriesBtn() {
  const arrCategories = await fetchData(categoriesUrl);

  // Création du bouton "Tous"
  const allButton = document.createElement('button');
  allButton.classList.add('btn', 'active');
  allButton.innerText = 'Tous';
  allButton.setAttribute('data-category-id', 0);
  categoryButtonsContainer.appendChild(allButton);

  // Écouteur d'événement pour le bouton "Tous"
  allButton.addEventListener('click', async () => {
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => button.classList.remove('active'));

    allButton.classList.add('active');
    showWorksByCategory(0);
  });

  // Création des boutons pour chaque catégorie
  for (let i = 0; i < arrCategories.length; i += 1) {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerText = arrCategories[i].name;
    btn.setAttribute('data-category-id', arrCategories[i].id);
    categoryButtonsContainer.appendChild(btn);

    // Écouteur d'événement pour chaque bouton de catégorie
    btn.addEventListener('click', async () => {
      const allButtons = document.querySelectorAll('.btn');
      allButtons.forEach(button => button.classList.remove('active'));

      btn.classList.toggle('active');
      showWorksByCategory(arrCategories[i].id);
    });
  }

  // Affichage des travaux au chargement de la page
  showWorksByCategory(0);
}

// Appel de la fonction pour afficher les catégories au chargement de la page
displayCategoriesBtn();

// ...

// Fonction pour vérifier l'état de connexion et mettre à jour le bouton
function checkLoginStatus() {
  const loginButton = document.getElementById('login');
  const accessToken = sessionStorage.getItem('accessToken');

  if (accessToken) {
      // L'utilisateur est connecté
      loginButton.innerText = 'logout';
      loginButton.addEventListener('click', logout);
  } else {
      // L'utilisateur n'est pas connecté
      loginButton.innerText = 'login';
      loginButton.href = './login.html';
  }
}

// Appelle la fonction au chargement de la page
checkLoginStatus();

// Fonction pour déconnexion
async function logout() {
  try {
      // Effectue une requête de déconnexion à l'API, si nécessaire
      // ...

      // Efface le jeton de session
      sessionStorage.removeItem('accessToken');

      // Redirige vers la page de login
      window.location.href = './login.html';
  } catch (error) {
      console.log(error);
  }
}

// Fonction pour vérifier l'état de connexion et afficher/masquer le bouton d'édition
function checkEditButtonVisibility() {
    const editButton = document.querySelector('.edit-btn');
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
        // L'utilisateur est connecté, affiche le bouton d'édition
        editButton.style.display = 'block';
    } else {
        // L'utilisateur n'est pas connecté, masque le bouton d'édition
        editButton.style.display = 'none';
    }
}

// Appelle la fonction au chargement de la page
checkEditButtonVisibility();

