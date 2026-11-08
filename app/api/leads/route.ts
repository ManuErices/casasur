import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { COMUNAS } from '@/lib/config';
import { VIVIENDAS_DEMO } from '@/lib/viviendas';

export const dynamic = 'force-dynamic';

const limpiar = (v: unknown, max = 120) => String(v ?? '').trim().slice(0, max);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Formulario inválido.' }, { status: 400 }); }

  // Campo trampa: los robots lo llenan, las personas no lo ven.
  if (limpiar(body.empresa)) return NextResponse.json({ ok: true });

  const nombre = limpiar(body.nombre, 80);
  const telefono = limpiar(body.telefono, 30);
  const email = limpiar(body.email, 120).toLowerCase();
  const comuna = limpiar(body.comuna, 40);
  const subsidio = limpiar(body.subsidio, 12);
  const terreno = limpiar(body.terreno, 4) || 'sin-dato';
  const origen = limpiar(body.origen, 120);
  const viviendaSlug = limpiar(body.vivienda, 60);

  if (nombre.length < 2) return NextResponse.json({ error: 'Escribe tu nombre.' }, { status: 400 });
  if (telefono.replace(/\D/g, '').length < 8) return NextResponse.json({ error: 'Escribe un teléfono válido.' }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Revisa tu correo.' }, { status: 400 });
  if (!COMUNAS.includes(comuna) && comuna !== 'Otra') return NextResponse.json({ error: 'Elige una comuna.' }, { status: 400 });
  if (!['si', 'postulando', 'no'].includes(subsidio)) return NextResponse.json({ error: 'Indica si tienes subsidio.' }, { status: 400 });
  if (!['si', 'no', 'sin-dato'].includes(terreno)) return NextResponse.json({ error: 'Indica si tienes terreno.' }, { status: 400 });
  if (limpiar(body.consentimiento, 4) !== 'si') return NextResponse.json({ error: 'Necesitamos tu autorización para contactarte.' }, { status: 400 });

  // La vivienda se valida contra el catálogo; el modelo se deduce de ella.
  const vivienda = VIVIENDAS_DEMO.find((v) => v.slug === viviendaSlug);
  const modelo = vivienda?.modeloId ?? 'no-se';

  try {
    await adminDb().collection('leads').add({
      nombre, telefono, email, comuna, modelo, subsidio, terreno,
      vivienda: vivienda ? { slug: vivienda.slug, nombre: vivienda.nombre, comuna: vivienda.comuna, precioUF: vivienda.precioUF } : null,
      origen,
      estado: 'nuevo', notas: '', vencimientoSubsidio: null,
      creado: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error('Error guardando contacto', e);
    return NextResponse.json({ error: 'No pudimos guardar tus datos en este momento.' }, { status: 500 });
  }

  // Aviso por correo (opcional).
  const { RESEND_API_KEY, AVISO_EMAIL_DESTINO, AVISO_EMAIL_REMITENTE } = process.env;
  if (RESEND_API_KEY && AVISO_EMAIL_DESTINO) {
    const califica = subsidio === 'si' && terreno === 'si' ? 'Sí (tiene subsidio y terreno)' : 'Revisar';
    const interes = vivienda ? `${vivienda.nombre} · ${vivienda.comuna} (${vivienda.precioUF} UF)` : 'Sin definir';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: AVISO_EMAIL_REMITENTE || 'Avisos <onboarding@resend.dev>',
        to: [AVISO_EMAIL_DESTINO],
        subject: `Nuevo contacto: ${nombre} (${comuna}) · ${interes}`,
        text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nCorreo: ${email || '—'}\nComuna: ${comuna}\nVivienda de interés: ${interes}\nSubsidio: ${subsidio}\nTerreno: ${terreno}\nCalifica: ${califica}\nPágina: ${origen}\n\nWhatsApp: https://wa.me/${telefono.replace(/\D/g, '')}`,
      }),
    }).catch((e) => console.error('Error enviando aviso', e));
  }

  return NextResponse.json({ ok: true });
}
