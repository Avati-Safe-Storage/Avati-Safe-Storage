import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/+918095589888"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <MessageCircle className="w-8 h-8 text-white" />
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity: 0.3 }}
      />
    </motion.a>
  );
}
