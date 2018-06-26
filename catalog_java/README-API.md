<a name="top"></a>
# Catalog en Java Service v0.1.0

Microservicio de Catálogo

- [Art_culos](#art_culos)
	- [Actualizar Artículo](#actualizar-artículo)
	- [Buscar Artículo](#buscar-artículo)
	- [Crear Artículo](#crear-artículo)
	- [Eliminar Artículo](#eliminar-artículo)
	
- [Articulos](#articulos)
	- [Buscar Artículo](#buscar-artículo)
	
- [RabbitMQ](#rabbitmq)
	- [Orden Creada](#orden-creada)
	
- [RabbitMQ_GET](#rabbitmq_get)
	- [Validación de Artículos](#validación-de-artículos)
	- [Validación de Artículos](#validación-de-artículos)
	- [Logout](#logout)
	
- [RabbitMQ_POST](#rabbitmq_post)
	- [Validación de Artículos](#validación-de-artículos)
	


# <a name='art_culos'></a> Art_culos

## <a name='actualizar-artículo'></a> Actualizar Artículo
[Back to top](#top)



	POST /v1/articles/:articleId



### Examples

Body

```
{
    "name": "{nombre del articulo}",
    "description": "{descripción del articulo}",
    "image": "{id de imagen}",
    "price": {precio actual},
    "stock": {stock actual}
}
```
Header Autorización

```
Authorization=bearer {token}
```

### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
    "_id": "{id de articulo}"
    "name": "{nombre del articulo}",
    "description": "{descripción del articulo}",
    "image": "{id de imagen}",
    "price": {precio actual},
    "stock": {stock actual}
    "updated": {fecha ultima actualización}
    "created": {fecha creación}
    "enabled": {si esta activo}
}
```


### Error Response

401 Unauthorized

```
HTTP/1.1 401 Unauthorized
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "path" : "{Nombre de la propiedad}",
    "message" : "{Motivo del error}"
}
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "error" : "{Motivo del error}"
}
```
500 Server Error

```
HTTP/1.1 500 Server Error
{
    "error" : "{Motivo del error}"
}
```
## <a name='buscar-artículo'></a> Buscar Artículo
[Back to top](#top)

<p>Busca artículos por nombre o descripción</p>

	GET /v1/articles/search/:criteria




### Success Response

Respuesta

```
 HTTP/1.1 200 OK
 [
     {
         "_id": "{id de articulo}"
         "name": "{nombre del articulo}",
         "description": "{descripción del articulo}",
         "image": "{id de imagen}",
         "price": {precio actual},
         "stock": {stock actual}
         "updated": {fecha ultima actualización}
         "created": {fecha creación}
         "enabled": {activo}
     },
     ...
]
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "path" : "{Nombre de la propiedad}",
    "message" : "{Motivo del error}"
}
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "error" : "{Motivo del error}"
}
```
500 Server Error

```
HTTP/1.1 500 Server Error
{
    "error" : "{Motivo del error}"
}
```
## <a name='crear-artículo'></a> Crear Artículo
[Back to top](#top)



	POST /v1/articles/



### Examples

Body

```
{
    "name": "{nombre del articulo}",
    "description": "{descripción del articulo}",
    "image": "{id de imagen}",
    "price": {precio actual},
    "stock": {stock actual}
}
```
Header Autorización

```
Authorization=bearer {token}
```

### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
    "_id": "{id de articulo}"
    "name": "{nombre del articulo}",
    "description": "{descripción del articulo}",
    "image": "{id de imagen}",
    "price": {precio actual},
    "stock": {stock actual}
    "updated": {fecha ultima actualización}
    "created": {fecha creación}
    "enabled": {si esta activo}
}
```


### Error Response

401 Unauthorized

```
HTTP/1.1 401 Unauthorized
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "path" : "{Nombre de la propiedad}",
    "message" : "{Motivo del error}"
}
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "error" : "{Motivo del error}"
}
```
500 Server Error

```
HTTP/1.1 500 Server Error
{
    "error" : "{Motivo del error}"
}
```
## <a name='eliminar-artículo'></a> Eliminar Artículo
[Back to top](#top)



	DELETE /articles/:articleId



### Examples

Header Autorización

```
Authorization=bearer {token}
```

### Success Response

200 Respuesta

```
HTTP/1.1 200 OK
```


### Error Response

401 Unauthorized

```
HTTP/1.1 401 Unauthorized
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "path" : "{Nombre de la propiedad}",
    "message" : "{Motivo del error}"
}
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "error" : "{Motivo del error}"
}
```
500 Server Error

```
HTTP/1.1 500 Server Error
{
    "error" : "{Motivo del error}"
}
```
# <a name='articulos'></a> Articulos

## <a name='buscar-artículo'></a> Buscar Artículo
[Back to top](#top)



	GET /v1/articles/:articleId




### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
  "_id": "{id de articulo}"
  "name": "{nombre del articulo}",
  "description": "{descripción del articulo}",
  "image": "{id de imagen}",
  "price": {precio actual},
  "stock": {stock actual}
  "updated": {fecha ultima actualización}
  "created": {fecha creación}
  "enabled": {activo}
}
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "path" : "{Nombre de la propiedad}",
    "message" : "{Motivo del error}"
}
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
{
    "error" : "{Motivo del error}"
}
```
500 Server Error

```
HTTP/1.1 500 Server Error
{
    "error" : "{Motivo del error}"
}
```
# <a name='rabbitmq'></a> RabbitMQ

## <a name='orden-creada'></a> Orden Creada
[Back to top](#top)

<p>Consume de mensajes order-placed desde Order con el topic &quot;order_placed&quot;.</p>

	TOPIC order/order-placed




### Success Response

Mensaje

```
{
"type": "order-placed",
"message" : {
    "cartId": "{cartId}",
    "orderId": "{orderId}"
    "articles": [{
         "articleId": "{article id}"
         "quantity" : {quantity}
     }, ...]
   }
}
```


# <a name='rabbitmq_get'></a> RabbitMQ_GET

## <a name='validación-de-artículos'></a> Validación de Artículos
[Back to top](#top)

<p>Escucha de mensajes article-data desde cart. Valida artículos</p>

	DIRECT catalog/article-data



### Examples

Mensaje

```
{
"type": "article-exist",
"exchange" : "{Exchange name to reply}"
"queue" : "{Queue name to reply}"
"message" : {
    "referenceId": "{redId}",
    "articleId": "{articleId}"
}
```



## <a name='validación-de-artículos'></a> Validación de Artículos
[Back to top](#top)

<p>Escucha de mensajes article-exist desde cart. Valida artículos</p>

	DIRECT catalog/article-exist



### Examples

Mensaje

```
{
"type": "article-exist",
"exchange" : "{Exchange name to reply}"
"queue" : "{Queue name to reply}"
"message" : {
    "referenceId": "{redId}",
    "articleId": "{articleId}",
}
```



## <a name='logout'></a> Logout
[Back to top](#top)

<p>Escucha de mensajes logout desde auth. Invalida sesiones en cache.</p>

	FANOUT auth/logout



### Examples

Mensaje

```
{
  "type": "article-exist",
  "message" : "tokenId"
}
```



# <a name='rabbitmq_post'></a> RabbitMQ_POST

## <a name='validación-de-artículos'></a> Validación de Artículos
[Back to top](#top)

<p>Enviá de mensajes article-exist desde cart. Valida artículos</p>

	DIRECT cart/article-exist




### Success Response

Mensaje

```
{
"type": "article-exist",
"message" : {
    "cartId": "{cartId}",
    "articleId": "{articleId}",
    "valid": True|False
   }
}
```


