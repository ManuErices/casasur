"""Genera el presupuesto peor caso de la casa modelo (43 m², madera) con fórmulas."""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.comments import Comment
from openpyxl.utils import get_column_letter

SALIDA = sys.argv[1]
F = 'Arial'
AZUL = Font(name=F, color='0000FF', size=10)
NEG = Font(name=F, size=10)
NEGB = Font(name=F, size=10, bold=True)
VERDE = Font(name=F, size=10, color='008000')
TIT = Font(name=F, size=14, bold=True, color='0F2A22')
CAB = Font(name=F, size=10, bold=True, color='FBF6EC')
FCAB = PatternFill('solid', fgColor='0F2A22')
FCAP = PatternFill('solid', fgColor='F1E9DC')
FAMA = PatternFill('solid', fgColor='FFFF00')
FTOT = PatternFill('solid', fgColor='F2B33D')
CLP = '$#,##0;($#,##0);-'
UFF = '#,##0.0" UF";(#,##0.0" UF");-'
PCT = '0.0%'
fina = Side(style='thin', color='D9CFBD')
BORDE = Border(bottom=fina)

wb = Workbook()

# ------------------------------------------------------------------ Supuestos
s = wb.active
s.title = 'Supuestos'
s['A1'] = 'Supuestos del presupuesto (peor caso)'; s['A1'].font = TIT
s['A2'] = 'Celdas azules con fondo amarillo = valores que puedes cambiar. Todo lo demás se recalcula.'
s['A2'].font = Font(name=F, size=9, italic=True)
supuestos = [
    # clave, etiqueta, valor, formato, nota
    ('uf', 'Valor UF ($)', 41200, CLP, 'Valor de respaldo usado por el sitio (lib/config.ts). Actualizar con la UF del día.'),
    ('m2', 'Superficie construida (m²)', 43, '0', 'Casa modelo: 2 dormitorios y 1 baño (datos del sitio).'),
    ('dias', 'Días hábiles de obra cuadrilla', 70, '0', 'Peor caso: ~14 semanas. El sitio indica ~3 meses de obra.'),
    ('maestro', 'Jornal maestro carpintero ($/día)', 70000, CLP, 'Techo del rango $50.000–$70.000/día (OneEstimate, 2026).'),
    ('ayudante', 'Jornal ayudante ($/día)', 40000, CLP, 'Techo del rango $30.000–$40.000/día (OneEstimate, 2026).'),
    ('n_ayud', 'Ayudantes en cuadrilla', 2, '0', 'Supuesto.'),
    ('factor', 'Factor costo empresa sobre jornal', 1.35, '0.00', 'Imposiciones, seguro, mutual, vacaciones y feriados proporcionales. Supuesto conservador; validar con contador.'),
    ('imprev', 'Imprevistos (% del costo directo)', 0.10, PCT, 'Peor caso. Lluvia, alzas, pérdidas de material.'),
    ('gg', 'Gastos generales (% del costo directo)', 0.12, PCT, 'Administración, profesional a cargo, seguros, boleta de garantía, posventa.'),
    ('util', 'Utilidad (% del costo directo)', 0.10, PCT, 'Margen objetivo de la constructora.'),
    ('iva', 'IVA (% sobre el neto)', 0.19, PCT, 'Peor caso: IVA completo, SIN el Crédito Especial a Empresas Constructoras (CEEC). Validar con contador si aplica.'),
    ('subsidio', 'Subsidio DS1 CSP tramo 2, zona regular (UF)', 600, '#,##0', 'Zona regular Coquimbo–Los Lagos (Duplos/Bonos del Gobierno, 2026). Confirmar en el llamado vigente.'),
    ('ahorro', 'Ahorro mínimo familia (UF)', 30, '#,##0', 'Primer llamado 2026, CSP tramo 2 (MINVU).'),
    ('tope', 'Precio máximo vivienda CSP tramo 2 (UF)', 1600, '#,##0', 'ChileAtiende, ficha DS1 tramo 2 construcción.'),
]
s['A4'], s['B4'], s['C4'] = 'Supuesto', 'Valor', 'Fuente / nota'
for c in 'ABC':
    s[f'{c}4'].font = CAB; s[f'{c}4'].fill = FCAB
