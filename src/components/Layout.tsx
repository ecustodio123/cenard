import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { navigation, pages, pathFor, site } from "../data/site";

export function Layout() {
  const [menuLocation, setMenuLocation] = useState<string | null>(null);
  const location = useLocation();
  const open = menuLocation === location.key;
  const previousPath = useRef(location.pathname);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      document
        .querySelector<HTMLElement>("main h1")
        ?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
    document
      .querySelectorAll("header details[open]")
      .forEach((el) => el.removeAttribute("open"));
    const page = pages.find(
      (p) =>
        pathFor(p.slug) ===
          (location.pathname.endsWith("/")
            ? location.pathname
            : location.pathname + "/") ||
        (location.pathname === "/" && !p.slug),
    );
    document.title = page
      ? `${page.title === "Inicio" ? site.name : page.title} | CENARD`
      : "Página no encontrada | CENARD";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        page?.description ?? "Página no encontrada en CENARD.",
      );
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuLocation(null);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const els = [
          menuButton.current,
          ...Array.from(
            panel.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        const first = els[0],
          last = els.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) setMenuLocation(null);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const closeDetails = (event: Event) => {
      if (event.type === "keydown" && (event as KeyboardEvent).key !== "Escape")
        return;
      if (
        event.type === "pointerdown" &&
        (event.target as Element)?.closest("header details")
      )
        return;
      document
        .querySelectorAll("header details[open]")
        .forEach((el) => el.removeAttribute("open"));
    };
    document.addEventListener("pointerdown", closeDetails);
    document.addEventListener("keydown", closeDetails);
    return () => {
      document.removeEventListener("pointerdown", closeDetails);
      document.removeEventListener("keydown", closeDetails);
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>Arbitraje y JPRD</span>
          <div>
            <span>
              <Clock3 size={13} aria-hidden="true" />
              {site.hours}
            </span>
            <a href={site.phoneHref}>
              <Phone size={13} aria-hidden="true" />
              {site.phone}
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to={pathFor()} aria-label="CENARD, inicio">
            <img
              src="/images/logo.png"
              width="1600"
              height="624"
              alt="CNR CENARD Arbitraje"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navigation.map((group) => (
              <details
                name="main-navigation"
                className="nav-dropdown"
                key={group.label}
              >
                <summary
                  className={
                    group.slugs.some((s) => location.pathname === pathFor(s))
                      ? "is-active"
                      : ""
                  }
                >
                  {group.label}
                  <ChevronDown size={13} aria-hidden="true" />
                </summary>
                <div className="dropdown-content">
                  {group.slugs.map((slug) => (
                    <NavLink key={slug} to={pathFor(slug)}>
                      {pages.find((p) => p.slug === slug)?.title}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </NavLink>
                  ))}
                </div>
              </details>
            ))}
            <NavLink to={pathFor("atalaya-de-integridad")}>Integridad</NavLink>
            <NavLink className="nav-contact" to={pathFor("contacto")}>
              Contáctanos
              <ArrowUpRight size={16} aria-hidden="true" />
            </NavLink>
          </nav>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuLocation(open ? null : location.key)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-menu"
            className="mobile-nav"
            ref={panel}
            aria-label="Navegación móvil"
          >
            <div className="container">
              {navigation.map((group) => (
                <div className="mobile-group" key={group.label}>
                  <span>{group.label}</span>
                  {group.slugs.map((slug) => (
                    <NavLink key={slug} to={pathFor(slug)}>
                      {pages.find((p) => p.slug === slug)?.title}
                    </NavLink>
                  ))}
                </div>
              ))}
              <NavLink to={pathFor("atalaya-de-integridad")}>
                Atalaya de Integridad
              </NavLink>
              <NavLink to={pathFor("contacto")}>Contacto</NavLink>
            </div>
          </nav>
        )}
      </header>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <section className="contact-band contact-band-compact">
        <div className="container">
          <h2>Conversemos sobre el siguiente paso.</h2>
          <Link className="button button-light" to={pathFor("contacto")}>
            Contactar a CENARD<ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <footer className="site-footer footer-compact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to={pathFor()}>
                <img
                  src="/images/logo-white.png"
                  width="1500"
                  height="517"
                  alt="CNR CENARD Arbitraje"
                  loading="lazy"
                />
              </Link>
              <p>
                Centro Nacional para la
                <br />
                Resolución de Disputas
              </p>
              <nav className="footer-links" aria-label="Enlaces del pie de página">
                <Link to={pathFor("conocenos")}>Institución</Link>
                <Link to="/web/#servicios">Servicios</Link>
                <Link to={pathFor("documentos")}>Documentos</Link>
                <Link to={pathFor("atalaya-de-integridad")}>Integridad</Link>
              </nav>
            </div>
            <div>
              <h3>Canales de atención</h3>
              {site.emails.map((email) => (
                <a
                  className="footer-icon-link"
                  href={`mailto:${email}`}
                  key={email}
                >
                  <Mail size={16} aria-hidden="true" />
                  {email}
                </a>
              ))}
              <div className="footer-phone-row">
                <a className="footer-icon-link" href={site.phoneHref}>
                  <Phone size={16} aria-hidden="true" />{site.phone}
                </a>
                <a href={site.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp<ArrowUpRight size={13} aria-hidden="true" />
                  <span className="sr-only"> (abre en otra pestaña)</span>
                </a>
              </div>
            </div>
            <div>
              <h3>Visítanos</h3>
              <p className="footer-icon-link">
                <MapPin size={17} aria-hidden="true" />
                {site.address}
              </p>
              <p className="footer-icon-link">
                <Clock3 size={17} aria-hidden="true" />
                {site.hours}
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 CENARD Arbitraje. Todos los derechos reservados.</span>
            <a href="https://cenardarbitraje.com/web/wp-content/uploads/2025/05/Formato-de-Reclamaciones-CENARD.docx">Libro de Reclamaciones (DOCX)</a>
          </div>
          <div className="preview-label">
            <span />
            Vista previa · Contenido pendiente de validación institucional.
          </div>
        </div>
      </footer>
    </>
  );
}
