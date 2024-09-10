import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Ratings from "./Ratings";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import Product from "./Product";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };
  return (
    <div className="flex flex-col md:flex-row">
      {/* Section 1 */}
      <section className="mr-[5rem]">
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-white ${
            activeTab === 1 ? "font-bold text-pink-900" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
          write your review
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-white ${
            activeTab === 2 ? "font-bold text-pink-900" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg text-white ${
            activeTab === 3 ? "font-bold text-pink-900" : ""
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

    {/* Section 2 */}
      <section>
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label
                    htmlFor="rating"
                    className="block text-xl mb-2 text-white"
                  >
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg xl:w-[40rem] text-white bg-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decenet</option>
                    <option value="3">Great</option>
                    <option value="4">Excelent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div className="my-2">
                  <label
                    htmlFor="comment"
                    className="block text-xl mb-2 text-white"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="write comment here"
                    className="p-2 border rounded-lg xl:w-[40rem] text-white bg-black"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-500 text-white py-2 px-4 rounded-lg "
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-white">
                Please{" "}
                <Link to="/login" className="font-bold text-pink-200">
                  Sign in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}
      </section>


      {/* Section 3 */}
      <section>
        {
          activeTab===2&&(
              <>
              <div>
              {product.reviews.length===0&&(<p className="text-pink-400 font-bold">No Reviews</p>)}
               </div>

               <div>
                {
                  product?.reviews?.map((review)=>(
                    <div key={review._id} className="bg-[#1A1A1A] p-4 rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[50rem] sm:w-[24rem] mb-5">
                      <div className="flex justify-between">
                        <strong className="text-[#B0B0B0]">
                          {review.name}
                        </strong>
                        <p  className="text-[#B0B0B0]">{review.createdAt.substring(0,10)}</p>
                      </div>
                      <p className="py-4 text-white">{review.comment}</p>
                      <Ratings value={review.rating}/>
                    </div>
                  ))
                }
               </div>
              </>
          )
        }
      </section>


      <section>
        {
          activeTab===3&&(
           <section className="ml-[4rem] flex flex-wrap">
            {
              !data?(
                <Loader/>
              ):(
                 data.map((product)=>(
                  <div key={product._id}>
                   <SmallProduct product={product}/>
                  </div>
                 ))
              )
            }
           </section>
          )
        }
      </section>
    </div>
  );
};

export default ProductTabs;
