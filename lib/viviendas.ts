/**
 * Catálogo de viviendas.
 *
 * ⚠️ DATOS DE DEMOSTRACIÓN. Todas las viviendas de este archivo tienen `demo: true`
 * y el sitio las muestra con una etiqueta "Demo". No representan unidades reales en venta.
 * Reemplázalas por las viviendas reales (o muévelas a Firestore, ver lib/catalogo.ts).
 *
 * Los modelos (Calle-Calle, Niebla, Ranco) y sus precios base vienen de lib/config.ts.
 */
import { EXTRA_RURAL_UF, modeloPorId } from './config';

export type Disponibilidad = 'disponible' | 'ultimas' | 'reservada' | 'proximamente';
/**
 * compatible: la vivienda cumple las condiciones generales para operar con DS1;
 *             la operación igual depende de la evaluación del comprador y del llamado vigente.
 * por-confirmar: hay que revisar el caso (precio, terreno, tramo) antes de confirmarlo.
 */
export type EstadoDS1 = 'compatible' | 'por-confirmar';
export type Modalidad = 'sitio-propio' | 'proyecto';

export type Foto = {
  src: string;
  alt: string;
  /** Imagen de ambientación, no de esta vivienda. Se indica en pantalla. */
  referencial?: boolean;
};

export type Recinto = { nombre: string; m2?: number; zona: 'social' | 'privada' | 'servicio' };

export type Vivienda = {
  slug: string;
  nombre: string;
  modeloId: 'calle-calle' | 'niebla' | 'ranco';
  modalidad: Modalidad;
  comuna: string;
  sector: string;
  /** Centro aproximado de la comuna, solo para el mapa referencial. */
  coordenadas: { lat: number; lng: number };
  precioUF: number;
  superficieM2: number;
  dormitorios: number;
  banos: number;
  estacionamientos: number;
  disponibilidad: Disponibilidad;
  ds1: { estado: EstadoDS1; nota: string };
  frase: string;
  descripcion: string;
  destacados: string[];
  recintos: Recinto[];
  fotos: Foto[];
  plazoMeses: string;
  demo: boolean;
};

export const DISPONIBILIDAD: Record<Disponibilidad, { texto: string; tono: 'ok' | 'aviso' | 'neutro' }> = {
  disponible: { texto: 'Disponible', tono: 'ok' },
  ultimas: { texto: 'Últimos cupos', tono: 'aviso' },
  reservada: { texto: 'Reservada', tono: 'neutro' },
  proximamente: { texto: 'Próximamente', tono: 'neutro' },
};

export const MODALIDAD: Record<Modalidad, string> = {
  'sitio-propio': 'Construcción en sitio propio',
  proyecto: 'Vivienda en proyecto',
};

/** Fotografías de ambientación de interiores (Unsplash). Reemplazar por fotos reales. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=75`;
export const INTERIORES: Foto[] = [
  { src: u('photo-1513694203232-719a280e022f'), alt: 'Estar luminoso con sofá y plantas', referencial: true },
  { src: u('photo-1484154218962-a197022b5858'), alt: 'Cocina con muebles claros y madera', referencial: true },
  { src: u('photo-1522771739844-6a9f6d5f14af'), alt: 'Dormitorio sereno con luz natural', referencial: true },
  { src: u('photo-1493809842364-78817add7ffb'), alt: 'Comedor y estar integrados', referencial: true },
];

const FOTOS_RANCO: Foto[] = [
  { src: '/fotos/ranco-hero.jpg', alt: 'Casa modelo Ranco: revestimiento grafito, franja de madera, terraza y volcán al fondo' },
  { src: '/fotos/ranco-terraza.jpg', alt: 'Terraza de madera de 5 × 2 metros del modelo Ranco' },
  { src: '/fotos/ranco-acceso.jpg', alt: 'Acceso del modelo Ranco con revestimiento de madera vertical' },
  { src: '/fotos/ranco-ventanas.jpg', alt: 'Ventana alta y ventanales del estar del modelo Ranco' },
];

/** Las fachadas sin fotografía usan su ilustración (components/media/Fachada.tsx). */
const fachada = (modelo: string, alt: string): Foto => ({ src: `ilustracion:${modelo}`, alt });

const BASE_43: Recinto[] = [
  { nombre: 'Estar · comedor · cocina', m2: 17, zona: 'social' },
  { nombre: 'Dormitorio 1', m2: 8, zona: 'privada' },
  { nombre: 'Dormitorio 2', m2: 8, zona: 'privada' },
  { nombre: 'Baño completo', zona: 'servicio' },
];

