# E-commerce TEM DE TUDO

Projeto de portifólio de e-commerce utilizando Typescript, React, Material UI, SQLite com Sequelize e outras bibliotecas.

---
### Features disponíveis

- [x] Implementação de tema escudo;
- [x] Cadastro e login de usuário cliente e vendedor;
- [x] Credenciais criptografadas em token JWT;
- [x] Validação de formulários;
- [x] Interface para buscar, criar, editar, excluir e visualizar meus produtos;
- [x] Home page com listagem dos produtos dos vendedores;
- [x] Seleção aleatória de vendedores;
- [x] Carrinho de compras;
- [x] Cadastro de endereço de entrega com busca de CEP via API.

### Features ainda não implementadas
- [ ] Busca de produtos para clientes;
- [ ] Demais implementações para fechamento de compra.

### Instruções de uso

- ##### Instalação convencional
  -  Possuir o Node JS instalado na máquina;
  -  Clone o repositório;
  -  Execute dentro da pasta server os comandos 
      <code>npm install</code> <code>npm run start</code> para subir o servidor backend;
  -  Execute o dentro da pasta client o comando <code>npm install</code> <code>npm run dev</code> para subir o front-end em ambiente de desenvolvimento.
  - Acesse o serviço em http://localhost:3000

- ##### Instalação via docker compose
  - Possuir Docker e Docker Compose instalado na máquina;
  - Clone o repositório;
  - Execute dentro da pasta raiz do projeto o comando <code>docker compose up</code>;
  - Acesse o serviço em http://localhost:3000