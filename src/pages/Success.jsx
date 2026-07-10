import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Success() {
  const { clearCart } = useCart();

  // Payment succeeded -> empty the cart.
  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='mx-auto max-w-2xl px-6 py-32 text-center'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <p className='text-[12px] uppercase tracking-wide2 text-gold'>
          Payment received
        </p>
        <h1 className='mt-5 font-serif text-5xl md:text-6xl'>Thank you.</h1>
        <p className='mx-auto mt-6 max-w-md leading-loose text-taupe'>
          Your order is confirmed. You can view it any time on your orders page.
        </p>
        <div className='mt-10 flex items-center justify-center gap-5'>
          <Link
            to='/orders'
            className='group relative overflow-hidden border border-gold px-8 py-4 text-[12px] uppercase tracking-luxe'
          >
            <span className='relative z-10 transition-colors group-hover:text-obsidian'>
              View orders
            </span>
            <span className='absolute inset-0 z-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:translate-y-0' />
          </Link>
          <Link
            to='/'
            className='text-[12px] uppercase tracking-luxe text-taupe transition-colors hover:text-bone'
          >
            Continue shopping →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
