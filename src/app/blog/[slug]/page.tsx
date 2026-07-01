import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowLeft, BookOpen, Clock, Zap } from 'lucide-react';
import Footer from '../../components/footer';

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
        images: [{ url: `https://seosuite.info${imagePath}` }],
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.description,
        images: [`https://seosuite.info${imagePath}`],
      }
    };
  } catch (e) {
    return { title: 'Blog SEOsuite' };
  }
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  let postData: ReturnType<typeof getPost>;
  try {
    postData = getPost(params.slug);
  } catch {
    return <div className="min-h-screen bg-[#090b10] text-white flex items-center justify-center"><p>Post tidak ditemukan.</p></div>;
  }
  const { frontmatter, content } = postData;
  const htmlContent = await marked.parse(content);

  const imagePath = frontmatter.image || '/images/blog/pilar1.png';

  return (
    <div className="min-h-screen bg-[#090b10] text-white selection:bg-yellow-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#090b10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Indeks Blog
          </Link>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <Zap size={16} className="text-black fill-black" />
            </div>
            <p className="text-xl font-bold text-white tracking-tight hidden md:block">
              SEO<span className="text-zinc-500 font-medium">suite</span>
            </p>
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <header className="pt-32 pb-24 relative overflow-hidden">
        <Image src={imagePath} alt={frontmatter.title} fill className="object-cover opacity-20 pointer-events-none" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/80 to-transparent" />
        
        {/* SEOsuite Watermark */}
        <div className="absolute top-32 right-8 md:right-16 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-10 opacity-70">
          <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
            <Zap size={12} className="text-black fill-black" />
          </div>
          <span className="text-xs font-bold text-white tracking-tight">SEO<span className="text-zinc-400">suite</span> Blog</span>
        </div>

        <div className="max-w-3xl mx-auto px-8 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-black text-yellow-500 uppercase tracking-widest rounded-full">
              {frontmatter.category || 'Intelijen'}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <Clock className="w-3 h-3" /> {new Date(frontmatter.date).toLocaleDateString('id-ID')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8 leading-tight">
            {frontmatter.title}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
            {frontmatter.description}
          </p>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-8 py-20">
        <article 
          className="prose prose-invert prose-lg prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-yellow-500 prose-a:no-underline hover:prose-a:text-yellow-400 prose-strong:text-white prose-blockquote:border-yellow-500 prose-blockquote:bg-yellow-500/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-20 p-10 rounded-3xl bg-[#131316] border border-yellow-500/30 text-center shadow-[0_0_50px_rgba(234,179,8,0.05)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h4 className="text-2xl font-black text-white mb-4 relative z-10">Website Anda Sedang Sekarat?</h4>
          <p className="text-zinc-400 mb-8 font-medium relative z-10 max-w-xl mx-auto">Sebagian besar website bisnis menderita "Koma Digital" tanpa disadari pemiliknya. Masukkan URL Anda dan biarkan AI kami membongkar kebocoran fatal yang membuat kompetitor mencuri pelanggan Anda.</p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-black hover:opacity-90 transition-opacity shadow-[0_10px_30px_rgba(220,38,38,0.3)] relative z-10 uppercase tracking-wide">
            Audit Website Saya Sekarang <Zap className="w-4 h-4 fill-white" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
