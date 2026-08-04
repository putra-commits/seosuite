# Arsip konten `.mdx` — tidak ditayangkan

**Diarsipkan 4 Agustus 2026 atas keputusan Putu.** Berkas-berkas ini **tidak dihapus** — dipindahkan ke sini supaya berhenti dibaca oleh mesin blog, tapi tetap bisa dikembalikan kapan saja.

## Isinya apa

120 berkas `.mdx` hasil commit `b3f9e6b` (*Massive RPL Gen-Z Article Generation*), plus dua berkas backlog JSON.

## Kenapa diarsipkan, bukan ditayangkan

Mesin blog hanya membaca berkas `.md`. Selama ini ke-120 berkas `.mdx` muncul di indeks blog tetapi halaman detailnya **tidak pernah ada** — pengunjung yang mengkliknya mendapat halaman kosong. Lebih buruk lagi, statusnya HTTP 200, bukan 404, sehingga mesin pencari tetap mengindeksnya.

Alasan kedua lebih penting. Sebagian besar nama berkasnya memuat klaim yang tidak bisa dipertanggungjawabkan tanpa ditinjau satu per satu:

- `beasiswa-fully-funded-bebas-utang`
- `lulus-langsung-penempatan-kerja`
- `kuliah-sambil-dibayar`

Klaim seperti ini akan tayang di bawah merek Adolo di domain hidup. Menayangkannya butuh tinjauan isi, bukan sekadar keputusan teknis.

## Efek sampingan yang menguntungkan

Satu berkas `.mdx` di sini punya frontmatter YAML rusak (tanda kutip tidak di-escape). Selama ia berada di `src/content/blog/`, `npm run build` **gagal** saat memprarender `/blog`. Memindahkannya keluar membuat build lulus.

## Kalau mau dikembalikan

```bash
git mv src/content/_arsip-mdx/<nama-berkas>.mdx src/content/blog/
```

Lalu pastikan mesin blog memang membaca `.mdx` — saat ini tidak. Dan tinjau isinya dulu.

## Riwayat tetap utuh

Pemindahan ini memakai `git mv`, jadi seluruh riwayat perubahan tiap berkas tetap bisa ditelusuri dengan `git log --follow`.
