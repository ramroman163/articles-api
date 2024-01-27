
# API de  Articulos

Permite la carga, lectura, edición y eliminación de articulos.


## Consultas

#### Obtener todos los articulos

```http
  GET http://localhost:3000/articles
```

#### Obtener todos los articulos sin preprocesamiento

```http
  GET http://localhost:3000/articles?raw=true
```

#### Obtener todos los articulos según categoría

```http
  GET http://localhost:3000/articles/categories/:category
```

#### Obtener articulo según id

```http
  GET http://localhost:3000/articles/:id
```

#### Agregar un nuevo articulo

```http
  POST http://localhost:3000/articles
  Content-Type: application/json
  
  {
    "name": "...",
    "price": ...,
    "category_id": ...,
    "description": "...",
    "brand_id": ...,
    "availability": ...,
    "release_date": "..."
  }
```

#### Editar un nuevo articulo

```http
  PATCH http://localhost:3000/articles/:id
  Content-Type: application/json

  {
    "price": 25,
    "category": 1
  }
```

#### Eliminar articulo según id

```http
  DELETE http://localhost:3000/articles/:id
```


## Environment Variables

Para correr el proyecto, debes tener las siguientes variables de entorno en un archivo .env

`DB_URL`
URL de la BBDD en Turso

`DB_TOKEN`
TOKEN de la BBDD en Turso


## Instalacion

Dirigirse mediante la consola al directorio del proyecto y ejecutar el siguiente comando:

```bash
  npm install 
```
    
## Local Deployment

Para iniciar la API, correr el siguiente comando

```bash
  node index.js
```


## Tech Stack

- Backend: Node.js, Express
- BBDD: SQL
- Host BBDD: Turso


## Authors

- [@ramroman163](https://www.github.com/ramroman163)

