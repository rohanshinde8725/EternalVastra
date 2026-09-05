import { useEffect, useState } from "react";
import { GiThreeLeaves } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import FadeUp from "../animations/FadeUp";
import { API_BASE_URL } from "../../api/products";

const DEFAULT_CATEGORIES = [
  { img: "/images/silk/silkCategory.png", title: "Silk Sarees" },
  { img: "/images/cotton/cottonCategory.png", title: "Cotton Sarees" },
  { img: "/images/paithani/paithaniCategory.png", title: "Paithani Sarees" },
  { img: "/images/georgette/georgetteCategory.png", title: "Georgette Sarees" },
  { img: "/images/organza/organzaCategory.png", title: "Organza Sarees" },
];

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((c) => ({
            img: c.banner?.startsWith("http")
              ? c.banner
              : `${API_BASE_URL}${c.banner || "/images/silk/silkCategory.png"}`,
            title: c.name,
          }));
          setCategories(formatted);
        }
      })
      .catch(() => {});
  }, []);

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
        
        {categories.map((cat, index) => (
          <FadeUp key={cat.title || index} delay={0.08 + (index % 5) * 0.07}>
            <div
              className="text-center group cursor-pointer"
              onClick={() => handleCategoryClick(cat.title)}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.title)}
              role="button"
              tabIndex={0}
            >
          
              {/* Image */}
              <img loading="lazy" decoding="async"
                className='h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 2xl:h-48 2xl:w-48
                object-cover rounded-full border-4 border-white group-hover:border-[#74202D] group-hover:scale-105 
                transition-all duration-300 mx-auto'
                src={cat.img}
                alt={cat.title}
              />

              {/* Title */}
              <h1 className='uppercase font-semibold mt-4 text-xs sm:text-sm md:text-base'>
                {cat.title}
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

