const cutoutMenuImages = new Set([
  'arancini.png',
  'beef-bianco-pizza.png',
  'beef-bianco.png',
  'bianco-salad.png',
  'burrata-salad.png',
  'chicken-polo-pizza.png',
  'chili-shrimp.png',
  'coffee-americano.webp',
  'diavola-pizza.png',
  'french-fries.png',
  'funghi-risotto.png',
  'grilled-salmon.png',
  'margherita-pizza.png',
  'mushroom-soup.png',
  'penne-rose.png',
  'pesto-pizza.webp',
  'pumpkin-soup.webp',
  'quinoa-salad.webp',
  'rigatoni-pesto.png',
  'seafood-spaghetti.png',
  'truffle-fettuccine.png',
  'truffle-pizza.png',
]);

const menuImageOverrides: Record<string, string> = {
  'portobello-shrimp-salad.png': 'portobello-shrimp-salad.jpg',
};

export function resolveMenuImage(path: string | null | undefined) {
  if (!path) return null;

  const normalizedPath = path.replace(/^\/+/, '');
  const filename = normalizedPath.split('/').pop() ?? '';
  const directory = normalizedPath.slice(0, normalizedPath.length - filename.length);
  const overriddenFilename = menuImageOverrides[filename];
  const resolvedFilename =
    overriddenFilename ??
    (cutoutMenuImages.has(filename)
      ? filename.replace(/\.[^.]+$/, '-cutout.png')
      : filename);

  return `${import.meta.env.BASE_URL}${directory}${resolvedFilename}`;
}

export function isMenuCutoutImage(path: string | null | undefined) {
  return Boolean(path?.includes('-cutout.png'));
}