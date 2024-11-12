try {
    //Скрипт для обработки соббытий и вызова webhook
    //Parameters: 
    //host {HOST.IP}; 
    //key {ваш ключ api полученный через приложение}; 
    //message {EVENT.NAME}; 
    //statusofhost {EVENT.VALUE}; 
    //time {EVENT.DATE}T{EVENT.TIME}

    Zabbix.log(4, '[ Alert API Webhook ] Started with params: ' + value);

    // Парсим параметры, переданные в Webhook
    var params = JSON.parse(value),
        req = new HttpRequest(),
        payload = {},
        result = {
            'tags': {
                'endpoint': 'alertapro'
            }
        },
        response;

    // Устанавливаем заголовки запроса
    req.addHeader('Content-Type: application/json');

    // Формируем JSON-тело для отправки в API
    payload = {
        "key": params.key || "string",
        "host": params.host || "string",
        "message": params.message || "string",
        "time": params.time || "string",
        "statusofhost": params.statusofhost || "string"
    };

    // Выполняем POST-запрос к API
    response = req.post(
        'https://alerta.bot-n.ru/api/alert',
        JSON.stringify(payload)
    );

    // Проверяем статус ответа
    if (req.getStatus() != 200) {
        throw 'Response code: ' + req.getStatus();
    }

    // Парсим и логируем ответ для отладки
    Zabbix.log(4, '[ Alert API Webhook ] Response: ' + response);
    response = JSON.parse(response);

    // Возвращаем результат в виде JSON
    result.tags.api_response_id = response.id;
    result.tags.api_message = response.message;

    return JSON.stringify(result);
}
catch (error) {
    // Логируем ошибку, если запрос не удался
    Zabbix.log(4, '[ Alert API Webhook ] Request failed with payload: ' + JSON.stringify(payload));
    Zabbix.log(3, '[ Alert API Webhook ] Error: ' + error);

    throw 'Failed with error: ' + error;
}
