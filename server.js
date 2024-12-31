const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors());

app.use(express.json());  // Só uma vez

// Rota para listar todos os usuários
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Rota para adicionar um usuário
app.post('/users', async (req, res) => {
    const { name, password } = req.body;
    console.log("Dados recebidos para criação de usuário:", { name, password });

    try {
        // Usar findFirst para buscar qualquer campo, já que "name" não é único
        const existingUser = await prisma.user.findFirst({
            where: { name },  // Buscando pelo nome, mas sem exigir que seja único
        });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Usuário já existe." });
        }

        const newUser = await prisma.user.create({
            data: { name, password },
        });

        res.status(201).json(newUser); // Criando o usuário e retornando a resposta
    } catch (error) {
        console.error("Erro ao criar usuário:", error.message);  // Log detalhado do erro
        res.status(500).json({ success: false, message: "Erro ao criar usuário.", error: error.message });  // Envia a mensagem de erro
    }
});

// Rota de login
app.post("/login", async (req, res) => {
    const { name, password } = req.body;
    console.log("Dados recebidos:", { name, password });

    try {
        const usuario = await prisma.user.findFirst({
            where: { name, password },
        });
        console.log("Resultado da busca:", usuario);

        if (usuario) {
            res.json({ success: true, message: "Login bem-sucedido!" });
        } else {
            res.json({ success: false, message: "Nome ou senha inválidos." });
        }
    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
