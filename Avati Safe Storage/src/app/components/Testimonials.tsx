import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
    text: "Avati Safe Storage has been a game-changer for my business. The security and accessibility are unmatched. Highly recommend!"
  },
  {
    name: "Priya Sharma",
    role: "Homeowner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 5,
    text: "Moving to a smaller apartment was stress-free thanks to Avati. Their professional team handled everything perfectly."
  },
  {
    name: "Amit Patel",
    role: "IT Professional",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    rating: 5,
    text: "The climate-controlled units and 24/7 security give me complete peace of mind. Excellent service from start to finish."
  },
  {
    name: "Sneha Reddy",
    role: "Entrepreneur",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 5,
    text: "Professional, reliable, and affordable. Avati Safe Storage exceeded all my expectations. The best storage solution in the city!"
  },
  {
    name: "Vikram Singh",
    role: "Frequent Traveler",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    rating: 5,
    text: "As someone who travels frequently, knowing my valuables are secure in a climate-controlled environment gives me incredible peace of mind."
  },
  {
    name: "Neha Gupta",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
    rating: 5,
    text: "I constantly need to store furniture and decor for clients. Avati makes it incredibly easy to manage my inventory with their flexible plans."
  },
  {
    name: "Arjun Desai",
    role: "Student",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
    rating: 4,
    text: "Perfect for storing my dorm room items during the summer break. The student discounts and hassle-free pickup were exactly what I needed."
  },
  {
    name: "Kavita Verma",
    role: "Event Planner",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    rating: 5,
    text: "Managing event props is a nightmare without proper storage. Avati's 24/7 access allows me to retrieve items even for late-night setups."
  },
  {
    name: "Siddharth Nair",
    role: "Tech Startup Founder",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop",
    rating: 5,
    text: "We use Avati to store our archived documents and spare server racks. Their top-notch security protocols perfectly align with our company's standards."
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    if (currentIndex === testimonials.length) {
      // After transitioning to the duplicate first card, wait for animation to finish then snap to real first card
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setCurrentIndex(0);
      }, 500); // matches the 0.5s transition duration
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const displayTestimonials = [...testimonials, ...testimonials];
  const totalItems = displayTestimonials.length;

  return (
    <section className="py-24 bg-gradient-to-br from-[#0B1F3A] to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-white mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Trusted by thousands of satisfied customers
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden w-full -mx-3 px-3">
            <motion.div
              className="flex"
              style={{ width: `${(totalItems / itemsPerView) * 100}%` }}
              animate={{ x: `-${(currentIndex / totalItems) * 100}%` }}
              transition={{ duration: isAnimating ? 0.5 : 0, ease: "easeInOut" }}
            >
              {displayTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="px-3"
                  style={{ width: `${100 / totalItems}%` }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 bg-white rounded-2xl shadow-xl h-full flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-lg text-black">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed flex-grow">
                      "{testimonial.text}"
                    </p>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  (currentIndex % testimonials.length) === index ? 'bg-[#D4AF37] w-8' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
