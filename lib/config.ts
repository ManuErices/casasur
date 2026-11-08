export const MARCA = process.env.NEXT_PUBLIC_MARCA || 'Casa Sur';

export const CONTACTO = {
  telefono: process.env.NEXT_PUBLIC_TELEFONO || '+56 9 0000 0000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '56900000000',
  asesor: process.env.NEXT_PUBLIC_ASESOR || 'Nombre del asesor',
  horario: process.env.NEXT_PUBLIC_HORARIO || 'Lunes a viernes de 9:00 a 18:00',
  razonSocial: process.env.NEXT_PUBLIC_RAZON_SOCIAL || 'Nombre Constructora SpA',
  registroMinvu: process.env.NEXT_PUBLIC_REGISTRO_MINVU || 'N° de inscripción',
  egis: process.env.NEXT_PUBLIC_EGIS || 'Nombre EGIS · N° de inscripción',
};

/** Valor de respaldo si no se puede consultar la UF del día. */
export const UF_RESPALDO = 41200;
export const SUBSIDIO_UF = 600;
export const AHORRO_MINIMO_UF = 30;
/** Diferencia de precio en terreno rural: agua potable rural + fosa séptica en vez de redes urbanas. */
export const EXTRA_RURAL_UF = 45;

export type Modelo = {
  id: string;
  nombre: string;
  resumen: string;
  precioUF: number;
  caracteristicas: string[];
  imagen?: string;
};

export const MODELOS: Modelo[] = [
  {
    id: 'calle-calle',
    nombre: 'Calle-Calle',
    resumen: 'La base: simple, luminosa y eficiente.',
    precioUF: 946,
    caracteristicas: [
      'Techo a dos aguas de zinc',
      'Revestimiento claro, fácil de mantener',
      'Ventanas con doble vidrio de baja emisividad',
      'El precio más bajo de los tres',
    ],
  },
  {
    id: 'niebla',
    nombre: 'Niebla',
    resumen: 'Tradicional del sur, con acceso protegido de la lluvia.',
    precioUF: 975,
    caracteristicas: [
      'Frontón de madera hacia la calle',
      'Techito de acceso de 2,4 × 1,5 m',
      'Fachada en dos colores',
      'Ventanas con doble vidrio de baja emisividad',
    ],
  },
  {
    id: 'ranco',
    nombre: 'Ranco',
    resumen: 'Moderna, con luz alta en el estar y terraza.',
    precioUF: 1012,
    caracteristicas: [
      'Techo a un agua con alero amplio',
      'Revestimiento vertical oscuro con detalle de madera',
      'Ventana alta que ilumina el estar',
      'Terraza de madera de 5 × 2 m',
    ],
    imagen: '/ranco.jpg',
  },
];

export const CUOTAS = [
  { pct: 0.4, cuando: 'Al firmar el contrato' },
  { pct: 0.4, cuando: 'A mitad de la obra' },
  { pct: 0.2, cuando: 'Al terminar la casa' },
];

export const COMUNAS = [
  'Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina',
  'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno',
];

export function modeloPorId(id: string | undefined): Modelo {
  return MODELOS.find((m) => m.id === id) ?? MODELOS[0];
}
