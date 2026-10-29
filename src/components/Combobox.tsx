import { useId, useLayoutEffect, useEffect, useRef, useState, useImperativeHandle } from "react";
import type { KeyboardEvent, Ref } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { normalize } from "../lib/search";
import "./combobox.css";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
interface ComboboxProps {
  label: string;
  value: string;
  options: ComboboxOption[];
  onValueChange: (value: string) => void;
  id?: string;
  name?: string;
  form?: string;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  onBlur?: () => void;
  triggerRef?: Ref<HTMLButtonElement>;
}

/** Selector de valor único. El foco permanece en el control mientras la lista
 * usa aria-activedescendant; Tab nunca queda atrapado en las opciones. */
export function Combobox({ label, value, options, onValueChange, id, name, form,
  className = "", disabled = false, invalid = false, describedBy, onBlur, triggerRef }: ComboboxProps) {
  const generatedId = useId();
  const controlId = id ?? `combobox-${generatedId}`;
  const listId = `${controlId}-list`;
  const labelId = `${controlId}-label`;
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0, maxHeight: 280 });
  const enabled = options.map((option, i) => option.disabled ? -1 : i).filter(i => i >= 0);
  const selected = options.findIndex(option => option.value === value);
  const expanded = open && !disabled;
  useImperativeHandle(triggerRef, () => trigger.current!, []);

  function show(index = selected >= 0 && !options[selected].disabled ? selected : enabled[0]) {
    if (disabled || !enabled.length) return;
    typeahead.current = { text: "", time: 0 };
    setActive(index);
    setOpen(true);
  }
  function choose(index: number) {
    if (!options[index] || options[index].disabled) return;
    onValueChange(options[index].value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  useLayoutEffect(() => {
    if (!expanded) return;
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const width = viewport?.width ?? window.innerWidth;
      const below = height - rect.bottom - 12;
      const above = rect.top - 12;
      const upwards = below < 220 && above > below;
      const maxHeight = Math.max(80, Math.min(304, upwards ? above - 6 : below - 6));
      const popupHeight = Math.min(popup.current?.scrollHeight ?? maxHeight, maxHeight);
      const popupWidth = Math.min(rect.width, width - 24);
      setPosition({ left: Math.max(12, Math.min(rect.left, width - popupWidth - 12)),
        top: upwards ? rect.top - popupHeight - 6 : rect.bottom + 6, width: popupWidth, maxHeight });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
    };
  }, [expanded, position.width]);
  useEffect(() => {
    if (expanded) popup.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [expanded, active]);
  useEffect(() => {
    if (!expanded) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!root.current?.contains(target) && !popup.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside, true);
    return () => document.removeEventListener("pointerdown", outside, true);
  }, [expanded]);

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") { setOpen(false); return; }
    if (event.key === "Escape" && expanded) {
      event.preventDefault(); event.stopPropagation(); setOpen(false); return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!expanded) { show(event.key === "End" ? enabled.at(-1) : event.key === "Home" ? enabled[0] : undefined); return; }
      const current = enabled.indexOf(active);
      const next = event.key === "Home" ? enabled[0] : event.key === "End" ? enabled.at(-1)
        : enabled[(current + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length];
      if (next !== undefined) setActive(next);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (expanded) choose(active); else show();
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const character = normalize(event.key);
      const previous = now - typeahead.current.time < 700 ? typeahead.current.text : "";
      const text = previous === character ? character : previous + character;
      typeahead.current = { text, time: now };
      const current = expanded ? active : selected;
      const ordered = [...enabled.filter(i => i > current), ...enabled.filter(i => i <= current)];
      const match = ordered.find(i => normalize(options[i].label).startsWith(text));
      if (match !== undefined) { setActive(match); setOpen(true); }
    }
  }
  return (
    <div ref={root} className={`cenard-combobox ${className}`}>
      <label id={labelId} htmlFor={controlId}>{label}</label>
      {name && <input type="hidden" name={name} value={value} form={form} disabled={disabled} />}
      <button id={controlId} ref={trigger} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined} aria-labelledby={labelId}
        aria-activedescendant={expanded ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined} aria-describedby={describedBy}
        disabled={disabled || !enabled.length} onKeyDown={keyDown}
        onClick={() => expanded ? setOpen(false) : show()}
        onBlur={() => { setOpen(false); onBlur?.(); }} className="cenard-combobox-trigger">
        <span>{options[selected]?.label ?? "Selecciona una opción"}</span>
        <ChevronDown size={17} strokeWidth={1.5} aria-hidden="true" />
      </button>
      {expanded && createPortal(<div ref={popup} id={listId} role="listbox" aria-labelledby={labelId}
        className="cenard-combobox-list" style={position}>
        {options.map((option, i) => <div key={option.value} id={`${listId}-${i}`} role="option"
          aria-selected={option.value === value} aria-disabled={option.disabled || undefined}
          data-index={i} data-active={i === active} className="cenard-combobox-option"
          onPointerDown={event => event.preventDefault()}
          onPointerMove={() => { if (!option.disabled) setActive(i); }}
          onClick={() => choose(i)}>
          <span>{option.label}</span>{option.value === value && <Check size={16} strokeWidth={1.8} aria-hidden="true" />}
        </div>)}
      </div>, document.body)}
    </div>
  );
}
