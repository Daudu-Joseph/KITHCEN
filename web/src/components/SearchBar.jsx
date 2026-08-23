import { useUi } from "../context/UiContext";

export default function SearchBar() {
  const { searchOpen, closeSearch } = useUi();

  return (
    <div className={`search-bar ${searchOpen ? "show" : "d-none"}`} id="search-container">
      <div className="close-btn" id="search-close-btn" onClick={closeSearch} role="button" tabIndex={0}>
        <i className="fa fa-close"></i>
      </div>
      <div className="search-bar-wrapper">
        <input type="search" placeholder="Enter any text here..." />
        <div className="search-button">
          <a href="#">
            <i className="fa fa-search"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
