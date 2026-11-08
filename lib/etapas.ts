export type Etapa = { id: number; titulo: string; paraLaFamilia: string; proximoPaso: string };

export const ETAPAS: Etapa[] = [
  { id: 1, titulo: 'Visita y evaluación', paraLaFamilia: 'Revisamos su certificado, su ahorro y su terreno.', proximoPaso: 'Elegir el modelo y firmar el contrato.' },
  { id: 2, titulo: 'Contrato firmado', paraLaFamilia: 'Firmamos el contrato y usted pagó la primera parte de su aporte.', proximoPaso: 'Preparamos los planos de su casa.' },
  { id: 3, titulo: 'Planos y permisos', paraLaFamilia: 'Su proyecto está en revisión en el SERVIU y en la municipalidad.', proximoPaso: 'Cuando llegue el permiso, empezamos la obra.' },
  { id: 4, titulo: 'Obra: fundaciones', paraLaFamilia: 'Estamos haciendo las fundaciones y el radier de su casa.', proximoPaso: 'Levantar la estructura de madera.' },
  { id: 5, titulo: 'Obra: estructura y techo', paraLaFamilia: 'La casa ya tiene muros y techo. Es el momento de la segunda parte de su aporte.', proximoPaso: 'Aislación, ventanas e instalaciones.' },
  { id: 6, titulo: 'Obra: terminaciones', paraLaFamilia: 'Estamos instalando pisos, baño, cocina y pintura.', proximoPaso: 'Revisión final y recepción municipal.' },
  { id: 7, titulo: 'Recepción municipal', paraLaFamilia: 'La municipalidad está revisando la casa terminada.', proximoPaso: 'Entrega de llaves y cobro del subsidio.' },
  { id: 8, titulo: 'Entrega de llaves', paraLaFamilia: '¡Su casa está lista! Le entregamos las llaves y el manual de uso.', proximoPaso: 'Cualquier problema, llámenos: la casa tiene garantía.' },
];

export function etapaPorId(id: number): Etapa {
  return ETAPAS.find((e) => e.id === id) ?? ETAPAS[0];
}

export const ESTADOS_CONTACTO = [
  { id: 'nuevo', nombre: 'Nuevo' },
  { id: 'contactado', nombre: 'Contactado' },
  { id: 'visita', nombre: 'Visita agendada' },
  { id: 'cliente', nombre: 'Cliente' },
  { id: 'descartado', nombre: 'Descartado' },
] as const;
