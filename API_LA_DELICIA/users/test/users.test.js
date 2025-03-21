import { expect } from 'chai';
import request from 'supertest';

const BASE_URL = 'http://localhost:3100';
let token;

describe('Users Service', () => {

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

    it ('debería permitir obtener todos los usuarios', async () => {
        const res = await request(BASE_URL)
            .get('/api/users/getAll/users')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('debería crear un usuario', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Pepe',
                first_surname: 'Pérez',
                last_surname: 'López',
                auth_user_id: 1,
                city: 'Ciudad',
                date_of_birth: '2000-01-01',
                phone_number: '5551234567',
                postal_code: '28001',
            });
    
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('id');
    });

    it('debería retornar 401 al intentar obtener todos los usuarios sin token', async () => {
        const res = await request(BASE_URL)
            .get('/api/users/getAll/users');
    
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });

    it('debería retornar 403 al intentar obtener todos los usuarios con un token inválido', async () => {
        const res = await request(BASE_URL)
            .get('/api/users/getAll/users')
            .set('Authorization', 'Bearer token_invalido');
    
        expect(res.status).to.equal(403);
        expect(res.body).to.have.property('message').that.includes('Token inválido');
    });

    it('debería retornar 500 al intentar crear un usuario sin datos obligatorios', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Pepe',
            });
    
        expect(res.status).to.equal(500);
    });

    it('debería permitir eliminar un usuario existente', async () => {
        const res = await request(BASE_URL)
            .delete('/api/users/delete/user/1')
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.status).to.equal(200); 
    });

    it('debería retornar 401 al intentar eliminar un usuario sin token', async () => {
        const res = await request(BASE_URL)
            .delete('/api/users/delete/user/1');
    
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message').that.includes('No se proporcionó token de autenticación');
    });
    
    it('debería retornar 404 al intentar eliminar un usuario que no existe', async () => {
        const res = await request(BASE_URL)
            .delete('/api/users/delete/user/9999')
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message').that.includes('Usuario no encontrado');
    });

    
    it('debería retornar 404 al intentar obtener todos los usuarios con un token no definido', async () => {
        const res = await request(BASE_URL)
            .get('/api/users')
            .set('Authorization', `Bearer ${undefined}`);
    
        expect(res.status).to.equal(404);
    });
    
    it('debería retornar 403 al intentar usar un token vacío', async () => {
        const res = await request(BASE_URL)
            .get('/api/users/getAll/users')
            .set('Authorization', 'Bearer ') // Token vacío
    
        expect(res.status).to.equal(403);
    });
    
    it('debería retornar 403 al intentar usar un token malformado', async () => {
        const malformedToken = 'malformed.token';
        const res = await request(BASE_URL)
            .get('/api/users/getAll/users')
            .set('Authorization', `Bearer ${malformedToken}`);
    
        expect(res.status).to.equal(403);
        expect(res.body).to.have.property('message').that.includes('Token inválido');
    });
    
    it('debería retornar 404 al intentar acceder a un endpoint incorrecto para listar usuarios', async () => {
        const res = await request(BASE_URL)
            .get('/api/users/getAllUser') // Endpoint incorrecto
    
        expect(res.status).to.equal(404);
    });
    
    it('debería retornar 404 al intentar eliminar un usuario con un endpoint inexistente', async () => {
        const res = await request(BASE_URL)
            .delete('/api/users/remove/user/1') // Endpoint inexistente
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.status).to.equal(404);
    });
    
    it('debería retornar 500 al intentar eliminar un usuario con un ID no numérico', async () => {
        const res = await request(BASE_URL)
            .delete('/api/users/delete/user/abc') // ID no numérico
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.status).to.equal(500);
    });
    
    it('debería retornar 404 al intentar eliminar un usuario con un ID negativo', async () => {
        const res = await request(BASE_URL)
            .delete('/api/users/delete/user/-1') // ID negativo
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.status).to.equal(404);
    });

    it('debería retornar 404 al intentar acceder a un endpoint incorrecto para crear usuario', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/add/user') // Endpoint mal escrito
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Carlos',
                first_surname: 'Rodríguez',
                last_surname: 'Díaz',
                auth_user_id: 3,
                city: 'Otra Ciudad',
                date_of_birth: '1985-06-20',
                phone_number: '5558765432',
                postal_code: '68050',
            });
    
        expect(res.status).to.equal(404);
    });
    
    it('debería retornar 404 al intentar eliminar un usuario sin proporcionar un ID en la ruta', async () => {
        const res = await request(BASE_URL)
            .delete('/api/users/delete/user/') // Falta el ID
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.status).to.equal(404);
    });
    
    it('debería retornar 403 al intentar usar un token emitido para otro servicio', async () => {
        const otherServiceToken = 'ey...otroservicio'; // Token de ejemplo para otro servicio
        const res = await request(BASE_URL)
            .get('/api/users/getAll/users')
            .set('Authorization', `Bearer ${otherServiceToken}`);
    
        expect(res.status).to.equal(403);
    });
    
    it('debería retornar 413 al intentar crear un usuario con un nombre extremadamente largo', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'A'.repeat(50000000), // Nombre excesivamente largo
                first_surname: 'García',
                last_surname: 'Pérez', 
                auth_user_id: 3,
                city: 'Ciudad',
                date_of_birth: '1990-01-01',
                phone_number: '5551234567',
                postal_code: '12345',
            });
    
        expect(res.status).to.equal(413);
    });
    
    it('debería retornar 413 al intentar crear un usuario con un teléfono excesivamente largo', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Mario',
                first_surname: 'Hernández',
                last_surname: 'Lozano',
                auth_user_id: 7,
                city: 'Ciudad',
                date_of_birth: '1990-12-01',
                phone_number: '1'.repeat(5000000), // Teléfono excesivamente largo
                postal_code: '34567',
            });
    
        expect(res.status).to.equal(413);
    });
    
    it('debería retornar 500 al intentar crear un usuario con un payload vacío', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // Payload vacío
    
        expect(res.status).to.equal(500);
    });
    
    it('debería retornar 500 al intentar crear un usuario con datos incompletos', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Carlos', // Faltan campos requeridos
                first_surname: 'Ruiz',
            });
    
        expect(res.status).to.equal(500);
    });

    it('debería retornar 413 al intentar crear un usuario con un apellido paterno excesivamente largo', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Juan',
                first_surname: 'B'.repeat(1000000), // Apellido paterno excesivamente largo
                last_surname: 'García',
                auth_user_id: 6,
                city: 'Ciudad de las Sobrecargas',
                date_of_birth: '1998-04-12',
                phone_number: '5551112233',
                postal_code: '45000',
            });
    
        expect(res.status).to.equal(413);
    });
    
    it('debería retornar 413 al intentar crear un usuario con un apellido materno excesivamente largo', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Ana',
                first_surname: 'López',
                last_surname: 'C'.repeat(1000000), // Apellido materno excesivamente largo
                auth_user_id: 7,
                city: 'Ciudad Compleja',
                date_of_birth: '1990-02-02',
                phone_number: '5553334455',
                postal_code: '50001',
            });
    
        expect(res.status).to.equal(413);
    });

    it('debería retornar 413 al intentar crear un usuario con un campo de fecha de nacimiento excesivamente largo', async () => {
        const res = await request(BASE_URL)
            .post('/api/users/create/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Pedro',
                first_surname: 'Martínez',
                last_surname: 'Hernández',
                auth_user_id: 8,
                city: 'Sobrecarga City',
                date_of_birth: '1990-01-01'.repeat(100000), // Fecha de nacimiento excesivamente larga
                phone_number: '5556667788',
                postal_code: '60001',
            });
    
        expect(res.status).to.equal(413);
    }); 
    
});
