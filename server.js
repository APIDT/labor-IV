const http = require('http')
const fs = require('fs')
const { URLSearchParams } = require('url')

const host = 'localhost'
const port = 8000;

const sushi = {
    title: "Суші",
    price: 70000,
    weight: '1 кг',
    ingredients: ['рис', 'норі', 'авокадо', 'лосось']
};

const frenchfries = {
    title: "Картопля фрі",
    price: 40000,
    weight: '200 г',
    ingredients: ['картопля', 'соус']
};

const ice = {
    title: "Морозиво",
    price: 3000,
    weight: '500 г',
    ingredients: ['молоко', 'фрукти', 'вафлі']
};

const pizza = {
    title: "Піца",
    price: 70000,
    weight: '600 г',
    ingredients: ['томати', 'салямі', 'шампіньйони', 'сир']
};

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile('index.html', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(500, {'Content-Type': 'text/html'})
                res.end('Помилка');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(data);
            }
        });
    } else if (req.url === '/submit' && req.method === 'POST') {
        let body = ''

        req.on('data', (chunk) => {
            body += chunk
        })

        req.on('end', async () => {
            const formData = new URLSearchParams(body);
            const name = formData.get('name')
            const email = formData.get('email')
            const phone = formData.get('phone')
            const address = formData.get('address')
            const orderCode = formData.get('orderCode')

            let orderItem;
            switch (orderCode) {
                case "1":
                    orderItem = sushi
                    break
                case "2":
                    orderItem = ice
                    break
                case "3":
                    orderItem = frenchfries
                    break
                case "4":
                    orderItem = pizza
                    break
                default:
                    res.writeHead(400, {'Content-Type': 'text/html'})
                    res.end('Невірний код замовлення')
                    return
            }

            setTimeout(() => {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.end(`<h1>Замовлення успішно оброблено!</h1>
                         <p>Дякуємо, ${name}! Ваше замовлення (${orderItem.title}) в дорозі.</p>`)
            }, 5000)

            console.log('Отримано замовлення:', orderItem.title)
        })
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'})
        res.end('Сторінка не знайдена')
    }
});

server.listen(port, host, () => {
    console.log(`Сервер працює за адресою http://${host}:${port}`)
})