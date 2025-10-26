import { ShoppingCart, CreditCard, Plane, Home } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Select a Product",
      description: "Browse our curated collection of quality imports",
    },
    {
      icon: CreditCard,
      title: "Make Preorder Payment",
      description: "Secure payment for your selected items",
    },
    {
      icon: Plane,
      title: "We Ship from China",
      description: "Quality checked and shipped directly",
    },
    {
      icon: Home,
      title: "Delivery to Your Door",
      description: "Receive your products anywhere in Nigeria",
    },
  ];

  return (
    <section className="section-padding section-spacing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps to get quality imports delivered to you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-primary">
                  STEP {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
