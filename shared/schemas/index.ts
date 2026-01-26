import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "El correo es obligatorio" })
      .email({ message: "Correo no válido " }),
    name: z.string().min(1, { message: "El nombre es obligatorio" }),
    password: z
      .string()
      .min(8, { message: "La contraseña es muy corta, minimo 8 caracteres" }),
    password_confirmation: z
      .string()
      .min(8, { message: "La contraseña es muy corta, minimo 8 caracteres" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no son iguales",
    path: ["password_confirmation"],
  });

export const tokenSchema = z
  .string({ message: "Token no válido" })
  .length(6, { message: "Token no válido" });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo es Obligatorio" })
    .email({ message: "El correo no es válido" }),
  password: z.string().min(1, { message: "La contraseña no puede ir vacia" }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo es obligatorio" })
    .email({ message: "Correo no válido " }),
});