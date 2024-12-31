const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors());

const { exec } = require("child_process");

// Executa as migrações no início do servidor
exec("npx prisma migrate deploy", (error, stdout, stderr) => {
    if (error) {
        console.error(`Erro ao aplicar migrações: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Migrações aplicadas com sucesso: ${stdout}`);
});

app.use(express.json());  // Só uma vez

// Rota para listar todos os usuários
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Rota para adicionar um usuário
app.post('/users', async (req, res) => {
    const { name, password } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: { name }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Usuário já existe." });
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                password,
                exp: 0,  // Inicializando com 0 de XP
                level: 0,  // Inicializando com o nível 1
                ranking: 'noob'  // Inicializando com o ranking 'noob'
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message);
        res.status(500).json({ success: false, message: "Erro ao criar usuário.", error: error.message });
    }
});


// Rota de login
// Rota de login
app.post("/login", async (req, res) => {
    const { name, password } = req.body;

    try {
        const usuario = await prisma.user.findFirst({
            where: { name, password },
        });

        if (usuario) {
            // Certifique-se de que está retornando exp, level e ranking
            res.json({
                success: true,
                message: "Login bem-sucedido!",
                exp: usuario.exp,
                level: usuario.level,
                ranking: usuario.ranking
            });
        } else {
            res.json({ success: false, message: "Nome ou senha inválidos." });
        }
    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
});


// Rota para atualizar os dados do usuário
app.put("/updateUserData", async (req, res) => {
    const { name, exp, level, ranking } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { name: name },
            data: {
                exp,  // Atualiza o XP
                level,  // Atualiza o nível
                ranking  // Atualiza o ranking
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error("Erro ao atualizar dados do usuário:", error);
        res.status(500).json({ success: false, message: "Erro ao atualizar os dados." });
    }
});



// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
