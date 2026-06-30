import NextLink from './NextLink';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="d-flex flex-wrap align-items-center gap-2 m-0 p-0 list-unstyled fs-14" style={{ color: '#737373' }}>
        <li>
          <NextLink href="/" style={{ color: '#737373', textDecoration: 'none' }}>Главная</NextLink>
          <span className="ms-2">/</span>
        </li>
        {items.map((item, i) => (
          <li key={i}>
            {item.href ? (
              <>
                <NextLink href={item.href} style={{ color: '#737373', textDecoration: 'none' }}>{item.label}</NextLink>
                <span className="ms-2">/</span>
              </>
            ) : (
              <span style={{ color: '#a3a3a3' }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
