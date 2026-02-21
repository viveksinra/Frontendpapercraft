export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
