import { GiThreeLeaves } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import FadeUp from '../animations/FadeUp';

const Category = () => {
  const navigate = useNavigate();

  const sarees = [
    {
      img : "/images/silk/silkCategory.png",
      title : "Silk Sarees",
    },

    {
      img : "/images/cotton/cottonCategory.png",
      title : "Cotton Sarees",
    },

    {
      img : "/images/paithani/paithaniCategory.png",
      title : "Paithani Sarees",
    },

    {
      img : "/images/georgette/georgetteCategory.png",
      title : "Georgette Sarees",
    },

    // {
    //   img : "/images/categoryImg-5.png",
    //   title : "Chiffon Sarees",
    // },

    {
      img : "/images/organza/organzaCategory.png",
      title : "Organza Sarees",
    },
  ]
  const handleCategoryClick = (title) => {
    navigate(`/shop?category=${encodeURIComponent(title)}`);
  };

  return (
    <div className='py-10 bg-[#FEFAF8] w-full'>
      <div className='max-w-[1600px] mx-auto px-5'>

        {/* Heading */}
        <FadeUp delay={0.2}>
          <div className='flex items-center justify-center gap-2'>
            <GiThreeLeaves className='text-lg sm:text-xl md:text-2xl' />
            <h1 className='uppercase font-semibold text-lg sm:text-xl md:text-2xl lg:text-2xl'>
              Shop By Category
            </h1>
            <GiThreeLeaves className='text-lg sm:text-xl md:text-2xl' />
          </div>
        </FadeUp>

        {/* Grid */}
        <div className='mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 md:gap-8 lg:gap-10'>
        
        {sarees.map((saree, index) => (
          <FadeUp key={index} delay={0.3}>
            <div
              className="text-center group cursor-pointer"
              onClick={() => handleCategoryClick(saree.title)}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(saree.title)}
              role="button"
              tabIndex={0}
            >
          
              {/* Image */}
              <img loading="lazy" decoding="async"
                className='h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 2xl:h-48 2xl:w-48
                object-cover rounded-full border-4 border-white group-hover:border-[#74202D] group-hover:scale-105 
                transition-all duration-300 mx-auto'
                src={saree.img}
                alt={saree.title}
              />

              {/* Title */}
              <h1 className='uppercase font-semibold mt-4 text-xs sm:text-sm md:text-base'>
                {saree.title}
              </h1>

            </div>
          </FadeUp>
        ))}
      </div>
      </div>
    </div>
    )
  }

export default Category

