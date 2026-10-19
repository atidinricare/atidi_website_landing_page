import 'dotenv/config';
import { getPageBySlug } from '../src/lib/data';

async function check() {
  const page = await getPageBySlug('terms-of-service');
  console.log('PAGE FOUND:', Boolean(page));
  if (!page) {
    console.log('Page is null!');
    process.exit(0);
  }
  console.log('TITLE:', page.title);
  console.log('STATUS:', page.status);
  console.log('LAYOUT COUNT:', page.layout?.length);
  for (const b of (page.layout || [])) {
    console.log('BLOCK TYPE:', b.blockType);
    if (b.blockType === 'legalContent') {
      console.log('SECTIONS TYPE:', typeof b.sections, Array.isArray(b.sections));
      console.log('SECTIONS LENGTH:', b.sections?.length);
      console.log('FIRST SECTION:', JSON.stringify(b.sections?.[0], null, 2));
    }
  }
  process.exit(0);
}

check().catch(e => { console.error(e); process.exit(1); });

