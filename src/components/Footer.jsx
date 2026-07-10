import { Link } from 'react-router-dom';

const shop = [
  ['Timepieces', '/category/timepieces'],
  ['Fragrances', '/category/fragrances'],
  ['Audio', '/category/audio'],
  ['Eyewear', '/category/eyewear'],
];

const account = [
  ['Sign in', '/login'],
  ['Orders', '/orders'],
  ['Cart', '/cart'],
];

export default function Footer() {
  return (
    <footer className='border-t border-gold/15 bg-obsidian'>
      <div className='mx-auto max-w-7xl px-6 py-16'>
        <div className='grid grid-cols-2 gap-10 md:grid-cols-4'>
          <div className='col-span-2 md:col-span-1'>
            <div className='font-serif text-3xl tracking-wide2'>NOIR</div>
            <p className='mt-4 max-w-xs text-sm leading-relaxed text-taupe'>
              A curated edit of finely made things, for the few who notice the
              details.
            </p>
          </div>

          <div>
            <h4 className='text-[12px] uppercase tracking-luxe text-gold'>
              Shop
            </h4>
            <ul className='mt-5 space-y-3 text-sm text-taupe'>
              {shop.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className='transition-colors hover:text-bone'>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='text-[12px] uppercase tracking-luxe text-gold'>
              Account
            </h4>
            <ul className='mt-5 space-y-3 text-sm text-taupe'>
              {account.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className='transition-colors hover:text-bone'>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='text-[12px] uppercase tracking-luxe text-gold'>
              Contact
            </h4>
            <ul className='mt-5 space-y-3 text-sm text-taupe'>
              <li>
                <a
                  href='mailto:care@noir.store'
                  className='transition-colors hover:text-bone'
                >
                  care@noir.store
                </a>
              </li>
              <li>Karachi, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className='mt-14 border-t border-gold/10 pt-8 text-[11px] uppercase tracking-luxe text-taupe'>
          © 2026 NOIR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
