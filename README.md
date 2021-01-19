# **OBS Overlay**

# Contenido
- [Instalación](#instalacion)
- [Inicio automático](#inicio_automatico)
- [Configuración OBS](#configuracion_OBS)
- [Funciones básicas]()

# <a name="instalacion"></a> Instalación
Para instalarlo es tan sencillo como descargar la última versión desde [Releases](https://github.com/0ces/iglesia-overlay/releases), una vez descargado es recomendable añadir el archivo como una excepción de su antivirus, esto es porque el ejecutable no está firmado digitalmente y por defecto será bloqueado.

# <a name="inicio_automatico"></a> Inicio automático *(recomendado)*
Si se desea que el programa inicie automáticamente  hay que seguir los siguientes pasos:


1. Dar click derecho sobre el ejecutable y crear un acceso directo.
2. Copiar el acceso directo.
3. Abrir *Ejecutar* con <code>Windows+R</code>.
4. Escribir <code>shell:startup</code>.
5. Pegar el acceso directo dentro de la carpeta que se abrió.

# <a name="configuracion_OBS"></a> Configuración OBS

Lo primero que debemos hacer es añadir a la escena el visualizador, este será el encargado de que todas nuestras acciones se proyecten en pantalla, para esto añadiremos a las fuentes una fuente de tipo *Navegador* y la configuraremos de la siguiente manera:

![Configuración fuente](/docs/images/conf-fuente.png "Configuración fuente")

**Nota:** hay que fijarse que el overlay se desarrolló pensando en una resolución de 1920x1080, por eso es importante que el ancho y alto de la fuente sean los correctos para poder visualizarlo de manera correcta.

Ahora configuraremos el panel para la administración del overlay. Para eso haremos lo siguiente, en el menú de OBS daremos click en <code>Vista > Paneles > Paneles de navegador personalizados</code>.

![Añadir panel](/docs/images/panel-1.png "Añadir panel")

Ahora añadiremos lo siguiente:

![Añadir panel](/docs/images/panel-2.png "Añadir panel")

Esto nos generará una ventana la cual puede ser insertada en la interfaz de OBS tan sólo arrastrandola al lugar deseado.

![Interfaz final](/docs/images/final.png "Interfaz final")

**Nota:** en caso de que el programa se esté ejecutando en un equipo diferente al que ejecuta OBS hay que cambiar en la URL a la siguiente <code>http://192.168.x.y:3000</code> donde <code>x</code> y <code>y</code> corresponden a los valores de la IP del equipo que ejecuta el programa.

___Ahora sólo falta usarla ;)___

Desarrollado por: [Edwar Plata](https://github.com/0ces)
