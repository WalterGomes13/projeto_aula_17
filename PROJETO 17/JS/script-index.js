
function showLogin(role) {
    // Definir a função globalmente para saber o papel selecionado
    window.selectedRole = role;
    document.getElementById('login-form').classList.remove('hidden');
}

// Função para verificar credenciais
function authenticateUser(username, password) {
    // Dados dos usuários armazenados no JSON
    const users = {
        gestor: { login: "marcos", senha: "1234" },
        fiscal: { login: "pedro", senha: "456" },
        cliente: { login: "mateus", senha: "789" }
    };

    // Verificar credenciais com base no papel selecionado
    if (users[window.selectedRole]) {
        const user = users[window.selectedRole];
        if (username === user.login && password === user.senha) {
            return true;
        }
    }
    return false;
}

// Manipular o envio do formulário
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    if (authenticateUser(username, password)) {
        // Redirecionar para a página correspondente com base no papel selecionado
        window.location.href = `${window.selectedRole}.html`;
    } else {
        messageElement.textContent = 'Usuário ou senha inválidos!';
        messageElement.style.color = 'red';
    }
});

