// js/supabase-client.js
const SUPABASE_URL = "https://oiqxotvntoohugsrutwu.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcXhvdHZudG9vaHVnc3J1dHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTA0OTMsImV4cCI6MjA5MTcyNjQ5M30.5GF32foP17OtbSFsjVX3T_yPaHm7sZPVbZUcBWT9C0I"; // Reemplázala por tu clave real
window.LOGO_ALMENDROS =
  "https://oiqxotvntoohugsrutwu.supabase.co/storage/v1/object/public/escudos/logo-almendros.png";
// Exportamos el cliente global de manera limpia
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
