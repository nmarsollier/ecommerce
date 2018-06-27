# ecommerce

## Casos de Uso

Es un ecommerce, o carrito de compras online.

__El usuario__ :

- se registra.
- se loguea en el sistema
- se deslogua del sistema
- navega por un catalogo de artículos.
- agrega artículos al cart
- revisa el cart
- puede agregar mas artículos o quitar artículos del cart.
- hace checkout del cart y genera una orden de compra
- define la forma de pago
- visualiza el estado de la orden.

El resto son casos de estudio

Como __usuario administrador__:

- crea nuevos artículos
- elimina artículos
- define stock y precio actual
- administra los permisos de usuario
- invalida otros usuarios del sistema

## Arquitectura

Por motivos de simplicidad se ha reducido la cantidad de microservicios al mínimo, para dictar el curso. A su vez se han reducido al mínimo los frameworks y se ha intentado codificar los microservicios de una forma sencilla y legible.

Por lo tanto los microservicios necesitan un trabajo mas refinado de framework para poder ponerse en producción.

Se compone de los siguientes microservicios :

__Auth__

- Controla la seguridad del sistema.
- Los usuarios se registran utilizando REST signup.
- Los usuarios registrados adquieren el permiso "user".
- Un usuario con permiso "admin" puede otorgar nuevos permisos a los demás usuarios.
- Inicialmente nadie es admin, por lo tanto hay que recurrir a MongoDB Compass para asignarle el permiso a alguien.
- Los usuarios se loguean utilizando REST.
- Utiliza JWT, tanto el signin como signup devuelven el token para utilizar el sistema.
- JWT esta compuesto por
- El token debe pasarse siempre a todos los microservicios a través del header "Authorization": "bearer __token__"
- Los tokens nunca caducan, los usuarios puede utilizar el token todo el tiempo que quieran.
- Los token se invalidan en el signout. Desde el servidor se podría invalidar los tokens a demanda.
- Los demás microservicios utilizan REST /current para obtener los datos del usuario logueado, utilizando el token pasado en el header. (queda en estudio realizar un protocolo binario para este caso)
- La autorización anterior es una consulta costosa, para evitar consultas repetitivas los microservicios deben almacenar los datos del token y usuario en un cache local.
- Cuando se invalida un token, auth envía un broadcast con rabbit a todos los microservicios para que se invaliden los caches locales para ese token.

__Image__

- Image almacena imágenes en una base de datos redis.
- Es un microservicio que se realiza por cuestiones técnicas
- Las imágenes deben subirse en formato base 64 "data:image/jpeg;base64,/9j/...".
- Se pueden subir jpeg y png.
- Al subir una imagen se obtiene el id, que luego sirve para recuperarla.
- Se puede descargar en formato base64 o bien en jpeg
- Se pueden descargar imágenes con tamaños mas reducidos para mejorar la experiencia del usuario
- Los tamaños reducidos de imágenes se almacenan en redis para mejorar el acceso
- Se necesita estar logueado como 'user' para subir imágenes.
- No hace falta estar logueado para descargarlas.
- Las imágenes nunca se borran de la db, solo se suben y se leen.
- Utiliza rabbit para leer broadcasts de logout.

__Catalog__

- El catalogo es el encargado de mantener un listado de artículos.
- Ademas de el listado de artículos mantiene el precio y el stock, dos cosas que no deben ser responsabilidad de este microservicio, pero simplifican los ejemplos en la cátedra.
- Los artículos se crean a través de servicios rest.
- Los artículos tienen asociada un image id del microservicio Image.
- Para cargar artículos se necesita ser 'admin' del sistema.
- Para consultar artículos no se necesita ser usuario.
- Los artículos se consultan a través de servicios Rest.
- El catalogo tiene la capacidad de validar artículos en forma asíncrona a través de rabbit.
- El catalogo puede validar una existencia simple o bien validar mas datos de artículos, como precio y stock.
- El catalogo se une a la cola de rabbit "topic" para "order_placed" de modo que cuando se hace un place de una orden automáticamente procede a validar los artículos e informar a orders que el los artículos son validos o no.
- Ademas, utiliza rabbit para leer broadcasts de logout.

__Cart__

