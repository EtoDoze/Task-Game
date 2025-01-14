const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors());

const { exec } = require("child_process");//

// Executa as migrações no início do servidor
const { execSync } = require("child_process");
if (process.env.NODE_ENV !== "production") {
    execSync("npx prisma migrate dev", { stdio: "inherit" });
}



try {
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("Migrações aplicadas com sucesso.");
} catch (error) {
    console.error("Erro ao aplicar migrações:", error);
}

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
app.put('/users/:id/updateStats', async (req, res) => {
    const { id } = req.params;
    const { exp, level, ranking } = req.body;

    if (exp == null || level == null || ranking == null) {
        return res.status(400).json({ error: "Campos exp, level e ranking são obrigatórios." });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { exp, level, ranking }
        });
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar os dados do usuário." });
    }
});



// Rota para buscar um usuário pelo ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar usuário.' });
    }
});




// Rota para deletar um usuário pelo ID
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Verifica se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        // Deleta o usuário
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.json({ success: true, message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error.message);
        res.status(500).json({ success: false, message: 'Erro ao deletar usuário.' });
    }
});


// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
