//  components/ui/Reviews.tsx
 
import React from "react";
import HeadingDescription from "./HeadingDescription";
import ReviewsCard from "../layout/reviews/ReviewsCard";

const Reviews = () => {
  return (
    <section className="container mx-auto py-16 px-4 md:px-8">
      <HeadingDescription
        heading="Customer Reviews"
        text="Loved by Food Enthusiasts"
        description="Join thousands of satisfied customers who trust Asian Spice for authentic flavors"
      />
      
      {/* Pass a target productId if you want item-specific feedback, 
         or omit/handle overall feedback inside your API query logic 
      */}
      <ReviewsCard productId="all" />
    </section>
  );
};

export default Reviews;

/* import React from "react";
import HeadingDescription from "./HeadingDescription";

import ReviewsCard from "../layout/reviews/ReviewsCard";

const Reviews = () => {
  return (
    <section className=" container mx-auto   p-20">
      <HeadingDescription
        heading="Customer Reviews"
        text="Love by Food Enthisiasts"
        description="Join thousand of satisfied customers who trust Asian Spice for authentic flavors"
      />

      <ReviewsCard />
    </section>
  );
};

export default Reviews;
 */