import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, ArrowRight } from 'lucide-react';
import Footer from '../../components/footer';
import SiteNav from '../../components/site-nav';
import { AdoloSeoMark } from '../../components/logo';
import GrowTogetherCta from '../../components/grow-together-cta';
import { ctaPhoto } from '@/config/photos';

const SITE_URL = 'https://seo.adolo.id';

export async function generateStaticParams() {
  try {
    const dir = path.join(process.cwd(), 'src/content/blog');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(filename => filename.endsWith('.md') && fs.existsSync(path.join(dir, filename)))
      .map((filename) => ({ slug: filename.replace('.md', '') }));
  } catch {
    return [];
  }
}

function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'src/content/blog', slug + '.md');
  if (!fs.existsSync(filePath)) throw new Error(`Post not found: ${slug}`);
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);
  return { frontmatter, slug, content };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getPost(slug);
    const imagePath = frontmatter.image || '/images/blog/pilar1.png';
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        type: 'article',
        publishedTime: frontmatter.date,
        images: [{ url: `${SITE_URL}${imagePath}` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.description,
        images: [`${SITE_URL}${imagePath}`],
      }
    };
  } catch {
    return { title: 'Blog AdoloSEO' };
  }
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  let postData: ReturnType<typeof getPost>;
  try {
    postData = getPost(params.slug);
  } catch {
    // notFound() -> status HTTP 404 SUNGGUHAN. Sebelumnya UI 404 dikembalikan
    // dengan status 200 (soft-404): 120 berkas .mdx di folder yang sama tidak
    // punya halaman detail, dan soft-404 justru lebih buruk bagi SEO karena
    // mesin pencari tetap mengindeksnya.
    notFound();
  }
  const { frontmatter, content } = postData;
  const htmlContent = await marked.parse(content);

  const imagePath = frontmatter.image || '/images/blog/pilar1.png';

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-accent/20">
      <SiteNav />

      {/* Article Header */}
      <header className="relative overflow-hidden pb-20 pt-24">
        {/* Duotone sama seperti kartu /blog: hero artikel masih artwork
            hitam + neon kuning-emas dari palet lama. */}
        <Image
          src={imagePath}
          alt={frontmatter.title ?? 'Artikel AdoloSEO'}
          fill
          sizes="100vw"
          priority
          className="pointer-events-none object-cover opacity-20 grayscale"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-tr from-brand-900/80 via-brand-700/40 to-accent/25 mix-blend-multiply"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-brand-500/15 mix-blend-screen" />
        <div aria-hidden="true" className="absolute inset-0 bg-ink-900/60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />

        {/* Watermark AdoloSEO */}
        <div className="absolute right-6 top-8 z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-4 py-2 opacity-70 backdrop-blur-md sm:right-10">
          <AdoloSeoMark className="h-5 w-5" />
          <span className="font-display text-xs font-bold tracking-tight text-white">
            Adolo<span className="text-gradient">SEO</span> Blog
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="text-xs font-semibold text-slate-400 transition hover:text-white"
          >
            &larr; Kembali ke Indeks Blog
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="section-label rounded-full border border-accent/30 bg-brand-600/10 px-3 py-1 text-accent">
              {frontmatter.category || 'Intelijen'}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              <Clock className="h-3 w-3" /> {new Date(frontmatter.date ?? 0).toLocaleDateString('id-ID')}
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {frontmatter.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            {frontmatter.description}
          </p>
        </div>
      </header>

      {/* Article Content */}
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <article
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>

      <GrowTogetherCta
        eyebrow="Kedaulatan Digital"
        headline="Website Anda Sedang Sekarat?"
        body='Sebagian besar website bisnis menderita "Koma Digital" tanpa disadari pemiliknya. Masukkan URL Anda dan biarkan AI kami membongkar kebocoran fatal yang membuat kompetitor mencuri pelanggan Anda.'
        photo={ctaPhoto}
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-none bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition hover:bg-accent-300"
        >
          Audit Website Saya Sekarang <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/blog"
          className="flex items-center justify-center rounded-none border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
        >
          Baca Artikel Lain
        </Link>
      </GrowTogetherCta>

      <Footer />
    </div>
  );
}
