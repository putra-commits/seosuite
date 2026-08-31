#!/usr/bin/env bash
#
# rename-vps.sh — Rename seosuite -> adoloseo di VPS (path, PM2, nginx).
#
# ADA DOWNTIME. Jalankan DI VPS sebagai root/sudo:
#   bash /opt/bigcloud/seosuite/scripts/rename-vps.sh
#
# Skrip berhenti di kesalahan pertama dan mencetak cara rollback-nya.

set -euo pipefail

LAMA_PATH="${LAMA_PATH:-/opt/bigcloud/seosuite}"
BARU_PATH="${BARU_PATH:-/opt/bigcloud/adoloseo}"
LAMA_PM2="${LAMA_PM2:-seosuite}"
BARU_PM2="${BARU_PM2:-adoloseo}"
PORT="${PORT:-3025}"
DOMAIN="${DOMAIN:-seo.adolo.id}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/sites-available/$DOMAIN}"

# AdoloSEO memakai .env, bukan Doppler (workspace Doppler mentok batas 10
# project). PM2 menjalankan `next start` langsung.

info() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }
gagal() { printf '\n\033[1;31mGAGAL: %s\033[0m\n' "$1" >&2; exit 1; }

[ -d "$LAMA_PATH" ] || gagal "$LAMA_PATH tidak ada. Sudah di-rename sebelumnya?"
[ -e "$BARU_PATH" ] && gagal "$BARU_PATH sudah ada. Bereskan dulu supaya tidak ada dua salinan."

# ── 0. Catat keadaan awal untuk rollback ────────────────────────────────────
info "Keadaan sebelum rename"
pm2 info "$LAMA_PM2" | grep -E 'exec cwd|status|script' || true
sudo ss -tlnp | grep ":$PORT " || true

# ── 1. Pastikan data lead TIDAK di dalam folder yang akan dipindah ─────────
# Kalau ADOLOSEO_DATA_DIR belum diarahkan keluar, rename ini ikut memindahkan
# database prospek dan alamatnya berubah di tengah jalan.
DATA_DIR_VAL="$(sed -n 's/^ADOLOSEO_DATA_DIR=//p' "$LAMA_PATH/.env" 2>/dev/null | tail -1 | tr -d '"'"'"'"')"
if [ -z "$DATA_DIR_VAL" ] || [[ "$DATA_DIR_VAL" == "$LAMA_PATH"* ]]; then
  gagal "ADOLOSEO_DATA_DIR belum menunjuk ke luar $LAMA_PATH (sekarang: '${DATA_DIR_VAL:-kosong}').
       Pindahkan data lead dulu:
         sudo mkdir -p /var/lib/adoloseo/data
         sudo cp -r $LAMA_PATH/data/* /var/lib/adoloseo/data/
         printf 'ADOLOSEO_DATA_DIR=/var/lib/adoloseo/data\n' >> $LAMA_PATH/.env"
fi
info "Data lead aman di luar folder app: $DATA_DIR_VAL"

# ── 2. Hentikan proses lama ─────────────────────────────────────────────────
info "Menghentikan PM2 $LAMA_PM2"
pm2 stop "$LAMA_PM2"
pm2 delete "$LAMA_PM2"

# ── 3. Pindahkan folder ─────────────────────────────────────────────────────
info "Memindahkan $LAMA_PATH -> $BARU_PATH"
sudo mv "$LAMA_PATH" "$BARU_PATH"

info "Memastikan .env ikut berpindah"
[ -f "$BARU_PATH/.env" ] || gagal ".env tidak ada di $BARU_PATH. App tidak akan punya ADMIN_TOKEN."

# ── 4. Arahkan remote git ke nama repo baru ────────────────────────────────
info "Memperbarui git remote"
cd "$BARU_PATH"
git remote set-url origin https://github.com/putra-commits/adoloseo.git
git remote -v

# ── 5. Build ulang di path baru ────────────────────────────────────────────
# Next.js menyimpan jejak path absolut; build lama dari path lama tidak sah.
info "Build ulang di path baru"
rm -rf .next
npm ci
npm run build

# ── 6. Start dengan nama baru ──────────────────────────────────────────────
info "Memeriksa port $PORT sebelum start"
SISA="$(sudo ss -tlnp | grep ":$PORT " || true)"
[ -n "$SISA" ] && { echo "$SISA"; gagal "Port $PORT masih dipakai proses lain. Bereskan dulu (gotcha #13)."; }

info "Menjalankan PM2 $BARU_PM2"
cd "$BARU_PATH"
# Sama persis dengan cara app lama dijalankan: next start langsung, port
# dipaksa lewat -p. Next.js membaca .env dari cwd saat runtime.
pm2 start ./node_modules/next/dist/bin/next --name "$BARU_PM2" -- start -p "$PORT"
pm2 save

# ── 7. Verifikasi cwd (gotcha #2) ──────────────────────────────────────────
CWD="$(pm2 info "$BARU_PM2" | grep 'exec cwd' | awk '{print $NF}')"
echo "exec cwd = $CWD"
[ "$CWD" = "$BARU_PATH" ] || gagal "exec cwd ($CWD) bukan $BARU_PATH."

# ── 8. nginx ───────────────────────────────────────────────────────────────
# proxy_pass menunjuk port, bukan path, jadi biasanya TIDAK perlu diubah.
# Yang perlu dicek: root/alias atau access_log yang menyebut path lama.
info "Memeriksa rujukan path lama di nginx"
if sudo grep -rn "$LAMA_PATH" /etc/nginx/ 2>/dev/null; then
  printf '\033[1;33mAda rujukan path lama di nginx (lihat di atas). Perbarui lalu:
  sudo nginx -t && sudo systemctl reload nginx\033[0m\n'
else
  echo "  tidak ada rujukan path lama"
fi

# ── 9. Smoke test ──────────────────────────────────────────────────────────
info "Smoke test"
for i in $(seq 1 15); do
  KODE="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/" || true)"
  [ "$KODE" = "200" ] && break
  sleep 2
done
[ "$KODE" = "200" ] || gagal "Lokal membalas $KODE.
       ROLLBACK: pm2 delete $BARU_PM2; sudo mv $BARU_PATH $LAMA_PATH; cd $LAMA_PATH; pm2 start ./node_modules/next/dist/bin/next --name $LAMA_PM2 -- start -p $PORT; pm2 save"
echo "  127.0.0.1:$PORT -> 200"

KODE_PUBLIK="$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN/" || true)"
echo "  https://$DOMAIN -> $KODE_PUBLIK"
[ "$KODE_PUBLIK" = "200" ] || printf '\033[1;33mDomain publik membalas %s. Periksa nginx block untuk %s —
tanpa block yang benar, domain jatuh ke default_server agenc1st (gotcha #4).\033[0m\n' "$KODE_PUBLIK" "$DOMAIN"

info "Rename selesai. Perbarui tabel di D:/Fullstack/CLAUDE.md: path VPS dan nama PM2 kini adoloseo."
