<a name="top"></a>
# Auth Service v0.1.0

Microservicio de Autentificación

- [RabbitMQ_POST](#rabbitmq_post)
	- [Invalidar Token](#invalidar-token)
	
- [Seguridad](#seguridad)
	- [Cambiar Password](#cambiar-password)
	- [Deshabilitar Usuario](#deshabilitar-usuario)
	- [Habilitar Usuario](#habilitar-usuario)
	- [Lista de Usuarios](#lista-de-usuarios)
	- [Login](#login)
	- [Logout](#logout)
	- [Otorga Permisos](#otorga-permisos)
	- [Registrar Usuario](#registrar-usuario)
	- [Revoca Permisos](#revoca-permisos)
	- [Usuario Actual](#usuario-actual)
	


# <a name='rabbitmq_post'></a> RabbitMQ_POST

## <a name='invalidar-token'></a> Invalidar Token
[Back to top](#top)

<p>AuthService enviá un broadcast a todos los usuarios cuando un token ha sido invalidado. Los clientes deben eliminar de sus caches las sesiones invalidadas.</p>

	FANOUT auth/fanout




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

	POST /v1/user/password



### Examples

Body

```
{
  "currentPassword" : "{Contraseña actual}",
  "newPassword" : "{Nueva Contraseña}",
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
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='deshabilitar-usuario'></a> Deshabilitar Usuario
[Back to top](#top)

<p>Deshabilita un usuario en el sistema.   El usuario logueado debe tener permisos &quot;admin&quot;.</p>

	POST /v1/users/:userId/disable



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
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='habilitar-usuario'></a> Habilitar Usuario
[Back to top](#top)

<p>Habilita un usuario en el sistema. El usuario logueado debe tener permisos &quot;admin&quot;.</p>

	POST /v1/users/:userId/enable



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
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='lista-de-usuarios'></a> Lista de Usuarios
[Back to top](#top)

<p>Devuelve una lista de usuarios. El usuario logueado debe tener permisos &quot;admin&quot;.</p>

	POST /v1/users



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
   "id": "{Id usuario}",
   "name": "{Nombre del usuario}",
   "login": "{Login de usuario}",
   "permissions": [
       "{Permission}"
   ],
   "enabled": true|false
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
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='login'></a> Login
[Back to top](#top)

<p>Loguea un usuario en el sistema.</p>

	POST /v1/users/signin



### Examples

Body

```
{
  "login": "{Login de usuario}",
  "password": "{Contraseña}"
}
```

### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
  "token": "{Token de autorización}"
}
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
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
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='logout'></a> Logout
[Back to top](#top)

<p>Desloguea un usuario en el sistema, invalida el token.</p>

	GET /v1/users/signout



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
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='otorga-permisos'></a> Otorga Permisos
[Back to top](#top)

<p>Otorga permisos al usuario indicado, el usuario logueado tiene que tener permiso &quot;admin&quot;.</p>

	POST /v1/users/:userId/grant



### Examples

Body

```
{
  "permissions" : ["{permiso}", ...],
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
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='registrar-usuario'></a> Registrar Usuario
[Back to top](#top)

<p>Registra un nuevo usuario en el sistema.</p>

	POST /v1/users



### Examples

Body

```
{
  "name": "{Nombre de Usuario}",
  "login": "{Login de usuario}",
  "password": "{Contraseña}"
}
```

### Success Response

Respuesta

```
HTTP/1.1 200 OK
{
  "token": "{Token de autorización}"
}
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
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
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='revoca-permisos'></a> Revoca Permisos
[Back to top](#top)

<p>Quita permisos al usuario indicado, el usuario logueado tiene que tener permiso &quot;admin&quot;.</p>

	POST /v1/users/:userId/revoke



### Examples

Body

```
{
  "permissions" : ["{permiso}", ...],
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
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='usuario-actual'></a> Usuario Actual
[Back to top](#top)

<p>Obtiene información del usuario actual.</p>

	GET /v1/users/current



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
   "id": "{Id usuario}",
   "name": "{Nombre del usuario}",
   "login": "{Login de usuario}",
   "permissions": [
       "{Permission}"
   ]
}
```


### Error Response

401 Unauthorized

```
HTTP/1.1 401 Unauthorized
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
