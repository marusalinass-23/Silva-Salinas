import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Gem, Baby, ShoppingCart, PartyPopper, Home, HeartHandshake, Sparkles,
  Plus, Trash2, ClipboardPaste, ChevronDown, X, Wallet, CreditCard,
  Banknote, Landmark, TrendingUp, TrendingDown, Minus, Lock, LogOut, Settings, Eye, EyeOff, Pencil, Briefcase, Coffee, HeartPulse,
  Car, ShoppingBag, Phone, CalendarClock, CheckCircle2, Circle, ListTodo, Wallet2, CalendarDays
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";

/* ---------------------------------------------------------------
   PALETA — limpia, ordenada, con color
--------------------------------------------------------------- */
const BG = "#FAFAF8";
const LINE = "#ECE7DE";
const INK = "#2B2620";
const INK_SOFT = "#8A8073";

const DEFAULT_CATEGORIES = [
  { name: "Personales", color: "#5EC2A0", icon: "Sparkles" },
  { name: "Niños", color: "#5B8FCB", icon: "Baby" },
  { name: "Alimentos y casa", color: "#E4B363", icon: "ShoppingCart" },
  { name: "Celebraciones", color: "#D68FA3", icon: "PartyPopper" },
  { name: "Mantenimiento casa", color: "#8FA381", icon: "Home" },
  { name: "Servicio doméstico", color: "#6B4F6E", icon: "HeartHandshake" },
  { name: "Oficina", color: "#54504A", icon: "Briefcase" },
  { name: "Snacks & Café", color: "#E08A3E", icon: "Coffee" },
  { name: "Doctores y Medicamentos", color: "#D14343", icon: "HeartPulse" },
  { name: "Otros", color: "#A9927D", icon: "Gem" },
];

const PAYMENT_METHODS = [
  { name: "Efectivo", color: "#8FA381", icon: "Banknote" },
  { name: "American Express Personal", color: "#2B2620", icon: "CreditCard" },
  { name: "American Express Business", color: "#E3B23C", icon: "CreditCard" },
  { name: "Transferencia BBVA", color: "#7EC8E3", icon: "Landmark" },
  { name: "Transfer Maru", color: "#8B5E3C", icon: "Landmark" },
  { name: "Tarjeta de débito BBVA Maru", color: "#3A6EA5", icon: "CreditCard" },
  { name: "Tarjeta BofA", color: "#D64545", icon: "CreditCard" },
  { name: "Tarjeta crédito BBVA", color: "#C9A227", icon: "CreditCard" },
];

const RICARDO_PAYMENT_METHODS = [
  { name: "R- Efectivo", color: "#8FA381", icon: "Banknote" },
  { name: "R- MASI", color: "#6B5B67", icon: "Landmark" },
  { name: "R- Amex platinum", color: "#9CA3AF", icon: "CreditCard" },
  { name: "R- Amex metal", color: "#3F3B36", icon: "CreditCard" },
  { name: "R- Amex crédito", color: "#2B2620", icon: "CreditCard" },
  { name: "R- Amex oro", color: "#C9A227", icon: "CreditCard" },
  { name: "R- Banamex", color: "#C94F4F", icon: "CreditCard" },
  { name: "R- Transfer BBVA", color: "#7EC8E3", icon: "Landmark" },
  { name: "R- BBVA", color: "#3A6EA5", icon: "CreditCard" },
  { name: "R- Bank of America", color: "#8B2E2E", icon: "CreditCard" },
  { name: "R- Palacio", color: "#5B3A5C", icon: "CreditCard" },
];

function paymentMethodsForRole(role) {
  return role === "Ricardo" ? RICARDO_PAYMENT_METHODS : PAYMENT_METHODS;
}

const PENDIENTE_CATEGORIAS = [
  { name: "Vueltas", color: "#5EC2A0", icon: "Car" },
  { name: "Compras", color: "#E4B363", icon: "ShoppingBag" },
  { name: "Llamadas/Mandar mensaje", color: "#7EC8E3", icon: "Phone" },
  { name: "Agendar cita", color: "#D68FA3", icon: "CalendarClock" },
  { name: "Oficina", color: "#54504A", icon: "Briefcase" },
  { name: "Casa Maru", color: "#8FA381", icon: "Home" },
  { name: "Personal", color: "#E8735C", icon: "Sparkles" },
];

const ICONS = { Sparkles, Baby, ShoppingCart, PartyPopper, Home, HeartHandshake, Gem, Banknote, CreditCard, Landmark, Briefcase, Coffee, HeartPulse, Car, ShoppingBag, Phone, CalendarClock };
const MESES_ES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

/* ---------------------------------------------------------------
   AGENDA — mismo formato que "Agenda María Ortega", con 7 calendarios
--------------------------------------------------------------- */
const AGENDA_CATS = [
  { key: "Leonel", color: "#5B84A6" },
  { key: "Diego", color: "#C36E8B" },
  { key: "Eugenio", color: "#7A8F5A" },
  { key: "Familia", color: "#B5713C" },
  { key: "Maru", color: "#9B7EBD" },
  { key: "Ricardo", color: "#4E9B8F" },
];
const AGENDA_TODOS_COLOR = "#2B2A33";
const AGENDA_PALETTE = ["#AFC9E8","#C9B6E4","#D7DFA0","#8FD3D8","#F4C95D","#E893B3","#F2A65A","#9AD1B5","#E27D60","#B5C99A","#A79BC6","#7EA8BE"];
const AGENDA_MONTHS_FULL = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];
const AGENDA_MONTHS_SHORT = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const AGENDA_DOW = ["L","M","M","J","V","S","D"];

function agendaTabsFor(role) {
  const keys = AGENDA_CATS.map(c => c.key).concat(["Todos"]);
  if (role === "Maru") {
    return ["Maru", ...keys.filter(k => k !== "Maru")];
  }
  if (role === "Ricardo") {
    const rest = keys.filter(k => k !== "Ricardo" && k !== "Maru");
    return ["Ricardo", ...rest, "Maru"];
  }
  return keys;
}
function agendaColorFor(key) {
  if (key === "Todos") return AGENDA_TODOS_COLOR;
  const c = AGENDA_CATS.find(c => c.key === key);
  return c ? c.color : AGENDA_TODOS_COLOR;
}
function agendaFmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function agendaParseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function agendaDaysBetween(a, b) {
  return Math.round((agendaParseDate(b) - agendaParseDate(a)) / 86400000);
}
function agendaAddDays(s, n) {
  const d = agendaParseDate(s);
  d.setDate(d.getDate() + n);
  return agendaFmt(d);
}
function agendaShortDate(s) {
  const d = agendaParseDate(s);
  return `${d.getDate()} ${AGENDA_MONTHS_SHORT[d.getMonth()]}`;
}
const DEFAULT_PINS = { Maru: "1010", Fernanda: "2222", Ricardo: "3030" };
const SCOPE_LABELS = { propio: "Mis gastos", fermaru: "Fer + Maru", todos: "Los 3" };
function scopesFor(role) {
  if (role === "Maru") return ["fermaru", "todos"];
  if (role === "Ricardo") return ["propio", "fermaru", "todos"];
  return ["propio"];
}
function defaultScopeFor(role) {
  if (role === "Ricardo") return "propio";
  if (role === "Maru") return "fermaru";
  return "propio";
}

function todayMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return `${MESES_ES[m - 1]} ${y}`;
}
function shortMonthLabel(key) {
  const [, m] = key.split("-").map(Number);
  return MESES_ES[m - 1];
}
function fmtMoney(n) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n || 0);
}
function uid() {
  return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
}
function prevMonthKey(key) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function last6Months() {
  const out = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 5; i >= 0; i--) {
    const dd = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${LINE}`, padding: "22px 20px", ...style }}>
      {children}
    </div>
  );
}
function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 15, color: INK, letterSpacing: 0.2 }}>
        {children}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function CatRow({ cat, amount, pct, active, onClick, canManage, isEditing, editValue, onStartEdit, onChangeEdit, onSaveEdit, onCancelEdit, confirming, onAskDelete, onConfirmDelete, onCancelDelete }) {
  const Icon = ICONS[cat.icon] || Gem;
  const dimmed = active !== null && active !== cat.name && !isEditing;

  if (isEditing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: `${cat.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={15} color={cat.color} strokeWidth={2.2} />
        </div>
        <input autoFocus value={editValue} onChange={e => onChangeEdit(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") onSaveEdit(); if (e.key === "Escape") onCancelEdit(); }}
          style={{ ...inputStyle, flex: 1, padding: "6px 9px", fontSize: 13 }} />
        <button onClick={onSaveEdit} style={{ border: "none", background: "#8FA381", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>guardar</button>
        <button onClick={onCancelEdit} style={{ border: "none", background: "transparent", color: INK_SOFT, fontSize: 12, cursor: "pointer" }}>cancelar</button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: `${cat.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={15} color={cat.color} strokeWidth={2.2} />
        </div>
        <div style={{ flex: 1, fontSize: 12.5, color: INK }}>¿Borrar "{cat.name}"? sus gastos se pasarán a otro rubro.</div>
        <button onClick={onConfirmDelete} style={{ border: "none", background: "#C4593F", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>sí, borrar</button>
        <button onClick={onCancelDelete} style={{ border: "none", background: "transparent", color: INK_SOFT, fontSize: 12, cursor: "pointer" }}>cancelar</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: dimmed ? 0.35 : 1, transition: "opacity 0.15s", padding: "6px 0" }}>
      <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1, minWidth: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: `${cat.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={15} color={cat.color} strokeWidth={2.2} />
        </div>
        <div style={{ width: 140, flexShrink: 0, fontSize: 13, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cat.name}</div>
        <div style={{ flex: 1, background: "#F3EFE7", borderRadius: 5, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${Math.max(pct * 100, amount > 0 ? 2 : 0)}%`, height: "100%", background: cat.color, borderRadius: 5, transition: "width 0.3s" }} />
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12.5, fontWeight: 700, color: INK, width: 84, textAlign: "right", flexShrink: 0 }}>{fmtMoney(amount)}</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: INK_SOFT, width: 34, textAlign: "right", flexShrink: 0 }}>{(pct * 100).toFixed(0)}%</div>
      </div>
      {canManage && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button onClick={onStartEdit} style={{ border: "none", background: "transparent", cursor: "pointer", color: INK_SOFT, padding: 4, display: "flex" }} title="editar">
            <Pencil size={13} />
          </button>
          <button onClick={onAskDelete} style={{ border: "none", background: "transparent", cursor: "pointer", color: INK_SOFT, padding: 4, display: "flex" }} title="borrar">
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

/* --------------------------- Login screen --------------------------- */
function Login({ pins, onSuccess }) {
  const [role, setRole] = useState(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [showPin, setShowPin] = useState(false);

  const submit = () => {
    if (String(pins[role]).trim() === pin.trim() && pin.trim() !== "") onSuccess(role);
    else { setErr("PIN incorrecto"); setPin(""); }
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        html, body { margin: 0; padding: 0; background: ${BG}; min-height: 100%; }
        #root, #app { min-height: 100%; background: ${BG}; }
      `}</style>
      <Card style={{ width: 320, textAlign: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#2B26201A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Lock size={20} color={INK} />
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Gastos</div>
        <div style={{ fontSize: 12, color: INK_SOFT, marginBottom: 18 }}>casa Silva Salinas</div>

        {!role ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => setRole("Maru")} style={roleBtnStyle}>Maru</button>
            <button onClick={() => setRole("Fernanda")} style={roleBtnStyle}>Fernanda</button>
            <button onClick={() => setRole("Ricardo")} style={roleBtnStyle}>Ricardo</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Hola, {role}</div>
            <div style={{ position: "relative" }}>
              <input autoFocus type={showPin ? "text" : "password"} inputMode="numeric" maxLength={6} value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }}
                onKeyDown={e => { if (e.key === "Enter") submit(); }}
                placeholder="PIN" style={{ ...inputStyle, width: "100%", boxSizing: "border-box", textAlign: "center", letterSpacing: 4, fontSize: 18, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPin(s => !s)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: INK_SOFT, display: "flex" }}>
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {err && <div style={{ fontSize: 12, color: "#C4593F" }}>{err}</div>}
            <div style={{ fontSize: 10.5, color: "#B7AC98" }}>
              ¿Primera vez? El PIN inicial de {role} es {DEFAULT_PINS[role]} (cámbialo entrando como Maru → PINs).
            </div>
            <button type="button" onClick={submit} style={{ border: "none", background: INK, color: "#fff", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Entrar</button>
            <button type="button" onClick={() => { setRole(null); setPin(""); setErr(""); }} style={{ border: "none", background: "transparent", color: INK_SOFT, fontSize: 12, cursor: "pointer" }}>volver</button>
          </div>
        )}
      </Card>
    </div>
  );
}

const roleBtnStyle = {
  border: `1.5px solid ${LINE}`, background: "#fff", color: INK, borderRadius: 10, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer",
};

/* --------------------------- Agenda tab --------------------------- */
function AgendaTab({ role }) {
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeCal, setActiveCal] = useState(role);
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => agendaFmt(today), [today]);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", categories: [], start: todayStr, end: todayStr, color: AGENDA_PALETTE[0] });
  const [dragOverDate, setDragOverDate] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const dragIdRef = React.useRef(null);

  const tabOrder = useMemo(() => agendaTabsFor(role), [role]);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("agenda-eventos", true);
        let evs = r ? JSON.parse(r.value) : [];
        evs = evs.map(ev => (!ev.categories && ev.category) ? { ...ev, categories: [ev.category], category: undefined } : ev);
        setEvents(evs);
      } catch (e) { setEvents([]); }
      setReady(true);
    })();
  }, []);

  const persistEvents = useCallback(async (list) => {
    try {
      await window.storage.set("agenda-eventos", JSON.stringify(list), true);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    } catch (e) {}
  }, []);

  const eventsForDay = useCallback((dateStr, catFilter) => {
    return events.filter(ev => {
      if (catFilter && catFilter !== "Todos" && !ev.categories.includes(catFilter)) return false;
      return dateStr >= ev.start && dateStr <= ev.end;
    });
  }, [events]);

  const shiftMonths = (n) => {
    let m = viewMonth + n, y = viewYear;
    while (m < 0) { m += 12; y--; }
    while (m > 11) { m -= 12; y++; }
    setViewMonth(m); setViewYear(y);
  };

  const rangeLabel = useMemo(() => {
    let m = viewMonth, y = viewYear;
    const names = [];
    for (let i = 0; i < 3; i++) { names.push(`${AGENDA_MONTHS_SHORT[m].toUpperCase()} ${y}`); m++; if (m > 11) { m = 0; y++; } }
    return `${names[0]} — ${names[2]}`;
  }, [viewYear, viewMonth]);

  const monthsToShow = useMemo(() => {
    let m = viewMonth, y = viewYear;
    const out = [];
    for (let i = 0; i < 3; i++) { out.push({ year: y, month: m }); m++; if (m > 11) { m = 0; y++; } }
    return out;
  }, [viewYear, viewMonth]);

  function buildWeeks(year, month) {
    const firstOfMonth = new Date(year, month, 1);
    let startOffset = firstOfMonth.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let counter = 1 - startOffset;
    for (let week = 0; week < 6; week++) {
      const row = [];
      let rowHasDay = false;
      for (let dow = 0; dow < 7; dow++) {
        if (counter < 1 || counter > daysInMonth) row.push(null);
        else { row.push(counter); rowHasDay = true; }
        counter++;
      }
      if (rowHasDay) weeks.push(row);
    }
    return weeks;
  }

  const nextUnusedColor = () => {
    const used = new Set(events.map(e => e.color));
    return AGENDA_PALETTE.find(c => !used.has(c)) || AGENDA_PALETTE[Math.floor(Math.random() * AGENDA_PALETTE.length)];
  };

  const openAddModal = (dateStr) => {
    setEditingId(null);
    setForm({
      title: "", categories: activeCal !== "Todos" ? [activeCal] : [],
      start: dateStr || todayStr, end: dateStr || todayStr, color: nextUnusedColor(),
    });
    setModalOpen(true);
  };
  const openEditModal = (ev) => {
    setEditingId(ev.id);
    setForm({ title: ev.title, categories: ev.categories, start: ev.start, end: ev.end, color: ev.color });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const toggleFormCat = (key) => {
    setForm(f => ({ ...f, categories: f.categories.includes(key) ? f.categories.filter(c => c !== key) : [...f.categories, key] }));
  };

  const saveEvent = () => {
    const title = form.title.trim();
    if (!title) return;
    if (form.categories.length === 0) return;
    let start = form.start || todayStr;
    let end = form.end || start;
    if (end < start) { const t = start; start = end; end = t; }
    let next;
    if (editingId) {
      next = events.map(ev => ev.id === editingId ? { ...ev, title, categories: form.categories, start, end, color: form.color } : ev);
    } else {
      next = [...events, { id: uid(), title, categories: form.categories, start, end, color: form.color }];
    }
    setEvents(next);
    persistEvents(next);
    closeModal();
  };

  const deleteEvent = () => {
    if (!editingId) return;
    const next = events.filter(ev => ev.id !== editingId);
    setEvents(next);
    persistEvents(next);
    closeModal();
  };

  const handleDrop = (dateStr) => {
    const id = dragIdRef.current;
    dragIdRef.current = null;
    setDragOverDate(null);
    if (!id) return;
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const duration = agendaDaysBetween(ev.start, ev.end);
    const newStart = dateStr;
    const newEnd = agendaAddDays(dateStr, duration);
    const next = events.map(e => e.id === id ? { ...e, start: newStart, end: newEnd } : e);
    setEvents(next);
    persistEvents(next);
  };

  const visibleLegend = useMemo(() => {
    return events
      .filter(ev => activeCal === "Todos" || ev.categories.includes(activeCal))
      .slice()
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [events, activeCal]);

  const subtitle = activeCal === "Todos"
    ? AGENDA_CATS.map(c => c.key).join(" · ") + " (vista combinada)"
    : activeCal;

  if (!ready) {
    return <div style={{ textAlign: "center", padding: "40px 0", color: INK_SOFT, fontSize: 13 }}>Cargando agenda…</div>;
  }

  return (
    <div className="ag-root">
      <style>{`
        .ag-root{ font-family:'Inter', sans-serif; }
        .ag-header{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px;}
        .ag-title{font-family:'Manrope', sans-serif;font-weight:800;font-size:28px;color:${INK};letter-spacing:-0.5px;margin:0 0 4px;}
        .ag-subtitle{margin:0;color:${INK_SOFT};font-size:12px;}
        .ag-addbtn{background:${INK};color:#fff;border:none;padding:11px 18px;border-radius:999px;font-weight:700;font-size:13.5px;cursor:pointer;box-shadow:0 8px 20px -12px rgba(43,42,51,0.5);white-space:nowrap;}
        .ag-tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
        .ag-tab{position:relative;padding:9px 16px 10px;border:none;cursor:pointer;font-weight:700;font-size:13.5px;color:${INK_SOFT};background:#F3EFE7;border-radius:9px 9px 3px 3px;transition:transform .12s ease, box-shadow .12s ease, color .12s ease;}
        .ag-tab.active{transform:translateY(-2px);box-shadow:0 2px 0 rgba(43,42,51,0.06), 0 8px 20px -12px rgba(43,42,51,0.25);color:#fff;}
        .ag-tab:hover:not(.active){color:${INK};}
        .ag-monthnav{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px;flex-wrap:wrap;}
        .ag-navbtns{display:flex;gap:8px;align-items:center;}
        .ag-navbtns button{border:1px solid ${LINE};background:#fff;width:32px;height:32px;border-radius:50%;font-size:15px;cursor:pointer;color:${INK};}
        .ag-navbtns button:hover{background:#F3EFE7;}
        .ag-rangelabel{font-family:'Manrope', sans-serif;font-weight:700;font-size:15.5px;color:${INK};}
        .ag-todaybtn{border:1px solid ${LINE};background:#fff;border-radius:999px;padding:6px 13px;font-size:12px;font-weight:700;cursor:pointer;color:${INK_SOFT};}
        .ag-todaybtn:hover{color:${INK};background:#F3EFE7;}
        .ag-months{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        @media (max-width:900px){ .ag-months{grid-template-columns:1fr;} }
        .ag-month-card{background:#fff;border:1px solid ${LINE};border-radius:14px;padding:14px 12px 16px;}
        .ag-month-name{font-family:'Manrope', sans-serif;font-weight:700;font-size:14px;text-align:center;margin:2px 0 10px;text-transform:uppercase;letter-spacing:0.04em;color:${INK};}
        .ag-cal{width:100%;border-collapse:collapse;table-layout:fixed;}
        .ag-cal th{font-size:10px;color:${INK_SOFT};font-weight:700;padding-bottom:6px;text-transform:uppercase;}
        .ag-cal td{height:34px;text-align:center;vertical-align:middle;font-size:12px;border-radius:6px;position:relative;padding:0;}
        .ag-daycell{cursor:pointer;}
        .ag-daycell:hover{filter:brightness(0.96);}
        .ag-empty{cursor:default;}
        .ag-today .ag-num{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;border:1.5px solid ${INK};font-weight:700;}
        .ag-num{position:relative;z-index:2;}
        .ag-halfsplit{position:absolute;inset:0;display:flex;border-radius:6px;overflow:hidden;}
        .ag-halfsplit > div{flex:1;}
        .ag-drop-hover{outline:2px dashed ${INK};outline-offset:-2px;}
        .ag-legend{margin-top:18px;display:flex;flex-wrap:wrap;gap:8px;}
        .ag-legend-item{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid ${LINE};padding:6px 12px 6px 8px;border-radius:999px;font-size:12.5px;cursor:pointer;}
        .ag-legend-item:hover{border-color:${INK};}
        .ag-swatch{width:12px;height:12px;border-radius:4px;flex:none;}
        .ag-legend-empty{color:${INK_SOFT};font-size:13px;font-style:italic;padding:8px 2px;}
        .ag-overlay{position:fixed;inset:0;background:rgba(43,42,51,0.45);display:flex;align-items:center;justify-content:center;z-index:50;padding:16px;}
        .ag-modal{background:${BG};border-radius:16px;max-width:420px;width:100%;padding:22px 20px 18px;box-shadow:0 20px 50px -10px rgba(0,0,0,0.35);position:relative;}
        .ag-modal h2{font-family:'Manrope', sans-serif;font-size:18px;margin:0 0 14px;font-weight:800;color:${INK};}
        .ag-field{margin-bottom:12px;}
        .ag-field label{display:block;font-size:11px;font-weight:700;color:${INK_SOFT};margin-bottom:5px;text-transform:uppercase;letter-spacing:0.03em;}
        .ag-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .ag-catchecks{display:flex;flex-wrap:wrap;gap:7px;}
        .ag-catcheck{display:flex;align-items:center;gap:6px;border:1px solid ${LINE};border-radius:999px;padding:6px 12px;font-size:12.5px;font-weight:600;cursor:pointer;background:#fff;}
        .ag-catcheck.checked{border-color:${INK};background:#F3EFE7;}
        .ag-swatches{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px;}
        .ag-swatch-btn{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;}
        .ag-swatch-btn.selected{border-color:${INK};transform:scale(1.12);}
        .ag-modal-actions{display:flex;justify-content:flex-end;align-items:center;margin-top:16px;gap:8px;}
        .ag-close-x{position:absolute;top:12px;right:14px;background:none;border:none;font-size:18px;cursor:pointer;color:${INK_SOFT};}
        .ag-saved{position:fixed;bottom:16px;right:16px;background:${INK};color:${BG};padding:8px 16px;border-radius:999px;font-size:12px;opacity:0;transition:opacity .3s ease;pointer-events:none;z-index:60;}
        .ag-saved.show{opacity:0.92;}
      `}</style>

      <div className="ag-header">
        <div>
          <div className="ag-title">Agenda Silva Salinas</div>
          <div className="ag-subtitle">{subtitle}</div>
        </div>
        <button className="ag-addbtn" onClick={() => openAddModal(null)}>+ Agregar actividad</button>
      </div>

      <div className="ag-tabs">
        {tabOrder.map(key => (
          <button key={key} onClick={() => setActiveCal(key)}
            className={`ag-tab${activeCal === key ? " active" : ""}`}
            style={activeCal === key ? { background: agendaColorFor(key) } : undefined}>
            {key}
          </button>
        ))}
      </div>

      <div className="ag-monthnav">
        <div className="ag-navbtns">
          <button onClick={() => shiftMonths(-3)}>‹</button>
          <span className="ag-rangelabel">{rangeLabel}</span>
          <button onClick={() => shiftMonths(3)}>›</button>
        </div>
        <button className="ag-todaybtn" onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}>Hoy</button>
      </div>

      <div className="ag-months">
        {monthsToShow.map(({ year, month }) => {
          const weeks = buildWeeks(year, month);
          return (
            <div className="ag-month-card" key={`${year}-${month}`}>
              <div className="ag-month-name">{AGENDA_MONTHS_FULL[month]} {year}</div>
              <table className="ag-cal">
                <thead><tr>{AGENDA_DOW.map((d, i) => <th key={i}>{d}</th>)}</tr></thead>
                <tbody>
                  {weeks.map((week, wi) => (
                    <tr key={wi}>
                      {week.map((dayNum, di) => {
                        if (dayNum === null) return <td key={di} className="ag-empty" />;
                        const dateStr = agendaFmt(new Date(year, month, dayNum));
                        const dayEvents = eventsForDay(dateStr, activeCal);
                        const isToday = dateStr === todayStr;
                        const startEvent = dayEvents.find(ev => ev.start === dateStr);
                        return (
                          <td key={di}
                            className={`ag-daycell${isToday ? " ag-today" : ""}${dragOverDate === dateStr ? " ag-drop-hover" : ""}`}
                            style={dayEvents.length === 1 ? { background: dayEvents[0].color } : undefined}
                            draggable={!!startEvent}
                            onDragStart={() => { if (startEvent) dragIdRef.current = startEvent.id; }}
                            onDragOver={(e) => { if (dragIdRef.current) { e.preventDefault(); setDragOverDate(dateStr); } }}
                            onDragLeave={() => setDragOverDate(d => d === dateStr ? null : d)}
                            onDrop={(e) => { e.preventDefault(); handleDrop(dateStr); }}
                            onClick={() => { if (dayEvents.length) openEditModal(dayEvents[dayEvents.length - 1]); else openAddModal(dateStr); }}
                          >
                            {dayEvents.length > 1 && (
                              <div className="ag-halfsplit">
                                {dayEvents.slice(0, 3).map((ev, i2) => <div key={i2} style={{ background: ev.color }} />)}
                              </div>
                            )}
                            <span className="ag-num">{dayNum}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <div className="ag-legend">
        {visibleLegend.length === 0 ? (
          <div className="ag-legend-empty">Aún no hay actividades en esta vista. Da clic en un día o en "+ Agregar actividad".</div>
        ) : visibleLegend.map(ev => {
          const range = ev.start === ev.end ? agendaShortDate(ev.start) : `${agendaShortDate(ev.start)} – ${agendaShortDate(ev.end)}`;
          const catNames = ev.categories.join(", ");
          return (
            <div key={ev.id} className="ag-legend-item" onClick={() => openEditModal(ev)}>
              <span className="ag-swatch" style={{ background: ev.color }} />
              <span>{ev.title}{activeCal === "Todos" ? ` · ${catNames}` : ""} ({range})</span>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="ag-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ag-modal">
            <button className="ag-close-x" onClick={closeModal}>×</button>
            <h2>{editingId ? "Editar actividad" : "Nueva actividad"}</h2>
            <div className="ag-field">
              <label>Título</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ej. Campamento Misiones" style={inputStyle} autoFocus />
            </div>
            <div className="ag-field">
              <label>Calendarios</label>
              <div className="ag-catchecks">
                {AGENDA_CATS.map(c => (
                  <label key={c.key} className={`ag-catcheck${form.categories.includes(c.key) ? " checked" : ""}`}>
                    <input type="checkbox" checked={form.categories.includes(c.key)} onChange={() => toggleFormCat(c.key)} style={{ display: "none" }} />
                    {c.key}
                  </label>
                ))}
              </div>
            </div>
            <div className="ag-row2">
              <div className="ag-field">
                <label>Inicio</label>
                <input type="date" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} style={inputStyle} />
              </div>
              <div className="ag-field">
                <label>Fin</label>
                <input type="date" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div className="ag-field">
              <label>Color</label>
              <div className="ag-swatches">
                {AGENDA_PALETTE.map(color => (
                  <button key={color} type="button" className={`ag-swatch-btn${form.color === color ? " selected" : ""}`}
                    style={{ background: color }} onClick={() => setForm(f => ({ ...f, color }))} />
                ))}
              </div>
            </div>
            <div className="ag-modal-actions">
              {editingId && (
                <button onClick={deleteEvent} style={{ border: "1px solid #E3C1C1", background: "#fff", color: "#B23B3B", borderRadius: 999, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", marginRight: "auto" }}>
                  Eliminar
                </button>
              )}
              <button onClick={closeModal} style={{ border: "none", background: "transparent", color: INK_SOFT, fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "9px 12px" }}>Cancelar</button>
              <button onClick={saveEvent} style={{ border: "none", background: INK, color: "#fff", borderRadius: 999, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div className={`ag-saved${savedFlash ? " show" : ""}`}>Guardado</div>
    </div>
  );
}

/* --------------------------- App --------------------------- */
export default function App() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null); // { role: 'Maru' | 'Fernanda' | 'Ricardo' }
  const [scope, setScope] = useState(null); // 'propio' | 'fermaru' | 'todos'
  const [pins, setPins] = useState(DEFAULT_PINS);
  const [tab, setTab] = useState("gastos"); // 'gastos' | 'pendientes'
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [pendientes, setPendientes] = useState([]);
  const [pendTexto, setPendTexto] = useState("");
  const [pendCategoria, setPendCategoria] = useState(PENDIENTE_CATEGORIAS[0].name);
  const [pendFecha, setPendFecha] = useState("");
  const [pendUrgente, setPendUrgente] = useState(false);
  const [confirmDeleteAllDone, setConfirmDeleteAllDone] = useState(false);
  const [pendMsg, setPendMsg] = useState("");
  const [verHechosCat, setVerHechosCat] = useState({}); // { [categoria]: bool }
  const [confirmDeletePend, setConfirmDeletePend] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(todayMonthKey());
  const [filterCat, setFilterCat] = useState(null);
  const [filterPay, setFilterPay] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [pasteText, setPasteText] = useState("");
  const [pasteCat, setPasteCat] = useState(DEFAULT_CATEGORIES[2].name);
  const [pasteMethod, setPasteMethod] = useState(PAYMENT_METHODS[0].name);
  const [pasteMsg, setPasteMsg] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [pinDraft, setPinDraft] = useState(DEFAULT_PINS);
  const [pinMsg, setPinMsg] = useState("");
  const [form, setForm] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    comercio: "", monto: "", rubro: DEFAULT_CATEGORIES[2].name,
    formaPago: PAYMENT_METHODS[0].name, nota: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("gastos-todos", true);
        setExpenses(r ? JSON.parse(r.value) : []);
      } catch (e) { setExpenses([]); }
      try {
        const r = await window.storage.get("gastos-categorias", true);
        let cats = r ? JSON.parse(r.value) : DEFAULT_CATEGORIES;
        const forcedColors = { "Personales": "#5EC2A0", "Niños": "#5B8FCB" };
        let changed = false;
        cats = cats.map(c => {
          if (forcedColors[c.name] && c.color !== forcedColors[c.name]) { changed = true; return { ...c, color: forcedColors[c.name] }; }
          return c;
        });
        const toInsert = [
          { name: "Oficina", color: "#54504A", icon: "Briefcase" },
          { name: "Snacks & Café", color: "#E08A3E", icon: "Coffee" },
          { name: "Doctores y Medicamentos", color: "#D14343", icon: "HeartPulse" },
        ];
        toInsert.forEach(nc => {
          if (!cats.some(c => c.name === nc.name)) {
            changed = true;
            const otrosIdx = cats.findIndex(c => c.name === "Otros");
            if (otrosIdx === -1) cats = [...cats, nc];
            else cats = [...cats.slice(0, otrosIdx), nc, ...cats.slice(otrosIdx)];
          }
        });
        setCategories(cats);
        if (!r || changed) { await window.storage.set("gastos-categorias", JSON.stringify(cats), true); }
      } catch (e) { setCategories(DEFAULT_CATEGORIES); }
      try {
        const r = await window.storage.get("gastos-config", true);
        let cfg = r ? JSON.parse(r.value) : DEFAULT_PINS;
        let cfgChanged = false;
        if (cfg.Maru === "1111") { cfg = { ...cfg, Maru: "1010" }; cfgChanged = true; }
        if (!cfg.Ricardo) { cfg = { ...cfg, Ricardo: DEFAULT_PINS.Ricardo }; cfgChanged = true; }
        setPins(cfg); setPinDraft(cfg);
        if (!r || cfgChanged) { await window.storage.set("gastos-config", JSON.stringify(cfg), true); }
      } catch (e) {
        try { await window.storage.set("gastos-config", JSON.stringify(DEFAULT_PINS), true); } catch (e2) {}
      }
      try {
        const r = await window.storage.get("pendientes-todos", true);
        setPendientes(r ? JSON.parse(r.value) : []);
      } catch (e) { setPendientes([]); }
      setReady(true);
    })();
  }, []);

  const persistExpenses = useCallback(async (list) => {
    setSaveStatus("saving");
    try {
      await window.storage.set("gastos-todos", JSON.stringify(list), true);
      setSaveStatus("guardado");
      setTimeout(() => setSaveStatus("idle"), 1400);
    } catch (e) { setSaveStatus("error"); }
  }, []);

  const persistCategories = useCallback(async (list) => {
    try { await window.storage.set("gastos-categorias", JSON.stringify(list), true); } catch (e) {}
  }, []);

  const persistPendientes = useCallback(async (list) => {
    setSaveStatus("saving");
    try {
      await window.storage.set("pendientes-todos", JSON.stringify(list), true);
      setSaveStatus("guardado");
      setTimeout(() => setSaveStatus("idle"), 1400);
    } catch (e) { setSaveStatus("error"); }
  }, []);

  const addPendiente = () => {
    if (!session) return;
    if (!pendTexto.trim()) { setPendMsg("Escribe qué hay que hacer."); return; }
    const item = {
      id: uid(), texto: pendTexto.trim(), categoria: pendCategoria, fecha: pendFecha || null,
      urgente: pendUrgente, hecho: false, completadoEn: null, asignadoPor: session.role, creadoEn: new Date().toISOString(),
    };
    const next = [...pendientes, item];
    setPendientes(next);
    persistPendientes(next);
    setPendTexto("");
    setPendFecha("");
    setPendUrgente(false);
    setPendMsg("¡Agregado!");
    setTimeout(() => setPendMsg(""), 1500);
  };

  const toggleHecho = (id) => {
    const next = pendientes.map(p => p.id === id
      ? { ...p, hecho: !p.hecho, completadoEn: !p.hecho ? new Date().toISOString() : null }
      : p);
    setPendientes(next);
    persistPendientes(next);
  };

  const deletePendiente = (id) => {
    const next = pendientes.filter(p => p.id !== id);
    setPendientes(next);
    persistPendientes(next);
    setConfirmDeletePend(null);
  };

  const deleteAllDone = () => {
    const next = pendientes.filter(p => !p.hecho);
    setPendientes(next);
    persistPendientes(next);
    setConfirmDeleteAllDone(false);
  };

  const savePins = async () => {
    try {
      await window.storage.set("gastos-config", JSON.stringify(pinDraft), true);
      setPins(pinDraft);
      setPinMsg("PINs actualizados.");
      setTimeout(() => setPinMsg(""), 2000);
    } catch (e) { setPinMsg("No se pudo guardar."); }
  };

  // Según la vista activa: solo lo propio, Fer + Maru, o los 3
  const visibleExpenses = useMemo(() => {
    if (!session) return [];
    const s = scope || defaultScopeFor(session.role);
    if (s === "propio") return expenses.filter(e => e.capturadoPor === session.role);
    if (s === "fermaru") return expenses.filter(e => e.capturadoPor === "Fernanda" || e.capturadoPor === "Maru");
    return expenses; // todos
  }, [expenses, session, scope]);

  const monthOptions = useMemo(() => {
    const set = new Set(visibleExpenses.map(e => e.fecha.slice(0, 7)));
    set.add(todayMonthKey());
    return Array.from(set).sort().reverse();
  }, [visibleExpenses]);

  const monthExpenses = useMemo(
    () => visibleExpenses.filter(e => e.fecha.slice(0, 7) === selectedMonth),
    [visibleExpenses, selectedMonth]
  );

  const monthTotal = useMemo(() => monthExpenses.reduce((s, e) => s + Number(e.monto), 0), [monthExpenses]);

  const prevTotal = useMemo(() => {
    const pk = prevMonthKey(selectedMonth);
    return visibleExpenses.filter(e => e.fecha.slice(0, 7) === pk).reduce((s, e) => s + Number(e.monto), 0);
  }, [visibleExpenses, selectedMonth]);

  const delta = prevTotal > 0 ? ((monthTotal - prevTotal) / prevTotal) * 100 : null;

  const catTotals = useMemo(() => {
    const map = {};
    categories.forEach(c => { map[c.name] = 0; });
    monthExpenses.forEach(e => { map[e.rubro] = (map[e.rubro] || 0) + Number(e.monto); });
    return categories.map(c => ({ ...c, amount: map[c.name] || 0 })).sort((a, b) => b.amount - a.amount);
  }, [monthExpenses, categories]);

  const activePaymentMethods = useMemo(() => {
    const s = scope || defaultScopeFor(session ? session.role : "Maru");
    if (s === "todos") return [...PAYMENT_METHODS, ...RICARDO_PAYMENT_METHODS];
    if (s === "propio" && session && session.role === "Ricardo") return RICARDO_PAYMENT_METHODS;
    return PAYMENT_METHODS;
  }, [scope, session]);

  const payTotals = useMemo(() => {
    const map = {};
    activePaymentMethods.forEach(p => { map[p.name] = 0; });
    monthExpenses.forEach(e => { map[e.formaPago] = (map[e.formaPago] || 0) + Number(e.monto); });
    return activePaymentMethods.map(p => ({ ...p, amount: map[p.name] || 0 })).sort((a, b) => b.amount - a.amount);
  }, [monthExpenses, activePaymentMethods]);

  const trendData = useMemo(() => {
    const months = last6Months();
    return months.map(mk => ({
      mes: shortMonthLabel(mk), full: mk,
      total: visibleExpenses.filter(e => e.fecha.slice(0, 7) === mk).reduce((s, e) => s + Number(e.monto), 0),
    }));
  }, [visibleExpenses]);

  const filteredList = useMemo(() => {
    return monthExpenses
      .filter(e => !filterCat || e.rubro === filterCat)
      .filter(e => !filterPay || e.formaPago === filterPay)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [monthExpenses, filterCat, filterPay]);

  const filteredTotal = useMemo(() => filteredList.reduce((s, e) => s + Number(e.monto), 0), [filteredList]);

  const pendientesPorCategoria = useMemo(() => {
    return PENDIENTE_CATEGORIAS.map(cat => {
      const items = pendientes
        .filter(p => p.categoria === cat.name)
        .sort((a, b) => {
          if (a.hecho !== b.hecho) return a.hecho ? 1 : -1;
          if (!!a.urgente !== !!b.urgente) return a.urgente ? -1 : 1;
          return (a.fecha || "").localeCompare(b.fecha || "");
        });
      return { ...cat, items, abiertos: items.filter(p => !p.hecho).length, hechos: items.filter(p => p.hecho).length };
    });
  }, [pendientes]);

  const totalHechos = useMemo(() => pendientes.filter(p => p.hecho).length, [pendientes]);

  const totalAbiertos = useMemo(() => pendientes.filter(p => !p.hecho).length, [pendientes]);

  const [addMsg, setAddMsg] = useState("");
  const addExpense = () => {
    if (!session) return;
    if (!form.comercio.trim() || !form.monto || Number(form.monto) <= 0) {
      setAddMsg("Falta el comercio o el monto.");
      return;
    }
    const item = {
      id: uid(), fecha: form.fecha, comercio: form.comercio.trim(), monto: Number(form.monto),
      rubro: form.rubro, formaPago: form.formaPago, nota: form.nota.trim(), capturadoPor: session.role,
    };
    const next = [...expenses, item];
    setExpenses(next);
    persistExpenses(next);
    setForm(f => ({ ...f, comercio: "", monto: "", nota: "" }));
    setAddMsg("¡Guardado!");
    setTimeout(() => setAddMsg(""), 1500);
  };

  const deleteExpense = (id) => {
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next);
    persistExpenses(next);
  };

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name || categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    const palette = ["#E8735C", "#4FA8A0", "#E4B363", "#D68FA3", "#8FA381", "#6B4F6E", "#B7876F"];
    const next = [...categories, { name, color: palette[categories.length % palette.length], icon: "Gem" }];
    setCategories(next);
    persistCategories(next);
    setNewCatName("");
  };

  const [editingCat, setEditingCat] = useState(null);
  const [editCatValue, setEditCatValue] = useState("");
  const [confirmDeleteCat, setConfirmDeleteCat] = useState(null);
  const [catMsg, setCatMsg] = useState("");

  const startEditCat = (name) => { setEditingCat(name); setEditCatValue(name); setConfirmDeleteCat(null); };
  const cancelEditCat = () => { setEditingCat(null); setEditCatValue(""); };

  const saveEditCat = () => {
    const oldName = editingCat;
    const newName = editCatValue.trim();
    if (!newName) { setCatMsg("El nombre no puede quedar vacío."); return; }
    if (newName !== oldName && categories.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
      setCatMsg("Ya existe un rubro con ese nombre.");
      return;
    }
    if (newName === oldName) { cancelEditCat(); return; }
    const nextCats = categories.map(c => (c.name === oldName ? { ...c, name: newName } : c));
    setCategories(nextCats);
    persistCategories(nextCats);
    const nextExp = expenses.map(e => (e.rubro === oldName ? { ...e, rubro: newName } : e));
    setExpenses(nextExp);
    persistExpenses(nextExp);
    if (filterCat === oldName) setFilterCat(newName);
    if (form.rubro === oldName) setForm(f => ({ ...f, rubro: newName }));
    if (pasteCat === oldName) setPasteCat(newName);
    setCatMsg(`"${oldName}" ahora se llama "${newName}".`);
    setTimeout(() => setCatMsg(""), 2200);
    cancelEditCat();
  };

  const askDeleteCat = (name) => { setConfirmDeleteCat(name); setEditingCat(null); };
  const cancelDeleteCat = () => setConfirmDeleteCat(null);

  const confirmDeleteCategory = () => {
    const name = confirmDeleteCat;
    if (!name || categories.length <= 1) { setConfirmDeleteCat(null); return; }
    const fallback = categories.find(c => c.name !== name)?.name || "Otros";
    const nextCats = categories.filter(c => c.name !== name);
    setCategories(nextCats);
    persistCategories(nextCats);
    const nextExp = expenses.map(e => (e.rubro === name ? { ...e, rubro: fallback } : e));
    setExpenses(nextExp);
    persistExpenses(nextExp);
    if (filterCat === name) setFilterCat(null);
    if (form.rubro === name) setForm(f => ({ ...f, rubro: fallback }));
    if (pasteCat === name) setPasteCat(fallback);
    setCatMsg(`"${name}" se borró. Sus gastos ahora son "${fallback}".`);
    setTimeout(() => setCatMsg(""), 2600);
    setConfirmDeleteCat(null);
  };

  const parsePaste = () => {
    if (!session) return;
    const lines = pasteText.split("\n").map(l => l.trim()).filter(Boolean);
    const rows = [];
    for (const line of lines) {
      const cols = line.includes("\t") ? line.split("\t") : line.split(",");
      const cleaned = cols.map(c => c.trim());
      if (cleaned.length < 2) continue;
      const montoRaw = cleaned.find(c => /^-?\$?\s?[\d,]+(\.\d+)?$/.test(c.replace(/\s/g, "")));
      if (!montoRaw) continue;
      const monto = Number(montoRaw.replace(/[$,\s]/g, ""));
      if (Number.isNaN(monto)) continue;
      const fechaCandidate = cleaned.find(c => /\d{4}-\d{2}-\d{2}/.test(c) || /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(c));
      let fecha = selectedMonth + "-01";
      if (fechaCandidate) {
        if (/\d{4}-\d{2}-\d{2}/.test(fechaCandidate)) fecha = fechaCandidate;
        else {
          const [d, m, y] = fechaCandidate.split("/");
          const yyyy = y.length === 2 ? `20${y}` : y;
          fecha = `${yyyy}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
      }
      const comercio = cleaned.find(c => c !== montoRaw && c !== fechaCandidate) || "Compra";
      const rubro = cleaned.length >= 4 && categories.some(c => c.name === cleaned[3]) ? cleaned[3] : pasteCat;
      const myMethods = paymentMethodsForRole(session.role);
      const formaPago = cleaned.length >= 5 && myMethods.some(p => p.name === cleaned[4]) ? cleaned[4] : pasteMethod;
      rows.push({ id: uid(), fecha, comercio, monto, rubro, formaPago, nota: "", capturadoPor: session.role });
    }
    if (rows.length === 0) {
      setPasteMsg("No encontré filas válidas. Revisa que cada línea tenga fecha, comercio y monto separados por tab o coma.");
      return;
    }
    const next = [...expenses, ...rows];
    setExpenses(next);
    persistExpenses(next);
    setPasteMsg(`Se agregaron ${rows.length} gastos.`);
    setPasteText("");
  };

  if (!ready) {
    return <div style={{ background: BG, minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: INK }}>Cargando…</div>;
  }

  if (!session) {
    return <Login pins={pins} onSuccess={(role) => {
      setSession({ role });
      setScope(defaultScopeFor(role));
      const myMethods = paymentMethodsForRole(role);
      setForm(f => ({ ...f, formaPago: myMethods[0].name }));
      setPasteMethod(myMethods[0].name);
    }} />;
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", width: "100%", boxSizing: "border-box", padding: "28px 18px 60px", fontFamily: "'Inter', sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        html, body { margin: 0; padding: 0; background: ${BG}; min-height: 100%; }
        #root, #app { min-height: 100%; background: ${BG}; }
        select, input, textarea, button { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #E2DACB; border-radius: 8px; }
      `}</style>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", maxWidth: 900, margin: "0 auto 14px", flexWrap: "wrap", gap: 6 }}>
        <div>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 28, color: INK, letterSpacing: -0.5 }}>
            {tab === "gastos" ? "Gastos" : tab === "pendientes" ? "Pendientes" : "\u00A0"}
          </div>
          <div style={{ fontSize: 12, color: INK_SOFT }}>
            {tab === "gastos"
              ? `casa Silva Salinas · viendo: ${SCOPE_LABELS[scope || defaultScopeFor(session.role)]}`
              : tab === "pendientes"
              ? "casa Silva Salinas · compartido entre los 3"
              : "\u00A0"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 11, color: "#B7AC98" }}>
            {saveStatus === "saving" && "guardando…"}
            {saveStatus === "guardado" && "✓ guardado"}
          </div>
          {session.role === "Maru" && (
            <button onClick={() => setShowSettings(s => !s)} style={{ border: "none", background: "transparent", cursor: "pointer", color: INK_SOFT, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
              <Settings size={14} /> PINs
            </button>
          )}
          <button onClick={() => { setSession(null); setScope(null); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: INK_SOFT, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
            <LogOut size={14} /> salir
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ maxWidth: 900, margin: "0 auto 20px", display: "flex", gap: 8 }}>
        <button onClick={() => setTab("gastos")} style={{
          border: "none", cursor: "pointer", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 13,
          background: tab === "gastos" ? INK : "#fff", color: tab === "gastos" ? "#fff" : INK_SOFT,
          boxShadow: tab === "gastos" ? "none" : `inset 0 0 0 1px ${LINE}`,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Wallet2 size={14} /> Gastos
        </button>
        <button onClick={() => setTab("pendientes")} style={{
          border: "none", cursor: "pointer", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 13,
          background: tab === "pendientes" ? INK : "#fff", color: tab === "pendientes" ? "#fff" : INK_SOFT,
          boxShadow: tab === "pendientes" ? "none" : `inset 0 0 0 1px ${LINE}`,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <ListTodo size={14} /> Pendientes{totalAbiertos > 0 ? ` (${totalAbiertos})` : ""}
        </button>
        {session.role !== "Fernanda" && (
          <button onClick={() => setTab("agenda")} style={{
            border: "none", cursor: "pointer", borderRadius: 10, padding: "8px 16px", fontWeight: 700, fontSize: 13,
            background: tab === "agenda" ? INK : "#fff", color: tab === "agenda" ? "#fff" : INK_SOFT,
            boxShadow: tab === "agenda" ? "none" : `inset 0 0 0 1px ${LINE}`,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <CalendarDays size={14} /> Agenda
          </button>
        )}
      </div>

      {tab === "gastos" && (
      <>
      {showSettings && session.role === "Maru" && (
        <div style={{ maxWidth: 900, margin: "0 auto 16px" }}>
          <Card>
            <SectionTitle sub="Solo tú puedes cambiarlos. Avisa a Fernanda si actualizas el suyo.">Acceso (PINs)</SectionTitle>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 11, color: INK_SOFT, marginBottom: 4 }}>PIN de Maru</div>
                <input value={pinDraft.Maru} onChange={e => setPinDraft(d => ({ ...d, Maru: e.target.value.replace(/\D/g, "") }))} style={{ ...inputStyle, width: 100 }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: INK_SOFT, marginBottom: 4 }}>PIN de Fernanda</div>
                <input value={pinDraft.Fernanda} onChange={e => setPinDraft(d => ({ ...d, Fernanda: e.target.value.replace(/\D/g, "") }))} style={{ ...inputStyle, width: 100 }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: INK_SOFT, marginBottom: 4 }}>PIN de Ricardo</div>
                <input value={pinDraft.Ricardo || ""} onChange={e => setPinDraft(d => ({ ...d, Ricardo: e.target.value.replace(/\D/g, "") }))} style={{ ...inputStyle, width: 100 }} />
              </div>
              <button onClick={savePins} style={{ border: "none", background: INK, color: "#fff", borderRadius: 9, padding: "9px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Guardar</button>
              {pinMsg && <div style={{ fontSize: 12, color: "#5C7A55" }}>{pinMsg}</div>}
            </div>
          </Card>
        </div>
      )}

      {/* VISTA (SCOPE) */}
      {scopesFor(session.role).length > 1 && (
        <div style={{ maxWidth: 900, margin: "0 auto 16px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11.5, color: INK_SOFT, fontWeight: 600 }}>ver:</span>
          {scopesFor(session.role).map(s => (
            <button key={s} onClick={() => setScope(s)} style={{
              border: "none", cursor: "pointer", borderRadius: 20, padding: "6px 14px", fontWeight: 700, fontSize: 12,
              background: scope === s ? "#2B26201A" : "transparent", color: scope === s ? INK : INK_SOFT,
              boxShadow: scope === s ? `inset 0 0 0 1px ${INK}33` : `inset 0 0 0 1px ${LINE}`,
            }}>
              {SCOPE_LABELS[s]}
            </button>
          ))}
        </div>
      )}

      {/* TOTAL + TREND */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 900, margin: "0 auto 16px" }}>
        <Card style={{ flex: "1 1 240px", borderLeft: "4px solid #E8735C" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ border: "none", background: "transparent", fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 13, color: INK, cursor: "pointer", padding: 0 }}>
              {monthOptions.map(mk => <option key={mk} value={mk}>{monthLabel(mk)}</option>)}
            </select>
            <ChevronDown size={13} color={INK_SOFT} />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 32, color: INK }}>{fmtMoney(monthTotal)}</div>
          {delta !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12, color: delta > 0 ? "#C4593F" : delta < 0 ? "#5C9089" : INK_SOFT, fontWeight: 700 }}>
              {delta > 0 ? <TrendingUp size={14} /> : delta < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
              {Math.abs(delta).toFixed(0)}% vs {shortMonthLabel(prevMonthKey(selectedMonth))}
            </div>
          )}
        </Card>

        <Card style={{ flex: "1 1 260px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: INK_SOFT, marginBottom: 8 }}>últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={90}>
            <BarChart data={trendData}>
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: INK_SOFT }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={v => fmtMoney(v)} contentStyle={{ fontFamily: "Inter", fontSize: 12, borderRadius: 8, border: `1px solid ${LINE}` }} />
              <Bar dataKey="total" radius={[5, 5, 0, 0]}>
                {trendData.map((d, i) => <Cell key={i} fill={d.full === selectedMonth ? "#E8735C" : "#E4C9A0"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* CATEGORIES */}
      <div style={{ maxWidth: 900, margin: "0 auto 16px" }}>
        <Card>
          <SectionTitle sub="Da clic en un rubro para filtrar los movimientos">Por rubro</SectionTitle>
          <div>
            {catTotals.map(c => (
              <CatRow key={c.name} cat={c} amount={c.amount} pct={monthTotal ? c.amount / monthTotal : 0}
                active={filterCat} onClick={() => setFilterCat(filterCat === c.name ? null : c.name)}
                canManage={session.role === "Maru"}
                isEditing={editingCat === c.name} editValue={editCatValue}
                onStartEdit={() => startEditCat(c.name)} onChangeEdit={setEditCatValue}
                onSaveEdit={saveEditCat} onCancelEdit={cancelEditCat}
                confirming={confirmDeleteCat === c.name}
                onAskDelete={() => askDeleteCat(c.name)} onConfirmDelete={confirmDeleteCategory} onCancelDelete={cancelDeleteCat}
              />
            ))}
          </div>
          {catMsg && <div style={{ fontSize: 12, color: "#5C7A55", marginTop: 8 }}>{catMsg}</div>}
          {session.role === "Maru" && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${LINE}` }}>
              <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="agregar rubro nuevo…" style={{ ...inputStyle, flex: 1, padding: "7px 10px", fontSize: 12.5 }} />
              <button onClick={addCategory} style={{ border: "none", background: INK, color: "#fff", borderRadius: 9, padding: "7px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Plus size={13} /> agregar</button>
            </div>
          )}
        </Card>
      </div>

      {/* PAYMENT METHODS */}
      <div style={{ maxWidth: 900, margin: "0 auto 16px" }}>
        <Card>
          <SectionTitle sub="Da clic en una forma de pago para filtrar">Por forma de pago</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {payTotals.map(p => {
              const Icon = ICONS[p.icon] || Wallet;
              const pct = monthTotal ? (p.amount / monthTotal) * 100 : 0;
              const active = filterPay === p.name;
              return (
                <div key={p.name} onClick={() => setFilterPay(filterPay === p.name ? null : p.name)} style={{ cursor: "pointer", opacity: filterPay === null || active ? 1 : 0.35, display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: `${p.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={p.color} strokeWidth={2.2} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, width: 190, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ flex: 1, background: "#F3EFE7", borderRadius: 5, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.max(pct, p.amount > 0 ? 2 : 0)}%`, height: "100%", background: p.color, borderRadius: 5, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12.5, fontWeight: 700, width: 84, textAlign: "right", flexShrink: 0 }}>{fmtMoney(p.amount)}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ADD + PASTE */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, maxWidth: 900, margin: "0 auto 16px" }}>
        <Card style={{ flex: "1 1 320px" }}>
          <SectionTitle>Agregar un gasto</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} style={inputStyle} />
            <input placeholder="comercio (ej. HEB Valle)" value={form.comercio} onChange={e => setForm(f => ({ ...f, comercio: e.target.value }))} style={inputStyle} />
            <input type="text" inputMode="decimal" placeholder="monto" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value.replace(/[^0-9.]/g, "") }))} style={inputStyle} />
            <select value={form.rubro} onChange={e => setForm(f => ({ ...f, rubro: e.target.value }))} style={inputStyle}>
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <select value={form.formaPago} onChange={e => setForm(f => ({ ...f, formaPago: e.target.value }))} style={inputStyle}>
              {paymentMethodsForRole(session.role).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            <input placeholder="nota (opcional)" value={form.nota} onChange={e => setForm(f => ({ ...f, nota: e.target.value }))} style={inputStyle} />
            <button type="button" onClick={addExpense} style={{ border: "none", background: INK, color: "#fff", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 2 }}><Plus size={15} /> guardar</button>
            {addMsg && <div style={{ fontSize: 12, textAlign: "center", color: addMsg === "¡Guardado!" ? "#5C7A55" : "#C4593F" }}>{addMsg}</div>}
          </div>
        </Card>

        <Card style={{ flex: "1 1 360px" }}>
          <SectionTitle sub="Copia las columnas Fecha, Comercio y Monto de su Excel (o incluye Rubro y Forma de pago si las tiene) y pégalas aquí, una fila por línea.">Pegar el Excel de Fernanda</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select value={pasteCat} onChange={e => setPasteCat(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 12 }}>
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <select value={pasteMethod} onChange={e => setPasteMethod(e.target.value)} style={{ ...inputStyle, flex: 1, fontSize: 12 }}>
              {paymentMethodsForRole(session.role).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 10.5, color: "#B7AC98", marginBottom: 8 }}>(el rubro/forma de pago de arriba se usan si la fila pegada no los trae ya)</div>
          <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} rows={5}
            placeholder={"2026-07-14\tHEB Valle\t1,240.50\n2026-07-15\tCostco San Pedro\t3,890"}
            style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "'Space Mono', monospace", fontSize: 12 }} />
          <button onClick={parsePaste} style={{ marginTop: 10, border: "none", background: "#8FA381", color: "#fff", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><ClipboardPaste size={15} /> agregar todo</button>
          {pasteMsg && <div style={{ fontSize: 12, color: "#5C7A55", marginTop: 8 }}>{pasteMsg}</div>}
        </Card>
      </div>

      {/* LIST */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
            <SectionTitle>{`Movimientos — ${monthLabel(selectedMonth)}`}</SectionTitle>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {(filterCat || filterPay) && (
                <button onClick={() => { setFilterCat(null); setFilterPay(null); }} style={{ border: `1px solid ${LINE}`, background: "#fff", color: INK, borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}><X size={12} /> quitar filtro</button>
              )}
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: "#E8735C" }}>{fmtMoney(filteredTotal)}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxHeight: 420, overflowY: "auto" }}>
            {filteredList.length === 0 && (
              <div style={{ textAlign: "center", color: INK_SOFT, fontSize: 13, padding: "30px 0" }}>Todavía no hay gastos aquí. Agrega uno arriba o pega el Excel de Fernanda.</div>
            )}
            {filteredList.map((e, idx) => {
              const cat = categories.find(c => c.name === e.rubro) || categories[categories.length - 1];
              const canDelete = session.role === "Maru" || e.capturadoPor === session.role;
              return (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 6px", background: idx % 2 === 0 ? "transparent" : "#FBF9F4", borderRadius: 8 }}>
                  <div style={{ width: 7, height: 30, borderRadius: 4, background: cat.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.comercio}</div>
                    <div style={{ fontSize: 11, color: INK_SOFT }}>
                      {e.fecha} · {e.rubro} · {e.formaPago}{e.nota ? ` · ${e.nota}` : ""}
                      {(scope || defaultScopeFor(session.role)) !== "propio" && e.capturadoPor ? ` · ${e.capturadoPor}` : ""}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{fmtMoney(e.monto)}</div>
                  {canDelete && (
                    <button onClick={() => deleteExpense(e.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#C4593F", flexShrink: 0 }}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* DONA POR RUBRO */}
      <div style={{ maxWidth: 900, margin: "16px auto 0" }}>
        <Card>
          <SectionTitle sub={`En qué se fue más el dinero — ${monthLabel(selectedMonth)}`}>Distribución por rubro</SectionTitle>
          {monthTotal === 0 ? (
            <div style={{ textAlign: "center", color: INK_SOFT, fontSize: 13, padding: "20px 0" }}>
              Todavía no hay gastos este mes para graficar.
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: 220, height: 220, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={catTotals.filter(c => c.amount > 0)} dataKey="amount" nameKey="name"
                      innerRadius={64} outerRadius={98} paddingAngle={2} strokeWidth={0}>
                      {catTotals.filter(c => c.amount > 0).map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [fmtMoney(v), n]} contentStyle={{ fontFamily: "Inter", fontSize: 12, borderRadius: 8, border: `1px solid ${LINE}` }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  textAlign: "center", pointerEvents: "none",
                }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, color: INK }}>
                    {fmtMoney(monthTotal)}
                  </div>
                  <div style={{ fontSize: 10.5, color: INK_SOFT, textTransform: "uppercase", letterSpacing: 0.4 }}>total</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 200 }}>
                {catTotals.filter(c => c.amount > 0).map(c => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, width: 140, flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: INK_SOFT }}>
                      {fmtMoney(c.amount)} · {((c.amount / monthTotal) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
      </>
      )}

      {tab === "pendientes" && (
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionTitle sub="Estos pendientes los ven los 3. Marca el círculo cuando ya esté hecho — no se borra, queda en el historial.">
              Agregar un pendiente
            </SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <input placeholder="¿qué hay que hacer?" value={pendTexto} onChange={e => setPendTexto(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addPendiente(); }} style={inputStyle} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select value={pendCategoria} onChange={e => setPendCategoria(e.target.value)} style={{ ...inputStyle, flex: "1 1 200px" }}>
                  {PENDIENTE_CATEGORIAS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <input type="date" value={pendFecha} onChange={e => setPendFecha(e.target.value)} style={{ ...inputStyle, flex: "1 1 150px" }} />
              </div>
              <button type="button" onClick={() => setPendUrgente(u => !u)} style={{
                border: `1.5px solid ${pendUrgente ? "#D64545" : LINE}`, background: pendUrgente ? "#D645451A" : "#fff",
                color: pendUrgente ? "#C4593F" : INK_SOFT, borderRadius: 9, padding: "8px 12px", fontSize: 12.5, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
              }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: pendUrgente ? "#D64545" : "transparent", border: `1.5px solid ${pendUrgente ? "#D64545" : "#C7BEAE"}` }} />
                urgente
              </button>
              <button type="button" onClick={addPendiente} style={{ border: "none", background: INK, color: "#fff", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Plus size={15} /> agregar pendiente
              </button>
              {pendMsg && <div style={{ fontSize: 12, textAlign: "center", color: pendMsg === "¡Agregado!" ? "#5C7A55" : "#C4593F" }}>{pendMsg}</div>}
            </div>
          </Card>

          {pendientesPorCategoria.map(cat => {
            const Icon = ICONS[cat.icon] || ListTodo;
            const showHechos = !!verHechosCat[cat.name];
            const visibles = showHechos ? cat.items : cat.items.filter(p => !p.hecho);
            return (
              <Card key={cat.name}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: `${cat.color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={15} color={cat.color} strokeWidth={2.2} />
                    </div>
                    <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: 14.5, color: INK }}>{cat.name}</div>
                    <div style={{ fontSize: 11.5, color: INK_SOFT }}>
                      {cat.abiertos} pendiente{cat.abiertos === 1 ? "" : "s"}{cat.hechos > 0 ? ` · ${cat.hechos} hecho${cat.hechos === 1 ? "" : "s"}` : ""}
                    </div>
                  </div>
                  {cat.hechos > 0 && (
                    <button onClick={() => setVerHechosCat(v => ({ ...v, [cat.name]: !v[cat.name] }))} style={{ border: "none", background: "transparent", cursor: "pointer", color: INK_SOFT, fontSize: 11.5, fontWeight: 600 }}>
                      {showHechos ? "ocultar hechos" : "ver hechos"}
                    </button>
                  )}
                </div>

                {visibles.length === 0 && (
                  <div style={{ fontSize: 12.5, color: "#B7AC98", padding: "6px 0" }}>Sin pendientes aquí ✨</div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {visibles.map(p => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", opacity: p.hecho ? 0.5 : 1 }}>
                      <button onClick={() => toggleHecho(p.id)} style={{
                        border: "none", background: "transparent", cursor: "pointer",
                        color: p.hecho ? "#5C9089" : (p.urgente ? "#D64545" : INK_SOFT), flexShrink: 0, display: "flex",
                        borderRadius: "50%", boxShadow: p.urgente && !p.hecho ? "0 0 0 3px #D6454522" : "none",
                      }}>
                        {p.hecho ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: INK, textDecoration: p.hecho ? "line-through" : "none" }}>{p.texto}</div>
                        <div style={{ fontSize: 11, color: INK_SOFT }}>
                          {p.fecha ? `para ${p.fecha} · ` : ""}pidió {p.asignadoPor}{p.hecho && p.completadoEn ? ` · hecho ${p.completadoEn.slice(0, 10)}` : ""}
                        </div>
                      </div>
                      {confirmDeletePend === p.id ? (
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button onClick={() => deletePendiente(p.id)} style={{ border: "none", background: "#C4593F", color: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>borrar</button>
                          <button onClick={() => setConfirmDeletePend(null)} style={{ border: "none", background: "transparent", color: INK_SOFT, fontSize: 11, cursor: "pointer" }}>no</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeletePend(p.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: INK_SOFT, flexShrink: 0 }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}

          {totalHechos > 0 && (
            <div style={{ textAlign: "center", padding: "4px 0 8px" }}>
              {!confirmDeleteAllDone ? (
                <button onClick={() => setConfirmDeleteAllDone(true)} style={{
                  border: `1px solid ${LINE}`, background: "#fff", color: INK_SOFT, borderRadius: 10, padding: "9px 16px",
                  fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <Trash2 size={13} /> borrar todos los completados ({totalHechos})
                </button>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 16px" }}>
                  <span style={{ fontSize: 12.5, color: INK }}>¿Borrar los {totalHechos} completados? no se puede deshacer.</span>
                  <button onClick={deleteAllDone} style={{ border: "none", background: "#C4593F", color: "#fff", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>sí, borrar</button>
                  <button onClick={() => setConfirmDeleteAllDone(false)} style={{ border: "none", background: "transparent", color: INK_SOFT, fontSize: 12, cursor: "pointer" }}>cancelar</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "agenda" && session.role !== "Fernanda" && (
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <AgendaTab role={session.role} />
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  border: `1.5px solid ${LINE}`, borderRadius: 9, padding: "9px 11px", fontSize: 13,
  outline: "none", background: "#FDFCFA", color: "#2B2620",
};
