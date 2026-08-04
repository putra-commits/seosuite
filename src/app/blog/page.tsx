import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import Footer from '../components/footer';
import SiteNav from '../components/site-nav';
import { AdoloSeoMark } from '../components/logo';

type PostMeta = {
  slug: string;
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  image?: string;
};

async function getPosts(): Promise<PostMeta[]> {
  const dir = path.join(process.cwd(), 'src/content/blog');
  // Hanya .md — sama seperti generateStaticParams di /blog/[slug]. Berkas .mdx
  // dan .json di folder ini tidak punya halaman detail (getPost cuma membaca
  // `${slug}.md`), jadi menampilkannya di indeks hanya menghasilkan tautan mati.
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

  const posts = files.flatMap((filename) => {
    const slug = filename.replace('.md', '');
    try {
      const markdownWithMeta = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data: frontmatter } = matter(markdownWithMeta);
      return [{ slug, ...frontmatter } as PostMeta];
    } catch (err) {
      // Frontmatter rusak tidak boleh menjatuhkan seluruh halaman indeks.
      console.warn(`[blog] lewati ${filename}:`, err instanceof Error ? err.message : err);
      return [];
    }
  });

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-ink text-white">
      <SiteNav />

      {/* Hero */}
      <header className="hero-mesh border-b border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span aria-hidden="true" className="ey-accent-bar mb-4 h-1 w-14 bg-accent" />
          <p className="section-label text-accent">Sovereign Intel</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Membongkar Rahasia <span className="text-gradient">Dominasi Pasar.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Wawasan eksklusif, strategi Enterprise SEO, dan rahasia arsitektur konversi yang
            digunakan oleh dominator industri untuk meraup miliaran rupiah.
          </p>
        </div>
      </header>

      {/* Blog Grid */}
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const imagePath = post.image || '/images/blog/pilar1.png';

            return (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl bg-ink ring-1 ring-white/10 transition hover:ring-accent/40"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10">
                  <Image
                    src={imagePath}
                    alt={post.title ?? 'Artikel AdoloSEO'}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

                  {/* Watermark AdoloSEO */}
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 backdrop-blur-md">
                    <AdoloSeoMark className="h-4 w-4" />
                    <span className="font-display text-[10px] font-bold tracking-tight text-white">
                      Adolo<span className="text-gradient">SEO</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="section-label rounded-full border border-white/10 bg-white/5 px-3 py-1 text-accent">
                      {post.category || 'Intelijen'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      <Clock className="h-3 w-3" /> {new Date(post.date ?? 0).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-xl font-bold leading-snug tracking-tight text-white transition group-hover:text-accent">
                    {post.title}
                  </h2>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {post.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-xs font-bold text-slate-500 transition group-hover:text-white">
                    Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
