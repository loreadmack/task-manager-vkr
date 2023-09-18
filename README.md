# task-manager-vkr
# RU
Данный проект был реализован как приложение для ВКР, при разработке были использованы следующие инструмены:
1. TypeScrpit,
2. Express
3. InversifyJS
4. argon2
5. mysql
6. ejs
7. JWT
Для модификации проекта необходимо скачать репозиторий и установить все зависимости командой "npm i" и "npm i -D" (Если после этого dev зависимтости не установились, попробуйте следующие команды "npm i --production=false" или "npm install --only=dev")
Для запуска проекта необходимо создать файл ".env" в папке "dist/" и добавить в него следующие поля со своими параметрами :
1. PORT= //Порт, на котором будет работать приложение (Рекомендую использовать 80 для http и 443 для https)
2. DB_HOST= //Адрес хоста, где находится база данных (localhost для локальной базы данных)
3. DB_USER= //Имя пользователя базы данных
4. DB_PWD= //Пароль пользователя
5. DB_DATABASE= //Название базы данных
6. SALT= //Соль (секретное слово для шифрования данных)

#ENG
This project was implemented as an application for final qualifying work. The following tools were used during development:
1. TypeScrpit,
2. Express
3. InversifyJS
4. argon2
5. mysql
6. ejs
7. JWT
To modify the project, you need to download the repository and install all dependencies with the command "npm i" and "npm i -D" (If after this dev dependencies are not installed, try the following commands "npm i --production=false" or "npm install --only =dev")
To run the project, you need to create a ".env" file in the "dist/" folder and add the following fields with your parameters to it:
1. PORT= //Port on which the application will run (I recommend using 80 for http and 443 for https)
2. DB_HOST= //Host address where the database is located (localhost for a local database)
3. DB_USER= //Database user name
4. DB_PWD= //User password
5. DB_DATABASE= //Database name
6. SALT= //Salt (secret word for data encryption)
