import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import aboutImage from "@/assets/about-image.jpg";

const AboutPreview = () => {
  return (
    <section className="section-padding section-spacing bg-secondary/30">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold">
              About Gift Closet Importation
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              We simplify global shopping. Gift Closet helps you preorder directly from China 
              with complete quality checks and delivery across Nigeria. Our mission is to make 
              premium international products accessible to everyone, ensuring quality assurance 
              and reliable delivery every step of the way.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              With years of experience in international procurement, we've built trusted 
              relationships with manufacturers and logistics partners to bring you the best 
              products at competitive prices.
            </p>
            <Link to="/about">
              <Button size="lg" variant="outline" className="rounded-full font-semibold">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={aboutImage} 
                alt="Gift Closet Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
