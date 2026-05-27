import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir);
  return files.filter(f => f.endsWith('.md')).map(filename => ({
    slug: filename.replace('.md', '')
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Await the params before using its properties to fix the Next.js 15+ sync dynamic API warning
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  const htmlContent = await marked.parse(content);

  return (
    <article className="min-h-screen bg-[#040609] text-white pt-32 pb-24 selection:bg-amber-500/30">
      <div className="max-w-3xl mx-auto px-8 relative z-10">
        <header className="mb-16 border-b border-white/10 pb-8">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{data.date}</span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-6 leading-tight italic tracking-tighter">
            {data.title}
          </h1>
          <p className="text-zinc-400 font-bold">Oleh: {data.author}</p>
        </header>
        <div 
          className="prose prose-invert prose-amber max-w-none prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter prose-a:text-amber-500 hover:prose-a:text-amber-400"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </article>
  );
}
