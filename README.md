# Proyecto Backend - Coderhouse

Este proyecto es una API y aplicación web para la gestión de productos y carritos de compras, desarrollado con Node.js, Express, MongoDB, Mongoose, Socket.io y Handlebars.

## Características

- **API RESTful** para productos y carritos.
- **Persistencia en MongoDB** usando Mongoose y mongoose-paginate-v2.
- **Vistas dinámicas** con Handlebars.
- **Carga de archivos** (imágenes) con Multer.
- **Actualización en tiempo real** de productos usando Socket.io.
- **Gestión de carritos de compras**.
- **Paginación y filtrado** de productos.

## Estructura del proyecto

```
src/
│
├── app.js                # Archivo principal de la aplicación
├── ProductManager.js     # Lógica de productos
├── CartManager.js        # Lógica de carritos
├── utils.js              # Configuración de Multer para uploads
├── models/               # Modelos de Mongoose
│   ├── product.model.js
│   └── cart.model.js
├── routes/               # Rutas de la API y vistas
│   ├── products.router.js
│   ├── carts.router.js
│   └── view.router.js
├── public/               # Archivos estáticos (JS, imágenes)
│   ├── js/
│   │   ├── home.js
│   │   └── realTimeProducts.js
│   └── img/
└── views/                # Vistas Handlebars
    ├── home.handlebars
    ├── product.handlebars
    ├── cart.handlebars
    ├── realTimeProducts.handlebars
    ├── index.handlebars
    └── layouts/
        └── main.handlebars
```

## Instalación

1. **Clona el repositorio**  
   ```bash
   git clone <url-del-repo>
   cd proyecto-backend-1
   ```

2. **Instala las dependencias**  
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**  
   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   MONGO_URI=mongodb://localhost:27017/tu_basededatos
   ```

4. **Inicia el servidor**  
   ```bash
   npm start
   ```

5. **Accede a la aplicación**  
   - Vistas: [http://localhost:8080/view/home](http://localhost:8080/view/home)
   - Real Time Products: [http://localhost:8080/view/realtimeproducts](http://localhost:8080/view/realtimeproducts)
   - API: [http://localhost:8080/api/products](http://localhost:8080/api/products)

## Endpoints

- **GET /api/products**  
  Lista productos con paginación y filtros.

- **GET /api/products/:pid**  
  Devuelve un producto.

- **POST /api/products**  
  Agrega un producto.

- **PUT /api/products/:pid**  
  Actualiza un producto.

- **DELETE /api/products/:pid**  
  Elimina un producto.

- **GET /api/carts/:cid**  
  Devuelve los productos de un carrito.

- **POST /api/carts**  
  Crea un carrito.

- **POST /api/carts/:cid/products/:pid**  
  Agrega un producto al carrito.

- **PUT /api/carts/:cid**  
  Actualiza todos los productos del carrito con un arreglo de productos.

- **PUT /api/carts/:cid/products/:pid**  
  Actualiza solo la cantidad de un producto.

- **DELETE /api/carts/:cid/products/:pid**  
  Elimina un producto del carrito.

- **DELETE /api/carts/:cid**  
  Elimina todos los productos del carrito.

## Notas

- El proyecto usa ES Modules (`"type": "module"` en `package.json`).
- Las vistas están en `src/views`.
- Los archivos estáticos se sirven desde `src/public`.
- Para la funcionalidad en tiempo real, asegúrate de tener Socket.io funcionando y accede a `/view/realtimeproducts`.

---

**Desarrollado para el curso de Backend I de Coderhouse.**
