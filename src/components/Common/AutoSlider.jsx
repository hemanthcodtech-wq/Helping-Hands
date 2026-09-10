import { motion } from "framer-motion"

export default function AutoSlider({ children, duration = 24, gap = "gap-5", className = "" }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className={`flex w-max ${gap}`}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        whileHover={{ animationPlayState: "paused" }}
      >
        <div className={`flex shrink-0 ${gap}`}>{children}</div>
        <div className={`flex shrink-0 ${gap}`} aria-hidden="true">{children}</div>
      </motion.div>
    </div>
  )
}
