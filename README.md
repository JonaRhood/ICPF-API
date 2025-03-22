
# <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHlxZnUzc3NlZm95YzU3Z3psOG41eGY2dTFzd2NmZ3V4bTdlZzVpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/gdTD9BIMWfPEnWmV4e/giphy.gif" width="30">&nbsp; ICPF REST API 

#  REST API con Node.js, Express y PostgreSQL

Este es el backend del proyecto, desarrollado como una REST API utilizando **Node.js**, **Express** y **PostgreSQL**. El backend ha sido desplegado en **Railway**, mientras que la base de datos se aloja en **Supabase**, permitiéndome aprender mucho sobre la integración entre diferentes proveedores de servicios.

## 📋 Tabla de Contenidos
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Características](#caracteristicas)
3. [Tecnologías Utilizadas](#tecnologias-utilizadas)
4. [Contacto](#contacto)

## ✏️ Resumen del Proyecto  
Este backend proporciona una **API REST robusta, segura y escalable** para la gestión eficiente de la **Librería Baluarte de la Fe** de ICPF. La arquitectura está diseñada para garantizar la integridad y seguridad de los datos mediante **encriptación de contraseñas con bcrypt**, autenticación basada en sesiones con **express-session**, y validaciones estrictas con **express-validator**. Además, se ha optimizado el almacenamiento y rendimiento utilizando **PostgreSQL** alojado en **Supabase**, asegurando una experiencia ágil y confiable.  

## ⚙️ Características 

- **🔐 Autenticación Segura**  
  Implementación de **Passport.js** con estrategias locales para gestionar el inicio de sesión de usuarios de manera segura, reforzado con encriptación avanzada.

- **🔑 Gestión de Sesiones**  
  Uso de **express-session** con almacenamiento en **Supabase**, permitiendo persistencia de sesiones de usuario de forma eficiente y segura.

- **🖼️ Carga y Procesamiento de Imágenes**  
  Integración de **Sharp** y **Busboy** para la carga, conversión y compresión de imágenes en **formato .webp**, optimizando el uso del almacenamiento en **Supabase** y asegurando una alta calidad con menor tamaño de archivo.

- **🛡️ Validaciones y Seguridad**  
  Protección del servidor con **helmet** y **CORS**, garantizando un entorno seguro ante ataques como **XSS**, **CSRF** y **inyección de código**. Validaciones en los endpoints con **express-validator** para evitar datos inconsistentes.

- **📚 Documentación de la API**  
  Documentación interactiva con **Swagger UI**, facilitando la comprensión e integración de la API por parte de desarrolladores y clientes.

- **📊 Monitoreo y Registro de Peticiones**  
  Implementación de **Morgan** como middleware para registrar solicitudes HTTP, permitiendo un seguimiento detallado del tráfico y posibles errores en el servidor.

- **💻 Software Cliente para Gestión Integral**  
  Se ha desarrollado un software cliente diseñado específicamente para los encargados de la librería, permitiéndoles gestionar la librería de manera eficiente y en tiempo real. La aplicación permite registrar y modificar libros y autores, gestionar el proceso de venta de libros, y visualizar estadísticas detalladas sobre ventas y productos. Al estar completamente integrado con el backend, garantiza que toda la información se almacene y actualice en línea, facilitando la administración y asegurando la disponibilidad de datos en cualquier momento y desde cualquier dispositivo.

  <p align="center">
  <img src="./public/diagrams/icpf-cliente.png" />
  </p>

- **📊 Modelo de Datos Estructurado**: Se ha diseñado un **Diagrama de Relaciones de Entidad (ERD)** que define la estructura de la base de datos en **PostgreSQL**, asegurando integridad referencial, eficiencia en las consultas y escalabilidad. Este modelo permite gestionar relaciones clave como libros, autores, ventas y usuarios de manera optimizada.

  <p align="center">
    <img src="./public/diagrams/icpf-diagram-black.svg" />
  </p>

### 🔧 Tecnologías Utilizadas
- **Servidor y Framework**: [![EXPRESS][https://img.shields.io/badge/EXPRESS-20232A?style=for-the-badge&logo=express]][https://expressjs.com/es/]
- **Base de Datos**: `pg`, `postgres`
- **Autenticación**: `passport`, `passport-local`, `passport-google-oauth20`, `passport-facebook`
- **Seguridad**: `helmet`, `csrf-csrf`, `express-validator`
- **Manejo de Sesiones**: `express-session`, `connect-pg-simple`, `connect-flash`
- **Carga y Procesamiento de Imágenes**: `multer`, `sharp`
- **Variables de Entorno**: `dotenv`
- **Utilidades**: `uuid`, `validator`, `yamljs`

### 🛠️ Dependencias de Desarrollo
- **Linting y Seguridad**: `eslint`, `@eslint/js`, `eslint-plugin-security`, `globals`
- **Registro de Peticiones**: `morgan`
- **Monitoreo de Cambios**: `nodemon`

## 👤 Contacto
📧 **Jonathan Cano** - jonathancanofreta@gmail.com

🚀 ¡Espero que este proyecto te sea útil! Para más información o contribuciones, no dudes en contactarme.

