import { transport } from "../config/nodemailer";

type EmailType = {
    name: string;
    email: string;
    token: string;
};

export const sendConfirmationEmail = async (user: EmailType) => {
    const email = await transport.sendMail({
        from: "Presupuestos <admin@admin.com>",
        to: user.email,
        subject: "Presupuestos - Confirma tu cuenta",
        html: `
            <p>Hola: ${user.name}, has creado tu cuenta en Presupuestos, ya esta casi lista</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta">Confirmar cuenta</a>
            <p>e ingresa el código: <b>${user.token}</b></p>
            `,
    });
    console.log("Mensaje enviado", email.messageId);
};

export const sendPasswordResetToken = async (user: EmailType) => {
    const email = await transport.sendMail({
        from: "Presupuestos <admin@admin.com>",
        to: user.email,
        subject: "Presupuestos - Reestablece tu contraseña",
        html: `
            <p>Hola: ${user.name}, has solicitado reestablecer tu contraseña</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer contraseña</a>
            <p>e ingresa el código: <b>${user.token}</b></p>
            `,
    });
    console.log("Mensaje enviado", email.messageId);
};