REF = {}
for i, (k, et, v, fmt, nota) in enumerate(supuestos, start=5):
    s[f'A{i}'] = et; s[f'A{i}'].font = NEG
    s[f'B{i}'] = v; s[f'B{i}'].font = AZUL; s[f'B{i}'].fill = FAMA; s[f'B{i}'].number_format = fmt
    s[f'C{i}'] = nota; s[f'C{i}'].font = Font(name=F, size=9)
    REF[k] = f'Supuestos!$B${i}'
s.column_dimensions['A'].width = 44; s.column_dimensions['B'].width = 14; s.column_dimensions['C'].width = 95

# ------------------------------------------------------------------ Partidas
p = wb.create_sheet('Presupuesto')
p['A1'] = 'Presupuesto de construcción · casa 43 m² en madera · PEOR CASO'; p['A1'].font = TIT
p['A2'] = 'Precios de materiales: techo de los rangos de mercado 2026 (Sodimac, Easy, índices Factoia/ObraMaestra, SERNAC) + margen por flete al sur. Precios con IVA incluido salvo nota.'
p['A2'].font = Font(name=F, size=9, italic=True)
cab = ['Ítem', 'Partida', 'Unidad', 'Cantidad', 'Precio unitario ($)', 'Total ($)', 'Tipo', 'Fuente / supuesto']
for j, t in enumerate(cab, 1):
    c = p.cell(row=4, column=j, value=t); c.font = CAB; c.fill = FCAB; c.alignment = Alignment(wrap_text=True, vertical='center')

