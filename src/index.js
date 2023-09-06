import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./StarRating";

function Test() {
   const [movieRating, setMovieRating] = useState(0);
   return (
      <>
         <StarRating color="blue" onSetRating={setMovieRating} />
         <p>This movie was rated {movieRating} stars</p>
      </>
   );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <React.StrictMode>
      <StarRating
         maxRating={5}
         messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
         defaultRating={2}
      />
      <Test />
   </React.StrictMode>
);
