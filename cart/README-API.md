<a name="top"></a>
# Cart Service v0.1.0

Microservicio de Carrito

- [Carrito](#carrito)
	- [Agregar Artículo](#agregar-artículo)
	- [Checkout](#checkout)
	- [Decrementar](#decrementar)
	- [Incrementar](#incrementar)
	- [Obtener Carrito](#obtener-carrito)
	- [Quitar Artículo](#quitar-artículo)
	- [Validar Carrito](#validar-carrito)
	
- [RabbitMQ_GET](#rabbitmq_get)
	- [Validación de Artículos](#validación-de-artículos)
	- [Logout de Usuarios](#logout-de-usuarios)
	
- [RabbitMQ_POST](#rabbitmq_post)
	- [Comprobar Articulo](#comprobar-articulo)
	


# <a name='carrito'></a> Carrito

## <a name='agregar-artículo'></a> Agregar Artículo
[Back to top](#top)

<p>Agregar artículos al carrito.</p>

	POST /v1/cart/article



### Examples

Body

```
{
  "articleId": "{Article Id}",
  "quantity": {Quantity to add}
}
```

### Success Response

Body

```
{
  "userId": "{User Id}",
  "enabled": true|false,
  "_id": "{Id de carrito}",
  "articles": [{Artículos}],
  "updated": "{Fecha ultima actualización}",
  "created": "{Fecha creado}"
}
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "messages" : [
     {
       "path" : "{Propiedad con errores}",
       "message" : "{Mensaje con el error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```
## <a name='checkout'></a> Checkout
[Back to top](#top)

<p>Realiza el checkout del carrito.</p>

	POST /v1/cart/checkout




### Success Response

Body

```
HTTP/1.1 200 Ok
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "messages" : [
     {
       "path" : "{Propiedad con errores}",
       "message" : "{Mensaje con el error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```
## <a name='decrementar'></a> Decrementar
[Back to top](#top)

<p>Decrementa la cantidad de artículos en el cart.</p>

	POST /v1/cart/article/:articleId/decrement




### Success Response

Body

```
{
  "articleId": "{Article Id}",
  "quantity": {articles to decrement}
}
```
Body

```
{
  "userId": "{User Id}",
  "enabled": true|false,
  "_id": "{Id de carrito}",
  "articles": [{Artículos}],
  "updated": "{Fecha ultima actualización}",
  "created": "{Fecha creado}"
}
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "messages" : [
     {
       "path" : "{Propiedad con errores}",
       "message" : "{Mensaje con el error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```
## <a name='incrementar'></a> Incrementar
[Back to top](#top)

<p>Incrementa la cantidad de artículos en el cart.</p>

	POST /v1/cart/article/:articleId/increment




### Success Response

Body

```
{
  "articleId": "{Article Id}",
  "quantity": {articles to increment},
  "validated": True|False Determina si el articulo se valido en catalog
}
```
Body

```
{
  "userId": "{User Id}",
  "enabled": true|false,
  "_id": "{Id de carrito}",
  "articles": [{Artículos}],
  "updated": "{Fecha ultima actualización}",
  "created": "{Fecha creado}"
}
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "messages" : [
     {
       "path" : "{Propiedad con errores}",
       "message" : "{Mensaje con el error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```
## <a name='obtener-carrito'></a> Obtener Carrito
[Back to top](#top)

<p>Devuelve el carrito activo.</p>

	GET /v1/cart




### Success Response

Body

```
{
  "userId": "{User Id}",
  "enabled": true|false,
  "_id": "{Id de carrito}",
  "articles": [{Artículos}],
  "updated": "{Fecha ultima actualización}",
  "created": "{Fecha creado}"
}
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "messages" : [
     {
       "path" : "{Propiedad con errores}",
       "message" : "{Mensaje con el error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```
## <a name='quitar-artículo'></a> Quitar Artículo
[Back to top](#top)

<p>Eliminar un articulo del carrito.</p>

	DELETE /cart/article/:articleId




### Success Response

Body

```
HTTP/1.1 200 Ok
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "messages" : [
     {
       "path" : "{Propiedad con errores}",
       "message" : "{Mensaje con el error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```
## <a name='validar-carrito'></a> Validar Carrito
[Back to top](#top)

<p>Realiza una validación completa del cart, para realizar el checkout.</p>

	POST /v1/cart/validate




### Success Response

Body

```
{
   "errors": [
       {  "articleId": "{Article}",
          "message" : "{Error message}"
       }, ...],
   "warnings": [
       {  "articleId": "{Article}",
          "message" : "{Error message}"
       }, ...]
 }
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "messages" : [
     {
       "path" : "{Propiedad con errores}",
       "message" : "{Mensaje con el error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```
# <a name='rabbitmq_get'></a> RabbitMQ_GET

## <a name='validación-de-artículos'></a> Validación de Artículos
[Back to top](#top)

<p>Escucha de mensajes article-exist desde cart. Valida artículos</p>

	DIRECT cart/article-exist




### Success Response

Mensaje

```
{
   "type": "article-exist",
   "message": {
        "cartId": "{cartId}",
        "articleId": "{articleId}",
        "valid": true|false
   }
}
```


## <a name='logout-de-usuarios'></a> Logout de Usuarios
[Back to top](#top)

<p>Escucha de mensajes logout desde auth.</p>

	FANOUT auth/logout




### Success Response

Mensaje

```
{
   "type": "logout",
   "message": "{tokenId}"
}
```


# <a name='rabbitmq_post'></a> RabbitMQ_POST

## <a name='comprobar-articulo'></a> Comprobar Articulo
[Back to top](#top)

<p>Cart enviá un mensaje a Catalog para comprobar la validez de un articulo.</p>

	DIRECT catalog/article-exist



### Examples

Mensaje

```
{
   "type": "article-exist",
   "queue": "cart",
   "exchange": "cart",
    "message": {
        "cartId": "{cartId}",
        "articleId": "{articleId}"
   }
}
```



