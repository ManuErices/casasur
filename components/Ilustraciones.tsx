export function FachadaCalleCalle() {
  return (
    <svg viewBox="0 0 360 230" role="img" aria-label="Fachada del modelo Calle-Calle: techo a dos aguas y revestimiento claro" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x="0" y="196" width="360" height="34" fill="#C8DACF" />
      <polygon points="26,114 334,114 314,70 46,70" fill="#3A4743" stroke="#15211C" strokeWidth="2" />
      <rect x="40" y="112" width="280" height="86" fill="#F7F8F6" stroke="#15211C" strokeWidth="2" />
      <g stroke="#C9D0CB" strokeWidth="1">{[126, 140, 154, 168, 182].map((y) => <line key={y} x1="41" y1={y} x2="319" y2={y} />)}</g>
      <rect x="54" y="132" width="56" height="40" fill="#BFD6DE" stroke="#15211C" strokeWidth="2" />
      <rect x="116" y="132" width="56" height="40" fill="#BFD6DE" stroke="#15211C" strokeWidth="2" />
      <rect x="196" y="128" width="32" height="70" fill="#1E5A47" stroke="#15211C" strokeWidth="2" />
      <rect x="250" y="134" width="56" height="36" fill="#BFD6DE" stroke="#15211C" strokeWidth="2" />
    </svg>
  );
}

export function FachadaNiebla() {
  return (
    <svg viewBox="0 0 360 230" role="img" aria-label="Fachada del modelo Niebla: frontón de madera hacia la calle y techito de acceso" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x="0" y="196" width="360" height="34" fill="#C8DACF" />
      <rect x="90" y="110" width="200" height="88" fill="#F3EFE8" stroke="#15211C" strokeWidth="2" />
      <polygon points="90,110 290,110 190,52" fill="#B98250" stroke="#15211C" strokeWidth="2" />
      <g stroke="#8E5F33" strokeWidth="1.5">{[130, 150, 170, 190, 210, 230, 250].map((x) => <line key={x} x1={x} y1={110 - (100 - Math.abs(190 - x)) * 0.58} x2={x} y2="110" />)}</g>
      <polyline points="74,120 190,46 306,120" fill="none" stroke="#2F3A36" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="92" y="122" width="88" height="8" fill="#2F3A36" />
      <rect x="98" y="130" width="6" height="68" fill="#8A5A2B" /><rect x="168" y="130" width="6" height="68" fill="#8A5A2B" />
      <rect x="122" y="134" width="30" height="64" fill="#1E5A47" stroke="#15211C" strokeWidth="2" />
      <rect x="198" y="134" width="34" height="44" fill="#BFD6DE" stroke="#15211C" strokeWidth="2" />
      <rect x="244" y="134" width="34" height="44" fill="#BFD6DE" stroke="#15211C" strokeWidth="2" />
    </svg>
  );
}

export function Plano() {
  const t = { fontFamily: 'var(--fuente-texto), sans-serif' };
  return (
    <svg viewBox="0 0 360 300" role="img" aria-label="Plano de la casa: arriba el estar, comedor y cocina; abajo dos dormitorios con el baño al medio" style={{ width: '100%', maxWidth: 560, height: 'auto', display: 'block', margin: '0 auto' }}>
      <rect x="0" y="0" width="360" height="300" fill="#2F3A36" />
      <rect x="9" y="9" width="342" height="125" fill="#FFF6E8" />
      <rect x="144.5" y="134" width="75" height="42.5" fill="#FFF6E8" />
      <rect x="9" y="138.5" width="131" height="152.5" fill="#E4F0EA" />
      <rect x="144.5" y="181" width="75" height="110" fill="#DCEAF2" />
      <rect x="224" y="138.5" width="127" height="152.5" fill="#E4F0EA" />
      <g fill="#7FB4CF"><rect x="22.5" y="0" width="75" height="9" /><rect x="102.5" y="0" width="75" height="9" /><rect x="257.5" y="0" width="60" height="9" /><rect x="44.5" y="291" width="60" height="9" /><rect x="169.5" y="291" width="25" height="9" /><rect x="257.5" y="291" width="60" height="9" /></g>
      <g fill="#C27C3A"><rect x="197.5" y="0" width="42.5" height="9" /><rect x="351" y="52.5" width="9" height="42.5" /></g>
      <rect x="242.5" y="9" width="108.5" height="30" fill="#D9CBB2" />
      <text x="296" y="29" textAnchor="middle" fontSize="11" fill="#15211C" style={t}>Muebles de cocina</text>
      <text x="150" y="72" textAnchor="middle" fontSize="15" fontWeight="700" fill="#15211C" style={t}>Estar · Comedor · Cocina</text>
      <text x="150" y="92" textAnchor="middle" fontSize="13" fill="#3E4A45" style={t}>17 m²</text>
      <text x="74" y="212" textAnchor="middle" fontSize="14" fontWeight="700" fill="#15211C" style={t}>Dormitorio 1</text>
      <text x="74" y="230" textAnchor="middle" fontSize="13" fill="#3E4A45" style={t}>8 m²</text>
      <text x="182" y="236" textAnchor="middle" fontSize="14" fontWeight="700" fill="#15211C" style={t}>Baño</text>
      <text x="287" y="212" textAnchor="middle" fontSize="14" fontWeight="700" fill="#15211C" style={t}>Dormitorio 2</text>
      <text x="287" y="230" textAnchor="middle" fontSize="13" fill="#3E4A45" style={t}>8 m²</text>
    </svg>
  );
}
