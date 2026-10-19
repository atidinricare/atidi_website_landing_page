// @ts-nocheck
import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../src/payload.config';

async function check() {
  const payload = await getPayload({ config });
  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'terms-of-service' } },
    draft: true, // check if there is a draft vs published!
    limit: 10,
  });

  console.log('DOCS FOUND:', page.docs.length);
for (const doc of page.docs) {
  console.log('ID:', doc.id, 'STATUS:', doc.status, 'UPDATED:', doc.updatedAt);
  console.log('TITLE:', doc.title);
  const hero: any = doc.layout?.find((b: any) => b.blockType === 'hero');
  console.log('HERO:', hero);
  const legal: any = doc.layout?.find((b: any) => b.blockType === 'legalContent');
  console.log('LEGAL SECTIONS COUNT:', legal?.sections?.length);
  legal?.sections?.forEach((s: any, idx: number) => {
    console.log(`SECTION ${idx + 1}: ${s.title}`);
    s.items?.forEach((it: any, i: number) => {
      console.log(`  ITEM ${i + 1}: ${it.heading}`);
    });
  });
}

  // Also check if there are multiple pages with slug 'terms-of-service' or similar!
  const allPages = await payload.find({
    collection: 'pages',
    limit: 100,
  });
  console.log('ALL PAGE SLUGS IN CMS:', allPages.docs.map(p => ({ id: p.id, title: p.title, slug: p.slug, status: p.status, updated: p.updatedAt })));

  process.exit(0);
}

check().catch(console.error);

