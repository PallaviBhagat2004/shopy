import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('page', page);
    api
      .get(`/products?${params.toString()}`)
      .then((r) => {
        setProducts(r.data.products);
        setPages(r.data.pages);
      })
      .finally(() => setLoading(false));
  }, [keyword, category, sort, page]);

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
  };

  return (
    <div className="container section">
      <div className="shop-header">
        <h2>Shop all products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => update('keyword', e.target.value)}
          className="search-input"
        />
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <h4>Category</h4>
          <div className="filter-list">
            <button
              className={!category ? 'filter-btn active' : 'filter-btn'}
              onClick={() => update('category', '')}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? 'filter-btn active' : 'filter-btn'}
                onClick={() => update('category', c)}
              >
                {c}
              </button>
            ))}
          </div>

          <h4>Sort by</h4>
          <select value={sort} onChange={(e) => update('sort', e.target.value)}>
            <option value="">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top rated</option>
          </select>
        </aside>

        <section className="shop-results">
          {loading ? (
            <p className="muted">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="muted">No products match your filters.</p>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={page === p ? 'page-btn active' : 'page-btn'}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
