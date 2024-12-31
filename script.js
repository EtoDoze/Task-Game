/*
function mostrar(){
    const username = document.getElementById("nome").value;
    const password = document.getElementById("senha").value;
    alert(`Seu nome: ${username}, sua senha é: ${password}`);
}
*/

document.getElementById("formulario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("nome").value;
    const password = document.getElementById("senha").value;

    const response = await fetch("https://task-game.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, password }),
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById("result").innerText = "Login bem-sucedido!";
    } else {
        document.getElementById("result").innerText = "Login falhou: " + result.message;
    }
});
