import { motion } from 'framer-motion'
import useInView from '../hooks/useInView.js'

export function Reveal({ children, delay = 0, className, id }) {
  const { ref, inView } = useInView()

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal