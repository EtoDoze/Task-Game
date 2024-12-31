/*
function mostrar(){
    const username = document.getElementById("nome").value;
    const password = document.getElementById("senha").value;
    alert(`Seu nome: ${username}, sua senha é: ${password}`);
}
*/
let taskList = [];
var level = 1;
var exp = 0;
var ranking = "noob";

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
        // Salva os dados recebidos do login (exp, level, ranking)
        localStorage.setItem("user", JSON.stringify({
            name: username,
            exp: result.exp,
            level: result.level,
            ranking: result.ranking
        }));

        document.getElementById("result").innerText = "Login bem-sucedido!";
        window.location.href = "game.html";  // Redireciona para a página de jogo
    } else {
        document.getElementById("result").innerText = "Login falhou: " + result.message;
    }
});

window.addEventListener("load", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user) {
        document.getElementById("lvl").innerText = user.level;
        document.getElementById("xp").innerText = user.exp;
        document.getElementById("rank").innerText = user.ranking;
    } else {
        window.location.href = "index.html";  // Redireciona de volta se o usuário não estiver logado
    }
});




function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Digite uma tarefa!");
        return;
    }

    if (taskList.length >= 5) {
        alert("Você pode adicionar no máximo 5 tarefas.");
        return;
    }

    taskList.push({ text: taskText, isChecked: false, isEditing: false });
    taskInput.value = "";
    renderTasks();
}


function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    taskList.forEach((task, index) => {
        const taskItem = document.createElement('li');

        // Checkbox para marcar a tarefa como concluída
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.isChecked; // Verifica se a tarefa está marcada
        checkbox.addEventListener('change', () => handleCheckboxChange(checkbox, index));
        taskItem.appendChild(checkbox);

        // Renderiza o conteúdo da tarefa, se não estiver em edição
        if (task.isEditing) {
            const input = document.createElement('input');
            input.type = "text";
            input.value = task.text;
            input.onblur = () => saveTask(index, input.value); // Salva ao perder o foco
            taskItem.appendChild(input);
        } else {
            const span = document.createElement('span');
            span.textContent = task.text;
            taskItem.appendChild(span);

            // Botão de editar
            const editButton = document.createElement('button');
            editButton.textContent = "Alterar";
            editButton.onclick = () => toggleEdit(index);
            taskItem.appendChild(editButton);
        }

        // Botão de excluir
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = () => deleteTask(index);
        taskItem.appendChild(deleteButton);

        taskListElement.appendChild(taskItem);
    });
}

function handleCheckboxChange(checkbox, index) {
    // Atualiza o estado da checkbox
    taskList[index].isChecked = checkbox.checked;

    if (checkbox.checked) {
        exp += 10;  // Adiciona 10 de XP ao marcar a tarefa
    } else {
        exp -= 10;  // Subtrai 10 de XP ao desmarcar a tarefa
    }

    if (exp >= 100) {
        exp = 0;  // Reseta o XP
        level++;  // Aumenta o nível
    }

    document.getElementById("xp").innerText = exp;
    document.getElementById("lvl").innerText = level;
    updateRanking();  // Atualiza o ranking

    // Atualiza o ranking com base no level
    function updateRanking() {
        if (level >= 100) ranking = "god";
        else if (level >= 50) ranking = "mestre";
        else if (level >= 20) ranking = "lenda";
        else if (level >= 10) ranking = "estudioso";
        else ranking = "noob";

        document.getElementById("rank").innerText = ranking;
    }

    // Envia os dados atualizados ao servidor
    const user = JSON.parse(localStorage.getItem("user"));
    fetch("https://task-game.onrender.com/updateUserData", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: user.name,
            exp: exp,
            level: level,
            ranking: ranking
        })
    }).then(response => response.json())
      .then(data => {
          console.log("Dados atualizados:", data);
      });

    renderTasks(); // Atualiza a interface com o estado das checkboxes
}




function toggleEdit(index) {
    taskList[index].isEditing = !taskList[index].isEditing;
    renderTasks();
}

function saveTask(index, newText) {
    taskList[index].text = newText.trim();
    taskList[index].isEditing = false;
    renderTasks();
}

function deleteTask(index) {
    taskList.splice(index, 1);
    renderTasks();
}


function updateRanking() {
    if (level >= 100) ranking = "god";
    else if (level >= 50) ranking = "mestre";
    else if (level >= 20) ranking = "lenda";
    else if (level >= 10) ranking = "estudioso";
    else ranking = "noob";
    
    document.getElementById("rank").innerText = ranking;
}

renderTasks();