import { expect } from "chai";
import request from 'supertest';

const BASE_URL = 'http://localhost:3100';
let token;

describe('Auths service', () => {

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
            throw new Error('No se pudo obtener el token de autenticaci n');
        }
    });

    it('Deber a regresar un token al intentar loguear con credenciales correctas', async () => {
        const authResponse = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: 'tenchipe23',
                password: 'pepe2005',
            });

        expect(authResponse.status).to.equal(200);
        expect(authResponse.body).to.have.property('token');
    });

    it('debería retornar 404 al intentar obtener autenticación por ID inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/auths/get/auth/by/999999') // ID inexistente
            .set('Authorization', `Bearer ${token}`)
            .send();
    
        expect(res.status).to.equal(404);
    });

    it('debería retornar 200 al obtener autenticación por ID', async () => {
        const res = await request(BASE_URL)
            .get('/api/auths/get/auth/by/1') // ID válido
            .set('Authorization', `Bearer ${token}`)
            .send();
    
        expect(res.status).to.equal(200);
    });
    
    it('debería retornar 400 al intentar registrar un usuario con datos inválidos', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: 'tenchipe23',
                password: '', // Contraseña vacía
            });
    
        expect(res.status).to.equal(400);
    });
    
    it('debería retornar 201 al registrar un nuevo usuario', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: 'nuevoUsuario',
                email: 'galeano23@gmail.com',
                password: 'password123',
            });
    
        expect(res.status).to.equal(201);
    });
    
    it('debería retornar 400 al intentar loguearse con credenciales incorrectas', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: 'incorrectUsername',
                password: 'incorrectPassword',
            });
    
        expect(res.status).to.equal(400);
    });

    it('debería retornar 200 y un token al loguearse con credenciales correctas', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: 'tenchipe23',
                password: 'pepe2005',
            });
    
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
    });
    
    it('debería retornar 200 al verificar un token válido', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/verify-token')
            .set('Authorization', `Bearer ${token}`)
            .send();
    
        expect(res.status).to.equal(200);
    });
    

    it('debería retornar 403 si el token ha expirado', async () => {
        // Se simula un token expirado
        const expiredToken = 'expiredTokenExample';
    
        const res = await request(BASE_URL)
            .post('/api/auths/verify-token')
            .set('Authorization', `Bearer ${expiredToken}`)
            .send();
    
        expect(res.status).to.equal(403);
    });

    it('debería retornar 401 al intentar verificar el token sin proporcionar uno', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/verify-token')
            .send();
    
        expect(res.status).to.equal(401);
    });

    it('debería retornar 400 al intentar registrar un usuario sin datos', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({});
    
        expect(res.status).to.equal(400);
    });

    it('debería retornar 400 al intentar registrar un usuario con correo electrónico inválido', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: 'nuevoUsuario',
                password: 'password123',
                email: 'correo_invalido', // Correo inválido
            });
    
        expect(res.status).to.equal(400);
    });
    
    it('debería retornar 400 al intentar hacer login con una contraseña incorrecta', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: 'tenchipe23',
                password: 'contraseñaIncorrecta', // Contraseña incorrecta
            });
    
        expect(res.status).to.equal(400);
    });

    it('debería retornar 400 al intentar registrar un usuario con campos vacíos', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: '',
                password: '',
            });
    
        expect(res.status).to.equal(400);
    });

    it('debería retornar 400 al intentar hacer login con usuario y contraseña vacíos', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: '',
                password: '',
            });
    
        expect(res.status).to.equal(400);
    });

    it('debería retornar 400 al intentar hacer login con un formato de contraseña incorrecto', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: 'tenchipe23',
                password: '12345', // Contraseña de formato incorrecto
            });
    
        expect(res.status).to.equal(400); 
    });
    
    it('debería retornar 400 al intentar registrar un usuario con una contraseña muy corta', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: 'nuevoUsuario',
                password: '123', // Contraseña muy corta
            });
    
        expect(res.status).to.equal(400);
    });
    
    it('debería retornar 400 al intentar hacer login sin el campo username', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                password: 'password123',
            });
    
        expect(res.status).to.equal(400);
    });
    
    it('debería retornar 404 al intentar acceder a un endpoint inexistente', async () => {
        const res = await request(BASE_URL)
            .get('/api/auths/nonexistent/endpoint')
            .send();
        
        expect(res.status).to.equal(404);
    });

    it('debería retornar 404 al intentar usar un método no permitido en un endpoint', async () => {
        const res = await request(BASE_URL)
            .delete('/api/auths/login/user') // DELETE no está permitido en este endpoint
            .send();

        expect(res.status).to.equal(404);
    });

    it('debería retornar 400 al enviar datos malformados a un endpoint', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send('malformedData'); // Datos no válidos (no JSON)
        
        expect(res.status).to.equal(400);
    });

    it('debería retornar 401 al intentar hacer login con un username que exceda el límite de caracteres', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/login/user')
            .send({
                username: 'a'.repeat(300), // Nombre de usuario demasiado largo
                password: 'password123',
            });

        expect(res.status).to.equal(401);
    });

    it('debería retornar 500 al intentar registrar un usuario con un username duplicado', async () => {
        await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: 'duplicatedUser',
                password: 'password123',
            });

        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: 'duplicatedUser', // Nombre de usuario ya registrado
                password: 'password123',
            });

        expect(res.status).to.equal(500);
    });

    it('debería retornar 413 al intentar enviar un payload demasiado grande', async () => {
        const res = await request(BASE_URL)
            .post('/api/auths/register/auth/user')
            .send({
                username: 'usuarioGrande'.repeat(50000),
                password: 'password123',
            });

        expect(res.status).to.equal(413);
    });

    it('debería retornar 404 cuando el servicio de autenticación no está disponible', async () => {
        const res = await request(BASE_URL)
          .get('/api/auths')
          .set('Authorization', `Bearer ${token}`);
      
        expect(res.status).to.equal(404);
      });
    
    
    
    
});
