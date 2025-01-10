// Função para validar login
document.getElementById("formulario").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio do formulário e o recarregamento da página

    const username = document.getElementById("nome").value;
    const password = document.getElementById("senha").value;
    
    // Aqui você pode ajustar a URL para o endpoint correto da sua API de login
    try {
        const response = await fetch("https://task-game.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: username, password }),
        });

        const result = await response.json();

        // Verifique se o login foi bem-sucedido
        if (result.success) {
            // Armazenar os dados do usuário no localStorage
            localStorage.setItem("user", JSON.stringify({
                name: username,
                exp: result.exp,
                level: result.level,
                ranking: result.ranking
            }));

            // Redirecionar para o game.html
            window.location.href = "game.html"; 
        } else {
            // Se o login falhar, exibir a mensagem de erro
            document.getElementById("result").innerText = "Login falhou: " + result.message;
        }
    } catch (error) {
        // Caso haja erro de conexão ou outro tipo de erro
        document.getElementById("result").innerText = "Erro ao tentar fazer login. Tente novamente mais tarde.";
        console.error(error); // Exibir o erro no console para depuração
    }
});



const userData = {
    username,
    password
  };

document.getElementById('create').addEventListener('click', async () => {
    try {
      // Envia uma requisição POST para o servidor
      const response = await fetch('https://task-game.onrender.com/users', {
        method: 'POST', // Método HTTP
        headers: { 'Content-Type': 'application/json' }, // Cabeçalhos
        body: JSON.stringify(userData), // Converte os dados do usuário para JSON
      });
  
      // Processa a resposta do servidor
      const resultado = await response.json();
      if (response.ok) {
        document.getElementById("result").innerText = "Deu certo: " + resultado.message; // Exibe mensagem de sucesso
      } else {
        document.getElementById("result").innerText = "Create falhou: " + result.message; // Exibe mensagem de erro
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      document.getElementById("result").innerText = "Erro ao conectar com o servidor";
    }
  });


function validateLogin(event) {
    event.preventDefault(); // Evita o envio do formulário

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verifica se o usuário existe no localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
        // Armazena dados do usuário na sessão e redireciona para o game.html
        localStorage.setItem("user", JSON.stringify(storedUser));
        window.location.href = "game.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// Função para carregar o nome do usuário e a saudação no game.html
function loadUserData() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.getElementById("userGreeting").innerText = `Bem-vindo, ${user.name}!`;
    } else {
        window.location.href = "index.html"; // Se o usuário não estiver logado, redireciona para a página de login
    }
}

// Função de logout
function logout() {
    localStorage.removeItem("user"); // Remove o usuário da sessão
    window.location.href = "index.html"; // Redireciona para a página de login
}

// Exemplo de como você pode usar a função de login:
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", validateLogin);
}

// A função `loadUserData()` será chamada no game.html para garantir que o usuário está logado e exibir suas informações.
