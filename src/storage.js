// Este archivo hace que "window.storage" funcione igual que dentro de Claude,
// pero usando Supabase por debajo, para que los datos se compartan de
// verdad entre Maru, Fernanda y Ricardo en sus celulares.
//
// No necesitas entender esto ni tocarlo — solo asegúrate de haber llenado
// src/supabaseConfig.js con tus datos reales de Supabase.

import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./supabaseConfig.js";

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
const TABLE = "appdata";

async function get(key) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { key, value: data.value, shared: true };
}

async function set(key, value) {
  const { error } = await supabase.from(TABLE).upsert({ key, value });
  if (error) throw error;
  return { key, value, shared: true };
}

async function del(key) {
  const { error } = await supabase.from(TABLE).delete().eq("key", key);
  if (error) throw error;
  return { key, deleted: true, shared: true };
}

async function list(prefix = "") {
  const { data, error } = await supabase
    .from(TABLE)
    .select("key")
    .like("key", `${prefix}%`);
  if (error) throw error;
  return { keys: (data || []).map((d) => d.key), prefix, shared: true };
}

// El segundo argumento (shared: true/false) que usa el código de la app
// se ignora aquí a propósito: en esta versión todo vive en la misma
// tabla compartida, no hay almacenamiento "privado" por persona.
window.storage = {
  get: (key, _shared) => get(key),
  set: (key, value, _shared) => set(key, value),
  delete: (key, _shared) => del(key),
  list: (prefix, _shared) => list(prefix),
};
