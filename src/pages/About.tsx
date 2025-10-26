import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import aboutImage from "@/assets/about-image.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Gift Closet Importation
              </h1>
              <p className="text-xl text-muted-foreground">
                Your trusted partner for quality imports from China to Nigeria
              </p>
            </div>

            <div className="space-y-12">
              <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={aboutImage} 
                  alt="Gift Closet Team" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-lg max-w-none space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We simplify global shopping. Gift Closet helps you preorder directly from China 
                  with complete quality checks and delivery across Nigeria. Our mission is to make 
                  premium international products accessible to everyone, ensuring quality assurance 
                  and reliable delivery every step of the way.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  With years of experience in international procurement, we've built trusted 
                  relationships with manufacturers and logistics partners to bring you the best 
                  products at competitive prices. Every item in our catalog is carefully selected 
                  and quality-checked before shipping.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  We understand the challenges of international shopping - from finding reliable 
                  suppliers to ensuring quality and managing logistics. That's why we handle 
                  everything for you, from sourcing to delivery, so you can shop with confidence.
                </p>

                <div className="bg-secondary/50 rounded-2xl p-8 my-8">
                  <h2 className="text-2xl font-bold mb-4">Our Promise</h2>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Quality assurance on every product</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Transparent pricing with no hidden fees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Reliable delivery across Nigeria</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Dedicated customer support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = "/products"}
                  className="rounded-full font-semibold"
                >
                  Start Preordering
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
