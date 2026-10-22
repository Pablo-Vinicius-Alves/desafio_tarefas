import express from 'express';
import conectarDb from './db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
const PORTA = process.env.PORT;
const conexao = conectarDb();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: "./public" }) //criei apenas o caminho para o frond, não os arquivos e o código.
});

app.get('/tarefas', async (req, res) => {
    const sql = "SELECT * FROM tarefas";
    const [resposta] = await conexao.query(sql);
    res.status(201).json(resposta);
})

app.get('/tarefas/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!id) { return res.status(400).json({ message: "ID inválido." }) }
    try {
        const sql = "SELECT * FROM tarefas WHERE id=?";
        const [resposta] = await conexao.query(sql, [id]);
        if (resposta.length === 0) { return res.status(404).json({ message: "Tarefa não encontrada." }); }
        res.status(200).json(resposta[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao encontrar tarefa." });
    }
});

app.post('/tarefas', async (req, res) => {
    const { nome, descricao, responsavel, } = req.body;
    if (!nome || !descricao || !responsavel) {
       return res.status(404).json({
            message: "Os campos de nome, descrição e responsável são obrigatórios."
        })
    }
    try {
        const sql = "INSERT INTO tarefas (nome, descricao, responsavel ) VALUES (?, ?, ?)";
        const [resposta] = await conexao.query(sql, [nome, descricao, responsavel]);
        res.status(201).json({
            id: resposta.insertId,
            message: "Tarefa cadastrada!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao cadastrar tarefa." })
    }

});

app.put('/tarefas/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { nome, descricao, responsavel, } = req.body;
    const sql = "UPDATE tarefas SET nome=?, descricao=?, responsavel=? WHERE id=?";
    const [resposta] = await conexao.query(sql, [nome, descricao, responsavel, id]);
    if (resposta.affectedRows > 0) {
        return res.status(201).json({ message: "Tarefa atualizada com sucesso!" })
    } else { return res.status(404).json({ message: "Erro ao atualizar tarefa." }) };
})

app.put('/tarefas/:id/concluir', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const sql = "UPDATE tarefas SET concluido = TRUE WHERE id=?";
        const [resposta] = await conexao.query(sql, [id]);
        if (resposta.affectedRows === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }
        res.status(201).json({ message: "Tarefa concluída!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no server." });
    }
});

app.delete('/tarefas/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const sql = "DELETE FROM tarefas WHERE id=?";
        const [resposta] = await conexao.query(sql, [id]);
        if (resposta.affectedRows === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada." });
        }
        res.status(201).json({ message: "Tarefa exluída" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro no server." });
    }
})

app.listen((PORTA), () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
})