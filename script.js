
function mostrar(){
    const user = document.getElementById("nome");
    const username = user.value;
    const pass = document.getElementById("senha");
    const password = pass.value;
    alert(`Seu nome: ${username}, sua senha é: ${password}`);
}