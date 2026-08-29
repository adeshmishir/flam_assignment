import { useMemo } from 'react'
import { motion } from 'framer-motion'

const WORDS_PER_CHUNK = 3
const CHUNK_DELAY = 0.06

/**
 * Front-end "streaming" reveal.
 *
 * The full text is already in the DOM (so behaviour, accessibility and
 * existing logic are unchanged) but the visible characters fade in chunk by
 * chunk, top to bottom, mimicking an LLM streaming response.
 */
function ProgressiveText({ text, className }) {
  const chunks = useMemo(() => {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean)
    const result = []
    for (let i = 0; i < words.length; i += WORDS_PER_CHUNK) {
      result.push(words.slice(i, i + WORDS_PER_CHUNK).join(' '))
    }
    return result
  }, [text])

  if (chunks.length === 0) {
    return null
  }

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      {chunks.map((chunk, index) => (
        <motion.span
          key={`${chunk}-${index}`}
          aria-hidden="true"
          className="inline whitespace-pre-wrap"
          initial={{ opacity: 0, y: 5, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.28,
            delay: index * CHUNK_DELAY,
            ease: 'easeOut',
          }}
        >
          {chunk}&nbsp;
        </motion.span>
      ))}
    </p>
  )
}

export default ProgressiveText