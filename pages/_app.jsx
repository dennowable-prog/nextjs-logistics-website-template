import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ThemeProvider from 'theme/ThemeProvider';
import Layout from 'components/Layout';
import FloatingPhone from '../src/components/FloatingPhone';
import seoJsonLd from '../src/seo-jsonld';

import 'animate.css';
import 'styles/style.css';
import 'styles/responsive.css';
import 'plugins/scrollcue/scrollCue.css';
import 'assets/scss/style.scss';

import { inter, jetbrainsMono, barlowCondensed } from 'fonts';

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap');
    }
  }, []);

  useEffect(() => {
    const initScrollCue = async () => {
      const scrollCue = (await import('plugins/scrollcue')).default;
      scrollCue.init({ interval: -400, duration: 700, percentage: 0.8 });
      scrollCue.update();
    };
    initScrollCue();
  }, [pathname]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const fontClassNames = `${inter.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable}`;

  return (
    <div className={fontClassNames}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Line Cargo — Транспортно-логистические услуги</title>
        <meta name="description" content="New Line Cargo — транспортно-логистическая компания с 2003 года. Авиа, ЖД, авто и морские перевозки грузов по России и миру." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="New Line Cargo — Транспортно-логистические услуги" />
        <meta property="og:description" content="New Line Cargo — транспортно-логистическая компания с 2003 года." />
        <meta property="og:image" content="https://newlinecargo.ru/og/og-default.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://newlinecargo.ru/" />
        <link rel="preload" as="image" href="/images/hero-bg.webp" />
        <link rel="preload" as="image" href="/images/logo.svg" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }}
        />
        {process.env.NEXT_PUBLIC_YM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym'); ym(${process.env.NEXT_PUBLIC_YM_ID}, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`
            }}
          />
        )}
        {(process.env.NEXT_PUBLIC_GA_ID) && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
        )}
        {(process.env.NEXT_PUBLIC_GA_ID) && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`
            }}
          />
        )}
      </Head>

      <Layout>
        <ThemeProvider>
          {loading ? (
            <div className="page-loader" />
          ) : (
            <div className="page-fade-in" key={pathname}>
              <Component {...pageProps} />
            </div>
          )}
        </ThemeProvider>
      </Layout>
      {!loading && <FloatingPhone />}
    </div>
  );
}

export default MyApp;
