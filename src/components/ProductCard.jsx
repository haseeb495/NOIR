import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock < 5;

  return (
    <motion.div
      whileHover={outOfStock ? {} : { y: -6 }}
      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
      className={`group flex h-full flex-col border border-white/5 bg-charcoal transition-colors hover:border-gold/25 ${
        outOfStock ? 'opacity-60' : ''
      }`}
    >
      <Link to={`/product/${product.id}`}>
        <div className='relative h-60 overflow-hidden bg-charcoal2'>
          <img
            src={product.image_url}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
              outOfStock ? 'grayscale' : 'group-hover:scale-110'
            }`}
          />
          {outOfStock && (
            <div className='absolute left-3 top-3 border border-white/30 bg-obsidian/80 px-3 py-1 text-[10px] uppercase tracking-luxe text-bone backdrop-blur-sm'>
              Out of stock
            </div>
          )}
        </div>
      </Link>
      <div className='flex flex-1 flex-col p-5'>
        <div className='text-[11px] uppercase tracking-luxe text-gold'>
          {product.category}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className='mt-1.5 font-serif text-xl'>{product.name}</h3>
        </Link>
        <div className='mt-2 text-sm text-taupe'>
          Rs. {(product.price / 100).toLocaleString('en-PK')}
        </div>

        {lowStock && (
          <div className='mt-2 text-[11px] uppercase tracking-luxe text-gold'>
            Only {String(product.stock).padStart(2, '0')} left in stock
          </div>
        )}

        {outOfStock ? (
          <div className='mt-auto pt-4 text-[11px] uppercase tracking-luxe text-taupe'>
            Out of stock
          </div>
        ) : (
          <button
            onClick={() => addItem(product)}
            className='group/add relative mt-auto inline-block self-start pt-4 text-[11px] uppercase tracking-luxe text-bone'
          >
            Add to cart
            <span className='absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-400 group-hover/add:w-full' />
          </button>
        )}
      </div>
    </motion.div>
  );
}
