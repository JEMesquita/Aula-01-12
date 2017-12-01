const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const sequelize = new Sequelize('postgres://postgres:12345678@localhost:5432/agenda');

// Autenticando
sequelize.authenticate()
.then(() => {
  console.log('Conexão realizada com sucesso.');
})
.catch(err => {
  console.error('Não foi possível conectar:', err);
});

// Definindo o Model
const Contato = sequelize.define('contatos', {
    nome: {
      type: Sequelize.STRING
    },
    telefone: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    tipo: {
      type: Sequelize.STRING
    }
  });

Contato.sync({force: false})
.then(() => {console.log('Sincronizado!')})
.catch(() => {console.log('Falha na sincronização!')});

// Rotas
// Obtendo a lista de todos os contatos
app.get('/contatos', (request, response) => {
    Contato.findAll()
    .then((contatos) => {
        response.send(response.json(contatos));
    })
    .catch(()=>{
        response.send('Erro na recuperação dos contatos!');
    });
});

//Obtendo um contato por um ID
app.get('/contatos/:id', (request, response) => {
    const id = request.params.id;
    Contato.findById(id)
    .then((contato) => {
        response.send(response.json(contato));
    })
    .catch(()=>{
        response.send('Erro na recuperação dos contatos!');
    });
});

// Incluindo um novo contato
app.post('/contatos', (request, response) => {
    const novoContato = request.body.contato;

    Contato.create(novoContato)
    .then(() => {
        response.send(response.json(novoContato));
    })
    .catch(()=>{
        response.send('Erro na criação de um novo contato!');
    });
});

// Excluindo um contato
app.delete('/contatos/:id', (request, response) => {
    const id = request.params.id;
    Contato.findById(id)
    .then((contato) => {
        contato.destroy()
        .then(() => {
            response.send(response.json(contato));
        });
    })
    .catch(() => {
        response.send('Erro na exclusão!');
    });

});

// Atualizando um contato
app.put('/contatos/:id', (request, response) => {
    const id = request.params.id;
    const novo = request.body.contato;

    Contato.findById(id)
    .then((contato) => {

        contato.nome = novo.nome ? novo.nome : contato.nome;
        contato.telefone = novo.telefone ? novo.telefone : contato.telefone;
        contato.email = novo.email ? novo.email : contato.email;
        contato.tipo = novo.tipo ? novo.tipo : contato.tipo;

        contato.save()
        .then(() => {
            response.send(response.json(novo));
        });
    })
    .catch(() => {
        response.send('Erro na atualização!');
    });

});

app.listen(3000, () => console.log('Aplicação inicializada!'));
