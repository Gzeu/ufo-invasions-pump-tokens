import React, { createContext, useContext, useMemo, useRef, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  const idRef = useRef(0);
  const add = useCallback((payload) => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, ...payload }]);
    return id;
  }, []);
  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const show = useCallback((type, message, options = {}) => {
    const id = add({ type, message, ...options });
    const duration = options.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [add, remove]);

  const api = useMemo(() => ({
    items,
    clear,
    showInfo: (m, o) => show("info", m, o),
    showSuccess: (m, o) => show("success", m, o),
    showError: (m, o) => show("error", m, o),
    remove
  }), [items, clear, show, remove]);

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <NotificationCenter items={items} onClose={remove} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

function NotificationCenter({ items, onClose }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      zIndex: 9999
    }} aria-live="polite">
      {items.map(item => (
        <div key={item.id} role="status" style={{
          background: item.type === "error" ? "#ff3860" : item.type === "success" ? "#00cc88" : "#3a3a5a",
          color: "white",
          padding: "12px 16px",
          borderRadius: 8,
          minWidth: 260,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span>{item.message}</span>
            <button
              aria-label="Close notification"
              onClick={() => onClose(item.id)}
              style={{ background: "transparent", color: "white", border: "none", cursor: "pointer" }}
            >✕</button>
          </div>
          {item.action && (
            <div style={{ marginTop: 8 }}>
              <button
                onClick={item.action.onClick}
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}
              >
                {item.action.label}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}