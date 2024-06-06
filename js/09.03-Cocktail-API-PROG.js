// Lesson 09.03 - PROG
// Cocktail API 

/* There are 3 ways to get cocktails: 
- search box: input keyword /ingredient
- select menu: choose keyword / ingredient
- button: get random cocktail
ALL 3 ways call the same function: getCocktail
*/

// Get the DOM elements:

// 1. Get search box (input) and have it call fetchCocktail():
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('change', fetchCocktail);

// 2. Get the select menu and have it call fetchCocktail():
const selectMenu = document.getElementById('menu');
selectMenu.addEventListener('change', fetchCocktail);

cocktailKeywords.sort();
// make dynamic menu using cocktail-keywords.js
cocktailKeywords.forEach(keywd =>{
    const optn = document.createElement('option');
    optn.value = keywd.toLowerCase();
    optn.text = keywd;
    selectMenu.appendChild(optn);
})

// 3. Get the Random button and have it call fetchCocktail():
const randBtn = document.querySelector('#rand-btn');
randBtn.addEventListener('click', fetchCocktail);

// 4. Get the button div (letter button holder)
const letterBtnsDiv = document.getElementById('letter-btn-div');

// let letterAFromCharCode = String.fromCharCode(65);
// console.log('letterAFromCharCode', letterAFromCharCode)
const lettersArr = [];
let startCharCode = "A".charCodeAt(0);
let endCharCode = startCharCode + 26;
for(let i = startCharCode; i < endCharCode; i++) {
    let letterFromCharCode = String.fromCharCode(i);
    lettersArr.push(letterFromCharCode);
}

console.log('lettersArr', lettersArr)

lettersArr.forEach(letter => {
    if(letter != "U" && letter != "X" ) {
    const letterBtn = document.createElement('button');
    letterBtn.className = 'letter-btn';
    letterBtn.textContent = letter;
    letterBtn.id = letter.toLowerCase();
    letterBtn.addEventListener('click', fetchCocktail);
    letterBtnsDiv.appendChild(letterBtn);
}
})

// 5. Get the "Cocktail Box" (where all results appear)
const cocktailBox = document.querySelector('#cocktail-box');

// 6. Define the fetchCocktail() function
/*
all 3 ways of hitting API use the same func: text input, select menu, random button function concats rest of url from id of elem that is calling the func API returns JSON for the cocktail(s); structure is one obj w "drinks" key, the value of which is an array of individual drink objects each drink obj has numerous keys, including strDrink, strGlass, among others; oddly, the ingredients and measures are NOT arrays, but instead are individual key-value pairs: strIngredient1: "rum", strIngredient2: "lime juice", etc. (same for corresponding strMeasure1, strMeasure2, etc) function will loop the array of drink results, making divs containing img of drink, name of drink, glass, instructions, and even a ul of ingredients with their measures
*/

