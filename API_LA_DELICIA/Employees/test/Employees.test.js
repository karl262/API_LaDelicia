import { expect } from 'chai';
import request from 'supertest';

const BASE_URL = 'http://localhost:3100';
let token;

describe('Employees Service', () => {

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


    it('debería permitir crear un nuevo empleado', async () => {
        const res = await request(BASE_URL)
            .post('/api/employees/create/employee')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name_employee: 'Juan',
                middle_name: 'Pérez',
                last_name: 'López',
                street_address: 'Av. Principal 123',
                city_address: 'Ciudad',
                postal_code: '12345',
                cellphone_number: '5551234567',
            });

        // Validar la respuesta
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id'); // Verificar que se creó el empleado
    });

    it('debería permitir obtener todos los empleados', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('debería permitir actualizar un empleado', async () => {
        const res = await request(BASE_URL)
            .put('/api/employees/update/employee/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name_employee: 'Juan',
                middle_name: 'Pérez',
                last_name: 'López',
                street_address: 'Av. Principal 123',
                city_address: 'Ciudad',
                postal_code: '12345',
                cellphone_number: '5551234567',
            });

        // Validar la respuesta
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
    });

    it('debería permitir obtener un empleado por su ID', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/id/1')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
    });

    it('debería permitir obtener empleados por nombre', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/name/Juan')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('debería permitir eliminar un empleado', async () => {
        const res = await request(BASE_URL)
            .delete('/api/employees/delete/employees/1')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id');
    });


    it('debería dar error 404 al intentar eliminar un empleado inexistente', async () => {
        const res = await request(BASE_URL)
            .delete('/api/employees/delete/employees/9999999')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Empleado no encontrado');
    });

    it('debería dar error 404 al intentar obtener un empleado inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/id/9999999')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Empleado no encontrado');
    });

    it('debería dar error 404 al intentar obtener empleados por nombre inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/name/Juanito')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Empleado no encontrado con este nombre');
    });

    it('debería dar error 404 al intentar actualizar un empleado inexistente', async () => {
        const res = await request(BASE_URL)
            .put('/api/employees/update/employee/9999999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name_employee: 'Juan',
                middle_name: 'Pérez',
                last_name: 'López',
                street_address: 'Av. Principal 123',
                city_address: 'Ciudad',
                postal_code: '12345',
                cellphone_number: '5551234567',
            });

        // Validar la respuesta
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Empleado no encontrado');
    });

    it('deberia de dar error 404 al intentar crear un nuevo empleado con los endpoints incorrectos', async () => {
        const res = await request(BASE_URL)
            .post('/api/employees/create/employees')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name_employee: 'Juan',
                middle_name: 'Pérez',
                last_name: 'López',
                street_address: 'Av. Principal 123',
                city_address: 'Ciudad',
                postal_code: '12345',
                cellphone_number: '5551234567',
            });

        // Validar la respuesta
        expect(res.status).to.equal(404);
    });

    it('deberia de dar error 404 al intentar actualizar un empleado con los endpoints incorrectos', async () => {
        const res = await request(BASE_URL)
            .put('/api/employees/update/employees/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name_employee: 'Juan',
                middle_name: 'Pérez',
                last_name: 'López',
                street_address: 'Av. Principal 123',
                city_address: 'Ciudad',
                postal_code: '12345',
                cellphone_number: '5551234567',
            });

        // Validar la respuesta
        expect(res.status).to.equal(404);
    });

    it('deberia de dar error 404 al intentar eliminar un empleado con los endpoints incorrectos', async () => {
        const res = await request(BASE_URL)
            .delete('/api/employees/deletee/employees/1')
            .set('Authorization', `Bearer ${token}`)
            .send();

        // Validar la respuesta
        expect(res.status).to.equal(404);
    });

    it('debería dar error 500 al intentar obtener un empleado con un ID inválido', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/id/abc123')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(500);
    });

    it('debería dar error 500 al intentar eliminar un empleado con un ID inválido', async () => {
        const res = await request(BASE_URL)
            .delete('/api/employees/delete/employees/xyz789')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(500);
    });

    it('debería dar error 500 al intentar actualizar un empleado con un ID inválido', async () => {
        const res = await request(BASE_URL)
            .put('/api/employees/update/employee/invalidID')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name_employee: 'Error',
                middle_name: 'Prueba',
                last_name: 'Fallida',
            });

        expect(res.status).to.equal(500);
    });

    it('debería dar error 401 al intentar obtener todos los empleados sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees')
            .send();

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar obtener un empleado sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/id/1')
            .send();

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar eliminar un empleado sin token', async () => {
        const res = await request(BASE_URL)
            .delete('/api/employees/delete/employees/1')
            .send();

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar actualizar un empleado sin token', async () => {
        const res = await request(BASE_URL)
            .put('/api/employees/update/employee/1')
            .send({
                name_employee: 'Error',
                middle_name: 'Prueba',
                last_name: 'Fallida',
            });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'No se proporcionó token de autenticación');
    });

    it('debería dar error 401 al intentar crear un empleado sin token', async () => {
        const res = await request(BASE_URL)
            .post('/api/employees/create/employees')
            .send({
                name_employee: 'Error',
                middle_name: 'Prueba',
                last_name: 'Fallida',
            });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message', 'No se proporcionó token de autenticación');
    });

    it('debería dar error 404 al intentar obtener empleados sin pasar un parámetro necesario', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/name/')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar obtener un empleado con un ID nulo', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/by/id/')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar acceder a una ruta inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/non/existent/route')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

    it('debería dar error 404 al intentar eliminar un empleado sin ID', async () => {
        const res = await request(BASE_URL)
            .delete('/api/employees/delete/employees/')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

    it('debería dar error 403 al intentar crear un empleado con un token inválido', async () => {
        const res = await request(BASE_URL)
            .post('/api/employees/create/employee')
            .set('Authorization', 'Bearer invalid_token') // Token inválido
            .send({
                name_employee: 'Carlos',
                middle_name: 'Gómez',
                last_name: 'Sánchez',
                street_address: 'Calle Falsa 123',
                city_address: 'Ciudad X',
                postal_code: '67890',
                cellphone_number: '5556789012',
            });

        expect(res.status).to.equal(403); // Error interno del servidor
    });


    it('debería dar error 500 al intentar eliminar un empleado con un ID inválido', async () => {
        const res = await request(BASE_URL)
            .delete('/api/employees/delete/employees/not_a_number')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(500); // Error interno
    });


    it('debería dar error 404 si el servidor arroja una excepción inesperada', async () => {
        const res = await request(BASE_URL)
            .get('/api/employees/get/employees/trigger-exception') // Suponiendo un endpoint que arroje errores
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(404);
    });

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

        expect(res.status).to.equal(500); // Error interno
    });


});