# Capítulos: (código, nombre, [ (partida, unidad, cantidad, precio, tipo, fuente) ])
# tipo: M = material, S = subcontrato/servicio, MO = mano de obra (se calcula aparte)
CAP = [
 ('1', 'Proyecto, permisos e instalación de faenas', [
  ('Proyecto de arquitectura, cálculo y especialidades', 'gl', 1, 1500000, 'S', 'Supuesto peor caso; parte puede cubrirla la Entidad Patrocinante.'),
  ('Derechos municipales permiso de edificación y recepción', 'gl', 1, 600000, 'S', 'Supuesto (≈1,5% del presupuesto de obra según OGUC).'),
  ('Baño químico (4 meses)', 'mes', 4, 120000, 'S', 'Supuesto.'),
  ('Empalme provisorio de luz y agua, bodega y cierre de faena', 'gl', 1, 700000, 'S', 'Supuesto.'),
  ('Trazado y niveles', 'gl', 1, 150000, 'S', 'Supuesto.'),
 ]),
 ('2', 'Fundaciones y radier', [
  ('Hormigón premezclado H25 (cimientos, sobrecimientos y radier 10 cm)', 'm³', 13.5, 135000, 'M', 'Peor caso sobre "H-20 desde $98.000/m³" (ObraMaestra 2026) por flete al sur.'),
  ('Despacho de hormigón en zona rural', 'viaje', 2, 180000, 'S', 'Supuesto.'),
  ('Acero de refuerzo A630 (cimientos y sobrecimientos)', 'kg', 450, 1600, 'M', 'Supuesto peor caso.'),
  ('Malla ACMA C92 para radier', 'u', 4, 45000, 'M', 'Supuesto peor caso.'),
  ('Ripio compactado bajo radier (8 cm)', 'm³', 4, 35000, 'M', 'Supuesto.'),
  ('Polietileno 0,2 mm (barrera de humedad bajo radier)', 'm²', 55, 900, 'M', 'Supuesto.'),
  ('Aislación perimetral de piso (poliestireno extruido 30 mm, faja 1 m)', 'm²', 27, 8000, 'M', 'Supuesto; exigencia térmica de piso en el sur.'),
  ('Moldajes y madera desechable', 'gl', 1, 250000, 'M', 'Supuesto.'),
 ]),
 ('3', 'Estructura de madera (muros y techumbre)', [
  ('Pino seco cepillado 2x4" x 3,2 m (pies derechos, soleras, cadenetas)', 'u', 190, 5400, 'M', 'Factoia jul-2026: $5.190; Sodimac: $5.090–$5.250. Peor caso $5.400.'),
  ('Pino impregnado 2x4" x 3,2 m (solera inferior)', 'u', 14, 5600, 'M', 'Supuesto sobre precio seco.'),
  ('Vigas de techumbre pino 2x8" x 4,8 m', 'u', 16, 19000, 'M', 'Supuesto peor caso.'),
  ('Costaneras pino 2x2" x 3,2 m', 'u', 60, 2400, 'M', 'Supuesto.'),
  ('OSB 9,5 mm 1,22x2,44 m (arriostramiento de muros)', 'u', 24, 17990, 'M', 'Sodimac: $17.990 (precio normal).'),
  ('OSB 11,1 mm 1,22x2,44 m (base de cubierta)', 'u', 21, 22000, 'M', 'Supuesto peor caso sobre OSB 9,5 mm.'),
  ('Clavos, tornillos, conectores metálicos y pernos de anclaje', 'gl', 1, 450000, 'M', 'Supuesto.'),
 ]),
 ('4', 'Cubierta', [
  ('Zinc 5V 0,4 mm x 3,5 m', 'u', 22, 16000, 'M', 'Sodimac 5V 0,35 mm x 3,5 m: $12.907; peor caso con 0,4 mm.'),
  ('Fieltro asfáltico 15 lb (rollo 40 m²)', 'u', 2, 25000, 'M', 'Supuesto.'),
  ('Cumbreras, forros, hojalatería, canales y bajadas', 'gl', 1, 350000, 'M', 'Supuesto.'),
  ('Tornillos autoperforantes con golilla', 'gl', 1, 60000, 'M', 'Supuesto.'),
 ]),
 ('5', 'Aislación y barreras', [
  ('Barrera de humedad y viento en muros (tipo Tyvek)', 'rollo', 2, 90000, 'M', 'Supuesto peor caso.'),
  ('Lana de vidrio 100 mm en muros', 'm²', 55, 6500, 'M', 'Rango $4.500–$7.000/m² (guía de ferretería 2026).'),
  ('Lana de vidrio 2 capas x 100 mm en cielo', 'm²', 90, 6500, 'M', 'Ídem.'),
  ('Barrera de vapor interior (polietileno)', 'm²', 140, 600, 'M', 'Supuesto.'),
 ]),
 ('6', 'Revestimientos', [
  ('Revestimiento exterior (fibrocemento/siding o tablero) incl. fijaciones', 'm²', 63, 22000, 'M', 'Supuesto peor caso.'),
  ('Esquineros, tapacanes y guardapolvos exteriores', 'gl', 1, 200000, 'M', 'Supuesto.'),
  ('Volcanita ST 10 mm 1,2x2,4 m (muros interiores)', 'u', 43, 8000, 'M', 'Rango $5.500–$12.000 (ObraMaestra, Factoia, calculaobrachile 2026).'),
  ('Volcanita RH 12,5 mm (baño)', 'u', 8, 15000, 'M', 'Techo del rango $10.000–$15.000 (calculaobrachile 2026).'),
  ('Volcanita 10 mm para cielo', 'u', 17, 9000, 'M', 'Ídem.'),
  ('Perfiles, huinchas, pasta y tornillos de volcanita', 'gl', 1, 250000, 'M', 'Supuesto.'),
 ]),
 ('7', 'Pisos y cerámicas', [
  ('Cerámica/porcelanato de piso (incluye 10% de pérdida)', 'm²', 48, 14000, 'M', 'Rango $5.900–$24.350/m² (ObraMaestra 2026). Gama media.'),
  ('Adhesivo, fragüe y niveladores', 'gl', 1, 150000, 'M', 'Supuesto.'),
  ('Cerámica de muro baño y cocina', 'm²', 15, 12000, 'M', 'Supuesto.'),
  ('Adhesivo muro', 'gl', 1, 60000, 'M', 'Supuesto.'),
  ('Guardapolvos interiores', 'ml', 60, 2000, 'M', 'Supuesto.'),
 ]),
 ('8', 'Puertas y ventanas', [
  ('Ventanas PVC termopanel (instaladas)', 'u', 7, 350000, 'S', 'Cronoshare: PVC instalada $200.000–$300.000; peor caso +17%.'),
  ('Puerta exterior aislada con marco y cerradura', 'u', 2, 280000, 'M', 'Supuesto (modelo Ranco tiene 2 accesos).'),
  ('Puertas interiores con marco, bisagras y manilla', 'u', 3, 110000, 'M', 'Supuesto.'),
 ]),
 ('9', 'Instalaciones sanitarias y de gas', [
  ('WC con estanque', 'u', 1, 120000, 'M', 'Supuesto.'),
  ('Lavamanos con pedestal', 'u', 1, 70000, 'M', 'Supuesto.'),
  ('Receptáculo de ducha o tina con mampara', 'u', 1, 250000, 'M', 'Supuesto.'),
  ('Griferías (ducha, lavamanos, lavaplatos)', 'u', 3, 50000, 'M', 'Supuesto.'),
  ('Calefón 10 litros certificado', 'u', 1, 280000, 'M', 'Supuesto peor caso (tiro forzado).'),
  ('Red de agua potable fría/caliente (PPR o cobre) y fittings', 'gl', 1, 350000, 'M', 'Supuesto.'),
  ('Alcantarillado PVC, 2 cámaras de inspección', 'gl', 1, 450000, 'M', 'Supuesto.'),
  ('Instalación de gas (regulador, cañería, certificado SEC)', 'gl', 1, 350000, 'S', 'Supuesto.'),
  ('Unión domiciliaria de agua y alcantarillado (empresa sanitaria)', 'gl', 1, 900000, 'S', 'Supuesto peor caso; depende de la factibilidad del sitio.'),
  ('Subcontrato gasfíter (mano de obra)', 'gl', 1, 1400000, 'S', 'Supuesto.'),
 ]),
 ('10', 'Instalación eléctrica', [
  ('Tablero, protecciones, cables, ductos, cajas, artefactos y luminarias', 'gl', 1, 700000, 'M', 'Supuesto.'),
  ('Empalme monofásico y medidor (distribuidora)', 'gl', 1, 650000, 'S', 'Supuesto peor caso.'),
  ('Subcontrato electricista con declaración TE1 (SEC)', 'gl', 1, 900000, 'S', 'Supuesto.'),
 ]),
 ('11', 'Cocina, closets y terminaciones', [
  ('Mueble de cocina base y aéreo 2,4 m con lavaplatos', 'gl', 1, 900000, 'M', 'Supuesto peor caso.'),
  ('Closets dormitorios', 'u', 2, 300000, 'M', 'Supuesto.'),
  ('Pinturas exterior e interior (materiales)', 'gl', 1, 550000, 'M', 'Supuesto.'),
  ('Subcontrato pintor', 'gl', 1, 700000, 'S', 'Supuesto.'),
 ]),
 ('12', 'Terraza (solo modelo Ranco)', [
  ('Terraza de madera impregnada 5 x 2 m con baranda', 'm²', 10, 45000, 'M', 'Supuesto; poner cantidad 0 para Calle-Calle y Niebla.'),
 ]),
 ('13', 'Logística, equipos y cierre', [
  ('Traslados de cuadrilla y materiales (zona rural)', 'día', None, 25000, 'S', 'Supuesto: $25.000 por día de obra.'),
  ('Arriendo de herramientas y equipos (betonera, andamios, generador)', 'gl', 1, 600000, 'S', 'Supuesto.'),
  ('Retiro de escombros y aseo final', 'gl', 1, 350000, 'S', 'Supuesto.'),
 ]),
]

