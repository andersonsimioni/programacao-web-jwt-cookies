# 🍪 CookiesApp

Aplicação educacional full stack com autenticação via JWT (armazenado em cookies HTTP-only), frontend em React, backend em Node.js + Express + MongoDB.

---

## 🚀 Funcionalidades

- Cadastro e login com senha criptografada (bcrypt)
- Sessão persistente via cookie JWT seguro
- Proteção de rotas no frontend (React Router)
- Log de cookies locais + decodificação do JWT
- Armazenamento dos cookies no MongoDB
- Interface responsiva com Bootstrap 5

---

## 📁 Estrutura do Projeto

```
application/backend    ← API Express (cookies, auth, MongoDB)
application/frontend   ← React com Vite + Bootstrap via CDN
presentation           ← Reveal JS apresentação do projeto
```

---

## 🧰 Tecnologias

**Backend**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt
- cookie-parser
- dotenv
- PM2 (gerenciador de processos)

**Frontend**
- React (Vite)
- React Router DOM
- Context API
- Bootstrap 5 (via CDN)

**Servidor**
- Apache2 (Proxy reverso)
- Certbot (SSL)
- Ubuntu/Debian (Linux)

---

## ⚙️ Configuração do Ambiente (Linux)

### 1. Instale as dependências do sistema

```bash
sudo apt update
sudo apt install -y apache2 certbot python3-certbot-apache nodejs npm mongodb
```

#### Caso tenha problemas com MongoDB
##### 1. Adicione a chave pública oficial da MongoDB
```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
  --dearmor
```

##### 2. Crie o arquivo de repositório APT
```bash
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list > /dev/null
```

##### 3. Atualize a lista de pacotes
```bash
sudo apt update
```

##### 4. Instale o MongoDB
```bash
sudo apt install -y mongodb-org
```

##### Inicie o MongoDB e ative na inicialização
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```
##### Verifique se está rodando:
```bash
sudo systemctl status mongod
```

### 2. Teste cada dependência

```bash
node -v         # Deve exibir versão do Node.js
npm -v          # Deve exibir versão do NPM
mongod --version # Verificar se o MongoDB está instalado
apache2 -v      # Verificar se o Apache está ativo
certbot --version # Verificar Certbot
```

---

## 🔐 Gerar Certificado SSL (manual - sem apache)

### (Recomendado para ambientes personalizados ou proxy reverso)

```bash
sudo certbot certonly --standalone -d seu-dominio.com
```

Isso irá gerar certificados válidos em:

```
/etc/letsencrypt/live/seu-dominio.com/fullchain.pem
/etc/letsencrypt/live/seu-dominio.com/privkey.pem
```

---

## 🧪 Como rodar localmente

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Crie um `.env` com:

```
MONGO_URI=mongodb://localhost:27017/cookiesapp
JWT_SECRET=chave_super_secreta
```

Teste backend: `curl http://localhost:3000/api/ping`

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Crie um `.env` com:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deploy com Apache + Proxy + HTTPS

### 1. Compile o frontend (build)

```bash
cd frontend
npm run build
```

Copie o conteúdo para o diretório público:

```bash
sudo cp -r dist/* /var/www/html/
```

---

### 2. Configure o Apache com Proxy Reverso

Edite ou crie um VirtualHost:

```bash
sudo nano /etc/apache2/sites-available/cookiesapp.conf
```

Conteúdo:

```apache
<VirtualHost *:80>
    ServerName seu-dominio.com
    Redirect permanent / https://seu-dominio.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName seu-dominio.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/seu-dominio.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/seu-dominio.com/privkey.pem

    ProxyPreserveHost On
    ProxyPass /api http://localhost:3000/api
    ProxyPassReverse /api http://localhost:3000/api

    DocumentRoot /var/www/html

    ErrorLog ${APACHE_LOG_DIR}/cookies-error.log
    CustomLog ${APACHE_LOG_DIR}/cookies-access.log combined
</VirtualHost>
```

Ative os módulos e o site:

```bash
sudo a2enmod proxy proxy_http ssl
sudo a2ensite cookiesapp.conf
sudo systemctl restart apache2
```

---

### 3. Rodar backend com PM2

```bash
cd backend
```
```bash
npm run start
```
or
```bash
npm run start:pm2
```

---

## 🔐 Autenticação

- Senhas protegidas com BCrypt
- O JWT é armazenado em cookie `HttpOnly` para segurança
- O backend verifica e decodifica o token na rota `/me`
- As rotas do React são protegidas com Context + `ProtectedRoute`

---

## 📸 Funcionalidades visuais

- Login e Cadastro (formulários com Bootstrap)
- Dashboard do usuário autenticado
- Página de visualização de cookies locais
- Página de leitura do MongoDB com cookies salvos

---

## 📄 Licença

MIT

---

## 👨‍💻 Feito por

Anderson Simioni Assunção