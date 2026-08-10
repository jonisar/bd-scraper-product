"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import HeaderSearch from "./HeaderSearch";
import {
  MEGA_MENUS,
  TOP_LINKS,
  type MegaMenu,
  type NavBadge,
  type NavLink,
  type SubnavItem,
} from "@/lib/site-nav";

function Badge({ badge }: { badge: NavBadge }) {
  return <span className="site-nav-badge">{badge}</span>;
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`site-nav-chevron${open ? " is-open" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavAnchor({
  link,
  className,
  onNavigate,
}: {
  link: NavLink;
  className?: string;
  onNavigate?: () => void;
}) {
  const isExternal = link.external || link.href.startsWith("http");
  const content = (
    <>
      <span className="site-nav-item-label">
        {link.label}
        {link.badge && <Badge badge={link.badge} />}
      </span>
      {link.desc && <span className="site-nav-item-desc">{link.desc}</span>}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={link.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}

function MegaLinkList({
  links,
  onNavigate,
}: {
  links: NavLink[];
  onNavigate: () => void;
}) {
  return (
    <ul className="site-mega-list">
      {links.map((link) => (
        <li key={link.label}>
          <NavAnchor
            link={link}
            className="site-mega-item"
            onNavigate={onNavigate}
          />
          {link.children && link.children.length > 0 && (
            <div className="site-mega-children">
              {link.children.map((child) =>
                child.external || child.href.startsWith("http") ? (
                  <a
                    key={child.label}
                    href={child.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onNavigate}
                  >
                    {child.label}
                  </a>
                ) : (
                  <Link
                    key={child.label}
                    href={child.href}
                    onClick={onNavigate}
                  >
                    {child.label}
                  </Link>
                )
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function MegaPanel({
  menu,
  onNavigate,
}: {
  menu: MegaMenu;
  onNavigate: () => void;
}) {
  return (
    <div className="site-mega-panel" role="menu" aria-label={menu.label}>
      <div className={`site-mega-grid site-mega-grid-${menu.columns.length}`}>
        {menu.columns.map((col, i) => {
          const sections =
            col.sections ??
            (col.title && col.links
              ? [{ title: col.title, links: col.links }]
              : []);
          return (
            <div
              key={col.title ?? col.sections?.[0]?.title ?? i}
              className={`site-mega-col${col.accent ? " is-accent" : ""}`}
            >
              {sections.map((section) => (
                <div key={section.title} className="site-mega-section">
                  <p className="site-mega-col-title">{section.title}</p>
                  <MegaLinkList links={section.links} onNavigate={onNavigate} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type SiteHeaderProps = {
  /** In-page / contextual second navbar. Omit or pass null to hide (e.g. scraper page). */
  subnav?: SubnavItem[] | null;
};

export default function SiteHeader({ subnav = null }: SiteHeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };

  const openMega = (id: string) => {
    cancelClose();
    setOpenMenu(id);
  };

  useEffect(() => {
    if (!openMenu && !mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setMobileSection(null);
      }
    };

    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!headerRef.current?.contains(t)) {
        // Mega panels are position:fixed — also keep open if clicking inside one
        const panel = (e.target as HTMLElement | null)?.closest?.(".site-mega-wrap");
        if (!panel) setOpenMenu(null);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [openMenu, mobileOpen]);

  useEffect(() => {
    return () => cancelClose();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  };

  const hasSubnav = Boolean(subnav && subnav.length > 0);

  return (
    <header
      ref={headerRef}
      className={`site-header${hasSubnav ? " has-subnav" : ""}${openMenu ? " mega-open" : ""}${mobileOpen ? " mobile-open" : ""}`}
    >
      <div className="site-header-top">
        <div className="site-header-inner">
          <div className="site-header-brand">
            <a
              href="https://brightdata.com/"
              className="site-header-logo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bright Data homepage"
            >
              <span className="brand-mark grid h-8 w-8 place-items-center rounded-lg text-sm font-extrabold text-white shadow-sm shadow-bd-blue/40">
                BD
              </span>
            </a>
            <Link
              href="/products/web-scraper"
              className="site-header-product"
              onClick={closeAll}
            >
              Web Scraper API
            </Link>
          </div>

          <nav className="site-header-nav" aria-label="Primary">
            {MEGA_MENUS.map((menu) => {
              const isOpen = openMenu === menu.id;
              return (
                <div
                  key={menu.id}
                  className={`site-nav-dropdown${isOpen ? " is-open" : ""}`}
                  onMouseEnter={() => openMega(menu.id)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className="site-nav-trigger"
                    aria-expanded={isOpen}
                    aria-controls={`${menuId}-${menu.id}`}
                    onClick={() =>
                      setOpenMenu((cur) => (cur === menu.id ? null : menu.id))
                    }
                  >
                    {menu.label}
                    <Chevron open={isOpen} />
                  </button>
                  {isOpen && (
                    <div
                      id={`${menuId}-${menu.id}`}
                      className="site-mega-wrap"
                      onMouseEnter={() => openMega(menu.id)}
                      onMouseLeave={scheduleClose}
                    >
                      <MegaPanel menu={menu} onNavigate={closeAll} />
                    </div>
                  )}
                </div>
              );
            })}
            {TOP_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="site-nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-header-actions">
            <HeaderSearch />
            <a
              href="https://brightdata.com/cp"
              className="site-header-login"
              target="_blank"
              rel="noreferrer"
            >
              Log in
            </a>
            <a
              href="https://brightdata.com/cp/start"
              className="site-header-cta"
              target="_blank"
              rel="noreferrer"
            >
              Start free
            </a>
            <button
              type="button"
              className="site-header-burger"
              onClick={() => {
                setMobileOpen((v) => !v);
                setOpenMenu(null);
              }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {hasSubnav && (
        <nav className="site-header-sub" aria-label="On this page">
          <div className="site-header-sub-inner">
            {subnav!.map((item) =>
              item.href.startsWith("http") ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="site-sub-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : item.href.startsWith("#") ? (
                <a key={item.label} href={item.href} className="site-sub-link">
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="site-sub-link"
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}

      {mobileOpen && (
        <div className="site-mobile-panel">
          <div className="site-mobile-scroll">
            {MEGA_MENUS.map((menu) => {
              const open = mobileSection === menu.id;
              return (
                <div key={menu.id} className="site-mobile-section">
                  <button
                    type="button"
                    className="site-mobile-section-btn"
                    aria-expanded={open}
                    onClick={() =>
                      setMobileSection((cur) =>
                        cur === menu.id ? null : menu.id
                      )
                    }
                  >
                    {menu.label}
                    <Chevron open={open} />
                  </button>
                  {open && (
                    <div className="site-mobile-section-body">
                      {menu.columns.map((col, i) => {
                        const sections =
                          col.sections ??
                          (col.title && col.links
                            ? [{ title: col.title, links: col.links }]
                            : []);
                        return (
                          <div
                            key={col.title ?? col.sections?.[0]?.title ?? i}
                            className="site-mobile-col"
                          >
                            {sections.map((section) => (
                              <div key={section.title}>
                                <p className="site-mega-col-title">
                                  {section.title}
                                </p>
                                {section.links.map((link) => (
                                  <div key={link.label}>
                                    <NavAnchor
                                      link={link}
                                      className="site-mobile-item"
                                      onNavigate={closeAll}
                                    />
                                    {link.children?.map((child) =>
                                      child.external ||
                                      child.href.startsWith("http") ? (
                                        <a
                                          key={child.label}
                                          href={child.href}
                                          className="site-mobile-child"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={closeAll}
                                        >
                                          {child.label}
                                        </a>
                                      ) : (
                                        <Link
                                          key={child.label}
                                          href={child.href}
                                          className="site-mobile-child"
                                          onClick={closeAll}
                                        >
                                          {child.label}
                                        </Link>
                                      )
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {TOP_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="site-mobile-top-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeAll}
              >
                {link.label}
              </a>
            ))}

            {hasSubnav && (
              <div className="site-mobile-sub">
                <p className="site-mega-col-title">On this page</p>
                {subnav!.map((item) =>
                  item.href.startsWith("#") ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="site-mobile-top-link"
                      onClick={closeAll}
                    >
                      {item.label}
                    </a>
                  ) : item.href.startsWith("http") ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="site-mobile-top-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeAll}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="site-mobile-top-link"
                      onClick={closeAll}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            )}

            <a
              href="https://brightdata.com/cp"
              className="site-mobile-top-link"
              target="_blank"
              rel="noreferrer"
              onClick={closeAll}
            >
              Log in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
