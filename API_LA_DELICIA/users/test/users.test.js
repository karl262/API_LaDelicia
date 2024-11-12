import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';

describe('Users Service', () => {
    it('debería validar que first_name no esté vacío', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: '',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que last_name no esté vacío', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: '',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar el formato de date_of_birth (YYYY-MM-DD)', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '15-05-1990', // Formato incorrecto
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el phone_number tenga 10 dígitos', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '55512345', // Menos de 10 dígitos
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    // Test modificado para preferred_payment_method
    it('debería validar que preferred_payment_method solo acepte "fisico"', async () => {
        // Caso inválido: usando un método diferente a "fisico"
        const resInvalid = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'credit_card', // Método no permitido
                auth_user_id: 'auth123'
            });
        
        expect(resInvalid.status).to.equal(400);
    
        // Caso válido: usando "fisico"
        const resValid = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico', // Método permitido
                auth_user_id: 'auth123'
            });
        
        expect(resValid.status).to.equal(200);
    });
    
    it('debería validar que auth_user_id no esté vacío', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: ''
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que first_name no contenga números', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan123',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que last_name no contenga números', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García123',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que la fecha de nacimiento no sea futura', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '2025-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que phone_number no contenga letras', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '555abc4567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que auth_user_id sea único', async () => {
        // Primer usuario
        await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
    
        // Intentar crear otro usuario con el mismo auth_user_id
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Pedro',
                last_name: 'López',
                date_of_birth: '1992-08-20',
                phone_number: '5559876543',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el usuario sea mayor de edad', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '2010-05-15', // Menor de edad
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que phone_number sea único', async () => {
        // Primer usuario
        await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
    
        // Intentar crear otro usuario con el mismo número
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Pedro',
                last_name: 'López',
                date_of_birth: '1992-08-20',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth456'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar la longitud máxima de first_name', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'JuanCarlosAntonioJoséMaríaFrancisco',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar la longitud máxima de last_name', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'GarcíaRodríguezMartínezLópezSánchez',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que first_name comience con mayúscula', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que last_name comience con mayúscula', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'garcía',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que preferred_payment_method no esté vacío', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: '',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar caracteres especiales en first_name', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan@#$',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar caracteres especiales en last_name', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García@#$',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que la fecha de nacimiento no sea muy antigua', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1899-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar el formato del auth_user_id', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: '123' // Muy corto o formato inválido
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el mes en date_of_birth sea válido (1-12)', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-13-15', // Mes 13 inválido
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el día en date_of_birth sea válido (1-31)', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-32', // Día 32 inválido
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(400);
    });

    it('debería crear un usuario exitosamente cuando todos los datos son válidos', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                first_name: 'Juan',
                last_name: 'García',
                date_of_birth: '1990-05-15',
                phone_number: '5551234567',
                preferred_payment_method: 'fisico',
                auth_user_id: 'auth123'
            });
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('first_name', 'Juan');
        expect(res.body).to.have.property('last_name', 'García');
        expect(res.body).to.have.property('date_of_birth', '1990-05-15');
        expect(res.body).to.have.property('phone_number', '5551234567');
        expect(res.body).to.have.property('preferred_payment_method', 'fisico');
        expect(res.body).to.have.property('auth_user_id', 'auth123');
    });
});