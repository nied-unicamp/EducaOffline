# AVA-Offline

## Download

To download the project files, install [git](https://gitlab.com/nied/AVA-Offline/wikis/instalar-git) and execute:

```bash
git clone https://github.com/nied-unicamp/EducaOffline.git
```

## WebApp Dev Setup

Requirements:

- NodeJS 12+
- @angular/cli

After cloning the project, download the project dependencies by running:

```bash
cd webapp/
npm ci
```

Finally, to run a local server, execute:

```bash
ng serve
```

You can access the webapp in [localhost:4200](http://localhost:4200/)

## API Dev Setup

## Fast-way: using Visual Studio Code and dev containers

If you are using Windows this is by far the fastest way to do it.

### Setup Docker

- [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- Ensure that docker is running, and in the docker desktop settings the folder for the project is shared. (Docker icon on system tray -> Settings -> Resources -> File Sharing)
- In Visual Studio Code, install the [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Running

- Open vscode on the **/api** folder and you should be asked to *reopen the folder in a container*
- If not, press **Ctrl+Shift+p** and execute: ``Remote-Containers: Reopen in Container``
- Please wait the container to be downloaded and built (usually some minutes in the first time)
- After the window is fully loaded, execute ``./start-api`` in the editor terminal to run the api

## Additional information

You can access the README files inside the [api/](https://github.com/nied-unicamp/EducaOffline/tree/main/api) and [webapp/](https://github.com/nied-unicamp/EducaOffline/tree/main/webapp) folders for more information.

There is also a guide written using the CodeTour extension on VS Code that can help you to follow the code more easily. Just search install the extension and the guides will appear in the left panel, below the file list.

## Complete install guide

Educa Offline
Guia de instalação 

Para a instalação e execução do sistema Educa Offline, são necessários alguns programas e requisitos que serão detalhados passo a passo neste guia de instalação.
### Download de Arquivos:
git: Necessário para baixar os arquivos do projeto.

Depois de baixar e instalar, execute o comando abaixo para clonar o projeto: 
```bash
git clone https://github.com/nied-unicamp/EducaOffline.git
```
### Instalar no Servidor
- MySQL 5.7+
- Java 11 
- Maven 3.6+	
- Git
### Preparação do ambiente
#### Crie um banco de dados no Mysql chamado teste 
```bash
(como em src/main/resources/application.yml > spring.datasource.url)
```
##### Alteração das propriedades de acordo com seu ambiente no script application.yml 
###### Endereço do banco de dados local
```bash
spring.datasource.url
```
###### Nome de usuário do Banco de dados local
```bash
spring.datasource.username 
``` 
###### Senha do banco de dados local
```bash
spring.datasource.password
```
#### Alterações para uso do Docker
##### Nos paths abaixo, substituir DATABASE_NAME e DATABASE_PASSWORD pelo nome e senha correspondentes
```bash
.env
api/.devcontainer/.env
api/docker/.env
api/docker/db/setup.sql
api/src/main/java/br/- niedunicamp/ApplicationStart.java
api/src/main/resources/application.yml
```
#### Alterações para inicialização do ApplicationStart
##### No path abaixo definir o email e senha que serão utilizados pelo administrador
```bash
api/src/main/java/br/niedunicamp/ApplicationStart.java
user.setEmail("admin_mail");
user.setPassword("passwordEnconder.encode("password);
```
#### Alterações no application.yml
##### No path abaixo definir o email que será usado para enviar confirmação de cadastro, recuperação de senha, etc.
```bash
src/main/resources/application.yml > spring.mail.username
src/main/resources/application.yml > spring.mail.password
```
#### Testar o ambiente
Entre na pasta do projeto pelo terminal e execute
```bash
cd core/api
```
Compile o pacote “.jar”
```bash
mvn clean package
```
Execute o comando
```bash
java -jar target/core_back_end-1.0-SNAPSHOT.jar
```
### Na máquina do usuário
#### Instalar 
- NodeJS  >= 12
- @angular/cli (npm)
#### Baixar as dependências do projeto
abrir um terminal e executar o comando:
```bash
cd webapp/
npm install
npm ci 
```
Caso dê erro, tente o comando: 
```bash
npm config set legacy-peer-deps true
```
Para executar um servidor local e testar o sistema, entre na pasta X pelo terminal e execute o seguinte comando:
```bash
ng serve --open
```
Abrir o navegador e acessar o seguinte endereço:
```bash
http://localhost:3000
```
