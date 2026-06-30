import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ru">
        <Head>
          <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
          <link rel="icon" type="image/webp" href="/images/favicon.webp" sizes="32x32" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
