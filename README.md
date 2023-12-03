# 2º Desafio Técnico - Escribo

Este teste técnico consiste na criação de uma API RESTful que possibilita a autenticação de usuários.

#### Features:

- [X] Cadastro de novo usuário

- [X] Login de usuário

- [X] Alteração de senha de usuário

#### Endpoints:

- [X] `/` (GET) : Endpoint de uma página inicial, não contém informações nem funcionamentos;

- [X]  `/auth/login` (POST) : Esse endpoint é utilizado para realizar o login, ele recebe: E-mail e senha para efetuar o login;

- [X]  `/auth/register` (POST) : Esse é o endpoint utilizado para realizar o cadastro de um novo usuário. ele recebe: Nome, e-mail, telefone, senha e confirmação de senha para efetuar o cadastro;

- [X]  `/user/update/idDoUsuario` (PATCH) : Esse é o endpoint responsável por tratar a alteração de senha de um usuário, na url da requisição deve ser passada o id do usuário alvo, como corpo ele recebe: E-mail, a nova senha e a confirmação dessa senha;

- [X]  `/user/idDoUsuario` (GET) : Esse endpoint só pode ser acessado após efetuar o login na API. Após efetuar o login, poderá ser especificado um id de um usuário na url da requisição e ela vai retornar os dados completos daquele usuário;

### Como testar
---

O deploy dessa API foi realizado no render.com. Ela pode ser acessada na seguinte url: `https://auth-tech-test.onrender.com`

1. Para fazer os testes adequadamente, recomendo o uso do <a href="https://insomnia.rest/download">Insomnia</a>, basta clicar no link e instalar, sem muitas complicações;

2. Após isso, já dentro do Insomnia, é preciso criar uma nova Collection, com o nome de sua preferência;

3. Depois, já dentro da collection criada, podemos definir uma variável de ambiente, que vai conter o link de acesso da API. Para isso, aperte CTRL + E e dentro do corpo de "Base environment" cole o seguinte json:
  ```json
  {
    "base_url": "https://auth-tech-test.onrender.com"
  }
  ```

4. Após a criação da variável, clique em close e crie uma nova requisição (HTTP Request) com o método HTTP desejado <strong>*cheque a listagem de endpoints para saber qual método cada endpoint usa</strong>;

5. Na url da requisição, utilize a variavel criada digitando `_.base_url` com o endpoint vindo posteriormente a essa variável, ex: `_.base_url/auth/signup`;

6. Dependendo do endpoint escolhido, lembre-se de criar um corpo JSON contendo as informações necessárias;

7. Ao escolher usar o endpoint privado, lembre-se de criar uma conta, realizar o login e copiar o token jwt gerado no login, após isso, clique na aba `Auth` ao lado do `Body` e selecione `Bearer Token`. Quando selecionado, cole o token no campo `token` e realize a requisição. Lembre-se de passar um id de usuário na url;


#### Exemplo de requisição de cadastro (`_.base_url/auth/register`): 
```json
{
  "name": "Janet Doe",
  "email": "janetdoese@email.com",
  "phone": "988888888",
  "password": "12345678",
  "confirmPassword": "12345678"
}
```


#### Exemplo de requisição de login (`_.base_url/auth/login`): 
```json
{
  "email": "janetdoese@email.com",
  "password": "12345678"
}
```


#### Exemplo de requisição para alterar a senha (`_.base_url/user/update/idDoUsuario`):
```json
{
  "email": "janetdoese@email.com",
  "password": "12345678910",
  "confirmPassword": "12345678910"
}
```
