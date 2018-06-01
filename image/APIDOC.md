<a name="top"></a>
# Image Service v0.1.0

Microservicio de Imagenes

- [Imagen](#imagen)
	- [Crear Imagen](#crear-imagen)
	- [Obtener Imagen](#obtener-imagen)
	- [Obtener Imagen Jpeg](#obtener-imagen-jpeg)
	


# <a name='imagen'></a> Imagen

## <a name='crear-imagen'></a> Crear Imagen
[Back to top](#top)

<p>Agrega una nueva imagen al servidor.</p>

	POST /image




### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
  "id": "{Id de imagen}"
}
```
401 Unautorized

```
HTTP/1.1 401 Unautorized
```
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
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```


## <a name='obtener-imagen'></a> Obtener Imagen
[Back to top](#top)

<p>Obtiene una imagen del servidor en formato base64</p>

	GET /image/:id




### Success Response

Respuesta

```
{
  "id": "{Id de imagen}",
  "image" : "{Imagen en formato Base 64}"
}
```
401 Unautorized

```
HTTP/1.1 401 Unautorized
```
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
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```


## <a name='obtener-imagen-jpeg'></a> Obtener Imagen Jpeg
[Back to top](#top)

<p>Obtiene una imagen del servidor en formato jpeg.</p>

	GET /image/:id/jpeg




### Success Response

Respuesta

```
Imagen en formato jpeg
```
401 Unautorized

```
HTTP/1.1 401 Unautorized
```
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
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Mensaje}
{
   "error" : "Not Found"
}
```


