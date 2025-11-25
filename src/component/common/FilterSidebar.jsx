import React from 'react';

const FilterSidebar = ({ filters, categories, brands, onFilterChange, onClearFilters }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Filters</h5>
          <button className="btn btn-link btn-sm text-danger p-0" onClick={onClearFilters}>
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">Category</h6>
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">Brand</h6>
          <select
            className="form-select"
            value={filters.brand}
            onChange={(e) => onFilterChange({ brand: e.target.value })}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand.brandId} value={brand.brandId}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div className="mb-4">
          <h6 className="fw-semibold mb-2">Gender</h6>
          <div className="d-flex flex-column gap-2">
            {['Men', 'Women', 'Unisex'].map(gender => (
              <div key={gender} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id={gender}
                  checked={filters.gender === gender}
                  onChange={() => onFilterChange({ gender: filters.gender === gender ? '' : gender })}
                />
                <label className="form-check-label" htmlFor={gender}>
                  {gender}
                </label>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default FilterSidebar;
