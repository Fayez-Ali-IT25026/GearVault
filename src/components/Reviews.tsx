"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Rahim Uddin",
    role: "Construction Contractor",
    rating: 5,
    comment: "Rented an excavator for a week. The owner was professional and the payment process was very smooth.",
  },
  {
    name: "Nusrat Jahan",
    role: "Wedding Photographer",
    rating: 5,
    comment: "Got a full camera kit for my shoot at a great price. Everything was in perfect condition.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Event Organizer",
    rating: 4,
    comment: "The sound system arrived on time and worked perfectly. Booking was quick and easy.",
  },
  {
    name: "Sadia Islam",
    role: "Small Farm Owner",
    rating: 5,
    comment: "Renting a tractor saved me a lot of money. I will definitely use GearVault again.",
  },
];

const Reviews = () => {
  return (
    <section className="bg-[#09090b] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white">What Our Customers Say</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#a1a1aa]">
            Real feedback from people who rented equipment on GearVault.
          </p>
        </div>

        {/* cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <Quote className="h-7 w-7 text-[#3b82f6]" />

              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "fill-[#eab308] text-[#eab308]"
                        : "text-[#52525b]"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm text-[#a1a1aa]">{review.comment}</p>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-semibold text-white">{review.name}</p>
                <p className="text-xs text-[#a1a1aa]">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;