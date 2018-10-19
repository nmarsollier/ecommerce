<a name="top"></a>
# Order Service en Java v0.1.0

Microservicio de Ordenes

- [Ordenes](#ordenes)
	- [Batch Payment Defined](#batch-payment-defined)
	- [Batch Placed](#batch-placed)
	- [Batch Validated](#batch-validated)
	- [Buscar Orden](#buscar-orden)
	- [Ordenes de Usuario](#ordenes-de-usuario)
	
- [Pagos](#pagos)
	- [Agregar Pago](#agregar-pago)
	
- [RabbitMQ_GET](#rabbitmq_get)
	- [Validar Artículos](#validar-artículos)
	- [Crear Orden](#crear-orden)
	- [Logout](#logout)
	
- [RabbitMQ_POST](#rabbitmq_post)
	- [Validación de Artículos](#validación-de-artículos)
	- [Orden Creada](#orden-creada)
	


# <a name='ordenes'></a> Ordenes

## <a name='batch-payment-defined'></a> Batch Payment Defined
[Back to top](#top)

<p>Ejecuta un proceso batch que chequea ordenes en estado PAYMENT_DEFINED.</p>

	GET /v1/orders_batch/payment_defined



### Examples

Header Autorización

```
Authorization=bearer {token}
```


### Success Response

Respuesta

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
## <a name='batch-placed'></a> Batch Placed
[Back to top](#top)

<p>Ejecuta un proceso batch que chequea ordenes en estado PLACED.</p>

	GET /v1/orders_batch/placed



### Examples

Header Autorización

```
Authorization=bearer {token}
```


### Success Response

Respuesta

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
## <a name='batch-validated'></a> Batch Validated
[Back to top](#top)

<p>Ejecuta un proceso batch para ordenes en estado VALIDATED.</p>

	GET /v1/orders_batch/validated



### Examples

Header Autorización

```
Authorization=bearer {token}
```


### Success Response

Respuesta

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
## <a name='buscar-orden'></a> Buscar Orden
[Back to top](#top)

<p>Busca una order del usuario logueado, por su id.</p>

	GET /v1/orders/:orderId



### Examples

Header Autorización

```
Authorization=bearer {token}
```


### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
   "id": "{orderID}",
   "status": "{Status}",
   "cartId": "{cartId}",
   "updated": "{updated date}",
   "created": "{created date}",
   "articles": [
      {
          "id": "{articleId}",
          "quantity": {quantity},
          "validated": true|false,
          "valid": true|false
      }, ...
  ]
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
## <a name='ordenes-de-usuario'></a> Ordenes de Usuario
[Back to top](#top)

<p>Busca todas las ordenes del usuario logueado.</p>

	GET /v1/orders



### Examples

Header Autorización

```
Authorization=bearer {token}
```


### Success Response

Respuesta

```
HTTP/1.1 200 OK
[{
   "id": "{orderID}",
   "status": "{Status}",
   "cartId": "{cartId}",
   "updated": "{updated date}",
   "created": "{created date}",
   "totalPrice": {price}
   "articles": {count}
}, ...
]
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
# <a name='pagos'></a> Pagos

## <a name='agregar-pago'></a> Agregar Pago
[Back to top](#top)



	POST /v1/orders/:orderId/payment



### Examples

Body

```
{
    "paymentMethod": "CASH | CREDIT | DEBIT",
    "amount": "{amount}"
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
# <a name='rabbitmq_get'></a> RabbitMQ_GET

## <a name='validar-artículos'></a> Validar Artículos
[Back to top](#top)

<p>Antes de iniciar las operaciones se validan los artículos contra el catalogo.</p>

	DIRECT order/article-data



### Examples

Mensaje

```
{
"type": "article-data",
"message" : {
    "cartId": "{cartId}",
    "articleId": "{articleId}",
    "valid": True|False
   }
}
```




## <a name='crear-orden'></a> Crear Orden
[Back to top](#top)

<p>Escucha de mensajes place-order en el canal de order.</p>

	DIRECT order/place-order



### Examples

Mensaje

```
{
"type": "place-order",
"exchange" : "{Exchange name to reply}"
"queue" : "{Queue name to reply}"
"message" : {
    "cartId": "{cartId}",
    "articles": "[articleId, ...]",
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
  "type": "logout",
  "message" : "tokenId"
}
```




# <a name='rabbitmq_post'></a> RabbitMQ_POST

## <a name='validación-de-artículos'></a> Validación de Artículos
[Back to top](#top)

<p>Antes de iniciar las operaciones se validan los artículos contra el catalogo.</p>

	DIRECT cart/article-data





### Success Response

Mensaje

```
{
"type": "article-data",
"message" : {
    "cartId": "{cartId}",
    "articleId": "{articleId}",
   }
}
```


## <a name='orden-creada'></a> Orden Creada
[Back to top](#top)

<p>Envía de mensajes order-placed desde Order con el topic &quot;order_placed&quot;.</p>

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


