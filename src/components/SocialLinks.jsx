import { Icon } from './Icons';

const links = [
  {
    id: 1,
    icon: 'facebook',
    url: 'https://www.facebook.com/',
    label: 'Facebook',
  },
  {
    id: 2,
    icon: 'instagram',
    url: 'https://www.instagram.com/',
    label: 'Instagram',
  },
  {
    id: 3,
    icon: 'whatsapp',
    url: 'https://www.whatsapp.com/',
    label: 'WhatsApp',
  },
];

const SocialLinks = ({ className = 'nav social mt-4' }) => {
  return (
    <nav className={className} aria-label="Social media links">
      {links.map(({ id, icon, url, label }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit our ${label} page`}
        >
          <Icon name={icon} size={26} color="#fff" />
        </a>
      ))}
    </nav>
  );
};

export default SocialLinks;
