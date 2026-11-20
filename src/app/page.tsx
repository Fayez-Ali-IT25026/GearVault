import Categories from "@/components/Categories";
import FeaturedEquipment from "@/components/FeaturedEquipment";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Reviews from "@/components/Reviews";
import TrustedOwners from "@/components/TrustedOwners";
import WhyChooseUs from "@/components/WhyChooseUs";


export default function Home() {
  return (
    <div>
     
  <Hero/>
<Categories/>
      <FeaturedEquipment/>
      <WhyChooseUs/>
      <HowItWorks/>
      <Reviews/>
      <TrustedOwners/>
    </div>
  );
}
