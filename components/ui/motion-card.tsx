import { motion } from "framer-motion";

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
}

export const MotionCard = ({ children, className }: MotionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white p-6 rounded-lg shadow-md ${className}`}
    >
      {children}
    </motion.div>
  );
};
