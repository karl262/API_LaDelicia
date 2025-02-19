import { expect } from 'chai';
import request from 'supertest';
import fs from 'fs';
import FormData from 'form-data';

const BASE_URL = 'http://localhost:3100';
let token;

describe('Products Service', () => {

    before(async () => {
        const authResponse = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: 'tenchipe23',
                password: 'pepe2005',
            });

        if (authResponse.status === 200 && authResponse.body.token) {
            token = authResponse.body.token;
        } else {
            throw new Error('No se pudo obtener el token de autenticación');
        }
    });

    it('debería permitir crear un producto', async () => {
        const product = {
            name_product: 'Producto 1',
            price_product: 10.50,
            categoryid: 1,
            stock: 10,
            ingredients: 'Ingredientes 1, Ingredientes 2',
            baking_time: 30,
        };

        // Leer la imagen como un buffer
        const image = fs.readFileSync('./test/Pan-rustico-de-Levanova-1024x677.jpg');

        // Crear el formulario usando FormData
        const formData = new FormData();
        formData.append('image', image, 'Pan-rustico-de-Levanova-1024x677.jpg');
        formData.append('name_product', product.name_product);
        formData.append('price_product', product.price_product);
        formData.append('categoryid', product.categoryid);
        formData.append('stock', product.stock);
        formData.append('ingredients', product.ingredients);
        formData.append('baking_time', product.baking_time);

        // Obtener el buffer del formulario y sus encabezados
        const formBuffer = formData.getBuffer();
        const formHeaders = formData.getHeaders();

        // Realizar la solicitud POST
        const res = await request(BASE_URL)
            .post('/api/products/create/product')
            .set('Authorization', `Bearer ${token}`)
            .set(formHeaders) // Agregar los encabezados del formulario
            .send(formBuffer) // Enviar el buffer del formulario
            .timeout(5000)
            .expect(201);

        // Validar la respuesta
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
    });

    it('debería obtener una lista de productos', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('debería obtener un producto por su ID', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/id/1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
    });

    it('debería dar error 404 al intentar obtener un producto inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/id/9999999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Producto no encontrado con este id');
    });

    it('debería dar error 404 al intentar obtener productos por nombre inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/name_product/Juanito')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Producto no encontrado con este nombre');
    });

    it('debería permitir actualizar un producto por ID', async () => {
        const updatedProduct = {
            name_product: 'Producto Actualizado',
            price_product: 20.99,
            categoryid: 2,
            stock: 15,
            ingredients: 'Ingrediente Actualizado 1, Ingrediente Actualizado 2',
            baking_time: 45,
        };

        const updatedImage = fs.readFileSync('./test/Pan-rustico-de-Levanova-1024x677.jpg');

        const formData = new FormData();
        formData.append('image', updatedImage, 'Pan-rustico-de-Levanova-1024x677.jpg');
        formData.append('name_product', updatedProduct.name_product);
        formData.append('price_product', updatedProduct.price_product);
        formData.append('categoryid', updatedProduct.categoryid);
        formData.append('stock', updatedProduct.stock);
        formData.append('ingredients', updatedProduct.ingredients);
        formData.append('baking_time', updatedProduct.baking_time);

        const formBuffer = formData.getBuffer();
        const formHeaders = formData.getHeaders();

        const productId = 1;

        const res = await request(BASE_URL)
            .put(`/api/products/update/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .set(formHeaders)
            .send(formBuffer)
            .timeout(5000)
            .expect(200);


        expect(res.status).to.equal(200);
        expect(String(res.body.id)).to.equal(String(productId));
        expect(res.body).to.have.property('name_product', updatedProduct.name_product);
    });


    it('debería dar error 404 al intentar actualizar un producto por ID inexistente', async () => {
        const updatedProduct = {
            name_product: 'Producto Actualizado',
            price_product: 20.99,
            categoryid: 2,
            stock: 15,
            ingredients: 'Ingrediente Actualizado 1, Ingrediente Actualizado 2',
            baking_time: 45,
        };

        const updatedImage = fs.readFileSync('./test/Pan-rustico-de-Levanova-1024x677.jpg');

        const formData = new FormData();
        formData.append('image', updatedImage, 'Pan-rustico-de-Levanova-1024x677.jpg');
        formData.append('name_product', updatedProduct.name_product);
        formData.append('price_product', updatedProduct.price_product);
        formData.append('categoryid', updatedProduct.categoryid);
        formData.append('stock', updatedProduct.stock);
        formData.append('ingredients', updatedProduct.ingredients);
        formData.append('baking_time', updatedProduct.baking_time);

        const formBuffer = formData.getBuffer();
        const formHeaders = formData.getHeaders();

        const productId = 9999999; // ID inexistente

        const res = await request(BASE_URL)
            .put(`/api/products/update/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .set(formHeaders)
            .send(formBuffer)
            .timeout(5000)
            .expect(404);

        // Validar que el estado sea 404
        expect(res.status).to.equal(404);

        // Validar que el cuerpo tenga un mensaje de error (si aplica)
        expect(res.body).to.have.property('message').that.includes('Producto no encontrado');
    });

    it('debería obtener productos por precio', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/price_product/20.99')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('debería devolver error 404 al no encontrar productos con un precio específico', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/price_product/9999.99')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Producto no encontrado con este precio');
    });

    it('debería obtener productos por stock', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/stock/15')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('debería devolver error 404 al no encontrar productos con un stock específico', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/stock/999999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Producto no disponible en stock');
    });

    it('debería devolver error 400 al crear un producto sin imagen', async () => {
        const product = {
            name_product: 'Producto Sin Imagen',
            price_product: 15.50,
            categoryid: 1,
            stock: 10,
            ingredients: 'Ingrediente 1, Ingrediente 2',
            baking_time: 30,
        };

        const res = await request(BASE_URL)
            .post('/api/products/create/product')
            .set('Authorization', `Bearer ${token}`)
            .send(product);

        expect(res.status).to.equal(400);
    });

    it('debería devolver error 400 al crear un producto con campos faltantes', async () => {
        const formData = new FormData();
        formData.append('name_product', 'Producto Faltante');
        formData.append('price_product', 15.50);

        const res = await request(BASE_URL)
            .post('/api/products/create/product')
            .set('Authorization', `Bearer ${token}`)
            .set(formData.getHeaders())
            .send(formData.getBuffer());

        expect(res.status).to.equal(400);
    });

    it('debería devolver error 400 al actualizar un producto con campos inválidos', async () => {
        const updatedProduct = {
            name_product: '',
            price_product: -10,
            categoryid: 1,
            stock: -5,
            ingredients: '',
            baking_time: -1,
        };

        const formData = new FormData();
        formData.append('name_product', updatedProduct.name_product);
        formData.append('price_product', updatedProduct.price_product);
        formData.append('categoryid', updatedProduct.categoryid);
        formData.append('stock', updatedProduct.stock);
        formData.append('ingredients', updatedProduct.ingredients);
        formData.append('baking_time', updatedProduct.baking_time);

        const res = await request(BASE_URL)
            .put('/api/products/update/product/1')
            .set('Authorization', `Bearer ${token}`)
            .set(formData.getHeaders())
            .send(formData.getBuffer());

        expect(res.status).to.equal(400);
    });

    it('debería eliminar un producto existente', async () => {
        const res = await request(BASE_URL)
            .delete('/api/products/delete/product/1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Producto eliminado correctamente');
    });

    it('debería devolver error 404 al intentar eliminar un producto inexistente', async () => {
        const res = await request(BASE_URL)
            .delete('/api/products/delete/product/9999999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar acceder a un endpoint inexistente para listar productos', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/all_products') // Endpoint incorrecto
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar acceder a un endpoint inexistente para obtener producto por ID', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/by_id/1') // Endpoint incorrecto
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar acceder a un endpoint inexistente para obtener producto por nombre', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/title/Producto') // Endpoint incorrecto
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar acceder a un endpoint inexistente para obtener producto por precio', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/cost/20') // Endpoint incorrecto
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar acceder a un endpoint inexistente para obtener producto por stock', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/quantity/50') // Endpoint incorrecto
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
    });

    it('debería dar error el intentar acceder a un endpoint inexistente para crear un producto', async () => {
        const product = {
            name_product: 'Producto 1',
            price_product: 10.50,
            categoryid: 1,
            stock: 10,
            ingredients: 'Ingredientes 1, Ingredientes 2',
            baking_time: 30,
        };

        // Leer la imagen como un buffer
        const image = fs.readFileSync('./test/Pan-rustico-de-Levanova-1024x677.jpg');

        // Crear el formulario usando FormData
        const formData = new FormData();
        formData.append('image', image, 'Pan-rustico-de-Levanova-1024x677.jpg');
        formData.append('name_product', product.name_product);
        formData.append('price_product', product.price_product);
        formData.append('categoryid', product.categoryid);
        formData.append('stock', product.stock);
        formData.append('ingredients', product.ingredients);
        formData.append('baking_time', product.baking_time);

        // Obtener el buffer del formulario y sus encabezados
        const formBuffer = formData.getBuffer();
        const formHeaders = formData.getHeaders();

        // Realizar la solicitud POST
        const res = await request(BASE_URL)
            .post('/api/products/create/productitos')
            .set('Authorization', `Bearer ${token}`)
            .set(formHeaders) // Agregar los encabezados del formulario
            .send(formBuffer) // Enviar el buffer del formulario
            .timeout(5000)
            .expect(404);

        // Validar la respuesta
        expect(res.status).to.equal(404);
    });

    it('debería de dar error al intentar actualizar un producto por ID con los endpoints incorrectos', async () => {
        const updatedProduct = {
            name_product: 'Producto Actualizado',
            price_product: 20.99,
            categoryid: 2,
            stock: 15,
            ingredients: 'Ingrediente Actualizado 1, Ingrediente Actualizado 2',
            baking_time: 45,
        };

        const updatedImage = fs.readFileSync('./test/Pan-rustico-de-Levanova-1024x677.jpg');

        const formData = new FormData();
        formData.append('image', updatedImage, 'Pan-rustico-de-Levanova-1024x677.jpg');
        formData.append('name_product', updatedProduct.name_product);
        formData.append('price_product', updatedProduct.price_product);
        formData.append('categoryid', updatedProduct.categoryid);
        formData.append('stock', updatedProduct.stock);
        formData.append('ingredients', updatedProduct.ingredients);
        formData.append('baking_time', updatedProduct.baking_time);

        const formBuffer = formData.getBuffer();
        const formHeaders = formData.getHeaders();

        const productId = 1;

        const res = await request(BASE_URL)
            .put(`/api/products/update/productitos/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .set(formHeaders)
            .send(formBuffer)
            .timeout(5000)
            .expect(404);


        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar acceder a un endpoint inexistente para eliminar producto', async () => {
        const res = await request(BASE_URL)
            .delete('/api/products/remove/product/1') // Endpoint incorrecto
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(404);
    });

    it('debería dar error 500 al intentar acceder a un endpoint inexistente con parámetros inválidos', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/id/abc') // Parámetro inválido
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(500);
    });

    it('debería dar error 400 al intentar crear un producto sin datos', async () => {
        const res = await request(BASE_URL)
            .post('/api/products/create/product')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // Sin datos

        expect(res.status).to.equal(400);
    });

    it('debería dar error 401 al intentar listar productos sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products'); // Sin enviar el token

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar obtener un producto por ID sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/id/1'); // Sin enviar el token

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar obtener un producto por nombre sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/name_product/Producto'); // Sin enviar el token

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar obtener productos por precio sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/price_product/10.5'); // Sin enviar el token

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar obtener productos por stock sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/products/get/products/by/stock/20'); // Sin enviar el token

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar crear un producto sin token', async () => {
        const product = {
            name_product: 'Producto Sin Token',
            price_product: 10.50,
            categoryid: 1,
            stock: 10,
            ingredients: 'Ingrediente 1, Ingrediente 2',
            baking_time: 20,
        };

        const res = await request(BASE_URL)
            .post('/api/products/create/product') // Sin token
            .send(product);

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar actualizar un producto sin token', async () => {
        const updatedProduct = {
            name_product: 'Producto Actualizado Sin Token',
            price_product: 15.50,
            categoryid: 2,
            stock: 5,
            ingredients: 'Ingrediente Nuevo',
            baking_time: 25,
        };

        const res = await request(BASE_URL)
            .put('/api/products/update/product/1') // Sin token
            .send(updatedProduct);

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar eliminar un producto sin token', async () => {
        const res = await request(BASE_URL)
            .delete('/api/products/delete/product/1'); // Sin token

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

});
