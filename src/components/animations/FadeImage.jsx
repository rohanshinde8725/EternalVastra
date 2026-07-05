import { motion } from "framer-motion";

const FadeImage = ({ src, alt, className }) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{
        opacity: 0,
        scale: 1.1,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{ once: false }}
      transition={{
        duration: 1,
      }}
    />
  );
};

export default FadeImage;