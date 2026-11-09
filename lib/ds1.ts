/**
 * Contenido educativo sobre el subsidio DS1.
 * Solo describe el funcionamiento GENERAL del programa. No incluye montos, tramos ni
 * precios máximos: cambian según el llamado, el tramo y la ubicación. Antes de publicar,
 * revisa los textos con la información vigente del MINVU.
 */
export const FUENTE_OFICIAL = { nombre: 'minvu.gob.cl', url: 'https://www.minvu.gob.cl/' };

export const QUE_ES = {
  titulo: '¿Qué es el subsidio DS1?',
  texto:
    'Es un aporte del Estado, a través del MINVU, para que familias de sectores medios y emergentes que no tienen vivienda puedan comprar o construir la primera. Se suma a tu ahorro y, si hace falta, a un crédito hipotecario.',
};

export const TIPOS_VIVIENDA = [
  { titulo: 'Vivienda nueva o usada', texto: 'Comprar una casa o departamento que cumpla las condiciones del programa.' },
  { titulo: 'Construcción en sitio propio', texto: 'Construir tu casa en un terreno que ya es tuyo. Es nuestra especialidad.' },
];

export const QUE_APORTAS = [
  { titulo: 'Tu ahorro', texto: 'Depositado en una cuenta de ahorro para la vivienda. El mínimo depende de tu tramo.' },
  { titulo: 'La diferencia, si existe', texto: 'Si el precio supera ahorro + subsidio, el saldo puede cubrirse con crédito o aporte propio.' },
];

export const ANTECEDENTES = [
  'Cédula de identidad vigente',
  'Registro Social de Hogares',
  'Cartola de tu cuenta de ahorro para la vivienda',
  'Certificado de subsidio, si ya fuiste seleccionado',
  'Para construir: escritura o inscripción del terreno a tu nombre',
  'Si usarás crédito: acreditación de ingresos',
];

/** Distinción clave: lo que define el programa vs. lo que se revisa en cada operación. */
export const GENERAL_VS_ESPECIFICO = {
  programa: [
    'Quiénes pueden postular y en qué llamados',
    'Monto del subsidio y ahorro mínimo según tramo',
    'Precio máximo de la vivienda según tramo y ubicación',
    'Vigencia del certificado de subsidio',
  ],
  operacion: [
    'Si tu certificado está vigente y para qué modalidad sirve',
    'Si el precio de la vivienda calza con tu tramo',
    'Si el terreno o la propiedad cumplen las condiciones',
    'Si necesitas financiamiento complementario y cuánto',
  ],
};
