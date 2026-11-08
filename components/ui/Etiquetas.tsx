import { DISPONIBILIDAD, type Disponibilidad, type EstadoDS1 } from '@/lib/viviendas';

const tonos = {
  ok: 'bg-bosque-50 text-bosque-700',
  aviso: 'bg-copihue-50 text-copihue-700',
  neutro: 'bg-arena-100 text-grafito-700',
};

export function EtiquetaDisponibilidad({ valor, sobreFoto = false }: { valor: Disponibilidad; sobreFoto?: boolean }) {
  const d = DISPONIBILIDAD[valor];
  return (
    <span className={`etiqueta-cs ${sobreFoto ? 'bg-white/90 text-grafito backdrop-blur' : tonos[d.tono]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${d.tono === 'ok' ? 'bg-bosque-500' : d.tono === 'aviso' ? 'bg-copihue' : 'bg-grafito-400'}`} />
      {d.texto}
    </span>
  );
}

export function EtiquetaDS1({ estado, sobreFoto = false }: { estado: EstadoDS1; sobreFoto?: boolean }) {
  const compatible = estado === 'compatible';
  return (
    <span className={`etiqueta-cs ${sobreFoto ? 'bg-bosque-900/85 text-marfil backdrop-blur' : compatible ? 'bg-bosque text-marfil' : 'bg-arena-200 text-bosque-900'}`}
      title={compatible ? 'Pensada para DS1. Sujeta a la evaluación de cada caso.' : 'La compatibilidad con DS1 se confirma revisando tu caso.'}>
      {compatible ? 'Apta DS1*' : 'DS1 por confirmar'}
    </span>
  );
}

export function EtiquetaDemo({ className = '' }: { className?: string }) {
  return (
    <span className={`etiqueta-cs border border-dashed border-grafito/30 bg-white/80 text-grafito-500 backdrop-blur ${className}`} title="Información de demostración. No corresponde a una vivienda real en venta.">
      Demo
    </span>
  );
}
