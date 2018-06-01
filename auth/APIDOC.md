<a name="top"></a>
# Auth Service v0.1.0

Microservicio de Autenticaci&oacute;n

- [RabbitMQ](#rabbitmq)
	- [Invalidar Token](#invalidar-token)
	
- [Seguridad](#seguridad)
	- [Cambiar Password](#cambiar-password)
	- [Usuario Actual](#usuario-actual)
	- [Login](#login)
	- [Logout](#logout)
	- [Registrar Usuario](#registrar-usuario)
	


# <a name='rabbitmq'></a> RabbitMQ

## <a name='invalidar-token'></a> Invalidar Token
[Back to top](#top)

<p>AuthService envia un broadcast a todos los usuarios cuando un token ha sido invalidado. Los clientes deben eliminar de sus caches las sesiones invalidadas.</p>

	BROADCAST auth/fanout




### Success Response

Mensaje

```
{
   "type": "logout",
   "message": "{Token revocado}"
}
```


# <a name='seguridad'></a> Seguridad

## <a name='cambiar-password'></a> Cambiar Password
[Back to top](#top)

<p>Cambia la contraseña del usuario actual.</p>

	POST /auth/password




### Success Response

Respuesta

```
HTTP/1.1 200 OK
```
401 Unautorized

```
HTTP/1.1 401 Unautorized
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```


## <a name='usuario-actual'></a> Usuario Actual
[Back to top](#top)

<p>Obtiene informacion del usuario actual.</p>

	GET /auth/currentUser




### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
   "id": "{Id usuario}",
   "name": "{Nombre del usuario}",
   "login": "{Login de usuario}",
   "roles": [
       "{Rol}"
   ]
}
```
401 Unautorized

```
HTTP/1.1 401 Unautorized
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```


## <a name='login'></a> Login
[Back to top](#top)

<p>Loguea un usuario en el sistema.</p>

	POST /auth/signin




### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
  "token": "{Token de autorización}"
}
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```


## <a name='logout'></a> Logout
[Back to top](#top)

<p>Desloguea un usuario en el sistema, invalida el token.</p>

	GET /auth/signout




### Success Response

Respuesta

```
HTTP/1.1 200 OK
```
401 Unautorized

```
HTTP/1.1 401 Unautorized
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```


## <a name='registrar-usuario'></a> Registrar Usuario
[Back to top](#top)

<p>Registra un nuevo usuario en el sistema.</p>

	POST /auth/signup




### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
  "token": "{Token de autorización}"
}
```
400 Bad Request

```
HTTP/1.1 400 Bad Request
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
404 Not Found

```
HTTP/1.1 404 Not Found
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "url" : "{Url no encontrada}",
   "error" : "Not Found"
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```
405 Unautorized

```
HTTP/1.1 405 Unautorized Method
HTTP/1.1 Header X-Status-Reason: {Message}
{
   "error" : "Not Found"
}
```


