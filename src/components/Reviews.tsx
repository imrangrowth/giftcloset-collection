import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Chioma Adebayo",
    location: "Lagos",
    text: "Amazing quality products! I ordered the kids clothing set and it exceeded my expectations. Fast delivery too!",
    rating: 5,
  },
  {
    name: "Ibrahim Yusuf",
    location: "Abuja",
    text: "The bulk snacks deal was perfect for my store. Great prices and authentic products. Highly recommend!",
    rating: 5,
  },
  {
    name: "Ngozi Okafor",
    location: "Port Harcourt",
    text: "Professional service from start to finish. The wholesale plates are exactly what I needed for my restaurant.",
    rating: 5,
  },
  {
    name: "Tunde Afolabi",
    location: "Ibadan",
    text: "Best import deals I've found! Quality is top-notch and customer service is excellent. Will definitely order again.",
    rating: 5,
  },
  {
    name: "Fatima Mohammed",
    location: "Kano",
    text: "Very satisfied with my purchase. Products arrived in perfect condition and the prices are unbeatable!",
    rating: 5,
  },
];

const Reviews = () => {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers across Nigeria
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="border-primary/10">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {review.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
