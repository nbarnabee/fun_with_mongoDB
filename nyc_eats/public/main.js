const boroughs = ["Manhattan", "Queens", "Brooklyn", "Bronx", "Staten Island"],
  cuisineTypes = [
    "Chicken",
    "Ice Cream, Gelato, Yogurt, Ices",
    "American",
    "Hamburgers",
    "Pizza",
    "Chinese",
    "Italian",
    "Tex-Mex",
    "Café/Coffee/Tea",
    "Pizza/Italian",
    "Latin (Cuban, Dominican, Puerto Rican, South & Central American)",
    "Irish",
    "Bakery",
    "Delicatessen",
    "Continental",
    "Spanish",
    "Seafood",
    "Jewish/Kosher",
    "Donuts",
    "German",
    "French",
    "Greek",
    "Japanese",
    "Thai",
    "Steak",
    "Indian",
    "Polish",
    "Mexican",
    "African",
    "Bagels/Pretzels",
    "Hotdogs",
    "Caribbean",
    "Korean",
    "Mediterranean",
    "Armenian",
    "Pancakes/Waffles",
    "Turkish",
    "Sandwiches/Salads/Mixed Buffet",
    "Soul Food",
    "Chinese/Cuban",
    "Egyptian",
    "Eastern European",
    "Russian",
    "Middle Eastern",
    "Barbecue",
    "English",
    "Ethiopian",
    "Vegetarian",
    "Asian",
    "Indonesian",
    "Sandwiches",
    "Portuguese",
    "Chinese/Japanese",
    "Afghan",
    "Filipino",
    "Soups & Sandwiches",
    "Vietnamese/Cambodian/Malaysia",
    "Juice",
    "Smoothies",
    "Fruit Salads",
    "Brazilian",
    "Moroccan",
    "Pakistani",
    "Tapas",
    "Peruvian",
    "Salads",
    "Bangladeshi",
    "Czech",
    "Iranian",
    "Creole",
    "Fruits/Vegetables",
    "Cajun",
    "Scandinavian",
    "Polynesian",
    "Soups",
    "Australian",
    "Hotdogs/Pretzels",
    "Southwestern",
    "Nuts/Confectionary",
    "Hawaiian",
    "Creole/Cajun",
    "Californian",
    "Chilean",
  ];

const cuisineInput = document.getElementById("cuisine"),
  cuisineSuggestions = document.querySelector(".cuisine-suggestions");

function cuisineSearch(e) {
  const inputVal = e.currentTarget.value;
  // console.log(e.currentTarget.name); // this does return the input field name, so I should be able to use that to make these functions generalizable
  let results = [];
  if (inputVal.length > 0) {
    results = searchCuisineList(inputVal);
  }
  showCuisineSuggestions(results, inputVal);
}

function searchCuisineList(str) {
  let results = [];
  const val = str.toLowerCase();
  for (let i = 0; i < cuisineTypes.length; i++) {
    if (cuisineTypes[i].toLowerCase().indexOf(val) > -1) {
      results.push(cuisineTypes[i]);
    }
  }
  return results;
}

function showCuisineSuggestions(results, inputVal) {
  cuisineSuggestions.innerHTML = "";
  if (results.length > 0) {
    for (i = 0; i < results.length; i++) {
      let item = results[i];
      const match = item.match(new RegExp(inputVal, "i"));
      item = item.replace(match[0], `<strong>${match[0]}</strong>`);
      cuisineSuggestions.innerHTML += `<li>${item}</li>`;
    }
    cuisineSuggestions.classList.add("has-suggestions");
  } else {
    results = [];
    cuisineSuggestions.innerHTML = "";
    cuisineSuggestions.classList.remove("has-suggestions");
  }
}

function useCuisineSuggestion(e) {
  cuisineInput.value = e.target.innerText;
  cuisineInput.focus();
  cuisineSuggestions.innerHTML = "";
  cuisineSuggestions.classList.remove("has-suggestions");
}

cuisineInput.addEventListener("keyup", cuisineSearch);
cuisineSuggestions.addEventListener("click", useCuisineSuggestion);
