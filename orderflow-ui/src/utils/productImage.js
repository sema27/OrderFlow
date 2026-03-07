const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5085/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
const PLACEHOLDER_HOSTS = ['via.placeholder.com', 'placehold.co', 'dummyimage.com'];

function isPlaceholderProvider(url) {
  try {
    const parsed = new URL(url);
    return PLACEHOLDER_HOSTS.some((host) => parsed.hostname.includes(host));
  } catch {
    return false;
  }
}

function resolveLocalImageByName(name = '') {
  const value = String(name).toLowerCase();

  if (/macbook|laptop|notebook|pc|bilgisayar/.test(value)) {
    return '/images/product-laptop.svg';
  }

  if (/iphone|telefon|phone|samsung|pixel/.test(value)) {
    return '/images/product-phone.svg';
  }

  return '/images/product-default.svg';
}

function truncateLabel(label = '') {
  if (!label) return 'Product';
  return label.length > 24 ? `${label.slice(0, 21)}...` : label;
}

export function buildPlaceholder(label = 'Product', size = 'card') {
  const dimensions = size === 'thumb' ? { width: 80, height: 80 } : { width: 640, height: 420 };
  const safeLabel = truncateLabel(label);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#dbeafe"/>
          <stop offset="100%" stop-color="#fde68a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <g fill="#334155" opacity="0.5">
        <circle cx="${dimensions.width * 0.2}" cy="${dimensions.height * 0.28}" r="${dimensions.width * 0.08}"/>
        <rect x="${dimensions.width * 0.12}" y="${dimensions.height * 0.42}" width="${dimensions.width * 0.76}" height="${dimensions.height * 0.28}" rx="12"/>
      </g>
      <text x="50%" y="85%" text-anchor="middle" font-family="Segoe UI, Arial" font-size="${size === 'thumb' ? 10 : 18}" fill="#0f172a" opacity="0.8">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function toAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const value = url.trim();
  if (!value) return null;

  if (value.startsWith('data:')) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `${window.location.protocol}${value}`;
  if (value.startsWith('/')) return `${API_ORIGIN}${value}`;

  return `${API_ORIGIN}/${value.replace(/^\.\//, '')}`;
}

export function getProductImageSrc(entity, fallbackLabel, size = 'card') {
  const candidates = [
    entity?.imageUrl,
    entity?.image,
    entity?.imagePath,
    entity?.thumbnailUrl,
    entity?.pictureUrl,
    entity?.photoUrl,
  ];

  const found = candidates.map(toAbsoluteUrl).find(Boolean);

  if (found && !isPlaceholderProvider(found)) {
    return found;
  }

  const localImage = resolveLocalImageByName(fallbackLabel || entity?.name || entity?.productName);
  if (localImage) return localImage;

  return buildPlaceholder(fallbackLabel, size);
}

export function onProductImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === '1') return;
  img.dataset.fallbackApplied = '1';
  img.src = buildPlaceholder(img.alt || 'Product', img.dataset.size || 'card');
}
