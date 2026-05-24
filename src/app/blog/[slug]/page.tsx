import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Zap } from 'lucide-react';
import Footer from '../../components/footer';

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/blog'));
  return files.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));
}

function getPost(slug: string) {
  const markdownWithMeta = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', slug + '.md'), 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);
  return {
    frontmatter,
    slug,
    content,
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { frontmatter, content } = getPost(params.slug);
  const htmlContent = await marked.parse(content);

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
      <header className="pt-24 pb-16 border-b border-white/5 bg-[#050505] relative overflow-hidden">
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

        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-[#131316] border border-zinc-800 text-center shadow-2xl">
          <h4 className="text-2xl font-bold text-white mb-4">Berhenti Menebak Algoritma</h4>
          <p className="text-zinc-400 mb-8 font-medium">Jangan biarkan kompetitor mencuri calon pembeli Anda lagi. Gunakan SEOsuite dan mulailah mendominasi secara organik.</p>
          <Link href="/#pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black hover:opacity-90 transition-opacity">
            Lihat Harga Enterprise <Zap className="w-4 h-4 fill-black" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
