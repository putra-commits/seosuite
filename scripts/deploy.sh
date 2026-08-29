#!/usr/bin/env bash
#
# deploy.sh — Deploy AdoloSEO ke VPS Bigcloud.
#
# Jalankan DI VPS, dari dalam folder app:
#   cd /opt/bigcloud/seosuite && bash scripts/deploy.sh
#
# Skrip ini sengaja berhenti di kesalahan pertama. Kalau ada yang meleset,
# lebih baik app lama tetap jalan daripada app baru jalan setengah.

set -euo pipefail

APP_NAME="${APP_NAME:-seosuite}"     # nama PM2 (belum di-rename)
PORT="${PORT:-3025}"
DOPPLER_PROJECT="${DOPPLER_PROJECT:-seosuite}"
DOPPLER_CONFIG="${DOPPLER_CONFIG:-prd}"

info() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }
gagal() { printf '\n\033[1;31mGAGAL: %s\033[0m\n' "$1" >&2; exit 1; }

# ── 1. Rahasia wajib ────────────────────────────────────────────────────────
info "Memeriksa rahasia di Doppler ($DOPPLER_PROJECT/$DOPPLER_CONFIG)"

ambil_rahasia() {
  doppler secrets get "$1" --project "$DOPPLER_PROJECT" --config "$DOPPLER_CONFIG" --plain 2>/dev/null || true
}

ADMIN_TOKEN_VAL="$(ambil_rahasia ADMIN_TOKEN)"
if [ -z "$ADMIN_TOKEN_VAL" ]; then
  gagal "ADMIN_TOKEN belum diset. Tanpa ini /admin/leads menolak SEMUA akses.
       Setel dulu:
         doppler secrets set ADMIN_TOKEN=\"\$(openssl rand -hex 32)\" --project $DOPPLER_PROJECT --config $DOPPLER_CONFIG"
fi

# Gotcha #1: migrasi Doppler sering mengisi nilai template, bukan nilai asli.
case "$ADMIN_TOKEN_VAL" in
  *change-me*|*your-*|*xxx*|sk-ant-*)
    gagal "ADMIN_TOKEN tampak berisi nilai placeholder, bukan token asli." ;;
esac

DATA_DIR_VAL="$(ambil_rahasia ADOLOSEO_DATA_DIR)"
if [ -z "$DATA_DIR_VAL" ]; then
  printf '\033[1;33mPERINGATAN: ADOLOSEO_DATA_DIR kosong — data lead disimpan di dalam folder rilis
dan akan LENYAP saat folder deploy diganti. Sangat disarankan set ke /var/lib/adoloseo/data\033[0m\n'
else
  info "Data lead: $DATA_DIR_VAL"
  mkdir -p "$DATA_DIR_VAL"
fi

# ── 2. Ambil kode ───────────────────────────────────────────────────────────
info "git pull"
git pull --ff-only

info "npm ci"
npm ci

# ── 3. Build — WAJIB (gotcha #3) ────────────────────────────────────────────
# git pull + pm2 restart TANPA build memakai .next lama dan melahirkan
# InvariantError / client-side exception yang membingungkan.
info "npm run build"
rm -rf .next
npm run build

# ── 4. Uji yang harus lulus sebelum menyentuh proses hidup ──────────────────
info "Menjalankan uji keawetan data"
node scripts/verify-lock.mjs
node scripts/verify-slug.mjs

# ── 5. Cek port sebelum restart (gotcha #13) ────────────────────────────────
# Port bisa diserobot app lain tanpa sepengetahuan siapa pun. Jangan asumsikan
# port kosong hanya karena PM2 app ini statusnya stopped.
info "Memeriksa penghuni port $PORT"
PEMILIK="$(sudo ss -tlnp 2>/dev/null | grep ":$PORT " || true)"
if [ -n "$PEMILIK" ]; then
  echo "$PEMILIK"
  if ! echo "$PEMILIK" | grep -q "$(pm2 pid "$APP_NAME" 2>/dev/null || echo '___tidak_ada___')"; then
    printf '\033[1;33mPERINGATAN: port %s dipakai proses yang bukan PM2 %s. Periksa sebelum lanjut.\033[0m\n' "$PORT" "$APP_NAME"
  fi
fi

# ── 6. Restart ──────────────────────────────────────────────────────────────
info "pm2 restart $APP_NAME"
pm2 restart "$APP_NAME" --update-env
pm2 save

# ── 7. Verifikasi cwd (gotcha #2) ───────────────────────────────────────────
# Proses PM2 bernama X bisa saja menjalankan kode app LAIN.
info "Memeriksa exec cwd PM2"
CWD="$(pm2 info "$APP_NAME" 2>/dev/null | grep 'exec cwd' | awk '{print $NF}')"
echo "exec cwd = $CWD"
if [ "$CWD" != "$(pwd)" ]; then
  gagal "exec cwd PM2 ($CWD) TIDAK cocok dengan folder ini ($(pwd)).
       Perbaiki: pm2 delete $APP_NAME && cd $(pwd) && pm2 start ... && pm2 save"
fi

# ── 8. Smoke test ───────────────────────────────────────────────────────────
info "Smoke test"
for i in $(seq 1 15); do
  KODE="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" || true)"
  [ "$KODE" = "200" ] && break
  sleep 2
done
[ "$KODE" = "200" ] || gagal "Beranda membalas $KODE, bukan 200"
echo "  / -> 200"

# Konsol admin HARUS tertutup tanpa token. Kalau ini 200, database prospek bocor.
KODE_ADMIN="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api/leads" || true)"
[ "$KODE_ADMIN" = "401" ] || gagal "/api/leads membalas $KODE_ADMIN, seharusnya 401.
       Kalau 200, database prospek TERBUKA untuk publik — rollback sekarang."
echo "  /api/leads tanpa token -> 401 (benar)"

info "Deploy selesai."
