/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakSelect, TweakColor, TweakText */
const { useState, useEffect, useRef } = React;

/* ------------------------------------------------------------------ */
/* Reveal-on-scroll                                                    */
/* ------------------------------------------------------------------ */
function useReveal(){
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/* Counter that animates when in view                                  */
/* ------------------------------------------------------------------ */
function Counter({ to, prefix = '', suffix = '', duration = 1600 }){
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !done.current){
          done.current = true;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(to * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: .5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString('es-ES')}{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/* Cursor follower on CTAs (desktop only)                              */
/* ------------------------------------------------------------------ */
function CursorDot(){
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return;
    const dot = ref.current;
    let raf;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
      });
      dot.classList.add('show');
    };
    const onOver = (e) => {
      const t = e.target.closest('button, a, .f-card .cta, .faq-q, .disciple, .media-tile');
      dot.classList.toggle('hover', !!t);
    };
    const onLeave = () => dot.classList.remove('show');
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);
  return <div ref={ref} className="cursor-dot" />;
}

/* ------------------------------------------------------------------ */
/* TopBar                                                              */
/* ------------------------------------------------------------------ */
function TopBar(){
  return (
    <header className="topbar">
      <a href="#top" className="brand">Patxi Troitiño</a>
      <nav>
        <a href="#manifiesto">Sobre Patxi</a>
        <a href="#formaciones">Formaciones</a>
        <a href="#palmares">Palmarés</a>
        <a href="#prensa">Prensa</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <div className="lang">
        <span className="on">ES</span><span>·</span><span>EN</span><span>·</span><span>EU</span>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero({ heroVariant }){
  return (
    <section id="top" className="hero" data-screen-label="01 Hero">
      {heroVariant === 'video' ? (
        <video
          className="hero-video"
          src="assets/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : null}
      <div className="bg" />
      <div className="grain" />
      {heroVariant !== 'video' && (
        <div className="placeholder-tag">
          [ Retrato editorial · B/N · alto contraste ]
        </div>
      )}
      <div className="wrap hero-inner">
        <div className="hero-eye">
          <span>Director de Coctelería</span>
          <span className="dot" />
          <span>Restaurante Akelarre</span>
          <span className="star">★★★</span>
        </div>
        <h1 className="display">Patxi <span className="it">Troitiño</span></h1>
        <p className="sub">
          Tres décadas detrás de la barra. Una escuela formada. La coctelería como extensión natural de la alta cocina.
        </p>
        <div className="hero-row">
          <a href="#contacto" className="btn btn-primary">
            Reservar una formación <span className="arr">→</span>
          </a>
          <a href="#formaciones" className="btn btn-ghost">
            Ver formaciones <span className="arr">↓</span>
          </a>
        </div>
        <div className="wrap" style={{padding:0}}>
          <div className="hero-meta">
            <span>Donostia–San Sebastián · País Vasco</span>
            <span>Bartender · Coctelero · Profesor</span>
            <span className="scrolldown"><span className="line" /> Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust bar                                                           */
/* ------------------------------------------------------------------ */
function Trust(){
  const logos = [
    { t: 'Akelarre', el: <span>Akelarre <span className="ast">★★★</span></span> },
    { t: 'Basque Culinary Center', sc: true },
    { t: 'Escuela Luis Irizar' },
    { t: 'Hotel Zinema7' },
    { t: 'Estimar Valencia' },
    { t: 'FIBAR' },
    { t: 'HIP', sc: true },
    { t: 'Madrid Fusión' },
    { t: 'Netflix', sc: true },
    { t: 'Festival de San Sebastián' }
  ];
  return (
    <section className="trust">
      <div className="wrap">
        <div className="label">Han confiado en su criterio</div>
        <div className="row">
          {logos.map((l,i) => (
            <div key={i} className={"logo" + (l.sc ? " sc" : "")}>
              {l.el || l.t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Manifiesto                                                          */
/* ------------------------------------------------------------------ */
function Manifiesto(){
  return (
    <section id="manifiesto" className="section" data-screen-label="02 Manifiesto">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="num">02 — Sobre Patxi</div>
          </div>
          <div className="eyebrow">Donostia · 1972</div>
        </div>

        <div className="manifest">
          <div className="photo reveal">
            <span className="corner">EDITORIAL · 4×5</span>
            <span className="cap">[ Patxi en la barra del Akelarre, en acción ]</span>
          </div>
          <div className="reveal">
            <h2>Una vida<br/>detrás de <em>una barra</em>.</h2>
            <div className="blocks">
              <p>
                Nací entre cocteleras. Me formé en el <strong>Museo del Whisky</strong> de San Sebastián y, con apenas veintidós años, abrí <strong>Stick Cocktails</strong>. Era 1994 y la coctelería en España todavía no se llamaba a sí misma así.
              </p>
              <p>
                Hoy dirijo la coctelería del <strong>Restaurante Akelarre★★★</strong> y firmo cartas para hoteles como el Estimar Valencia o el Zinema7. He competido, he ganado, he viajado a Singapur, a La Habana, a Madrid Fusión. Pero mi sitio sigue siendo el mismo: detrás de una barra, con un cuchillo y un trozo de hielo.
              </p>
              <p>
                Mi obsesión real, sin embargo, es transmitir el oficio. Llevo más de <strong>quince años enseñando en el Basque Culinary Center</strong> y en la Escuela Luis Irizar. Me defino como un <em>bartender que da clases</em>, no como un profesor.
              </p>
            </div>
            <div className="pull">
              Somos artesanos del hielo y poetas del alcohol.
              <div className="sign">— Patxi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cifras                                                              */
/* ------------------------------------------------------------------ */
function Figures(){
  return (
    <section className="figures" data-screen-label="03 Cifras">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="num" style={{color:'var(--copper)'}}>03 — Cifras</div>
            <p className="figures-intro">
              Lo medible no lo cuenta todo.<br/>Pero algunos números importan.
            </p>
          </div>
        </div>
        <div className="figures-grid reveal">
          <div className="fig">
            <div className="num"><Counter to={30} suffix="+" /></div>
            <div className="lbl">Años detrás de la barra, sin descanso</div>
          </div>
          <div className="fig">
            <div className="num"><Counter to={15} suffix="+" /></div>
            <div className="lbl">Años formando en el Basque Culinary Center</div>
          </div>
          <div className="fig">
            <div className="num">2 <small>· 1</small></div>
            <div className="lbl">Libros publicados · Premio Gourmand mundial (2010)</div>
          </div>
          <div className="fig">
            <div className="num"><Counter to={1000} suffix="+" /></div>
            <div className="lbl">Profesionales formados en aulas y barras</div>
          </div>
          <div className="fig">
            <div className="num">3<small>★</small></div>
            <div className="lbl">Estrellas Michelin — Akelarre, donde dirige la coctelería</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Formaciones (la sección clave)                                       */
/* ------------------------------------------------------------------ */
function Formaciones({ onSelect }){
  const cards = [
    {
      n: '01',
      tag: 'Educación reglada',
      title: 'Másters y cursos en escuelas',
      who: 'Para escuelas de hostelería, universidades gastronómicas y centros de FP.',
      bullets: [
        'Módulos de coctelería clásica, contemporánea y técnicas de vanguardia',
        'Adaptado a programas reglados (FP, grados, másters)',
        'Material didáctico propio + sesiones prácticas',
      ],
      meta: 'Disponibilidad — cursos completos o módulos puntuales',
      type: 'Máster/curso en escuela'
    },
    {
      n: '02',
      tag: 'In-company',
      title: 'Formación para hoteles y restaurantes',
      who: 'Para equipos de barra de hoteles 4–5★, grupos de restauración y restaurantes con estrella.',
      bullets: [
        'Diagnóstico previo de la barra y de la carta actual',
        'Sesiones prácticas en tu propia barra, con tu equipo y tu producto',
        'Diseño de drinks menu a medida + manual de procedimientos',
      ],
      meta: 'Formato — jornada intensiva, fin de semana o programa multi-semana',
      type: 'Formación in-company'
    },
    {
      n: '03',
      tag: 'Marcas y eventos',
      title: 'Masterclasses y ponencias',
      who: 'Para destilerías, importadores premium, ferias y congresos del sector.',
      bullets: [
        'Activaciones de marca con coctelería en directo',
        'Ponencias magistrales (HIP, FIBAR, Madrid Fusión, La Habana)',
        'Showcooking de coctelería molecular y técnica',
      ],
      meta: 'Formato — ponencia 60–90 min · sesión hasta 4 h',
      type: 'Masterclass o ponencia'
    },
  ];

  return (
    <section id="formaciones" className="section formaciones" data-screen-label="04 Formaciones">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="num">04 — Formaciones</div>
            <h2 className="section-title" style={{marginTop:18}}>
              Tres maneras de <em style={{color:'var(--copper)',fontStyle:'italic'}}>trabajar juntos.</em>
            </h2>
          </div>
          <p style={{maxWidth:'34ch',color:'var(--stone)',fontFamily:'var(--serif)',fontStyle:'italic',fontSize:20}}>
            Cada formato se adapta. Pero ninguno se diluye: lo que recibes es siempre el mismo oficio, traducido a tu contexto.
          </p>
        </div>

        <div className="f-grid">
          {cards.map((c) => (
            <article key={c.n} className="f-card reveal">
              <div className="img">
                <span className="num-x">{c.n}</span>
                <span className="tag">{c.tag}</span>
              </div>
              <div className="body">
                <h3>{c.title}</h3>
                <div className="who">{c.who}</div>
                <ul>
                  {c.bullets.map((b,i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="meta">{c.meta}</div>
                <div className="cta" onClick={() => onSelect(c.type)}>
                  <span>Solicitar info</span>
                  <span className="arr">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="f-instituciones reveal">
          <div className="label">Instituciones donde imparte clase</div>
          <div className="row">
            <div className="logo">Basque Culinary Center</div>
            <div className="logo">Escuela Luis Irizar</div>
            <div className="logo">Aiala — Karlos Arguiñano</div>
            <div className="logo">FP Galega</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonios                                                         */
/* ------------------------------------------------------------------ */
function Testimonios(){
  const items = [
    {
      quote: 'Patxi convierte una clase en una sobremesa larga. Sus alumnos no solo aprenden técnica: aprenden a estar detrás de una barra.',
      name: '[ INSERTAR · Director del BCC ]',
      role: 'Basque Culinary Center',
      placeholder: true
    },
    {
      quote: 'Vino tres días, escuchó a mi equipo y se fue dejándonos una carta nueva y una manera nueva de servirla. La diferencia se notó en la cuenta de explotación al mes.',
      name: '[ INSERTAR · F&B hotel 5★ ]',
      role: 'Director F&B',
      placeholder: true
    },
    {
      quote: 'Lo bueno de Patxi no es lo que sabe — es lo que está dispuesto a contar. Y eso, en este oficio, es rarísimo.',
      name: '[ INSERTAR · Brand Manager destilería premium ]',
      role: 'Brand Manager',
      placeholder: true
    },
  ];
  return (
    <section className="section testimonios" data-screen-label="05 Testimonios">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="num">05 — Testimonios</div>
            <h2 className="section-title" style={{marginTop:18}}>
              Lo que dicen quienes ya<br/><em style={{color:'var(--copper)',fontStyle:'italic'}}>han trabajado</em> con él.
            </h2>
          </div>
        </div>
        <div className="t-grid">
          {items.map((t,i) => (
            <article key={i} className={"t-card reveal" + (t.placeholder ? " placeholder" : "")}>
              <div className="quote-mark">“</div>
              <p className="quote">{t.quote}</p>
              <div className="who">
                <div className="avatar">{t.placeholder ? '?' : t.name.charAt(0)}</div>
                <div>
                  <div className="name">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Media wall                                                          */
/* ------------------------------------------------------------------ */
function MediaWall({ onOpenPrensa }){
  return (
    <section id="prensa" className="section media" data-screen-label="06 Media">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="num">06 — Prensa, libros y TV</div>
            <h2 className="section-title" style={{marginTop:18}}>
              Treinta años<br/>en <em style={{color:'var(--copper)',fontStyle:'italic'}}>la conversación.</em>
            </h2>
          </div>
          <button className="btn btn-dark" onClick={onOpenPrensa}>
            Abrir kit de prensa <span className="arr">→</span>
          </button>
        </div>

        <div className="media-grid reveal">
          <div className="media-tile m-1 dark book">
            <div className="ph" />
            <span className="icon-tape">Libro · 2010</span>
            <div className="content">
              <div className="kicker">Premio Gourmand · París</div>
              <div className="title">Cócteles internacionales y nuevas creaciones</div>
            </div>
          </div>
          <div className="media-tile m-2 dark book2">
            <div className="ph" />
            <span className="icon-tape">Libro · 2011</span>
            <div className="content">
              <div className="kicker">Segunda obra</div>
              <div className="title">Cócteles a domicilio</div>
            </div>
          </div>
          <div className="media-tile m-3 dark netflix">
            <div className="ph" />
            <span className="icon-tape">TV · 2022</span>
            <div className="content">
              <div className="kicker">Cocktail design</div>
              <div className="title">Cócteles para Netflix España</div>
            </div>
          </div>
          <div className="media-tile m-4 dark tv">
            <div className="ph" />
            <span className="icon-tape">EITB</span>
            <div className="content">
              <div className="kicker">Programa propio</div>
              <div className="title">Cócteles a domicilio (EITB)</div>
            </div>
          </div>
          <div className="media-tile m-5 light press">
            <div className="ph" />
            <span className="icon-tape">Prensa</span>
            <div className="content">
              <div className="kicker">El Español · Guía Repsol · CN Traveller</div>
              <div className="title" style={{color:'var(--black)'}}>
                Reseñado en medios nacionales e internacionales
              </div>
            </div>
          </div>
          <div className="media-tile m-6 light product">
            <div className="ph" />
            <span className="icon-tape">Producto</span>
            <div className="content">
              <div className="kicker" style={{color:'var(--burgundy)'}}>Diseño industrial</div>
              <div className="title" style={{color:'var(--black)'}}>Pinzas multifuncionales A.Z.</div>
            </div>
          </div>
          <div className="media-tile m-7 light press">
            <div className="ph" />
            <span className="icon-tape">Local</span>
            <div className="content">
              <div className="kicker">Noticias de Gipuzkoa · Bar Business</div>
              <div className="title" style={{color:'var(--black)'}}>Voz de referencia del sector vasco</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Palmarés (timeline)                                                 */
/* ------------------------------------------------------------------ */
function Palmares(){
  const items = [
    { yr: '2005', what: 'Su hermana Yoli Troitiño gana el Mundial IBA con el "Stick Bloody"', where: 'Turín' },
    { yr: '2009', what: 'Campeón de España de Coctelería', where: 'España' },
    { yr: '2010', what: 'Representa a España en el Mundial IBA', where: 'Singapur' },
    { yr: '2010', what: 'Premio Gourmand al Mejor Libro de Cócteles del Mundo', where: 'París' },
    { yr: '2015', what: 'Mejor Gin Tonic de España', where: 'España' },
    { yr: '2018', what: 'Asume la Dirección de Coctelería del Restaurante Akelarre★★★', where: 'Donostia' },
    { yr: '2024', what: 'Premio FIBAR al Mejor Mentor', where: 'FIBAR' },
  ];
  return (
    <section id="palmares" className="section palmares" data-screen-label="07 Palmarés">
      <div className="wrap">
        <div className="timeline">
          <div className="reveal">
            <div className="num" style={{fontFamily:'var(--mono)',color:'var(--copper)',fontSize:11,letterSpacing:'.1em'}}>07 — Palmarés</div>
            <h2 className="section-title" style={{marginTop:18}}>
              Una línea<br/><em style={{color:'var(--copper)',fontStyle:'italic'}}>continua.</em>
            </h2>
            <p style={{marginTop:24,color:'var(--stone)',fontFamily:'var(--serif)',fontStyle:'italic',fontSize:19,maxWidth:'30ch'}}>
              Veinte años de hitos, contados sin adornos.
            </p>
          </div>
          <div className="timeline-list reveal">
            {items.map((it,i) => (
              <div key={i} className="t-item">
                <div className="yr">{it.yr}</div>
                <div className="what">{it.what}</div>
                <div className="where">{it.where}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Escuela Troitiño                                                    */
/* ------------------------------------------------------------------ */
function Escuela(){
  const ds = [
    { name: 'Santi García Lucchi', place: 'Donostia', init: 'SG' },
    { name: 'Óscar Pardo', place: 'Bilbao', init: 'OP' },
    { name: 'Esther Merino', place: 'Vitoria', init: 'EM' },
    { name: 'Sergio Santamaría', place: 'Donostia', init: 'SS' },
    { name: 'Ibon Zaldua', place: 'Bilbao', init: 'IZ' },
    { name: 'Indara Roman', place: 'San Sebastián', init: 'IR' },
  ];
  return (
    <section className="section escuela" data-screen-label="08 Escuela">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="num" style={{color:'var(--copper)'}}>08 — Escuela Troitiño</div>
          </div>
        </div>
        <h2 className="lead reveal">
          Lo que mejor enseña<br/>no es una receta.<br/><em>Es un oficio.</em>
        </h2>
        <div className="disciples reveal">
          {ds.map((d,i) => (
            <div key={i} className="disciple">
              <div className="face" data-init={d.init} />
              <div className="name">{d.name}</div>
              <div className="place">{d.place}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */
function Faq(){
  const items = [
    { q: '¿Te desplazas fuera del País Vasco o fuera de España?', a: 'Sí. Imparto formaciones por toda la península habitualmente y trabajo internacionalmente cuando el proyecto lo justifica. He impartido en La Habana, Singapur y diversos países europeos.' },
    { q: '¿Cuál es la duración mínima de una formación in-company?', a: 'Una jornada intensiva de 8 horas. Por debajo de eso es difícil aterrizar cambios reales en una barra y en un equipo. Lo habitual son programas de 2 a 5 jornadas, distribuidas según necesidad.' },
    { q: '¿En qué idiomas impartes formación?', a: 'Castellano, inglés y euskera. La documentación entregable se prepara en el idioma que pidas.' },
    { q: '¿Necesitamos disponer de barra equipada o tú aportas el material?', a: 'Para in-company trabajamos sobre tu barra y tu producto — esa es la parte importante. Para masterclasses externas aporto el material técnico necesario; los destilados los suele aportar la marca anfitriona.' },
    { q: '¿Cómo se estructura el presupuesto?', a: 'Honorarios cerrados por jornada para in-company y masterclasses; programa cerrado para másters y cursos en escuelas; tarifa específica para consultoría continuada de carta. Te paso un presupuesto detallado tras la primera llamada.' },
    { q: '¿Con qué antelación hay que reservar?', a: 'Para fechas concretas, idealmente 6–8 semanas. Programas a medida y consultorías de carta requieren 2–3 meses de planificación.' },
    { q: '¿Trabajas con marcas en exclusiva o de forma puntual?', a: 'Las dos cosas. Mantengo embajadurías de larga duración con marcas concretas y, en paralelo, colaboro de forma puntual en lanzamientos y activaciones.' },
    { q: '¿Puedes diseñar la carta de coctelería de nuestro establecimiento?', a: 'Sí. Es uno de los servicios principales: auditoría de la carta actual, diseño de drinks menu nuevo, manual de procedimientos para el equipo y sesiones de implantación. He firmado cartas para hoteles como Estimar Valencia o Zinema7, entre otros.' },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" data-screen-label="09 FAQ">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <div className="num">09 — Preguntas frecuentes</div>
            <h2 className="section-title" style={{marginTop:18}}>
              Lo que sueles<br/>preguntar antes.
            </h2>
          </div>
        </div>
        <div className="faq-list">
          {items.map((it,i) => (
            <div key={i} className={"faq-item reveal" + (open === i ? " open" : "")}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{it.q}</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">{it.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contacto                                                            */
/* ------------------------------------------------------------------ */
function Contacto({ preselect, setPreselect }){
  const [sent, setSent] = useState(false);
  const [type, setType] = useState(preselect || '');
  useEffect(() => { if (preselect) setType(preselect); }, [preselect]);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); }, 4500);
  };

  return (
    <section id="contacto" className="section contacto" data-screen-label="10 Contacto">
      <div className="wrap">
        <div className="contact-grid">
          <div className="reveal">
            <div className="num" style={{fontFamily:'var(--mono)',color:'var(--copper)',fontSize:11,letterSpacing:'.1em'}}>10 — Contacto y reserva</div>
            <h2 style={{marginTop:18}}>
              Cuéntame<br/>qué <em>necesitas.</em>
            </h2>
            <p className="contact-lead">
              Te respondo en menos de 48 horas. <span style={{fontStyle:'normal',color:'var(--copper)',fontFamily:'var(--hand)',fontSize:26,marginLeft:6}}>Eskerrik asko.</span>
            </p>
            <div className="contact-direct">
              <div className="row"><div className="lbl">Email</div><div className="val">hola@patxitroitino.com</div></div>
              <div className="row"><div className="lbl">WhatsApp</div><div className="val">+34 6·· ·· ·· ··</div></div>
              <div className="row"><div className="lbl">LinkedIn</div><div className="val">/in/patxi-troitiño</div></div>
              <div className="row"><div className="lbl">Instagram</div><div className="val">@patxi_troitino</div></div>
              <div className="row"><div className="lbl">Donostia</div><div className="val">País Vasco — España</div></div>
            </div>
          </div>

          <form className="form reveal" onSubmit={submit}>
            <div className="row">
              <div className="form-field">
                <label>Nombre y apellidos *</label>
                <input type="text" required defaultValue="" />
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input type="email" required />
              </div>
            </div>
            <div className="row">
              <div className="form-field">
                <label>Empresa / institución *</label>
                <input type="text" required />
              </div>
              <div className="form-field">
                <label>Tipo de formación *</label>
                <select required value={type} onChange={(e)=>setType(e.target.value)}>
                  <option value="">— Selecciona —</option>
                  <option>Máster/curso en escuela</option>
                  <option>Formación in-company</option>
                  <option>Masterclass o ponencia</option>
                  <option>Consultoría de carta</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="form-field">
                <label>Fechas tentativas</label>
                <input type="text" placeholder="ej. octubre–noviembre 2026" />
              </div>
              <div className="form-field">
                <label>¿Cuántas personas?</label>
                <input type="text" placeholder="ej. 12 bartenders" />
              </div>
            </div>
            <div className="form-field" style={{marginBottom:18}}>
              <label>Mensaje breve</label>
              <textarea placeholder="Cuéntame qué tienes en mente — sin formalidades." />
            </div>
            <div className="form-check">
              <input type="checkbox" required />
              <span>He leído y acepto la <a href="#">política de privacidad</a> y el tratamiento de mis datos para responder a esta solicitud.</span>
            </div>
            <button type="submit" className={"submit" + (sent ? " sent" : "")}>
              {sent
                ? <>Recibido. Te respondo en menos de 48 h. <span>·</span> Eskerrik asko</>
                : <>Enviar solicitud <span className="arr">→</span></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
function Footer(){
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <div className="brand">Patxi Troitiño</div>
            <p className="tagline">
              Director de Coctelería · Restaurante Akelarre★★★ · Profesor del Basque Culinary Center.
            </p>
          </div>
          <div>
            <h4>Navegar</h4>
            <ul>
              <li><a href="#manifiesto">Sobre Patxi</a></li>
              <li><a href="#formaciones">Formaciones</a></li>
              <li><a href="#palmares">Palmarés</a></li>
              <li><a href="#prensa">Prensa</a></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li><a href="#contacto">Reservar formación</a></li>
              <li><a href="#">hola@patxitroitino.com</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Aviso legal</a></li>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <div>© 2026 Patxi Troitiño · Donostia–San Sebastián</div>
          <div>Diseño editorial · ES / EN / EU</div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Drawers — Cocteles & Prensa                                          */
/* ------------------------------------------------------------------ */
function CoctelesDrawer({ open, onClose }){
  const cocteles = [
    { name: 'Donosti Sunrise', ficha: 'Brandy · cítricos · hielo tallado a mano', story: 'Un homenaje a los amaneceres en La Concha. Servido en copa baja con un solo bloque de hielo de cantera.' },
    { name: 'Stick Bloody', ficha: 'Vodka · tomate · especias de la huerta', story: 'La receta con la que su hermana Yoli ganó el Mundial IBA en Turín, 2005. Sigue siendo el clásico de la casa.' },
    { name: 'Diplomisú', ficha: 'Ron Diplomático · café · cacao · finger', story: 'Un cóctel postre. Pensado para cerrar un menú degustación, donde la coctelería hace de cuarta sobremesa.' },
    { name: 'A las 5 en el Astoria', ficha: 'Vermut · té · piel de naranja sanguina', story: 'Cóctel de hora baja, hecho para la sobremesa larga. Inspirado en la liturgia del té británico filtrada por el sol vasco.' },
    { name: 'Mascletá', ficha: 'Gin · pólvora cítrica · espuma de albahaca', story: 'Diseñado para la carta de Estimar Valencia. Estalla en boca: por eso el nombre.' },
    { name: 'Etxeko', ficha: 'Patxaran · cítrico vasco · sidra natural', story: 'Cóctel de casa. Solo se sirve cuando se conoce al cliente.' },
  ];
  return (
    <>
      <div className={"drawer-overlay" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <button className="drawer-close" onClick={onClose}>← Cerrar</button>
        <div className="num" style={{fontFamily:'var(--mono)',fontSize:11,letterSpacing:'.1em',color:'var(--copper)',marginTop:24}}>SUB-PÁGINA · /cocteles</div>
        <h2>Las creaciones</h2>
        <p className="sub">Selección de cócteles firmados a lo largo de tres décadas. Cada uno con una historia detrás.</p>
        <div className="cocteles-grid">
          {cocteles.map((c,i) => (
            <article key={i} className="coctel">
              <div className="img"><div className="name">{c.name}</div></div>
              <div className="body">
                <h3>{c.name}</h3>
                <div className="ficha">{c.ficha}</div>
                <p>{c.story}</p>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </>
  );
}

function PrensaDrawer({ open, onClose }){
  return (
    <>
      <div className={"drawer-overlay" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <button className="drawer-close" onClick={onClose}>← Cerrar</button>
        <div className="num" style={{fontFamily:'var(--mono)',fontSize:11,letterSpacing:'.1em',color:'var(--copper)',marginTop:24}}>SUB-PÁGINA · /prensa</div>
        <h2>Kit de prensa</h2>
        <p className="sub">Para periodistas, organizadores y agencias. Todo lo necesario para una pieza editorial o una ficha técnica de evento.</p>

        <div className="prensa-block">
          <div className="prensa-card">
            <div className="lbl">Bio · 100 palabras</div>
            <h3>Bio corta</h3>
            <p>Versión breve para fichas de ponente, calls to participate y agendas. Edición en ES/EN/EU.</p>
            <div className="download"><span>Descargar .docx</span><span>↓</span></div>
          </div>
          <div className="prensa-card">
            <div className="lbl">Bio · 300 palabras</div>
            <h3>Bio media</h3>
            <p>Versión estándar para programas de congreso, dossieres de patrocinio y notas editoriales.</p>
            <div className="download"><span>Descargar .docx</span><span>↓</span></div>
          </div>
        </div>

        <div className="prensa-block">
          <div className="prensa-card">
            <div className="lbl">Bio · 700 palabras</div>
            <h3>Bio extendida</h3>
            <p>Perfil completo con palmarés, escuela, libros y trayectoria. Para piezas long-form de prensa especializada.</p>
            <div className="download"><span>Descargar .docx</span><span>↓</span></div>
          </div>
          <div className="prensa-card">
            <div className="lbl">Foto · alta resolución</div>
            <h3>Pack fotográfico</h3>
            <p>Retratos editoriales en color y B/N · fotos de acción en barra · cócteles firma. Uso editorial autorizado.</p>
            <div className="download"><span>Descargar .zip · 240 MB</span><span>↓</span></div>
          </div>
        </div>

        <div className="prensa-block">
          <div className="prensa-card">
            <div className="lbl">Dossier completo</div>
            <h3>Dossier 2026 (PDF)</h3>
            <p>Documento maestro con bio, palmarés, formaciones, testimonios, fee orientativo y contacto del equipo.</p>
            <div className="download"><span>Descargar PDF · 12 MB</span><span>↓</span></div>
          </div>
          <div className="prensa-card">
            <div className="lbl">Contacto agente</div>
            <h3>Booking & prensa</h3>
            <p>Para entrevistas, ponencias y consultoría de carta — el equipo responde en menos de 48 h.</p>
            <div className="download"><span>Escribir al equipo</span><span>→</span></div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky CTA mobile                                                    */
/* ------------------------------------------------------------------ */
function StickyCta(){
  return (
    <div className="sticky-cta">
      <span>Patxi Troitiño</span>
      <a href="#contacto"><button>Reservar →</button></a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App + Tweaks                                                         */
/* ------------------------------------------------------------------ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "akelarre",
  "displayFont": "Cormorant Garamond",
  "bodyFont": "Inter",
  "heroVariant": "video",
  "ctaPrimaryLabel": "Reservar una formación",
  "showCursorDot": true,
  "darkSections": true
}/*EDITMODE-END*/;

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();
  const [coctelesOpen, setCoctelesOpen] = useState(false);
  const [prensaOpen, setPrensaOpen] = useState(false);
  const [preselect, setPreselect] = useState('');

  // Apply palette
  useEffect(() => {
    const root = document.documentElement;
    if (t.palette === 'akelarre'){
      root.style.setProperty('--cream','#F5EFE6');
      root.style.setProperty('--cream-2','#EDE5D6');
      root.style.setProperty('--copper','#B08D57');
      root.style.setProperty('--burgundy','#5C1A1B');
      root.style.setProperty('--black','#0A0A0A');
    } else if (t.palette === 'donosti'){
      root.style.setProperty('--cream','#F2F0EA');
      root.style.setProperty('--cream-2','#E6E2D6');
      root.style.setProperty('--copper','#7A6A4F');
      root.style.setProperty('--burgundy','#3B5D3B');
      root.style.setProperty('--black','#1A1814');
    } else if (t.palette === 'midnight'){
      root.style.setProperty('--cream','#0F0E0C');
      root.style.setProperty('--cream-2','#1A1814');
      root.style.setProperty('--copper','#C9A567');
      root.style.setProperty('--burgundy','#7A2A2B');
      root.style.setProperty('--black','#F5EFE6');
      document.body.style.color = '#F5EFE6';
    }
    if (t.palette !== 'midnight'){ document.body.style.color = ''; }
  }, [t.palette]);

  // Apply fonts
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--serif', `"${t.displayFont}", Georgia, serif`);
    root.style.setProperty('--sans', `"${t.bodyFont}", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`);
  }, [t.displayFont, t.bodyFont]);

  const handleSelectFormacion = (type) => {
    setPreselect(type);
    setTimeout(() => {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <>
      {t.showCursorDot && <CursorDot />}
      <TopBar />
      <Hero heroVariant={t.heroVariant} />
      <Trust />
      <Manifiesto />
      <Figures />
      <Formaciones onSelect={handleSelectFormacion} />
      <Testimonios />
      <MediaWall onOpenPrensa={() => setPrensaOpen(true)} />
      <Palmares />
      <Escuela />
      <Faq />
      <Contacto preselect={preselect} setPreselect={setPreselect} />
      <Footer />
      <StickyCta />

      <CoctelesDrawer open={coctelesOpen} onClose={() => setCoctelesOpen(false)} />
      <PrensaDrawer open={prensaOpen} onClose={() => setPrensaOpen(false)} />

      {/* hidden trigger for /cocteles via keyboard 'c' or footer */}
      <button
        onClick={() => setCoctelesOpen(true)}
        style={{
          position:'fixed', left: 16, bottom: 16, zIndex: 50,
          background:'var(--black)', color:'var(--copper)',
          border:'1px solid var(--copper)', padding:'10px 14px',
          fontFamily:'var(--mono)', fontSize: 11, letterSpacing:'.14em',
          textTransform:'uppercase', cursor:'pointer'
        }}
      >Ver cócteles →</button>

      <TweaksPanel title="Tweaks · Patxi Troitiño">
        <TweakSection label="Dirección de arte" />
        <TweakRadio label="Paleta" value={t.palette}
          options={[
            {value:'akelarre', label:'Akelarre'},
            {value:'donosti', label:'Donosti'},
            {value:'midnight', label:'Midnight'},
          ]}
          onChange={(v) => setTweak('palette', v)} />
        <TweakSelect label="Tipografía display" value={t.displayFont}
          options={[
            'Cormorant Garamond', 'Playfair Display', 'GT Super Display',
            'EB Garamond', 'Italiana', 'DM Serif Display'
          ]}
          onChange={(v) => setTweak('displayFont', v)} />
        <TweakSelect label="Tipografía body" value={t.bodyFont}
          options={[
            'Inter', 'General Sans', 'IBM Plex Sans', 'Manrope', 'Söhne'
          ]}
          onChange={(v) => setTweak('bodyFont', v)} />

        <TweakSection label="Hero" />
        <TweakRadio label="Tratamiento de hero" value={t.heroVariant}
          options={[
            {value:'video', label:'Vídeo loop'},
            {value:'photo', label:'Retrato B/N'},
          ]}
          onChange={(v) => setTweak('heroVariant', v)} />
        <TweakText label="CTA primario" value={t.ctaPrimaryLabel}
          onChange={(v) => setTweak('ctaPrimaryLabel', v)} />

        <TweakSection label="Detalles" />
        <TweakToggle label="Cursor follower (desktop)" value={t.showCursorDot}
          onChange={(v) => setTweak('showCursorDot', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
