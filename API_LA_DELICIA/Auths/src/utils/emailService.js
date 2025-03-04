import nodemailer from 'nodemailer';
import randomstring from 'randomstring';

export default class EmailService {
  static async sendVerificationCode(email) {
    const verificationCode = randomstring.generate({
      length: 6,
      charset: 'numeric'
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Código de Verificación para Recuperación de Contraseña',
      text: `Su código de verificación es: ${verificationCode}. 
             Este código expirará en 10 minutos.`,
      html: `
        <h2>Código de Verificación</h2>
        <p>Su código de verificación es: <strong>${verificationCode}</strong></p>
        <p>Este código expirará en 10 minutos.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      
      return {
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
      };
    } catch (error) {
      console.error('Error enviando correo de verificación:', error);
      throw new Error('No se pudo enviar el código de verificación');
    }
  }
}