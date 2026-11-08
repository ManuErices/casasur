import Cabecera from '@/components/Cabecera';
import Portada from '@/components/Portada';
import Requisitos from '@/components/Requisitos';
import Modelos from '@/components/Modelos';
import Simulador from '@/components/Simulador';
import Pasos from '@/components/Pasos';
import Incluye from '@/components/Incluye';
import Preguntas from '@/components/Preguntas';
import Contacto from '@/components/Contacto';
import Pie from '@/components/Pie';
import { SeleccionProvider } from '@/components/Seleccion';

export default function Inicio() {
  return (
    <>
      <Cabecera />
      <main>
        <Portada />
        <Requisitos />
        <SeleccionProvider>
          <Modelos />
          <Simulador />
          <Pasos />
          <Incluye />
          <Preguntas />
          <Contacto />
        </SeleccionProvider>
      </main>
      <Pie />
    </>
  );
}
