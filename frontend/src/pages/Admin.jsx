import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiBox,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiLogOut,
  FiMoon,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiSun,
  FiTag,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { API_BASE_URL } from "../api/products";

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const menuItems = [
  { label: "Overview", icon: FiGrid },
  { label: "Orders", icon: FiShoppingBag },
  { label: "Products", icon: FiBox },
  { label: "Customers", icon: FiUsers },
  { label: "Marketing", icon: FiTag },
];

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("adminTheme") || "dark");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.documentElement.dataset.adminTheme = theme;
    localStorage.setItem("adminTheme", theme);
    return () => {
      delete document.documentElement.dataset.adminTheme;
    };
  }, [theme]);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/api/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load products");
        return response.json();
      })
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        if (active) setError("Connect the backend to load your catalogue.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.title, product.tag, ...(product.category || [])].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [products, searchTerm]);

  const revenue = products.reduce((total, product) => total + Number(product.discountPrice || 0), 0);
  const averagePrice = products.length ? Math.round(revenue / products.length) : 0;
  const categoryCount = new Set(products.flatMap((product) => product.category || [])).size;

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, { method: "POST", body: form });
      if (!response.ok) throw new Error("Unable to add product");
      const product = await response.json();
      setProducts((current) => [...current, product].sort((a, b) => a.id - b.id));
      setIsAddProductOpen(false);
      setNotice("Product added to your catalogue.");
    } catch {
      setNotice("Product could not be added. Check the form and backend.");
    }
  };

  return (
    <div className="admin-shell min-h-screen">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark"><FiShoppingBag /></span>
          <span><strong>Eternal Vastra</strong><small>atelier console</small></span>
        </div>
        <div className="admin-label">Workspace</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {menuItems.map(({ label, icon: Icon }) => (
            <button key={label} className={activeMenu === label ? "active" : ""} onClick={() => setActiveMenu(label)}>
              <Icon /><span>{label}</span>{label !== "Overview" && <FiChevronRight className="nav-arrow" />}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <button className="admin-nav-link"><FiSettings /><span>Settings</span></button>
          <div className="admin-user">
            <span className="admin-avatar">SA</span>
            <span><strong>Super Admin</strong><small>Store owner</small></span>
            <FiChevronDown />
          </div>
          <Link to="/" className="admin-nav-link"><FiLogOut /><span>Back to storefront</span></Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>ATELIER</span><FiChevronRight /><strong>{activeMenu.toUpperCase()}</strong></div>
          <div className="admin-top-actions">
            <button className="admin-icon-button" aria-label="Notifications"><FiBell /><i /></button>
            <button className="admin-theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle light and dark theme">
              {theme === "dark" ? <FiSun /> : <FiMoon />}<span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <span className="admin-avatar">SA</span>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-welcome">
            <div><p className="admin-eyebrow">Friday, 28 August 2026</p><h1>Welcome back, Admin.</h1><p>Here is what is happening with your saree store today.</p></div>
            <button className="admin-primary-button" onClick={() => setIsAddProductOpen(true)}><FiPlus /> Add product</button>
          </section>

          {notice && <div className="admin-notice">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notice"><FiX /></button></div>}

          <section className="admin-stat-grid" aria-label="Store metrics">
            <article className="admin-stat-card accent-rose"><span className="stat-icon"><FiTrendingUp /></span><p>Total revenue</p><strong>{formatCurrency(revenue)}</strong><small><b>+12.8%</b> from last 30 days</small><div className="stat-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="admin-stat-card accent-green"><span className="stat-icon"><FiShoppingBag /></span><p>Total orders</p><strong>{products.length || 0}</strong><small><b>+8.4%</b> from last 30 days</small><div className="stat-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="admin-stat-card accent-gold"><span className="stat-icon"><FiTag /></span><p>Average order value</p><strong>{formatCurrency(averagePrice)}</strong><small><b>+5.2%</b> from last 30 days</small><div className="stat-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="admin-stat-card accent-blue"><span className="stat-icon"><FiBox /></span><p>Active showcase</p><strong>{products.length || 0}</strong><small><b>{categoryCount}</b> collections live</small><div className="stat-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
          </section>

          <section className="admin-panel-grid">
            <article className="admin-panel admin-chart-panel"><div className="panel-heading"><div><h2>Revenue overview</h2><p>Catalogue value across your current collection</p></div><select aria-label="Revenue period"><option>Last 30 days</option><option>Last 7 days</option></select></div><div className="admin-chart"><div className="chart-y"><span>30k</span><span>20k</span><span>10k</span><span>0</span></div><svg viewBox="0 0 640 190" role="img" aria-label="Revenue trend"><path d="M0 158 C40 145 62 152 92 126 S145 114 168 136 S230 146 255 108 S306 72 338 100 S382 127 407 77 S455 84 481 107 S520 72 550 84 S600 50 640 32" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M0 158 C40 145 62 152 92 126 S145 114 168 136 S230 146 255 108 S306 72 338 100 S382 127 407 77 S455 84 481 107 S520 72 550 84 S600 50 640 32 V190 H0Z" fill="currentColor" opacity=".09" /></svg><div className="chart-x"><span>01 Aug</span><span>08 Aug</span><span>15 Aug</span><span>22 Aug</span><span>Today</span></div></div></article>
            <article className="admin-panel admin-collection-panel"><div className="panel-heading"><div><h2>Top collections</h2><p>Most valuable categories</p></div><FiChevronRight /></div>{(products.length ? Array.from(new Set(products.flatMap((product) => product.category || []))).slice(0, 4) : ["Silk Sarees", "Cotton Sarees", "Paithani Sarees"]).map((category, index) => <div className="collection-row" key={category}><span className={`collection-number number-${index + 1}`}>0{index + 1}</span><span>{category}</span><strong>{formatCurrency(products.filter((product) => product.category?.includes(category)).reduce((sum, product) => sum + Number(product.discountPrice || 0), 0))}</strong></div>)}</article>
          </section>

          <section className="admin-panel admin-products-panel"><div className="panel-heading products-heading"><div><h2>Product catalogue</h2><p>Manage the sarees shown on your storefront.</p></div><div className="admin-products-tools"><label><FiSearch /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search products" /></label><button className="admin-filter-button">Filter <FiChevronDown /></button></div></div>{loading && <p className="admin-empty">Loading your catalogue...</p>}{error && <p className="admin-empty admin-error">{error}</p>}{!loading && !error && <div className="admin-table-wrap"><table><thead><tr><th>Product</th><th>Collection</th><th>Price</th><th>Rating</th><th>Status</th><th /></tr></thead><tbody>{filteredProducts.slice(0, 8).map((product) => <tr key={product.id}><td><div className="product-cell"><img src={product.img?.startsWith("http") ? product.img : `${API_BASE_URL}${product.img}`} alt="" /><span><strong>{product.title}</strong><small>{product.tag || "Handcrafted"}</small></span></div></td><td>{product.category?.[0] || "Uncategorised"}</td><td>{formatCurrency(product.discountPrice)}</td><td><span className="rating-star">&#9733;</span> {product.rating || "0"}</td><td><span className="status-pill">In showcase</span></td><td><button className="row-menu" aria-label={`Open actions for ${product.title}`}><FiChevronDown /></button></td></tr>)}</tbody></table>{!filteredProducts.length && <p className="admin-empty">No products match this search.</p>}</div>}</section>
        </div>
      </main>

      {isAddProductOpen && <div className="admin-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsAddProductOpen(false)}><form className="admin-modal" onSubmit={handleAddProduct}><div className="modal-heading"><div><p className="admin-eyebrow">New listing</p><h2>Add a product</h2></div><button type="button" onClick={() => setIsAddProductOpen(false)} aria-label="Close"><FiX /></button></div><label>Title<input name="title" required placeholder="e.g. Rose Gold Paithani" /></label><div className="form-row"><label>Category<input name="category" required placeholder="Silk Sarees" /></label><label>Tag<input name="tag" placeholder="New" /></label></div><div className="form-row"><label>Sale price<input name="discountPrice" required type="number" min="0" /></label><label>Actual price<input name="actualPrice" required type="number" min="0" /></label></div><label>Product image<input name="image" required type="file" accept="image/*" /></label><button className="admin-primary-button" type="submit"><FiPlus /> Publish product</button></form></div>}
    </div>
  );
};

export default Admin;