- Es el carrito del sistema
- Solo hay un carrito vigente en todo momento para un usuario logueado.
- Solo usuarios logueados pueden usarlo.
- Al carrito se le adjuntan article id y cantidad.
- El carrito se usa a través de la interfaz rest.
- La UI debe encargarse de traer los detalles de artículos desde catalog.
- El carrito valida los artículos que se van agregando en forma asíncrona contra catalog, utilizando rabbit. La validación se debe hacer periódicamente para actualizar cambios de catalog.
- Ademas puede ejecutarse una validación completa a demanda, que nos indica con warnings si un articulo no tiene suficiente stock. Una operación cara, pero recomendada en caso de que se este por hacer checkout.
- El checkout del carrito cierra el carrito y abre uno nuevo para el usuario.
- El proceso del checkout envía un mensaje asíncrono "place_order" utilizando rabbit a "order" service indicando que se cerro el carrito y se debe proceder a generar la orden.
- Orders, una vez creada la orden enviar un "topic" "order_placed", cart lee dicho mensaje y actualiza el carrito con el order Id correspondiente.
- Queda pendiente que se reenvíen los "place_order" en caso que el "order_placed" no se haya recibido.
- Ademas, utiliza rabbit para leer broadcasts de logout.

__Orders__

- Es el encargado de procesar la orden.
- Se maneja con CQRS. Esto quiere decir que se guardan solo eventos, no existe una entidad que sea el estado actual de la orden. Dicho estado se recupera desde los eventos.
- Desde el cart se recibe un "place_order", si todo esta bien se guarda el evento y se envía un mensaje a rabbit con el topic "order_placed".
- El mensaje topic "order_placed" lo escuchan Cart y Catalog. Catalog va a responder con el estado de los  artículos "article-data".
- Orders escucha "article-data" porque es una validación de artículos, que indica que los artículos de la orden son validos. Dicho evento se guarda.
- Orders posee una interfaz rest que permite cargar la forma de pago con que se realizara la orden. El pago de la orden es algo que debería registrarse en Payments, pero para simplificar los ejemplos se decidió así.

Las proyecciones de Orders:

En CQRS se manejan proyecciones para facilitar el acceso a datos

___Order___

- Se genera una orden, virtual, a partir de los eventos guardados.
- A medida que se van generando eventos, se va completando la Orden con la información adecuada.
- Existe un estado de la orden , que puede ser: PLACED, INVALID, VALIDATED, PAYMENT_DEFINED
- PLACED es el estado cuando recién se recibe el evento place desde el cart.
- VALIDATED es el estado que se adquiere cuando se validan los artículos desde el catalogo
- INVAILID es un estado que se adquiere cuando el catalogo informa que los artículos son inválidos.
- PAYMENT_DEFINED es un estado que se obtiene cuando el pago se definió.
- Quedan muchos estados mas por resolver, e interacciones con otros microservicios, como caso de estudio.

___Order_Status___

- Es un estado global de las ordenes.
- Indica por cada orden cual es el estado actual en que se encuentra
- No es preciso, no puede serlo ya que existe mucho paralelismo en estos sistemas. Queda como caso de estudio como podría mejorarse esta situación.
- Debe actualizarse periódicamente este estado, a partir de la proyección de Orders. Deben haber procesos batch que se ejecuten con diferentes prioridades y diferentes frecuencia dependiendo de cada estado, que permita mantener esta proyección actualizada.
- Los procesos batch de actualizaciones podrían encolarse en rabbit para distribuir la carga entre varios servidores.
- A su vez cada estado debe desencadenar los controles necesarios del seguimiento de la orden. Dado que es factible que queden estados inconsistentes, los procesos batch deben encargarse de resolver estos inconvenientes de la cola de rabbit.

___Casos de estudio___

- Muchas proyecciones pueden realizarse a partir de los eventos. Muchas proyecciones podrían almacenarse en diferentes bases de datos.

## Diagrama de comunicación asíncrona con RabbitMQ

### __"logout"__ de Auth

El logout es un broadcast enviado por Auth hacia todos los clientes conectados a rabbit.
Cuando un token se desactiva el logout envía el token, para que los otros microservicios lo quiten de su cache.

<img src='https://g.gravizo.com/svg?
 digraph G {
   auth -> fanout [label=Logout];
   fanout ->image ;
   fanout -> cart;
   fanout -> catalog;
   fanout-> "...";
 }
'/>

### __"article-valid"__ de Catalog

Es un evento que escucha Catalog, por exchange "direct", el evento lo puede enviar cualquier microservicio y catalog responde con el articulo y un flag si es valido o no. La comunicación es asíncrona, por lo tanto el mensaje debe indicar a que exchange y queue se debe responder.

Por el momento solo Cart envía este tipo de mensajes, cada vez que se agrega un artículo al cart se valida si existe o no.

<img src='https://g.gravizo.com/svg?
 digraph G {
   cart ->catalog  [label="article-valid"];
   catalog -> cart;
   }
'/>

### __"article-data"__ de Catalog

Es un evento que envía Catalog, en respuesta al mensaje recibido por exchange = "sell_flow"  y "topic" = "order_placed". , básicamente cuando Order realiza un place de order, envía ese evento. Catalog responde con el articulo y la información del precio y cantidad actual en stock. La comunicación es asíncrona, por lo tanto el mensaje original debe indicar a que exchange y queue se debe responder.

