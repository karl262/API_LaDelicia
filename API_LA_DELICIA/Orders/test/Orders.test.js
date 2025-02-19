import { expect } from 'chai';
import request from 'supertest';

const BASE_URL = 'http://localhost:3100'; 
let token;

describe('Orders Service', () => {
    
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


    it('debería fallar al convertir un pedido con monto total cero a venta', async () => {
        const zeroTotalOrderId = 14;

        const res = await request(BASE_URL)
            .post(`/api/orders/convert-to-sale/${zeroTotalOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(400);
    });

    it('debería fallar al aplicar un descuento extremadamente grande', async () => {
        const orderId = 15;

        const res = await request(BASE_URL)
            .patch(`/api/orders/add/discount/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ discountPercentage: 999 });

        expect(res.status).to.equal(400);
    });

    it('debería fallar al recuperar pedidos eliminados', async () => {
        const deletedOrderId = 16;

        const res = await request(BASE_URL)
            .get(`/api/orders/get/orders/deleted/${deletedOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

    it('debe fallar al crear una orden con un ID de cliente no existente', async () => {
        const res = await request(BASE_URL)
            .post('/api/orders/create/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientid: 9999,
                employeeid: 1,
                payment_methodid: 1,
                total: 100,
                details: [
                    { productsid: 1, quantity: 2, price_at_order: 10 },
                    { productsid: 2, quantity: 3, price_at_order: 20 },
                ],
            });

        expect(res.status).to.equal(404);        
    });


    it('debe fallar al crear una orden con un ID de empleado no existente', async () => {
        const res = await request(BASE_URL)
            .post('/api/orders/create/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientid: 1,
                employeeid: 9999,
                payment_methodid: 1,
                total: 100,
                details: [
                    { productsid: 1, quantity: 2, price_at_order: 10 },
                    { productsid: 2, quantity: 3, price_at_order: 20 },
                ],
            });

        expect(res.status).to.equal(404);        
    }); 
        

    it('debería fallar al agregar un porcentaje de descuento inválido', async () => {
        const orderId = 3;
        const invalidDiscounts = [-5, 105, 1000];

        for (const discountPercentage of invalidDiscounts) {
            const res = await request(BASE_URL)
                .patch(`/api/orders/add/discount/${orderId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ discountPercentage });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('success', false);
            expect(res.body.message).to.include('porcentaje de descuento');
        }
    });

    it('debería fallar al actualizar el estado de un pedido inexistente', async () => {
        const orderId = 99999; 

        const res = await request(BASE_URL)
            .patch(`/api/orders/updateStatus/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('success', false);
        expect(res.body.message).to.include('Orden no encontrada');
    });
    it('debería prevenir el acceso a las rutas de pedidos sin el rol adecuado', async () => {
        const lowPrivilegeToken = 'low.privilege.token';

        const res = await request(BASE_URL)
            .post('/api/orders/convert-to-sale/5')
            .set('Authorization', `Bearer ${lowPrivilegeToken}`)
            .send();

        expect(res.status).to.equal(403);
    });
    it('debería fallar al crear un pedido con detalles vacíos', async () => {
        const res = await request(BASE_URL)
            .post('/api/orders/create/order')
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientid: 1,
                total: 0,
                details: []
            });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('success', false);
        expect(res.body.message).to.include('detalles de la orden');
    });

    it('debería dar error 404 al intentar obtener un pedido con un ID inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/orders/get/orders/999')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });


    it('debería dar error 404 al intentar obtener un pedido sin pasar un parámetro necesario', async () => {
        const res = await request(BASE_URL)
            .get('/api/orders/get/orders/')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });


    it('debería dar error 401 al intentar eliminar una venta sin token', async () => {
        const saleId = 3; // Cambiar por un ID de venta existente en tu base de datos

        const res = await request(BASE_URL)
            .delete(`/api/sales/delete/sale/${saleId}`)
            .send();

        expect(res.status).to.equal(401); 
    });


    it('debería dar error 404 si el servidor arroja una excepción inesperada', async () => {
        const res = await request(BASE_URL)
            .get('/api/orders/get/orders/trigger-exception') // Suponiendo un endpoint que arroje errores
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

    it('debería dar error 401 al intentar obtener un pedido por ID sin token', async () => {
        const orderId = 1;

        const res = await request(BASE_URL)
            .get(`/api/orders/get/orders/by/id/${orderId}`)
            .send();

        expect(res.status).to.equal(401);
    });


    it('debería dar error 401 al intentar obtener un pedido por ID sin token', async () => {
        const orderId = 1; // Cambiar por un ID de pedido existente en tu base de datos

        const res = await request(BASE_URL)
            .get(`/api/orders/get/orders/by/id/${orderId}`)
            .send();

        expect(res.status).to.equal(401);
    });


    it('debería fallar al crear una orden con un método de pago no existente', async () => {
        const res = await request(BASE_URL)
            .post('/api/orders/create/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientid: 1,
                employeeid: 1,
                payment_methodid: 9999,
                total: 100,
                details: [
                    { productsid: 1, quantity: 2, price_at_order: 10 },
                    { productsid: 2, quantity: 3, price_at_order: 20 },
                ],
            });

        expect(res.status).to.equal(404);        
    });

    it('debería fallar al crear una orden con un producto no existente', async () => {
        const res = await request(BASE_URL)
            .post('/api/orders/create/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientid: 1,
                employeeid: 1,
                payment_methodid: 1,
                total: 100,
                details: [
                    { productsid: 9999, quantity: 2, price_at_order: 10 },
                ],
            });

        expect(res.status).to.equal(404);        
    });


    it('debería fallar al intentar convertir un pedido ya convertido a venta', async () => {
        const orderId = 5; // Asumir que este pedido ya ha sido convertido

        const res = await request(BASE_URL)
            .post(`/api/orders/convert-to-sale/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(400);
    });

    it('debería fallar al intentar restaurar una orden eliminada', async () => {
        const orderId = 7; // Asumir que este es un ID de orden previamente eliminada

        const res = await request(BASE_URL)
            .post(`/api/orders/restore/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

    it('debería prevenir múltiples descuentos en la misma orden', async () => {
        const orderId = 6;

        const firstDiscountRes = await request(BASE_URL)
            .patch(`/api/orders/add/discount/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ discountPercentage: 10 });

        const secondDiscountRes = await request(BASE_URL)
            .patch(`/api/orders/add/discount/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ discountPercentage: 20 });

        expect(secondDiscountRes.status).to.equal(400);
    });


    it('debería fallar al aplicar descuento a una orden cancelada', async () => {
        const cancelledOrderId = 10;

        const res = await request(BASE_URL)
            .patch(`/api/orders/add/discount/${cancelledOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ discountPercentage: 15 });

        expect(res.status).to.equal(400);
    });

    it('debería fallar al convertir un pedido con stock insuficiente', async () => {
        const orderWithInsufficientStockId = 11;

        const res = await request(BASE_URL)
            .post(`/api/orders/convert-to-sale/${orderWithInsufficientStockId}`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(400);
    });

});
