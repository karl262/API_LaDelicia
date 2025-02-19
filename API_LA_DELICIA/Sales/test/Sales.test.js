import { expect } from 'chai';
import request from 'supertest';
const BASE_URL = 'http://localhost:3100';
let token;

describe('Sales Service', () => {

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


    it('debería permitir obtener ventas con paginación', async () => {
        const res = await request(BASE_URL)
            .get('/api/sales/get/sales?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`)
            .send();
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.most(10);
    });


        it('debería fallar al crear una venta con método de pago inexistente', async () => {
            const order = {
                id: 3,
                total: 200,
                clientid: 3,
                payment_methodid: 999,
                details: [
                    { productsid: 3, quantity: 5, price_at_order: 40 }
                ]
            };

            const res = await request(BASE_URL)
                .post('/api/sales/create-from-order')
                .set('Authorization', `Bearer ${token}`)
                .send({ order });

            expect(res.status).to.equal(400);
            expect(res.body.message).to.include('violates foreign key constraint');
        });
        it('debería fallar al crear una venta con un cliente inexistente', async () => {
            const order = {
            id: 3,
            total: 200,
            clientid: 999,
            payment_methodid: 2,
            details: [
                { productsid: 3, quantity: 5, price_at_order: 40 }
            ]
            };
        
            const res = await request(BASE_URL)
            .post('/api/sales/create-from-order')
            .set('Authorization', `Bearer ${token}`)
            .send({ order });
        
            expect(res.status).to.equal(400);
            expect(res.body.message).to.include('violates foreign key constraint');
        });

        it('debería fallar al crear una venta con un producto inexistente', async () => {
            const order = {
            id: 3,
            total: 200,
            clientid: 3,
            payment_methodid: 2,
            details: [
                { productsid: 999, quantity: 5, price_at_order: 40 }
            ]
            };
        
            const res = await request(BASE_URL)
            .post('/api/sales/create-from-order')
            .set('Authorization', `Bearer ${token}`)
            .send({ order });
        
            expect(res.status).to.equal(400);
            expect(res.body.message).to.include('violates foreign key constraint');
        });


        it('debería permitir obtener una venta por ID y verificar la estructura de los detalles', async () => {
            const saleId = 2; // Cambiar por un ID de venta existente en tu base de datos

            const res = await request(BASE_URL)
                .get(`/api/sales/get/sales/by/id/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(200);
            expect(res.body.details).to.be.an('array');

            res.body.details.forEach(detail => {
                expect(detail).to.have.property('productsid');
                expect(detail).to.have.property('quantity');
                expect(detail).to.have.property('price_at_order');
            });
        });

    
        it('debería permitir obtener todas las ventas', async () => {
            const res = await request(BASE_URL)
                .get('/api/sales/get/sales')
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });

        it('debería fallar al eliminar una venta inexistente', async () => {
            const saleId = 999;
            const res = await request(BASE_URL)
                .delete(`/api/sales/delete/sale/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Venta no encontrada');
        });
        it('debería permitir obtener ventas ordenadas por fecha de creación ascendente', async () => {
            const res = await request(BASE_URL)
                .get('/api/sales/get/sales?sort=date_asc')
                .set('Authorization', `Bearer ${token}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            // Validar orden de fechas ascendente
        });
    
        it('debería permitir obtener ventas filtradas por un rango de fechas específicas', async () => {
            const startDate = '2024-01-01';
            const endDate = '2024-12-31';
    
            const res = await request(BASE_URL)
                .get(`/api/sales/get/sales?start_date=${startDate}&end_date=${endDate}`)
                .set('Authorization', `Bearer ${token}`)
                .send();
    
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            // Validar que las fechas de las ventas están dentro del rango
        });
        it('debería permitir obtener una venta por ID y verificar la estructura de los detalles', async () => {
            const saleId = 2; // Cambiar por un ID de venta existente en tu base de datos

            const res = await request(BASE_URL)
                .get(`/api/sales/get/sales/by/id/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.details).to.be.an('array');

            res.body.details.forEach(detail => {
                expect(detail).to.have.property('productsid');
                expect(detail).to.have.property('quantity');
                expect(detail).to.have.property('price_at_sale');
            });
        });
        it('debería dar error 500 al intentar obtener una venta por ID con un ID inválido', async () => {
            const saleId = 'abc123'; // ID inválido

            const res = await request(BASE_URL)
                .get(`/api/sales/get/sales/by/id/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(500);
        });

        it('debería fallar al eliminar una venta con un ID inválido', async () => {
            const saleId = 'abc123'; // ID inválido

            const res = await request(BASE_URL)
                .delete(`/api/sales/delete/sale/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(500);
        });

        it('debería fallar al eliminar una venta con un ID inexistente', async () => {
            const saleId = 999; // ID inexistente

            const res = await request(BASE_URL)
                .delete(`/api/sales/delete/sale/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Venta no encontrada');
        });

        it('debería dar error 500 al intentar eliminar una venta con un ID inexistente', async () => {
            const saleId = 'abc123'; // ID inexistente

            const res = await request(BASE_URL)
                .delete(`/api/sales/delete/sale/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(500);
        });

        it('debería dar error 500 al intentar eliminar una venta con un ID inválido', async () => {
            const saleId = 'abc123'; // ID inválido

            const res = await request(BASE_URL)
                .delete(`/api/sales/delete/sale/${saleId}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(res.status).to.equal(500);
        });

        /*it('debería dar error 500 si el servidor intenta procesar un gran volumen de datos', async () => {
            const res = await request(BASE_URL)
                .post('/api/employees/create/employee')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name_employee: 'x'.repeat(10000), // String extremadamente largo
                    middle_name: 'x'.repeat(10000),
                    last_name: 'x'.repeat(10000),
                    street_address: 'x'.repeat(10000),
                    city_address: 'x'.repeat(10000),
                    postal_code: 'x'.repeat(10000),
                    cellphone_number: 'x'.repeat(10000),
                });
        
            expect(res.status).to.equal(500); // Error interno
        });*/

        //para orders:



        it('debería dar error 500 si el servidor intenta procesar un gran volumen de datos', async () => {
            const res = await request(BASE_URL)
                .post('/api/employees/create/employee')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name_employee: 'x'.repeat(10000), // String extremadamente largo
                    middle_name: 'x'.repeat(10000),
                    last_name: 'x'.repeat(10000),
                    street_address: 'x'.repeat(10000),
                    city_address: 'x'.repeat(10000),
                    postal_code: 'x'.repeat(10000),
                    cellphone_number: 'x'.repeat(10000),
                });
                })


        

        it('deberia de dar error 404 al intentar eliminar una venta con los endpoints incorrectos', async () => {  
            const res = await request(BASE_URL)
                .delete('/api/employees/deletee/employees/1') 
                .set('Authorization', `Bearer ${token}`) 
                .send();
            
            // Validar la respuesta
            expect(res.status).to.equal(404);
        });

        it('deberia de dar error 404 al intentar obtener una venta con los endpoints incorrectos', async () => {
            const res = await request(BASE_URL)
                .get('/api/employees/get/employees/1') 
                .set('Authorization', `Bearer ${token}`) 
                .send();
            
            // Validar la respuesta
            expect(res.status).to.equal(404);
        })

        //token:

        it('debería dar error 401 al intentar crear una venta sin token', async () => {
            const res = await request(BASE_URL)
                .post('/api/sales/create/sale')
                .send({
                    clientid: 1,
                    date: '2024-01-01',
                    details: [
                        { productsid: 1, quantity: 2, price_at_sale: 10 },
                        { productsid: 2, quantity: 3, price_at_sale: 15 }
                    ]
                })

            expect(res.status).to.equal(401);
        });

        it('debería dar error 401 al intentar obtener todas las ventas sin token', async () => {
            const res = await request(BASE_URL)
                .get('/api/sales/get/sales')
                .send();

            expect(res.status).to.equal(401); 
        });
        
        it('debería dar error 401 al intentar obtener una venta por ID sin token', async () => {
            const saleId = 1; // Cambiar por un ID de venta existente en tu base de datos

            const res = await request(BASE_URL)
                .get(`/api/sales/get/sales/by/id/${saleId}`)
                .send();

            expect(res.status).to.equal(401); 
        });


        it('debería dar error 401 al intentar eliminar una venta sin token', async () => {
            const saleId = 1; // Cambiar por un ID de venta existente en tu base de datos

            const res = await request(BASE_URL)
                .delete(`/api/sales/delete/sale/${saleId}`)
                .send();

            expect(res.status).to.equal(401); 
        });


    });
    
    // Limpieza después de todas las pruebas
    after(async () => {
        // Lógica de limpieza si es necesario
    });
    

