const apiUrl = 'http://localhost:5678/api/works';
const categoriesUrl = 'http://localhost:5678/api/categories';
const galleryContainer = document.querySelector('.gallery');
const categoryButtonsContainer = document.querySelector('.btns');
const modalContainer = document.querySelector('.modalContainer');
const modal = document.getElementById('modal');
const worksContainer = document.querySelector('.worksContainer');
const token = sessionStorage.accessToken;

// Fonction asynchrone pour récupérer des données depuis une URL à l'aide de l'API Fetch.
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Fonction asynchrone pour afficher les œuvres filtrées par catégorie dans la galerie.
async function showWorksByCategory(categoryId) {
  // Efface le contenu de la galerie avant d'afficher de nouvelles œuvres.
  galleryContainer.innerHTML = '';

  // Récupère toutes les œuvres depuis l'API.
  const works = await fetchData(apiUrl);

  // Filtrer les œuvres en fonction de la catégorie sélectionnée.
  const filteredWorks = categoryId === 0 ? works : works.filter(work => work.categoryId === categoryId);

  // Afficher chaque œuvre filtrée dans la galerie.
  filteredWorks.forEach(work => {
    const figureElement = document.createElement('figure');
    figureElement.insertAdjacentHTML('beforeend', `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `);
    galleryContainer.appendChild(figureElement);
  });
}

// Fonction asynchrone pour afficher les boutons de catégories.
async function displayCategoriesBtn() {
  // Récupère la liste des catégories depuis l'API.
  const arrCategories = await fetchData(categoriesUrl);

  // Crée un bouton "Tous" actif par défaut.
  const allButton = document.createElement('button');
  allButton.classList.add('btn', 'active');
  allButton.innerText = 'Tous';
  allButton.setAttribute('data-category-id', 0);
  categoryButtonsContainer.appendChild(allButton);

  // Ajoute un écouteur d'événement pour afficher toutes les œuvres lorsque le bouton "Tous" est cliqué.
  allButton.addEventListener('click', async () => {
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => button.classList.remove('active'));
    allButton.classList.add('active');
    showWorksByCategory(0);
  });

  // Crée des boutons pour chaque catégorie.
  for (let i = 0; i < arrCategories.length; i += 1) {
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerText = arrCategories[i].name;
    btn.setAttribute('data-category-id', arrCategories[i].id);
    categoryButtonsContainer.appendChild(btn);

    // Ajoute un écouteur d'événement pour afficher les œuvres de la catégorie correspondante lorsque le bouton est cliqué.
    btn.addEventListener('click', async () => {
      const allButtons = document.querySelectorAll('.btn');
      allButtons.forEach(button => button.classList.remove('active'));
      btn.classList.toggle('active');
      showWorksByCategory(arrCategories[i].id);
    });
  }

  // Affiche initialement toutes les œuvres.
  showWorksByCategory(0);
}

// Fonction pour vérifier l'état de connexion de l'utilisateur.
function checkLoginStatus() {
  // Récupère le bouton de connexion et l'access token depuis la session.
  const loginButton = document.getElementById('login');
  const accessToken = sessionStorage.getItem('accessToken');

  // Vérifie si un access token est présent.
  if (accessToken) {
    // Si connecté, change le texte du bouton en "logout" et ajoute un écouteur pour la déconnexion.
    loginButton.innerText = 'logout';
    loginButton.addEventListener('click', logout);
  } else {
    // Si non connecté, change le texte du bouton en "login" et configure le lien vers la page de connexion.
    loginButton.innerText = 'login';
    loginButton.href = './login.html';
  }
}

// Fonction pour déconnecter l'utilisateur.
function logout() {
  // Supprime l'access token de la session et redirige vers la page de connexion.
  sessionStorage.removeItem('accessToken');
  window.location.href = './login.html';
}

// Fonction pour vérifier la visibilité du bouton d'édition.
function checkEditButtonVisibility() {
  // Récupère le bouton d'édition et l'access token depuis la session.
  const editButton = document.querySelector('.edit-btn');
  const accessToken = sessionStorage.getItem('accessToken');

  // Vérifie si un access token est présent.
  if (accessToken) {
    // Si connecté, affiche le bouton d'édition.
    editButton.style.display = 'block';
  } else {
    // Si non connecté, masque le bouton d'édition.
    editButton.style.display = 'none';
  }
}


