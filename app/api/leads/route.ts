import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { COMUNAS, MODELOS } from '@/lib/config';

export const dynamic = 'force-dynamic';

const limpiar = (v: unknown, max = 120) => String(v ?? '').trim().slice(0, max);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Formulario inválido.' }, { status: 400 }); }

  // Campo trampa: los robots lo llenan, las personas no lo ven.
  if (limpiar(body.empresa)) return NextResponse.json({ ok: true });

  const nombre = limpiar(body.nombre, 80);
  const telefono = limpiar(body.telefono, 30);
  const comuna = limpiar(body.comuna, 40);
  const modelo = limpiar(body.modelo, 30);
  const subsidio = limpiar(body.subsidio, 12);
  const terreno = limpiar(body.terreno, 4);

  if (nombre.length < 2) return NextResponse.json({ error: 'Escriba su nombre.' }, { status: 400 });
  if (telefono.replace(/\D/g, '').length < 8) return NextResponse.json({ error: 'Escriba un teléfono válido.' }, { status: 400 });
  if (!COMUNAS.includes(comuna)) return NextResponse.json({ error: 'Elija una comuna.' }, { status: 400 });
  if (!['si', 'postulando', 'no'].includes(subsidio)) return NextResponse.json({ error: 'Indique si tiene subsidio.' }, { status: 400 });
  if (!['si', 'no'].includes(terreno)) return NextResponse.json({ error: 'Indique si tiene terreno.' }, { status: 400 });
  const modeloValido = MODELOS.some((m) => m.id === modelo) ? modelo : 'no-se';

  try {
    await adminDb().collection('leads').add({
      nombre, telefono, comuna, modelo: modeloValido, subsidio, terreno,
      estado: 'nuevo', notas: '', vencimientoSubsidio: null,
      creado: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error('Error guardando contacto', e);
    return NextResponse.json({ error: 'No pudimos guardar sus datos en este momento.' }, { status: 500 });
  }

  // Aviso por correo (opcional).
  const { RESEND_API_KEY, AVISO_EMAIL_DESTINO, AVISO_EMAIL_REMITENTE } = process.env;
  if (RESEND_API_KEY && AVISO_EMAIL_DESTINO) {
    const califica = subsidio === 'si' && terreno === 'si' ? 'Sí (tiene subsidio y terreno)' : 'Revisar';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: AVISO_EMAIL_REMITENTE || 'Avisos <onboarding@resend.dev>',
        to: [AVISO_EMAIL_DESTINO],
        subject: `Nuevo contacto: ${nombre} (${comuna})`,
        text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nComuna: ${comuna}\nModelo: ${modeloValido}\nSubsidio: ${subsidio}\nTerreno: ${terreno}\nCalifica: ${califica}\n\nWhatsApp: https://wa.me/${telefono.replace(/\D/g, '')}`,
      }),
    }).catch((e) => console.error('Error enviando aviso', e));
  }

  return NextResponse.json({ ok: true });
}
