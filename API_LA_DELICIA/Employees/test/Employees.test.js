<<<<<<< HEAD
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


=======
import { expect } from "chai";
import request from "supertest";
import app from "../index.js";

describe("Employees Service", () => {
  it("debería permitir crear un nuevo empleado", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
  });

  it("debería fallar al crear un empleado con datos incompletos", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      last_name: "López",
    });
    expect(res.status).to.equal(400);
  });

  it("debería permitir crear un empleado con todos los datos opcionales", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Ana",
      middle_name: "Sánchez",
      last_name: "García",
      street_address: "Calle Secundaria 456",
      city_address: "Otro Ciudad",
      postal_code: "67890",
      cellphone_number: "5559876543",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
  });

  it("debería obtener todos los empleados", async () => {
    const res = await request(app).get("/api/employees");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("debería obtener un empleado por ID", async () => {
    const newEmployee = await request(app).post("/api/employees").send({
      name_employee: "Carlos",
      middle_name: "Rodríguez",
      last_name: "Martínez",
      street_address: "Calle Secundaria 456",
      city_address: "Ciudad",
      postal_code: "54321",
      cellphone_number: "5557654321",
    });

    const res = await request(app).get(`/api/employees/${newEmployee.body.id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", newEmployee.body.id);
  });

  it("debería retornar 404 para un empleado no existente", async () => {
    const res = await request(app).get("/api/employees/99999");

    expect(res.status).to.equal(404);
  });

  it("debería actualizar un empleado existente", async () => {
    const newEmployee = await request(app).post("/api/employees").send({
      name_employee: "Luis",
      middle_name: "Martín",
      last_name: "Hernández",
      street_address: "Avenida Tercera 789",
      city_address: "Ciudad",
      postal_code: "67890",
      cellphone_number: "5559876543",
    });

    const res = await request(app)
      .put(`/api/employees/${newEmployee.body.id}`)
      .send({
        name_employee: "Luis",
        middle_name: "Martín",
        last_name: "Hernández",
        street_address: "Avenida Modificada 789",
        city_address: "Ciudad Nueva",
        postal_code: "67891",
        cellphone_number: "5559876544",
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property(
      "street_address",
      "Avenida Modificada 789"
    );
  });

  it("debería retornar 404 al intentar actualizar un empleado no existente", async () => {
    const res = await request(app).put("/api/employees/99999").send({
      name_employee: "Nombre no existente",
      street_address: "Dirección nueva",
    });

    expect(res.status).to.equal(404);
  });

  it("debería eliminar un empleado existente", async () => {
    const newEmployee = await request(app).post("/api/employees").send({
      name_employee: "Mario",
      middle_name: "José",
      last_name: "García",
      street_address: "Calle Falsa 123",
      city_address: "Ciudad X",
      postal_code: "45678",
      cellphone_number: "5553210987",
    });

    const res = await request(app).delete(
      `/api/employees/${newEmployee.body.id}`
    );

    expect(res.status).to.equal(204);
  });

  it("debería retornar 404 al intentar eliminar un empleado no existente", async () => {
    const res = await request(app).delete("/api/employees/99999");

    expect(res.status).to.equal(404);
  });

  it("debería permitir buscar empleados por nombre", async () => {
    await request(app).post("/api/employees").send({
      name_employee: "Ana",
      middle_name: "Sofia",
      last_name: "Ramírez",
      street_address: "Calle Corta 101",
      city_address: "Ciudad Z",
      postal_code: "98765",
      cellphone_number: "5551098765",
    });

    const res = await request(app).get("/api/employees?name=A");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("debería retornar error 400 si se intenta buscar con un parámetro inválido", async () => {
    const res = await request(app).get("/api/employees?invalidParam=test");

    expect(res.status).to.equal(400);
  });

  it("debería validar que el name_employee no contenga números", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan123",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que el middle_name no contenga caracteres especiales", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez@#$",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que el last_name no esté vacío", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar el formato del postal_code (5 dígitos)", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "123456", // 6 dígitos
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar el formato del cellphone_number (10 dígitos)", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "55512", // menos de 10 dígitos
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que el city_address no esté vacío", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que el street_address tenga un mínimo de caracteres", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av", // muy corto
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que no se duplique el cellphone_number", async () => {
    // Primer empleado
    await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    // Intentar crear otro empleado con el mismo número
    const res = await request(app).post("/api/employees").send({
      name_employee: "Pedro",
      middle_name: "Gómez",
      last_name: "Sánchez",
      street_address: "Otra Calle 456",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar la longitud máxima del name_employee", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "JuanCarlosAntonioJoséMaríaFranciscoJavier", // nombre muy largo
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que el middle_name no exceda la longitud máxima", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "PérezGonzálezRodríguezMartínezSánchez", // muy largo
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que el last_name no exceda la longitud máxima", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "LópezGarcíaRodríguezMartínezGonzález", // muy largo
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar caracteres especiales en el city_address", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad@#$%",
      postal_code: "12345",
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });

  it("debería validar que el postal_code solo contenga números", async () => {
    const res = await request(app).post("/api/employees").send({
      name_employee: "Juan",
      middle_name: "Pérez",
      last_name: "López",
      street_address: "Av. Principal 123",
      city_address: "Ciudad",
      postal_code: "123A5", // contiene una letra
      cellphone_number: "5551234567",
    });

    expect(res.status).to.equal(400);
  });
>>>>>>> 9159b87 (fix: corregir de los archivos para optimizacion)
});