const precio = (modeloId: string, rural = false, extra = 0) =>
  modeloPorId(modeloId).precioUF + (rural ? EXTRA_RURAL_UF : 0) + extra;

export const VIVIENDAS_DEMO: Vivienda[] = [
  {
    slug: 'ranco-valdivia',
    nombre: 'Ranco',
    modeloId: 'ranco',
    modalidad: 'sitio-propio',
    comuna: 'Valdivia',
    sector: 'Sector urbano',
    coordenadas: { lat: -39.8142, lng: -73.2459 },
    precioUF: precio('ranco'),
    superficieM2: 43,
    dormitorios: 2,
    banos: 1,
    estacionamientos: 1,
    disponibilidad: 'disponible',
    ds1: { estado: 'compatible', nota: 'Pensada para operar con subsidio DS1. Se confirma al revisar tu certificado, tu ahorro y el terreno.' },
    frase: 'Luz alta en el estar y una terraza para mirar el sur.',
    descripcion: 'Techo a un agua con alero amplio, revestimiento vertical oscuro con un detalle de madera y una ventana alta que llena de luz el estar. La terraza de madera extiende la casa hacia el jardín.',
    destacados: ['Terraza de madera de 5 × 2 m', 'Ventana alta que ilumina el estar', 'Alero amplio contra la lluvia', 'Ventanas con doble vidrio de baja emisividad'],
    recintos: BASE_43,
    fotos: [...FOTOS_RANCO, ...INTERIORES],
    plazoMeses: '≈ 7 meses',
    demo: true,
  },
  {
    slug: 'niebla-costa',
    nombre: 'Niebla',
    modeloId: 'niebla',
    modalidad: 'sitio-propio',
    comuna: 'Valdivia',
    sector: 'Niebla · borde costero',
    coordenadas: { lat: -39.8705, lng: -73.3992 },
    precioUF: precio('niebla'),
    superficieM2: 43,
    dormitorios: 2,
    banos: 1,
    estacionamientos: 1,
    disponibilidad: 'disponible',
    ds1: { estado: 'compatible', nota: 'Pensada para operar con subsidio DS1. Se confirma en la evaluación de tu caso.' },
    frase: 'La casa tradicional del sur, con acceso protegido de la lluvia.',
    descripcion: 'Frontón de madera hacia la calle y un techito de acceso para llegar seco en invierno. Fachada en dos colores, cálida y reconocible.',
    destacados: ['Frontón de madera hacia la calle', 'Techito de acceso de 2,4 × 1,5 m', 'Fachada en dos colores', 'Ventanas con doble vidrio de baja emisividad'],
    recintos: BASE_43,
    fotos: [fachada('niebla', 'Ilustración de la fachada del modelo Niebla con frontón de madera'), ...INTERIORES],
    plazoMeses: '≈ 7 meses',
    demo: true,
  },
  {
    slug: 'calle-calle-paillaco',
    nombre: 'Calle-Calle',
    modeloId: 'calle-calle',
    modalidad: 'sitio-propio',
    comuna: 'Paillaco',
    sector: 'Sector urbano',
    coordenadas: { lat: -40.0708, lng: -72.8708 },
    precioUF: precio('calle-calle'),
    superficieM2: 43,
    dormitorios: 2,
    banos: 1,
    estacionamientos: 1,
    disponibilidad: 'ultimas',
    ds1: { estado: 'compatible', nota: 'El modelo de menor precio. La compatibilidad se confirma al revisar tu certificado y tu ahorro.' },
    frase: 'Simple, luminosa y eficiente. Lo esencial, bien hecho.',
    descripcion: 'Techo a dos aguas de zinc y revestimiento claro, fácil de mantener. Una casa honesta, pensada para rendir cada metro y cada peso.',
    destacados: ['Techo a dos aguas de zinc', 'Revestimiento claro de bajo mantenimiento', 'Ventanas con doble vidrio de baja emisividad', 'El precio más bajo de la línea'],
    recintos: BASE_43,
    fotos: [fachada('calle-calle', 'Ilustración de la fachada del modelo Calle-Calle con techo a dos aguas'), ...INTERIORES],
    plazoMeses: '≈ 7 meses',
    demo: true,
  },
  {
    slug: 'ranco-panguipulli',
    nombre: 'Ranco Lago',
    modeloId: 'ranco',
    modalidad: 'sitio-propio',
    comuna: 'Panguipulli',
    sector: 'Sector rural',
    coordenadas: { lat: -39.6431, lng: -72.3367 },
    precioUF: precio('ranco', true),
    superficieM2: 43,
    dormitorios: 2,
    banos: 1,
    estacionamientos: 2,
    disponibilidad: 'disponible',
    ds1: { estado: 'por-confirmar', nota: 'En terreno rural se suman agua potable rural y fosa séptica. Revisamos si el precio total calza con tu subsidio.' },
    frase: 'El mismo Ranco, pensado para el campo y los lagos.',
    descripcion: 'Versión rural del modelo Ranco: incluye la solución de agua potable rural y fosa séptica en lugar de las redes urbanas.',
    destacados: ['Solución sanitaria rural incluida', 'Terraza de madera de 5 × 2 m', 'Ventana alta que ilumina el estar', 'Espacio para 2 vehículos'],
    recintos: BASE_43,
    fotos: [FOTOS_RANCO[0], FOTOS_RANCO[1], FOTOS_RANCO[3], ...INTERIORES],
    plazoMeses: '≈ 7 a 8 meses',
    demo: true,
  },
  {
    slug: 'niebla-la-union',
    nombre: 'Niebla Familiar',
    modeloId: 'niebla',
    modalidad: 'sitio-propio',
    comuna: 'La Unión',
    sector: 'Sector urbano',
    coordenadas: { lat: -40.2952, lng: -73.0822 },
    precioUF: precio('niebla', false, 190),
    superficieM2: 58,
    dormitorios: 3,
    banos: 2,
    estacionamientos: 1,
    disponibilidad: 'proximamente',
    ds1: { estado: 'por-confirmar', nota: 'Versión ampliada: el saldo por financiar es mayor. Revisamos contigo ahorro, subsidio y financiamiento complementario.' },
    frase: 'Tres dormitorios para una familia que crece.',
    descripcion: 'Ejemplo de ampliación del modelo Niebla con un tercer dormitorio y un segundo baño, a partir de los planos preparados para crecer.',
    destacados: ['Tercer dormitorio', 'Segundo baño', 'Frontón de madera hacia la calle', 'Techito de acceso'],
    recintos: [
      { nombre: 'Estar · comedor · cocina', m2: 19, zona: 'social' },
      { nombre: 'Dormitorio principal', m2: 9, zona: 'privada' },
      { nombre: 'Dormitorio 2', m2: 8, zona: 'privada' },
      { nombre: 'Dormitorio 3', m2: 8, zona: 'privada' },
      { nombre: 'Baño completo', zona: 'servicio' },
      { nombre: 'Baño 2', zona: 'servicio' },
    ],
    fotos: [fachada('niebla', 'Ilustración de la fachada del modelo Niebla'), ...INTERIORES],
    plazoMeses: '≈ 8 meses',
    demo: true,
  },
  {
    slug: 'calle-calle-lago-ranco',
    nombre: 'Calle-Calle',
    modeloId: 'calle-calle',
    modalidad: 'sitio-propio',
    comuna: 'Lago Ranco',
    sector: 'Sector rural',
    coordenadas: { lat: -40.3173, lng: -72.5003 },
    precioUF: precio('calle-calle', true),
    superficieM2: 43,
    dormitorios: 2,
    banos: 1,
    estacionamientos: 2,
    disponibilidad: 'reservada',
    ds1: { estado: 'compatible', nota: 'Incluye solución sanitaria rural. La compatibilidad se confirma al revisar tu caso.' },
    frase: 'Esencial y cálida, frente al paisaje del lago.',
    descripcion: 'El modelo Calle-Calle en su versión rural, con agua potable rural y fosa séptica incluidas.',
    destacados: ['Solución sanitaria rural incluida', 'Techo a dos aguas de zinc', 'Revestimiento claro de bajo mantenimiento', 'Espacio para 2 vehículos'],
    recintos: BASE_43,
    fotos: [fachada('calle-calle', 'Ilustración de la fachada del modelo Calle-Calle'), ...INTERIORES],
    plazoMeses: '≈ 7 a 8 meses',
    demo: true,
  },
];

/** Especificaciones comunes de la línea (de la oferta actual). */
export const ESPECIFICACIONES: { grupo: string; items: string[] }[] = [
  { grupo: 'Envolvente y confort', items: ['Aislación en muros y techo según la norma térmica vigente', 'Ventanas con doble vidrio de baja emisividad', 'Calefón de 10 litros certificado'] },
  { grupo: 'Interior', items: ['Estar, comedor y cocina integrados con luz natural', 'Dormitorios con clóset', 'Baño completo con espacio para lavadora', 'Cocina con muebles y lavaplatos'] },
  { grupo: 'Instalaciones', items: ['Conexión de agua, alcantarillado y electricidad con certificados', 'En terreno rural: agua potable rural y fosa séptica'] },
  { grupo: 'Respaldo', items: ['Planos con tercer dormitorio para ampliar a futuro', 'Garantía y atención de postventa según la ley'] },
];
