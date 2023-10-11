# task-manager-vkr
## RU
Данный проект был реализован как приложение для ВКР, при разработке были использованы следующие инструмены:
* TypeScrpit,
* Express
* InversifyJS
* argon2
* mysql
* ejs
* JWT

Для модификации проекта необходимо скачать репозиторий и установить все зависимости командой "npm i" и "npm i -D" (Если после этого dev зависимтости не установились, попробуйте следующие команды "npm i --production=false" или "npm install --only=dev")

Для запуска проекта необходимо создать файл ".env" в папке "dist/" и добавить в него следующие поля со своими параметрами :
* PORT= //Порт, на котором будет работать приложение (Рекомендую использовать 80 для http и 443 для https)
* DB_HOST= //Адрес хоста, где находится база данных (localhost для локальной базы данных)
* DB_USER= //Имя пользователя базы данных
* DB_PWD= //Пароль пользователя
* DB_DATABASE= //Название базы данных
* SALT= //Соль (секретное слово для шифрования данных)

## ENG
This project was implemented as an application for final qualifying work. The following tools were used during development:
* TypeScrpit,
* Express
* InversifyJS
* argon2
* mysql
* ejs
* JWT

To modify the project, you need to download the repository and install all dependencies with the command "npm i" and "npm i -D" (If after this dev dependencies are not installed, try the following commands "npm i --production=false" or "npm install --only =dev")

To run the project, you need to create a ".env" file in the "dist/" folder and add the following fields with your parameters to it:
* PORT= //Port on which the application will run (I recommend using 80 for http and 443 for https)
* DB_HOST= //Host address where the database is located (localhost for a local database)
* DB_USER= //Database user name
* DB_PWD= //User password
* DB_DATABASE= //Database name
* SALT= //Salt (secret word for data encryption)
