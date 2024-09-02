import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./index.css"; // 기본 스타일
import "./App.css"; // 추가한 스타일
import Menubar from "./pages/Menubar";
import Bakery from "./pages/Bakery";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/recipes/RecipeDetail";
import EditRecipe from "./pages/recipes/EditRecipe";
import WriteRecipe from "./pages/recipes/WriteRecipe";
import MyRecipe from "./pages/userpage/MyRecipe";
import Diary from "./pages/Diary";
import WriteRecord from "./pages/diary/WriteRecord";
import EditRecord from "./pages/diary/EditRecord";
import Users from "./pages/Users";
import OrderList from "./pages/userpage/OrderList";
import Review from "./pages/userpage/Review";
import WriteReview from "./pages/review/WriteReview";
import SavedRecipes from "./pages/userpage/SavedRecipes";
import TestBread from "./pages/userpage/TestBread";
import OfUse from "./pages/userpage/OfUse";
import Detail from "./pages/Detail";
import Signup from "./pages/accounts/Signup";
import Login from "./pages/accounts/Login";
import SignClear from "./pages/accounts/SignClear";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import OrderClear from "./pages/OrderClear";

function App() {
  const location = useLocation();

  const hideMenubar =
    location.pathname.endsWith("/accounts/login") ||
    location.pathname.endsWith("/accounts/signup") ||
    location.pathname.endsWith("/accounts/signup-clear") ||
    location.pathname === "/" ||
    location.pathname.endsWith("/of-use");

  return (
    <div className="show_screen">
      {!hideMenubar && <Menubar />}
      <Routes>
        <Route path="/" element={<Navigate replace to="/accounts/login" />} />
        <Route path="/bakery/*" element={<Bakery />} />
        <Route path="/bakery/product/:id" element={<Detail />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/edit/:id" element={<EditRecipe />} />
        <Route path="/recipes/write" element={<WriteRecipe />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/record/write/:date" element={<WriteRecord />} />
        <Route path="/users/my-recipes" element={<MyRecipe />} />
        <Route path="edit/:id" element={<EditRecord />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/orders" element={<OrderList />} />
        <Route path="/users/reviews" element={<Review />} />
        <Route path="/users/reviews/:id" element={<WriteReview />} />
        <Route path="/users/saved-recipes" element={<SavedRecipes />} />
        <Route path="/test/result/{int:pk}" element={<TestBread />} />
        <Route path="/of-use" element={<OfUse />} />
        <Route path="/accounts/signup" element={<Signup />} />
        <Route path="/accounts/signup-clear" element={<SignClear />} />
        <Route path="/accounts/login" element={<Login />} />
        <Route path="/test/*" element={<TestBread />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/checkout" element={<Order />} />
        <Route path="/cart/orderclear" element={<OrderClear />} />
      </Routes>
    </div>
  );
}

export default App;
