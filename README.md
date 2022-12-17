![](https://i.imgur.com/xG74tOh.png)

# Desafio Final Módulo 5 - FRONTEND

Este repositório deverá servir de base para ser realizado o fork para desenvolvimento da parte de **FRONTEND** do desafio.

A URL deste repositório deverá ser entregue na plataforma de alunos da Cubos Academy na página da parte de FRONTEND do desafio.

A versão final do código de cada sprint deverá estar na branch principal do repositório e sim, a cada semana acumulará as alterações das sprints, portanto a segunda sobrescrevendo a primeira e assim por diante.

---

No fork de vocês, favor alterar este README para adicionar os links correspondentes para os seguintes itens:

**Repositório de Backend**: https://github.com/guilhermecduarte/back-integral-m05-t07

**Repositório de Frontend**: https://github.com/guilhermecduarte/front-integral-m05-t07

**URL da aplicação funcionando**: code6charge.netlify.app

---

E os itens abaixo, que deverão ser preenchidos apenas após a finalização de todas as sprints do projeto:

**Pull Request (PR) de Backend**:

**Pull Request (PR) de Frontend**:

Estes Pull Requests (PRs) deverão ser criados a partir da branch principal do fork correspondente de vocês daquela stack tendo como destino o repositório base da stack do desafio.

Ou seja, o Pull Request de **FRONTEND** deverá ser criado a partir do fork de vocês desse repositório aqui, com destino a este repositório aqui.

E portanto o Pull Request de **BACKEND** deverá ser criado a partir do fork de vocês do repositório base de BACKEND desse desafio, com destino ao [repositório base de BACKEND desse desafio](https://github.com/cubos-academy/back-integral-m05-t07).

<b>[Figma Desafio M05 - Sprint 1](https://www.figma.com/file/Gpl5YlCj17jJ99dT3LqV6U/M05-SPRINT-01?node-id=410%3A47347)</b>

<br>
<details>
<summary>1ª Sprint</summary>
<br>

<details>
<summary><b>[Usuário] Cadastro do usuário</b></summary>
<br>

### `Na posição de usuário do sistema, desejo cadastrar meus dados, afim de ter acesso ao sistema.`

---

- <b>Critérios de aceite</b>
  - O cadastro deverá funcionar em formulário web que funcione em um navegador padrão
  - Para acessar este formulário de cadastro não deverá ser exigida autenticação
  - Os dados do cadastro deverão ser persistidos de maneira que possam ser consultados em qualquer momento no futuro até que sejam excluídos.
  - O usuário poderá visualizar sua senha enquanto a escreve (Ex: Material UI Input Adornment https://v4.mui.com/pt/api/input-adornment/)
  - A senha do usuário deverá ser persistida utilizando algum algoritmo de criptografia confiável

---

- Campos necessários para o cadastro inicial (obrigatórios):

  - Nome do usuário (obrigatório)
  - Email (obrigatório)
  - Senha (obrigatório)

- Deverão ser informadas mensagens de erro em casos de:

  - Campos obrigatórios em branco
  - E-mail informado já existir cadastrado
  - Após realizado o cadastro com sucesso o usuário deverá receber uma mensagem de confirmação e um botão para ser redirecionado para a página de Login.

</details>

<details>
<summary><b>[Usuário] Login do usuário</b></summary>

### `Na posição de usuário do sistema, devo ser capaz de realizar login no Dashboard, afim de acessar o sistema.`

---

- <b>Critérios de aceite</b>
  - O login do usuário deverá ser realizado em formulário web funcionando em navegador padrão
- Campos obrigatórios:

  - E-mail
  - Senha
  - Deverá ser possível informar os dados de acesso (e-mail e senha) e então clicar em botão para realização do login

- Deverão ser informadas mensagens de erro em casos de:

  - Campos obrigatórios em branco
  - E-mail não existe no cadastro
  - Senha incorreta para o e-mail
  - Criação de token de autenticação após validação dos dados (credenciais) de acesso (e-mail e senha).

- Após realização de login com sucesso, deverá ser retornado ao navegador o token de autenticação de forma que possa ser utilizado em outras funcionalidades que exigem autenticação. O usuário deverá ser redirecionado para a home do sistema
</details>

<details>
<summary><b>[Dashboard] Home e Menu</b></summary>

### `Na posição de usuário do sistema, desejo visualizar uma tela inicial, afim de poder navegar pelo sistema através do menu.`

---

- <b>Critérios de aceite</b>

  - A página deverá funcionar em um navegador web padrão.
  - Apenas usuários autenticados deverão conseguir acessar esta página

- Esta tela deverá ter uma imagem padrão de usuário e o primeiro nome do usuário no canto superior direito, que ao clicar, abrirá um menu com dois botões:

  - O primeiro é o "Editar", que abrirá um modal de atualização do cadastro do usuário logado.
  - O segundo é o botão "Sair", que irá deslogar o usuário do sistema

- Deverá existir um menu lateral que permitirá o usuário navegar pelos módulos do sistema, contendo os links:

  - Home
  - Clientes
  - Cobranças

- Esta tela deverá ter 8 cards com as seguintes informações:

  Resumo do Valor Total das Cobranças

  - Pagas
  - Vencidas
  - Previstas

  - Cobranças Vencidas
  - Cobranças Previstas
  - Cobranças Pagas

  - Clientes Inadimplentes
  - Clientes Em dia

</details>

<details>
<summary><b>[Usuário] Edição do usuário logado</b></summary>

#### `Na posição de usuário dos sistema, desejo editar meus dados de usuário, quando logado no sistema.`

- <b>Critérios de aceite</b>
  - Através de um clique no perfil da Dashboard serão abertos dois botões:
    - Editar
    - Sair
  - Ao clicar em "Editar" um modal com um formulário de edição dos dados do usuário deverá ser aberto.
  - A edição deverá funcionar em formulário web que funcione em um navegador padrão
  - Ao abrir o formulário, os dados do usuário logado deverão ser carregados nos respectivos campos
  - Para acessar este formulário de cadastro será exigido autenticação.
- Os dados da atualização deverão ser persistidos de maneira que possam ser consultados em qualquer momento no futuro até que sejam excluídos.

- O usuário poderá ou não visualizar sua senha enquanto a escreve (Ex: Material UI Input Adornment)

  - Caso seja informado uma nova senha do usuário, a mesma deverá ser persistida utilizando algum algoritmo de criptografia confiável
  - O usuário poderá atualizar os respectivos dados a seguir :

    - Nome do usuário (obrigatório)
    - E-mail (obrigatório)
    - Senha (obrigatório - apenas se for alterar a senha)
    - CPF
    - Telefone

- Deverão ser informadas mensagens de erro em casos de:

  - Campos obrigatórios passados em branco
  - E-mail informado for diferente do usuário logado e já existir cadastrado para outro usuário

- Após realizado a atualização com sucesso o usuário deverá receber uma mensagem de confirmação
</details>

<details>
<summary><b>[Cliente] Cadastro do cliente</b></summary>

#### `Na posição de usuário do sistema, desejo cadastrar clientes, afim de acessar suas informações no futuro.`

- <b>Critérios de aceite</b>

  - O cadastro deverá funcionar em formulário web que funcione em um navegador padrão
  - Para acessar este formulário de cadastro deverá ser exigida autenticação
  - Os dados do cadastro deverão ser persistidos de maneira que possam ser consultados em qualquer momento no futuro até que sejam excluídos.

  - Campos necessários para o cadastro (<b>\*</b> obrigatórios):

    - Nome do usuário (<b>\*</b>)
    - Email (<b>\*</b>)
    - Cpf (<b>\*</b>)
    - Telefone (<b>\*</b>)
    - Cep
    - Logradouro
    - Complemento
    - Bairro
    - Cidade
    - Estado

  - Opcionalmente, poderá ter a busca do endereço ao digitar o CEP utilizando a api do ViaCEP

  - Deverão ser informadas mensagens de erro em casos de:
    - Campos obrigatórios em branco
    - E-mail informado já existir cadastrado
    - Após realizado o cadastro com sucesso o usuário deverá receber uma mensagem de confirmação.

</details>

<details>
<summary><b>[Dashboard] Configuração do Deploy</b></summary>

#### `Na posição de usuário do sistema, devo ser capaz de acessar o sistema através da internet, afim de usar o sistema em qualquer dispositivo com acesso a internet.`

- <b>Critérios de aceite</b>

  - O frontend deverá ser hospedado na <b>Netlify</b>
  - O backend e banco de dados deverá ser hospedado na <b>heroku</b>
  - O frontend hospedado na netlify deverá ser <b>integrado</b> ao backend hospedado na heroku

</details>

---

## <b>ATENÇÃO</b> É indispensável fazer deploy do projeto e disponibilizar a URL para o cliente realizar os testes. O não cumprimento desta etapa será considerada uma falha grave.

</details>

</details>

---