<img src='https://g.gravizo.com/svg?
 digraph G {
   order -> sell_flow  [label="order-placed"];
   sell_flow -> catalog  [label="order-placed"];
   catalog -> order [label="article-data"];
   }
'/>

Alternativamente "article-data" puede recibirse por "direct" exchange, esto puede ser util en caso que el topic no se haya recibido y se requiera una confirmación puntual.

<img src='https://g.gravizo.com/svg?
 digraph G {
   order -> catalog [label="article-data"];
   catalog -> order  ;
   }
'/>

### __"order-placed"__ de Order

Cuando una orden se recibe por Order Service, order envía "order-placed" al exchange = "sell_flow"  y "topic" = "order_placed".
En este caso vemos en acción el patron ___inversion de control___, por lo tanto los microservicios que deban hacer algo con este evento deben reaccionar.
Puntualmente Cart y Catalog son los que reaccionan a este evento.

Este ejemplo es clave para comprender el espíritu de los eventos en una arquitectura de microservicios.

<img src='https://g.gravizo.com/svg?
 digraph G {
   order -> sell_flow  [label="order-placed"];
   sell_flow -> catalog  [label="order-placed"];
   sell_flow -> cart  [label="order-placed"];
   }
'/>

## Casos de Estudio

Lo siguientes microservicios complementan el sistema:

### Stock

- Maneja la cantidad actual de artículos en stock.
- Maneja cantidad minima de stock para solicitar mas artículos.
- Maneja movimientos de stock. La cantidad actual de artículos es calculada procesando los movimientos de stock.
- Order y Stock Reposition generan movimientos sobre artículos
- Notifica las altas de stock (async) para Orders, Catalog, Stats
- Candidato ideal para CQRS

### Pricing

- Mantiene precios del catalogo
- Genera políticas de descuentos
- Maneja precios especiales, cupones y descuentos
- Permite consultar precios para el proceso de compras
- Notifica los nuevos precios (async) para Stats

### Delivery

- Realiza el envío de los pedido
- Mantiene un tracking del pedido
- Notifica cambios estados (async) para Orders, Stats
- Permite cancelar una order si no se pudo enviar
- Candidato ideal para CQRS

### Stats

- Mantiene estadísticas de Catalogo, Delivery, Pricing, etc
- Genera reportes estadísticos y mantiene una minería de información optimizada para consultas.
- Duplica mucha información de otros microservicios optimizando búsquedas
- Puede leer la cola rabbit para genera información.

### Profile

- Permite a los usuarios mantener sus datos personales, gustos, imagen de perfil, etc.

### Payment

- Procesa los pagos de los usuarios de las compras
- Notifica el estado del pago (async) para Orders, Stats
- Puede cancelar una order si no se realiza el pago
- Mantiene las formas de pago habilitadas por usuario

### Reclamos Sobre Ordenes

- El usuario reclama algo de la orden, permitiendo cancelarla si no se resuelve el reclamo correctamente.

### Wallet

- Es una billetera virtual en el caso que se hayan cobrado ordenes que no se pudieron guardar se generaría un crédito en wallet, que podría usarse como dinero.
- Event source

### Auth2

- Auth realiza autenticación de usuario, pero no autorización, este modulo permite definir los permisos de los usuarios a los diferentes módulos.
- Cada modulo define permisos, y con una interfaz unificada expone esos listados de permisos, Auth lee esos permisos y permite administrarles los permisos a los usuarios.
- Auth maneja un listado de permisos por usuario para diferentes módulos, que los notifica en un servicio interno para que los otros microservicios puedan consultarlo y manejar seguridad.

### User Feed

- Es un modulo que permite a los usuarios comentar sobre los artículos que compraron
- No tiene mucha interacción, un listado de mensajes de usuarios con comentarios de artículos del catalogo.

### Recommendations

- Basado en Orders genera recomendaciones de artículos que los compradores podrían estar interesados.
- Notifica las recomendaciones (async) para Mail Notifications

### Questions

- Un modulo que permite realizar consultas sobre artículos de Catalog
- Notifica (async) para Stats

### Early Buy

- Un modulo que permite anotarse para productos que no tiene stock.
- Una vez que el producto adquiere stock notifica al usuario de que hay stock.
- Notifica cuando se debe notificar (async)

### Mail Notifications

- Realiza notificaciones por email, solo manda mails.
- Lee ciertos canales como Early Buy y Stock Reposition para enviar mails.

### Stock Reposition

- Realiza un análisis del stock y notifica cuando se debe realizar reposición de artículos.
- Reponer artículos para un portal grande es un tema complejo.
- Se notifica cuando hay que reponer (async).
- Automáticamente genera ordenes de compra.

### Audit

- Permite realizar auditorías

