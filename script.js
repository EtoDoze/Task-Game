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
            window.location.href = "game.html"; 
            
            localStorage.setItem("user", JSON.stringify({
                name: username,
                exp: result.exp,
                level: result.level,
                ranking: result.ranking
            }));

            // Redirecionar para o game.html
        } else {
            // Se o login falhar, exibir a mensagem de erro
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerText = "Login falhou: " + result.message;
        }
    } catch (error) {
        // Caso haja erro de conexão ou outro tipo de erro
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerText = "Erro ao tentar fazer login. Tente novamente mais tarde.";
        console.error(error); // Exibir o erro no console para depuração
    }
});





// Função para criar um novo usuário
document.getElementById("create").addEventListener("click", async function () {
    const username = document.getElementById("nome").value;
    const password = document.getElementById("senha").value;
    
    if (!username || !password) {
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerText = "Por favor, preencha todos os campos.";
        return;
    }
    
    try {
        const response = await fetch("https://task-game.onrender.com/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, password }),
        });

        const result = await response.json();

        function random_rgba() {
            var o = Math.round,
            r = Math.random,
            s = 255;
            return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
        };
        
        
        if (response.ok) {
            document.getElementById("result").style.color = random_rgba();
            document.getElementById("result").innerText = "Usuário criado com sucesso!";
        } else if (result.message === "Usuário já existe.") {
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerText = "Erro: Usuário já existe.";
        } else {
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerText = "Erro ao criar usuário: " + result.message;
        }
        
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerText = "Erro ao conectar ao servidor.";
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

async function buscarUsuarioPorId(id) {
    try {
        const response = await fetch(`https://task-game.onrender.com/users/${id}`);
        const user = await response.json();

        if (response.ok) {
            console.log("Usuário encontrado:", user);
            document.getElementById("result").innerText = 
                `Usuário: ${user.name}, Exp: ${user.exp}, Level: ${user.level}, Ranking: ${user.ranking}`;
        } else {
            console.error("Erro ao buscar usuário:", user.message);
            document.getElementById("result").innerText = user.message;
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}


async function salvarDadosUsuario(id, dados) {
    try {
        const response = await fetch(`https://task-game.onrender.com/users/${id}/updateStats`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Usuário atualizado:", result);
            document.getElementById("result").innerText = 
                `Dados atualizados: Exp: ${result.exp}, Level: ${result.level}, Ranking: ${result.ranking}`;
        } else {
            console.error("Erro ao atualizar usuário:", result.error);
            document.getElementById("result").innerText = result.error;
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}


// A função `loadUserData()` será chamada no game.html para garantir que o usuário está logado e exibir suas informações.