function fetchCocktail() {
let apiUrl = "https:thecocktaildb.com/api/json/v1/1/";

cocktailBox.innerHTML = "";
    // 7. Save the base url to a var. All queries to API 
    //    start with this same base url:

    
    /* Add the custom part to the API URL: finish the API URL by adding value 
    (or id) of element that called the func. In the case on the input box and 
    the select menu, we want to add the value to the URL but in the case of 
    the random button, the URL is already complete */

    // 8. Decide which API request we are making: Keyword Search or Random; to do this we need to know what's calling the fucntion: the input box or the random button:
    if(this.id == "search-box" || this.id == "menu") {
        apiUrl += 'search.php?s=' + this.value;
    } else if(this.id.length == 1) {
        apiUrl += 'search.php?f=' + this.id;
    } else { // only other search elem is Random Btn
        apiUrl += 'random.php';
    }

    // 9. Send the fetch() request to the API:
    fetch(apiUrl, {method:"GET"})
    .then(j => j.json())
    .then(obj => {
        // the result is an object, represented here as obj
        // the obj has just one key: "drinks"
        // the value of drinks is an array of drink objects
        // each drink object has keys, the values of which
        // are what we want to display on the DOM 
        // log the name of the first drink:
        console.log('obj.drinks[0].strDrink:', obj.drinks[0].strDrink);
        obj.drinks.sort((a,b) => a.strDrink > b.strDrink ? 1 : -1);
        console.log('obj.drinks:', obj.drinks);

        obj.drinks.forEach(drink => {

        // output drinks to DOM, one drink per div
        const drinkDiv = document.createElement('div');
        drinkDiv.className = 'drink-div';
        cocktailBox.appendChild(drinkDiv);

        // append child elements for each drink
 
        // container div for drink elements


       // drink name strDrink
       const drinkH2 = document.createElement('h2');
       drinkDiv.appendChild(drinkH2)
       drinkH2.textContent = drink.strDrink;

        // Glass type strGlass
        drinkDiv.innerHTML += drink.strGlass;

        const drinkTextDiv = document.createElement('div');
        drinkTextDiv.className = "drink-text-div";
        drinkDiv.appendChild(drinkTextDiv);

        const intructionsP = document.createElement('p');
        intructionsP.innerHTML = drink.strInstructions;
        drinkTextDiv.appendChild(intructionsP);

        drinkTextDiv.innerHTML += "Ingredients:";
        
        const ul = document.createElement('ul');
        drinkTextDiv.appendChild(ul);

        for(let i = 1; i <= 15; i++) {
            
            let ingred = "strIngredient" + i;
            let measur = "strMeasure" + i;
            const li = document.createElement('li');
            if(drink[ingred]) {


                li.textContent = drink[ingred] + " - " + drink[measur];
            } else {
                break;
            }
            ul.appendChild(li);
        }
        drinkTextDiv.appendChild(ul)


        // for each, an li indredient-measurement pair
        // drinkUl.innerHTML = `<li>${drink.strIngredient[i]} - ${drink.strMeasure[i]}</li>`
        // p strinstructions .drink-text-div overlow:scroll
        // ul, li Stringredients[i] + strMeasure[i]
               // push each to cocktailBox
        const drinkPic = new Image();
        drinkPic.src = drink.strDrinkThumb;
        drinkDiv.appendChild(drinkPic);

    })

// .catch(err => console.log("Something went wrong", err))

}) // end function fetchCocktail() 

// Challenge 2: Make 26 buttons, one per letter, and put them into the btn-div. The css for the buttons is already done. Use the letter-btn class for each button. Have each button call a function called getCocktailsByLetter():
// Hint: refer to Chinese Zodiac Animals (06.02-06.03) for how to make elements dynamicallyw/ a loop.
// Hint 2: each button needs an id and text content, which in both cases is just the letter.

// "btn-div"

// for (let l = 'A'; l <= 'Z'; l = String.fromCharCode(l.charCodeAt(0) + 1)) {
//     let l = lettersArr[i];
//     if(l == "U" || l == "X") continue;
//     const button = document.createElement("button");
//     button.textContent = l;
//     button.id = l.toLowerCase();
//     button.className = "letter-btn";
//     button.addEventListener("click", getCocktail);
//     btnDiv.appendChild(button);
// }

// "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
// ''

// for (let l = 'A'; l <= 'Z'; l = String.fromCharCode(l.charCodeAt(0) + 1)) {
// forEa
    // "U" "X"
        // "button"
        // l
        // Case
        // "letter-btn"
        // "click"
        // append
//     }
// });

// for(let i = 0; i < lettersArr.length; i++) {
//     let l = lettersArr[i];
//     if(l == "U" || l == "X") continue;
//     const button = document.createElement("button");
//     button.textContent = l;
//     button.id = l.toLowerCase();
//     button.className = "letter-btn";
//     button.addEventListener("click", getCocktail);
//     btnDiv.appendChild(button);
// }

// sort

// for(let i = 0; i < cocktailkKeywords.length; i++) {
// forEa
    // 'option'
    // val
    // ". "
    // "-" ". - (hyphen)"
    // append
// });
};
/*
I added ingredients to the text. This was tricky to do, because the ingredients don't come as an array, which is what you want. Instead, they come in as a bunch of separate properties: "strIngredient1": "rum", "strIngredient2": "ginger ale", -- like that.
To make it even trickier to get the ingredients in a clean, usable format, all drink objects have the same number of "strIngredient" properties, but with the value set to null when they run out of actual ingredients..
What we need to do is extract the values of all keys that include the sub-string "strIngredient" AND (&&) whose values are not null.
To get the ingredient values into a new array, I looped the drink object, key by key, pushing to a new array all those values whose key includes the sub-string "strIngredient"..
We didn't do much looping of objects by key in this course--we mostly looped arrays--so this is an EXCELLENT example to study closely so as to add "looping objects by key" to your ever-growing repertoire of JS moves:
I made the ingredients as a bulleted list, so to hold the p tag and list, I made a new div under the h1, called drinkText. Inside drinkText goes the drink info, followed by an h3 that says "ingredients".
Beneath the h3 comes the bulleted list (ul tag with li tags nested inside). There needs to be one li for each ingredient, so we loop the ingredientsArr, making one li each time.. I used forEach() for this, as opposed to a for loop, just to give you some practice w the forEach() array method.
Below, the new code for all this is bolded within the context of the entire second then() .. The new sort() code is also bolded in case you missed that upgrade, posted previously to Slack here..
There is new CSS to go with this, as well. That too is pasted below:
*/