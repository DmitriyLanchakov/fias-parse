# Парсинг и перенос файлов [ФИАС](http://fias.nalog.ru/) в JSON/MongoDB

## Для сборки
1. Создать файл `config/config.json` с настройками подключения к Mongo
```json
{
  "mongoose": {
    "uri": "mongodb://localhost:27017/tracker",
    "options": {
      "server": {
        "socketOptions": {
          "keepAlive": 1
        }
      }
    }
  }
}
```
2. Скачать зависимости
```bash
npm install
```
3. Запустить с переменными, указывающими расположение файлов
### Сохранение в файлы
```bash
FIAS_PATH=/home/username/fias OUT_PATH=/home/username/out npm start
```
### Сохранение в MongoDB
```bash
FIAS_PATH=/home/username/fias npm start
```

# В РАЗРАБОТКЕ! Не использовать в PRODUCTION

# TODO
1. Работа с MongoDB
2. Форматирование в JSON
3. Парсинг обновлений ФИАС
4. Слежение за обновлениями в ФИАС