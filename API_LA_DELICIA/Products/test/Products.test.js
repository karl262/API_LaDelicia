import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';

describe('Products Service', () => {
    
    it('debería validar que el name_product no esté vacío', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: '',
                price_product: 25.99,
                stock: 100,
                ingredients: 'Harina, Azúcar, Huevos',
                baking_time: '30 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el price_product no sea negativo', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Integral',
                price_product: -10.50,
                stock: 50,
                ingredients: 'Harina integral, Agua, Levadura',
                baking_time: '45 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el stock no sea negativo', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Croissant',
                price_product: 15.99,
                stock: -5,
                ingredients: 'Harina, Mantequilla, Levadura',
                baking_time: '25 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que los ingredients no estén vacíos', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Francés',
                price_product: 12.99,
                stock: 75,
                ingredients: '',
                baking_time: '35 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el baking_time no esté vacío', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Baguette',
                price_product: 18.99,
                stock: 30,
                ingredients: 'Harina, Agua, Sal, Levadura',
                baking_time: ''
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el name_product no contenga caracteres especiales', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan@Especial#',
                price_product: 22.99,
                stock: 40,
                ingredients: 'Harina, Azúcar, Huevos',
                baking_time: '40 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el price_product tenga máximo dos decimales', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan de Ajo',
                price_product: 19.999,
                stock: 60,
                ingredients: 'Harina, Ajo, Mantequilla',
                baking_time: '20 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el stock sea un número entero', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan de Centeno',
                price_product: 24.99,
                stock: 30.5,
                ingredients: 'Harina de centeno, Agua, Levadura',
                baking_time: '50 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que los ingredients no contengan números', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Multigrano',
                price_product: 28.99,
                stock: 45,
                ingredients: 'Harina123, Semillas, Agua',
                baking_time: '40 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar el formato del baking_time (debe incluir "minutos")', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan de Molde',
                price_product: 21.99,
                stock: 55,
                ingredients: 'Harina, Leche, Mantequilla',
                baking_time: '30'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el name_product no exceda 50 caracteres', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan super especial con semillas múltiples y hierbas aromáticas premium',
                price_product: 32.99,
                stock: 25,
                ingredients: 'Harina, Semillas variadas, Hierbas',
                baking_time: '35 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el price_product no exceda 999999.99', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Dorado',
                price_product: 1000000.00,
                stock: 10,
                ingredients: 'Harina, Oro comestible',
                baking_time: '25 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el stock no exceda 9999', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Básico',
                price_product: 15.99,
                stock: 10000,
                ingredients: 'Harina, Agua, Sal',
                baking_time: '30 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el baking_time no exceda 180 minutos', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Artesanal',
                price_product: 45.99,
                stock: 20,
                ingredients: 'Harina, Masa madre, Agua',
                baking_time: '181 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el price_product no sea cero', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan de Prueba',
                price_product: 0,
                stock: 15,
                ingredients: 'Harina, Agua, Levadura',
                baking_time: '40 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el name_product no se duplique', async () => {
        // Primer producto
        await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Único',
                price_product: 25.99,
                stock: 30,
                ingredients: 'Harina, Agua, Sal',
                baking_time: '35 minutos'
            });
    
        // Intentar crear otro producto con el mismo nombre
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Único',
                price_product: 28.99,
                stock: 25,
                ingredients: 'Harina, Agua, Sal',
                baking_time: '35 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar el mínimo de ingredientes (al menos 3)', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Simple',
                price_product: 12.99,
                stock: 40,
                ingredients: 'Harina, Agua',
                baking_time: '25 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar el formato de los minutos en baking_time', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Especial',
                price_product: 29.99,
                stock: 35,
                ingredients: 'Harina, Agua, Sal, Levadura',
                baking_time: '25.5 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el price_product sea numérico', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Rústico',
                price_product: "25.99",
                stock: 45,
                ingredients: 'Harina, Agua, Sal',
                baking_time: '40 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el stock sea numérico', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Campesino',
                price_product: 19.99,
                stock: "50",
                ingredients: 'Harina, Agua, Sal',
                baking_time: '35 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar la separación correcta de ingredients con comas', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Multigranos',
                price_product: 32.99,
                stock: 30,
                ingredients: 'Harina Agua Sal', // Sin comas
                baking_time: '45 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el name_product comience con mayúscula', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'pan especial',
                price_product: 23.99,
                stock: 40,
                ingredients: 'Harina, Agua, Sal',
                baking_time: '30 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que cada ingrediente en ingredients comience con mayúscula', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Integral',
                price_product: 26.99,
                stock: 35,
                ingredients: 'harina, agua, sal',
                baking_time: '40 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el stock mínimo sea 5 unidades', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Gourmet',
                price_product: 39.99,
                stock: 4,
                ingredients: 'Harina, Agua, Sal',
                baking_time: '35 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
    
    it('debería validar que el baking_time mínimo sea 15 minutos', async () => {
        const res = await request(app)
            .post('/api/products')
            .send({
                name_product: 'Pan Express',
                price_product: 18.99,
                stock: 25,
                ingredients: 'Harina, Agua, Sal',
                baking_time: '14 minutos'
            });
        
        expect(res.status).to.equal(400);
    });
});