// --- Affichage de la modale au clic sur le bouton edit-btn ---
const editButton = document.querySelector('.edit-btn');


editButton.addEventListener('click', function () {
  modalContainer.style.display = 'flex';
  modal.style.display = 'flex';
});

async function showWorksInModal() {
  // Effacer le contenu existant du conteneur
  worksContainer.innerHTML = '';

  let arrWorks = await fetchData(apiUrl);

  arrWorks.forEach((work) => {
    const figureModal = document.createElement('figure');
    const figureImgModal = document.createElement('img');
    const editButton = document.createElement('button');
    const delButton = document.createElement('button');
    figureModal.setAttribute('data-id', work.id)
    figureImgModal.src = work.imageUrl;
    figureImgModal.alt = work.title;
    editButton.classList.add('editer');
    delButton.innerHTML = '<i class="fa-regular fa-trash-can fa-lg"></i>';
    delButton.classList.add('delete');

    // supprime les images
    delButton.addEventListener('click', function () {
      delWork(work.id);
    });

    // Ajout des éléments créés au conteneur modal
    worksContainer.appendChild(figureModal);
    figureModal.append(figureImgModal, editButton, delButton);
  });
}

// --- Requête DELETE pour supprimer un projet ---
async function delWork(workId) {
  try {
    await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Supprime l'élément du DOM une fois la suppression réussie
    const deletedElement = document.querySelector(`[data-id="${workId}"]`);
    if (deletedElement) {
      deletedElement.remove();
      
      // Actualise la liste des œuvres dans la première modale
      showWorksInModal();

      // Rafraîchit la galerie sur la page principale pour refléter la suppression
      showWorksByCategory(0);
    }
  } catch (e) {
    console.log('ERROR', e);
  }
}



displayCategoriesBtn();
checkLoginStatus();
checkEditButtonVisibility();
showWorksInModal();

const closeButton = document.querySelector('.close');

closeButton.addEventListener('click', closeModal);


// --- Fonction pour fermer la modale ---
function closeModal() {
  modalContainer.style.display = 'none';
  modal.style.display = 'none';
}

// --- Ajout d'un écouteur d'événement pour fermer la modale en cliquant en dehors ---
modalContainer.addEventListener('click', function (e) {
  if (e.target === modalContainer) {
    closeModal();
  }
});

// Ajoute cet événement au bouton "Ajouter une photo" dans la première modale
const addWorkButton = document.querySelector('.addWork');
addWorkButton.addEventListener('click', function () {
  // Assure-toi que la deuxième modale devient visible
  const modal2 = document.getElementById('modal2');
  modal2.style.display = 'flex';
});

// Ajoute cet événement au bouton de flèche dans la deuxième modale
const backButton = document.querySelector('.back');
backButton.addEventListener('click', function () {
  // Assure-toi que la deuxième modale devient invisible
  const modal2 = document.getElementById('modal2');
  modal2.style.display = 'none';

  // Assure-toi que la première modale redevient visible
  modal.style.display = 'flex';
});

// Ajoute cet événement à la croix dans la modal2
const closeButtonModal2 = document.querySelector('#modal2 .close');
closeButtonModal2.addEventListener('click', closeModal2);

// Ajoute cet événement à modalContainer pour fermer la modal2 en dehors de celle-ci
modalContainer.addEventListener('click', function (e) {
  if (e.target === modalContainer) {
    closeModal2();
  }
});

// Fonction pour fermer la modal2
function closeModal2() {
  modalContainer.style.display = 'none';
  document.getElementById('modal2').style.display = 'none';
}


// Ajoute cet appel à fetchData au début de showWorksInModal
async function showWorksInModal() {
  // Effacer le contenu existant du conteneur
  worksContainer.innerHTML = '';

  // Récupère les catégories depuis l'API
  const categories = await fetchData(categoriesUrl);

  let arrWorks = await fetchData(apiUrl);

  arrWorks.forEach((work) => {
    const figureModal = document.createElement('figure');
    const figureImgModal = document.createElement('img');
    const editButton = document.createElement('button');
    const delButton = document.createElement('button');
    figureModal.setAttribute('data-id', work.id)
    figureImgModal.src = work.imageUrl;
    figureImgModal.alt = work.title;
    editButton.classList.add('editer');
    delButton.innerHTML = '<i class="fa-regular fa-trash-can fa-lg"></i>';
    delButton.classList.add('delete');

    // supprime les images
    delButton.addEventListener('click', function () {
      delWork(work.id);
    });

    // Ajout des éléments créés au conteneur modal
    worksContainer.appendChild(figureModal);
    figureModal.append(figureImgModal, editButton, delButton);
  });

  // Mise à jour de la liste déroulante (select) dans la deuxième modal
  const categorieSelect = document.getElementById('categorie');
  categorieSelect.innerHTML = ''; // Efface le contenu existant

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.innerText = category.name;
    categorieSelect.appendChild(option);
  });
}

// Fonction pour prévisualiser l'image
function previewImage(event) {
  const preview = document.getElementById('preview');
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}

// Ajoute un écouteur d'événement au champ de fichier pour appeler la fonction de prévisualisation
const uploadImgInput = document.getElementById('uploadImg');
uploadImgInput.addEventListener('change', previewImage);


// Ajoute cet événement au bouton de validation dans la deuxième modale
const validButton = document.querySelector('.valid');
validButton.addEventListener('click', function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre

  const titleInput = document.getElementById('titre');
  const categorySelect = document.getElementById('categorie');
  const uploadImgInput = document.getElementById('sendImg').querySelector('input[type="file"]');
  const previewImageElement = document.getElementById('preview');

  const title = titleInput.value.trim();
  const categoryId = categorySelect.value;
  const file = uploadImgInput.files[0];

  if (title && categoryId && file) {
    // Création d'un objet FormData pour envoyer les données au serveur
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', categoryId);
    formData.append('image', file);

    // Envoi de la requête POST au serveur
    submitWork(formData);

    // Réinitialise les champs après l'envoi réussi
    titleInput.value = '';
    categorySelect.value = '';
    uploadImgInput.value = '';
    previewImageElement.src = '';
    validButton.classList.remove('envoyer'); // Retire la classe pour réinitialiser le style du bouton
  } else {
    alert("Veuillez remplir tous les champs.");
  }
});

// Fonction pour envoyer une nouvelle œuvre au serveur
async function submitWork(formData) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (response.status === 201) {
      // Si la requête est un succès (status 201 Created), alors ferme la modale et rafraîchit la galerie
      closeModal2();
      showWorksByCategory(0); // Rafraîchit la galerie pour afficher la nouvelle œuvre
      // Mise à jour de la liste des œuvres dans la première modale
      showWorksInModal();
    } else {
      // Affiche une alerte en cas d'erreur
      alert("Erreur lors de l'ajout de l'image.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Une erreur inattendue s'est produite.");
  }
}

// --- Conditions pour le bouton Valider ---
const checkConditions = () => {
  const uploadImg = document.getElementById('sendImg').querySelector('input[type="file"]');
  const upTitle = document.getElementById('titre');
  const selectCategory = document.getElementById('categorie');
  const submitButton = document.querySelector('.valid');

  if (uploadImg.files[0]?.size < 4000000 && upTitle.value !== '' && selectCategory.value !== '') {
    submitButton.classList.add('envoyer');
  } else {
    submitButton.classList.remove('envoyer');
  }
};

// Ajoute les écouteurs d'événements pour les champs pertinents
const uploadImg = document.getElementById('sendImg').querySelector('input[type="file"]');
const upTitle = document.getElementById('titre');
const selectCategory = document.getElementById('categorie');

upTitle.addEventListener('input', checkConditions);
selectCategory.addEventListener('input', checkConditions);
uploadImg.addEventListener('input', function (event) {
  checkConditions();
  previewImage(event);
});

