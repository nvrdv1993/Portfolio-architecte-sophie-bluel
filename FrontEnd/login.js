const form = document.querySelector('form');

async function handleFormSubmit(e) {
    e.preventDefault();

    // Récupération de l'email et du mot de passe depuis le formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
         // Envoi de la requête de connexion à l'API
        const response = await fetch('http://' + window.location.hostname + ':5678/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
         // Gestion de la réponse de l'AP
        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('accessToken', data.token);
            window.location.href = './index.html';
        } else {
            handleErrors(response.status);
        }
    } catch (error) {
        console.log(error);
    }
}

function handleErrors(status) {
    const connexion = document.querySelector('div');
    const error = document.createElement('p');

    switch (status) {
        case 401:
            error.innerText = "Erreur dans l'identifiant ou le mot de passe";
            break;
        default:
            error.innerText = `Une erreur s'est produite (${status})`;
            break;
    }
    
    error.style.textAlign = 'center';
    error.style.color = 'red';
    error.style.marginBottom = '15px';
    connexion.insertBefore(error, connexion.lastElementChild);
}

form.addEventListener('submit', handleFormSubmit);

// logout
const logoutButton = document.querySelector('.edit-btn');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}
