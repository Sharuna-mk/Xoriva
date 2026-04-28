import React from "react";

const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet</p>;
  }

  const avgRating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

  const ratingCount = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    ratingCount[r.rating - 1]++;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">

      <div className="md:w-1/3 w-full bg-white p-4 rounded-xl shadow-md border border-gray-300">
        <h2 className="text-3xl font-bold text-yellow-500">
          {avgRating.toFixed(1)} ⭐
        </h2>
        <p className="text-gray-500 mb-4">{reviews.length} reviews</p>

     
        {ratingCount
          .map((count, i) => {
            const percentage = (count / reviews.length) * 100;
            return (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-sm w-10">{5 - i}⭐</span>

                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-yellow-500 rounded"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <span className="text-sm text-gray-600">{count}</span>
              </div>
            );
          })
          .reverse()}
      </div>

      
      <div className="md:w-2/3 w-full">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-300  rounded-xl p-4 hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">
                  {review.reviewerName}
                </h4>

                <span className="text-yellow-500 text-sm">
                  {"⭐".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>

              <p className="text-gray-600 mt-2 text-sm">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;