import { stagger } from 'motion/react'

const navVariants = {
  open: {
    transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) }
  },
  closed: {
    transition: { delayChildren: stagger(0.05, { from: 'last' }) }
  }
}

const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } }
  },
  closed: {
    x: -50,
    opacity: 0,
    transition: { x: { stiffness: 1000 } }
  }
}

const scaleIn = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0 }
}

export { navVariants, itemVariants, scaleIn }