fila = 5
filas_cap = []  # (código, nombre, fila_inicio, fila_fin, fila_subtotal)
for cod, nombre, items in CAP:
    p.cell(row=fila, column=1, value=cod).font = NEGB
    p.cell(row=fila, column=2, value=nombre).font = NEGB
    for j in range(1, 9):
        p.cell(row=fila, column=j).fill = FCAP
    fila += 1
    ini = fila
    for k, (part, un, cant, precio, tipo, fuente) in enumerate(items, 1):
        p.cell(row=fila, column=1, value=f'{cod}.{k}').font = NEG
        p.cell(row=fila, column=2, value=part).font = NEG
        p.cell(row=fila, column=3, value=un).font = NEG
        cc = p.cell(row=fila, column=4)
        if cant is None:
            cc.value = f"={REF['dias']}"; cc.font = VERDE
        else:
            cc.value = cant; cc.font = AZUL
        cc.number_format = '#,##0.0'
        pu = p.cell(row=fila, column=5, value=precio); pu.font = AZUL; pu.number_format = CLP
        t = p.cell(row=fila, column=6, value=f'=D{fila}*E{fila}'); t.font = NEG; t.number_format = CLP
        p.cell(row=fila, column=7, value={'M': 'Material', 'S': 'Subcontrato/servicio'}[tipo]).font = NEG
        p.cell(row=fila, column=8, value=fuente).font = Font(name=F, size=9)
        for j in range(1, 9):
            p.cell(row=fila, column=j).border = BORDE
        fila += 1
    fin = fila - 1
    p.cell(row=fila, column=2, value=f'Subtotal {nombre.lower()}').font = NEGB
    st = p.cell(row=fila, column=6, value=f'=SUM(F{ini}:F{fin})'); st.font = NEGB; st.number_format = CLP
    filas_cap.append((cod, nombre, ini, fin, fila))
    fila += 2

