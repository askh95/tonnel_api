# Tonnel Network API

API-интерфейс для взаимодействия с Tonnel Network: получение информации о подарках, проверка баланса и покупка подарков.

## Установка и настройка

1. Создать файл `.env` на основе примера:

```bash
cp env.example .env
```

2. Обновить файл `.env`, указав свой токен аутентификации Tonnel Network:

```
USER_AUTH="ваш-токен-аутентификации-tonnel-network"
```

## Запуск сервера

```bash
npm start
```

Сервер будет доступен по адресу `http://localhost:3000`

## API-интерфейсы

### Получение информации о листингах

| Метод | Конечная точка                                                          | Описание                                     |
| ----- | ----------------------------------------------------------------------- | -------------------------------------------- |
| GET   | `/api/listed/:giftName`                                                 | Получить все листинги для указанного подарка |
| GET   | `/api/listed/:giftName?m={model}`                                       | Фильтрация по модели                         |
| GET   | `/api/listed/:giftName?b={backdrop}`                                    | Фильтрация по фону                           |
| GET   | `/api/listed/:giftName?s={symbol}`                                      | Фильтрация по символу                        |
| GET   | `/api/listed/:giftName?r={min}-{max}`                                   | Фильтрация по диапазону цен                  |
| GET   | `/api/listed/:giftName?m={model}&b={backdrop}&s={symbol}&r={min}-{max}` | Комбинированная фильтрация                   |

**Примеры:**

```
http://localhost:3000/api/listed/Santa%20Hat
http://localhost:3000/api/listed/Santa%20Hat?m=The%20Grinch
http://localhost:3000/api/listed/Astral%20Shard?r=1-100
http://localhost:3000/api/listed/Durov's%20Cap?r=1-100&m=Freshwave
http://localhost:3000/api/listed/Neko%20Helmet-10657
```

### Получение баланса кошелька

| Метод | Конечная точка | Описание                      |
| ----- | -------------- | ----------------------------- |
| GET   | `/api/balance` | Получить информацию о балансе |

**Пример:**

```
http://localhost:3000/api/balance
```

### Покупка подарков

| Метод | Конечная точка                        | Описание        |
| ----- | ------------------------------------- | --------------- |
| GET   | `/api/purchase/:giftId?price={price}` | Покупка подарка |

**Пример:**

```
http://localhost:3000/api/purchase/2081498?price=100
```

### Проверка статуса API

| Метод | Конечная точка | Описание                               |
| ----- | -------------- | -------------------------------------- |
| GET   | `/api/status`  | Получить статус API и время обновления |
