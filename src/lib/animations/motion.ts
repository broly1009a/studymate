import { Variants } from 'framer-motion'

/* ===============================
   EASING CHUNG (cao cấp)
================================ */
export const easeOutExpo = [0.16, 1, 0.3, 1]

/* ===============================
   Fade + slide up (SECTION / HERO)
================================ */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 32
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo
    }
  }
}

/* ===============================
   Fade nhẹ (TEXT / PARAGRAPH)
================================ */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
}

/* ===============================
   Slide left (IMAGE / BLOCK)
================================ */
export const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo
    }
  }
}

/* ===============================
   Slide right (đối xứng)
================================ */
export const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo
    }
  }
}

/* ===============================
   Scale in (MODAL / CARD)
================================ */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOutExpo
    }
  }
}

/* ===============================
   Container stagger (landing page)
================================ */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

/* ===============================
   Card hover (tinh tế, không gắt)
================================ */
export const cardHover = {
  whileHover: {
    y: -8,
    scale: 1.015,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

/* ===============================
   Button tap (click cảm giác thật)
================================ */
export const buttonTap = {
  whileTap: {
    scale: 0.96
  }
}

/* ===============================
   Pulse (HERO TITLE – rất nhẹ)
================================ */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}
