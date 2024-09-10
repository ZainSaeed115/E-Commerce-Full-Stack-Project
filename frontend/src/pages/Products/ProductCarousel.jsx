import Message from "../../components/Message.jsx"
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice.js"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import moment from "moment"

import 
{
    FaBox,
    FaClock,
    FaShoppingCart,
    FaStar,
    FaStore

} from "react-icons/fa"
import Loader from "../../components/Loader.jsx"

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrow: true,
        autoplay: true,
        autoPlaySpeed: 3000,
    };

    return (
        <div className="mb-4 xl:block lg:block md:block">
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.message}
                </Message>
            ) : (
                <Slider {...settings} className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] sm:block">
                    {products?.map(
                        ({
                            image,
                            name,
                            price,
                            description,
                            _id,
                            createdAt,
                            numReviews,
                            rating,
                            quantity,
                            countInStock,
                            brand,
                        }) => (
                            <div key={_id}>
                                <img src={image} alt={name} className="w-full rounded-lg object-cover h-[30rem]" />

                                <div className="one">
                                    <h2 className="text-white font-semibold"> {name}</h2>
                                    <p className="text-white font-bold">${price}</p>
                                     <div className="grid grid-cols-3 mt-3 space-y-2">
                                     <h1 className="text-white flex">
                                            <FaStore className="mr-2 text-pink-300" />Brand: {brand}
                                    </h1>
                                    <h1 className="text-white flex">
                                            <FaClock className="mr-2 text-pink-300" />Added: {""}
                                            {moment(createdAt).fromNow()}
                                    </h1>

                                    <h1 className="text-white flex ">
                                            <FaStar className="mr-2 text-pink-300" />Reviews: {numReviews}
                                          
                                    </h1>

                                    <h1 className="text-white flex ">
                                            <FaStar className="mr-2 text-pink-300" />Rating: {Math.round(rating)}
                                          
                                    </h1>

                                    <h1 className="text-white flex ">
                                            <FaShoppingCart className="mr-2 text-pink-300" />Qauntity: {quantity}     
                                    </h1>

                                    <h1 className="text-white flex ">
                                            <FaBox className="mr-2 text-pink-300" />CountInStock: {countInStock}     
                                    </h1>
                                     </div>
                                    <br />
                                    <h2 className="text-white w-[25rem]">{description}</h2>
                                </div>

                                {/* <div className="flex justify-between w-[20rem]">
                                    <div className="one">
                                        <h1 className="flex items-center mb-6 text-white">
                                            <FaStore className="mr-2 text-white" />Brand: {brand}
                                        </h1>
                                    </div>
                                </div> */}
                            </div>
                        )
                    )}
                </Slider>
            )}
        </div>
    );
};

export default ProductCarousel;