# Mano de obra de la cuadrilla
p.cell(row=fila, column=1, value='14').font = NEGB
p.cell(row=fila, column=2, value='Mano de obra cuadrilla propia (costo empresa)').font = NEGB
for j in range(1, 9):
    p.cell(row=fila, column=j).fill = FCAP
fila += 1
mo_ini = fila
mo = [
    ('Maestro carpintero', 'día', f"={REF['dias']}", f"={REF['maestro']}*{REF['factor']}", 'Jornal × factor costo empresa (ver Supuestos).'),
    ('Ayudantes', 'día', f"={REF['dias']}*{REF['n_ayud']}", f"={REF['ayudante']}*{REF['factor']}", 'Ídem.'),
    ('Jornales extra fundaciones y hormigonado', 'día', 20, f"={REF['ayudante']}*{REF['factor']}", 'Supuesto: 2 jornales × 10 días.'),
]
for k, (part, un, cant, pu, fuente) in enumerate(mo, 1):
    p.cell(row=fila, column=1, value=f'14.{k}').font = NEG
    p.cell(row=fila, column=2, value=part).font = NEG
    p.cell(row=fila, column=3, value=un).font = NEG
    c = p.cell(row=fila, column=4, value=cant); c.number_format = '#,##0.0'; c.font = AZUL if isinstance(cant, int) else VERDE
    c = p.cell(row=fila, column=5, value=pu); c.number_format = CLP; c.font = VERDE
    c = p.cell(row=fila, column=6, value=f'=D{fila}*E{fila}'); c.number_format = CLP; c.font = NEG
    p.cell(row=fila, column=7, value='Mano de obra').font = NEG
    p.cell(row=fila, column=8, value=fuente).font = Font(name=F, size=9)
    for j in range(1, 9):
        p.cell(row=fila, column=j).border = BORDE
    fila += 1
mo_fin = fila - 1
p.cell(row=fila, column=2, value='Subtotal mano de obra cuadrilla').font = NEGB
c = p.cell(row=fila, column=6, value=f'=SUM(F{mo_ini}:F{mo_fin})'); c.font = NEGB; c.number_format = CLP
filas_cap.append(('14', 'Mano de obra cuadrilla propia', mo_ini, mo_fin, fila))
fila += 2

total_dir_fila = fila
p.cell(row=fila, column=2, value='COSTO DIRECTO TOTAL').font = NEGB
c = p.cell(row=fila, column=6, value='=' + '+'.join(f'F{x[4]}' for x in filas_cap)); c.font = NEGB; c.number_format = CLP; c.fill = FTOT
ultima = fila

for col, w in zip('ABCDEFGH', [6, 62, 8, 10, 16, 16, 20, 70]):
    p.column_dimensions[col].width = w
p.freeze_panes = 'A5'

# ------------------------------------------------------------------ Resumen
r = wb.create_sheet('Resumen', 0)
r['A1'] = 'Resumen · casa 43 m² en madera · peor caso'; r['A1'].font = TIT
r['A2'] = 'Precio de venta mínimo para no perder dinero si todo sale caro. Fórmulas enlazadas a Presupuesto y Supuestos.'
r['A2'].font = Font(name=F, size=9, italic=True)
r['A4'], r['B4'], r['C4'], r['D4'] = 'Capítulo', 'Total ($)', 'Total (UF)', '% del costo directo'
for c in 'ABCD':
    r[f'{c}4'].font = CAB; r[f'{c}4'].fill = FCAB
