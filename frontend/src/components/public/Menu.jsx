import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Grid, List, SortAsc, SortDesc, Clock, Search, X, SlidersHorizontal } from "lucide-react";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";
import ItemCard from "../common/customer/ItemCard";

const Menu = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const customerId = sessionStorage.getItem('userId');
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/category/getCategories");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:3000/api/v1/item/getItems";
        if (category) {
          url = `http://localhost:3000/api/v1/item/getItems/category/${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        let items = data.data || [];

        // Apply sorting
        if (sortOption === "low-to-high") {
          items.sort((a, b) => a.price - b.price);
        } else if (sortOption === "high-to-low") {
          items.sort((a, b) => b.price - a.price);
        } else if (sortOption === "above-500") {
          items = items.filter((item) => item.price > 500);
        } else if (sortOption === "below-500") {
          items = items.filter((item) => item.price <= 500);
        } else if (sortOption === "between-1000-2000") {
          items = items.filter((item) => item.price >= 1000 && item.price <= 2000);
        }

        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortOption]);

  const clearFilters = () => {
    setCategory("");
    setSortOption("");
  };

  const hasActiveFilters = category || sortOption;

  return (
    <>
      <Layout />
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Our Collection</h1>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Discover our premium selection of luxury timepieces, carefully curated from the world's finest brands
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Brand Category
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-white text-gray-900"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">All Brands</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sort By
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-white text-gray-900"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="">Default Sorting</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                    <option value="above-500">Price: Above Rs 500</option>
                    <option value="below-500">Price: Below Rs 500</option>
                    <option value="between-1000-2000">Price: Rs 1000 - 2000</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full mb-4 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                )}

                {/* Results Count */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">
                    {products.length} watch{products.length !== 1 ? 'es' : ''} found
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters & Sort</span>
                {hasActiveFilters && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            </div>

            {/* Products Section */}
            <div className="lg:w-3/4">
              {/* View Mode Toggle and Sort Indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "grid" 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "list" 
                        ? "bg-blue-600 text-white shadow-lg" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Indicator */}
                {sortOption && (
                  <div className="flex items-center space-x-2 text-xs text-gray-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {sortOption.includes("low-to-high") ? (
                      <SortAsc className="w-3 h-3 text-blue-600" />
                    ) : sortOption.includes("high-to-low") ? (
                      <SortDesc className="w-3 h-3 text-blue-600" />
                    ) : null}
                    <span className="text-blue-700 font-medium">
                      {sortOption === "low-to-high" && "Price: Low to High"}
                      {sortOption === "high-to-low" && "Price: High to Low"}
                      {sortOption === "above-500" && "Price: Above Rs 500"}
                      {sortOption === "below-500" && "Price: Below Rs 500"}
                      {sortOption === "between-1000-2000" && "Price: Rs 1000 - 2000"}
                    </span>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">Loading luxury watches...</p>
                  </div>
                </div>
              )}

              {/* Products Grid/List */}
              {!loading && (
                <>
                  {products.length > 0 ? (
                    <div className={viewMode === "grid" 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                      : "space-y-4"
                    }>
                      {products.map((product, index) => (
                        <div 
                          key={product._id} 
                          className={viewMode === "list" ? "bg-white rounded-xl shadow-sm border border-gray-200 p-4" : ""}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <ItemCard item={product} customerId={customerId} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">No watches found</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try adjusting your filters or browse different brands
                      </p>
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
                      >
                        <span>Clear Filters</span>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                                 {/* Category Filter */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-3">
                     Brand Category
                   </label>
                   <select
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-white text-gray-900"
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                   >
                    <option value="">All Brands</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                                 {/* Sort Options */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-3">
                     Sort By
                   </label>
                   <select
                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm bg-white text-gray-900"
                     value={sortOption}
                     onChange={(e) => setSortOption(e.target.value)}
                   >
                    <option value="">Default Sorting</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                    <option value="above-500">Price: Above Rs 500</option>
                    <option value="below-500">Price: Below Rs 500</option>
                    <option value="between-1000-2000">Price: Rs 1000 - 2000</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-3 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                )}

                {/* Results Count */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium">
                    {products.length} watch{products.length !== 1 ? 'es' : ''} found
                  </p>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Menu;
