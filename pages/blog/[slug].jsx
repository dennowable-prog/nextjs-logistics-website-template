import Head from 'next/head';
import NextLink from '../../src/components/NextLink';
import blogArticles, { getBlogBySlug } from '../../src/blog-data';
import Breadcrumbs from '../../src/components/Breadcrumbs';
import QuoteForm from '../../src/components/QuoteForm';
import ReadingProgress from '../../src/components/ReadingProgress';
import { breadcrumbJsonLd } from '../../src/seo-jsonld';

export async function getStaticPaths() {
  return {
    paths: blogArticles.map((a) => ({ params: { slug: a.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = getBlogBySlug(params.slug);
  return { props: { article } };
}

const BlogArticle = ({ article }) => {
  if (!article) return null;

  return (
    <>
      <ReadingProgress />
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.metaDesc} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <meta property="og:image" content="https://newlinecargo.ru/og/og-default.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={`https://newlinecargo.ru/blog/${article.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
          { label: 'Блог', href: '/blog' },
          { label: article.h1 },
        ])) }} />
      </Head>

      <section className="wrapper position-relative" style={{ minHeight: '40vh', background: '#111111' }}>
        <div className="corrugated" />
        <div className="container position-relative" style={{ zIndex: 1, minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
          <div className="row w-100">
            <div className="col-lg-8" data-cue="fadeIn">
              <Breadcrumbs items={[
                { label: 'Блог', href: '/blog' },
                { label: article.h1 },
              ]} />
              <NextLink href="/blog" style={{ color: '#a3a3a3' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Все статьи
              </NextLink>
              <div className="d-flex align-items-center gap-3 mb-2" style={{ color: '#737373' }}>
                <span className="fs-14">{article.date}</span>
                <span className="fs-14">{article.readingTime} мин чтения</span>
              </div>
              <h1 className="display-heading-1 text-white mb-3">{article.h1}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper section-padding" style={{ background: '#1a1a1a' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8" data-cue="fadeIn">
              {article.paragraphs.map((p, i) => (
                <p key={i} className="fs-17 lh-lg mb-4" style={{ color: '#a3a3a3' }}>{p}</p>
              ))}

              <div className="mt-6 p-4" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
                <p className="fs-16 text-white fw-bold mb-2">Нужна консультация?</p>
                <p className="fs-15 mb-0" style={{ color: '#a3a3a3' }}>
                  Свяжитесь с нами — поможем подобрать оптимальный маршрут для вашего груза
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteForm />
    </>
  );
};

export default BlogArticle;