fr = 5
for cod, nombre, _, _, fsub in filas_cap:
    r[f'A{fr}'] = f'{cod}. {nombre}'; r[f'A{fr}'].font = NEG
    r[f'B{fr}'] = f'=Presupuesto!F{fsub}'; r[f'B{fr}'].font = VERDE; r[f'B{fr}'].number_format = CLP
    r[f'C{fr}'] = f"=B{fr}/{REF['uf']}"; r[f'C{fr}'].number_format = UFF; r[f'C{fr}'].font = NEG
    r[f'D{fr}'] = f'=IF($B${5 + len(filas_cap)}=0,0,B{fr}/$B${5 + len(filas_cap)})'; r[f'D{fr}'].number_format = PCT; r[f'D{fr}'].font = NEG
    fr += 1
cd = fr
filas = [
    ('Costo directo', f'=SUM(B5:B{fr - 1})', True),
    ('Imprevistos', f"=B{cd}*{REF['imprev']}", False),
    ('Gastos generales', f"=B{cd}*{REF['gg']}", False),
    ('Utilidad', f"=B{cd}*{REF['util']}", False),
    ('Precio neto', f'=SUM(B{cd}:B{cd + 3})', True),
    ('IVA', f"=B{cd + 4}*{REF['iva']}", False),
    ('PRECIO DE VENTA PEOR CASO', f'=B{cd + 4}+B{cd + 5}', True),
]
for i, (et, f, neg) in enumerate(filas):
    row = cd + i
    r[f'A{row}'] = et; r[f'A{row}'].font = NEGB if neg else NEG
    r[f'B{row}'] = f; r[f'B{row}'].number_format = CLP; r[f'B{row}'].font = NEGB if neg else NEG
    r[f'C{row}'] = f"=B{row}/{REF['uf']}"; r[f'C{row}'].number_format = UFF; r[f'C{row}'].font = NEGB if neg else NEG
    if i == 0:
        r[f'D{row}'] = 1; r[f'D{row}'].number_format = PCT
total = cd + 6
for c in 'ABC':
    r[f'{c}{total}'].fill = FTOT

k = total + 2
r[f'A{k}'] = 'Indicadores'; r[f'A{k}'].font = TIT
ind = [
    ('Precio peor caso por m² (UF/m²)', f"=C{total}/{REF['m2']}", '0.0" UF/m²"'),
    ('Referencia de mercado madera "llave en mano" (UF/m²)', '18–28', None),
    ('Tope DS1 CSP tramo 2 (UF)', f"={REF['tope']}", '#,##0" UF"'),
    ('Holgura bajo el tope (UF)', f"={REF['tope']}-C{total}", '#,##0.0" UF";(#,##0.0" UF")'),
    ('Subsidio + ahorro mínimo (UF)', f"={REF['subsidio']}+{REF['ahorro']}", '#,##0" UF"'),
    ('Saldo que pagaría la familia a precio peor caso (UF)', f"=MAX(0,C{total}-{REF['subsidio']}-{REF['ahorro']})", '#,##0.0" UF"'),
    ('Saldo que pagaría la familia ($)', f"=B{k + 6}*{REF['uf']}", CLP),
]
for i, (et, f, fmt) in enumerate(ind, 1):
    r[f'A{k + i}'] = et; r[f'A{k + i}'].font = NEG
    r[f'B{k + i}'] = f; r[f'B{k + i}'].font = NEGB
    if fmt: r[f'B{k + i}'].number_format = fmt

k2 = k + len(ind) + 2
r[f'A{k2}'] = 'Comparación con los precios publicados en el sitio'; r[f'A{k2}'].font = TIT
r[f'A{k2 + 1}'], r[f'B{k2 + 1}'], r[f'C{k2 + 1}'], r[f'D{k2 + 1}'] = 'Modelo', 'Precio sitio (UF)', 'Diferencia vs. peor caso (UF)', 'Margen real sobre costo'
for c in 'ABCD':
    r[f'{c}{k2 + 1}'].font = CAB; r[f'{c}{k2 + 1}'].fill = FCAB
