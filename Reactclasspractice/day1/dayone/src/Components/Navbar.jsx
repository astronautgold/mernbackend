import { Link } from "react-router-dom";

const Navbar=()=>{
    return(<>
   
     
    <div classname="bg-amber-200 flex justify-content-between">
        
        <Logo/>
    <Links/></div>
    </>)
}
export default Navbar;

const Logo=()=>{
 return(<>
 <div> <img src="logo.png" alt="Logo" /></div>

 </>)
}
const Links=()=>{

    return(<>
    
  <div classname="bg-amber-200 flex justify-content-between">
    <Link to="/">Home</Link>
    <Link to="products">products</Link>
    <Link to="cart">cart</Link>
    <Link to="favourites">favourites</Link>
    <Link to="feedback">feedback</Link>
  </div>

    </>)
}
