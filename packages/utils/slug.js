import slugify from 'slugify';

function createSlug(title) {
  const uniqueSuffix = Date.now().toString(36);
  let slug = slugify(title, {
    lower: true,
    locale: 'fr',
    strict: true,
    trim: true,
  });

  return `${slug}-${uniqueSuffix}`;
}

export { createSlug };