modelos = [('Calle-Calle (sin terraza)', 946), ('Niebla (sin terraza)', 975), ('Ranco (con terraza)', 1012)]
for i, (m, pr) in enumerate(modelos, 2):
    row = k2 + i
    r[f'A{row}'] = m; r[f'A{row}'].font = NEG
    r[f'B{row}'] = pr; r[f'B{row}'].font = AZUL; r[f'B{row}'].number_format = '#,##0" UF"'
    r[f'C{row}'] = f'=B{row}-$C${total}'; r[f'C{row}'].number_format = '#,##0.0" UF";[Red](#,##0.0" UF")'
    # margen real: precio neto sin IVA vs costo (directo+imprevistos+GG)
    r[f'D{row}'] = f"=IF(B{row}=0,0,(B{row}/(1+{REF['iva']})*{REF['uf']}-(B{cd}+B{cd + 1}+B{cd + 2}))/(B{cd}+B{cd + 1}+B{cd + 2}))"
    r[f'D{row}'].number_format = '0.0%;[Red]-0.0%'
r[f'A{k2 + 5}'] = ('Nota: el peor caso incluye la terraza del Ranco (≈ capítulo 12). Para Calle-Calle y Niebla, pon cantidad 0 en la partida 12.1 '
                   'de la hoja Presupuesto. "Margen real" = (precio sin IVA − costo con imprevistos y gastos generales) ÷ ese costo.')
r[f'A{k2 + 5}'].font = Font(name=F, size=9, italic=True)
r[f'A{k2 + 5}'].alignment = Alignment(wrap_text=True)
r.merge_cells(f'A{k2 + 5}:D{k2 + 6}')
r.row_dimensions[k2 + 5].height = 30
for col, w in zip('ABCD', [58, 18, 26, 22]):
    r.column_dimensions[col].width = w

# ------------------------------------------------------------------ Reglas DS1
n = wb.create_sheet('Quién fija los precios')
n['A1'] = '¿Quién fija el precio de cada partida en un DS1 de construcción en sitio propio?'; n['A1'].font = TIT
notas = [
 ('Conclusión', 'El MINVU/SERVIU NO publican precios unitarios por partida para el DS1. La constructora fija el precio de la vivienda y de cada partida y lo acuerda con la familia en el contrato de construcción, dentro del tope del tramo (1.600 UF en tramo 2; 2.200 UF en tramo 3). El subsidio es un monto fijo en UF según tramo y zona; lo que exceda subsidio + ahorro lo paga la familia (crédito o aporte).'),
 ('Lo que sí controla el Estado', 'SERVIU revisa los antecedentes del terreno y del proyecto; la DOM otorga el permiso y la recepción final; para cobrar el subsidio se presentan certificado de subsidio endosado, permiso, recepción municipal y contrato de construcción (y, según el SERVIU regional, presupuesto y especificaciones técnicas). La vivienda debe construirla un tercero y no superar 140 m².'),
 ('Ojo: DS27 sí tiene tabla de precios', 'Para el programa de mejoramiento DS27 el MINVU publica "Tablas de precios referenciales" por partida y región. No confundir con el DS1.'),
 ('Pendiente de confirmar', 'Formato exacto del presupuesto que pide SERVIU Los Ríos, si revisa precios unitarios, monto vigente del subsidio en el próximo llamado y si aplica el Crédito Especial a Empresas Constructoras (IVA). Los sitios minvu.gob.cl y chileatiende.gob.cl no pudieron leerse directamente desde el entorno donde se hizo este archivo; las cifras salen de fragmentos de búsqueda.'),
 ('Fuentes', 'ChileAtiende ficha DS1 tramo 2 construcción (chileatiende.gob.cl/fichas/81721) · Guía DS1 construcción MINVU 2019/2025/2026 (minvu.gob.cl) · SERVIU Los Lagos, antecedentes de cobro DS01 CSP (serviuloslagos.cl) · Duplos y Bonos del Gobierno, montos 2026 · MINVU Tabla de precios referenciales DS27 RM 2025.'),
]
for i, (t, d) in enumerate(notas, 3):
    n[f'A{i}'] = t; n[f'A{i}'].font = NEGB; n[f'A{i}'].alignment = Alignment(vertical='top', wrap_text=True)
    n[f'B{i}'] = d; n[f'B{i}'].font = NEG; n[f'B{i}'].alignment = Alignment(wrap_text=True, vertical='top')
    n.row_dimensions[i].height = 75
n.column_dimensions['A'].width = 30; n.column_dimensions['B'].width = 120

wb.save(SALIDA)
print('ok', SALIDA)
