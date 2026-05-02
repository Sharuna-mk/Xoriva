import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import forHer from "../../assets/image.png";
import forHim from "../../assets/forhim.jpeg";
import { useNavigate } from "react-router-dom";

const GenderSection = () => {
  const navigate = useNavigate();

  const genderCards = [
    {
      id: "women",
      label: "WOMEN'S EDIT",
      title: "For her",
      image: forHer,
      gender: "women",
    },
    {
      id: "men",
      label: "MEN'S EDIT",
      title: "For him",
      image: forHim,
      gender: "men"
    },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 pt-6 md:pt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {genderCards.map((g, index) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 30 }}
            onClick={() => navigate("/products", { state: { gender: g.gender } })}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer h-[260px] sm:h-[340px] md:h-[420px] group"
          >

            <motion.img
              src={g.image}
              alt={g.title}
              className="w-full h-full object-fit"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />


            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6">
              <div className="transform translate-y-0 sm:translate-y-2 group-hover:translate-y-0 transition-all duration-500 opacity-100 sm:opacity-90 group-hover:opacity-100">
                <p className="text-[10px] sm:text-[11px] font-medium text-blue-300 tracking-widest mb-1 uppercase">
                  {g.label}
                </p>

                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3">
                  {g.title}
                </p>

                <button className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-white border border-white/30 bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300 group/btn">
                  Explore
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="absolute inset-0 opacity-20 sm:opacity-0 group-hover:opacity-100 transition duration-700">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GenderSection;