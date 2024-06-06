// Lesson 09.02 Cocktail API - FINAL

/* There are 3 ways to get cocktails: 
- search box: input keyword /ingredient
- select menu: choose keyword / ingredient
- button: get random cocktail
ALL 3 ways call the same function: getCocktail

API returns an object w ONE key: "drinks"
the drinks array values are all objects, one per drink
each obj has lots of keys; the ones we want are:
    - strDrink (name of drink)
    - strInstructions (how-to-make text)
    - strDrinkThumb (url of drink image on API server)
    - strIngredient1 - strIngredient15 
      (each property is one ingredient string instead of having all ingredients in an array); 
    - if less than 15 ingredients, those values are all null
    - strMeasure1 - strMeasure15 works same as ingredient props
*/


// get the DOM elements: input box, select menu, random btn and 
// div for displaying output
// get the search box (input):
const input = document.querySelector('input');
input.addEventListener('change', getCocktail);
// Search ingredient by name
// www.thecocktaildb.com/api/json/v1/1/search.php?i=lemon
// baseURL + "i=" + this.value 

// get the select menu which is for choosing an ingredient
const selectMenu = document.querySelector('select');
selectMenu.addEventListener('change', getCocktail);

// select menu hits this endpoint:
// www.thecocktaildb.com/api/json/v1/1/search.php?i=vodka
// replace 'vodka' w value of menu, which is this.value in func:
// start w base url:
// www.thecocktaildb.com/api/json/v1/1/search.php?
// base url is the same for all endpoints / API requests
//  then add "i=" for ingredient
// then add the ingredient as this. value
// baseURL + "i=" + this.value 

// get Random Cocktai btn
// click Random Cocktail btn to call function
const button = document.querySelector('button');
button.addEventListener('click', getCocktail);

// get the letter-box div for the letter buttons
const letterBox = document.querySelector('#letter-box');

// get the cocktail-box div for the output:
const cocktailBox = document.querySelector('#cocktail-box');

// challenge:
// make the select menu options dynamically
// data is in the cocktail-keywords.js file

// cocktailkKeywords array is not fully alphabetized, 
// so sort it before making options:
cocktailkKeywords.sort();
// generate options for select menu:
for(let keyword of cocktailkKeywords) {
    const option = document.createElement("option");
    option.value = keyword.toLowerCase(); // lemon
    option.text = keyword; // Lemon
    selectMenu.appendChild(option);
}

// generate A-Z buttons for fetching by first letter
const letters = "ABCDEFGHIJKLMNOPQRSTVWYZ"; // No "U" or "X"
for(let letter of letters) {
    const btn = document.createElement('button');
    btn.addEventListener('click', getCocktail);
    btn.id = letter; // "A", etc.
    btn.className = 'letter-btn';
    btn.textContent = letter;
    letterBox.appendChild(btn);
}

// define getCocktail() function:
function getCocktail() {

    let baseUrl = "https://www.thecocktaildb.com/api/json/v1/1/";
    let url = baseUrl;
    // concat the url for making request to API endpoint:
    // if the element that called the func has a value, then it's NOT the button
    if(this.value) { // function called by input text box OR select menu
        // concatenate a "Search cocktail by name" request:
        url += `search.php?s=${this.value}`; // this.value is from input box or select menu
    // this does NOT have a value, so it must be the button calling: if this.id has length of 1, it is a letter button
    } else if(this.id.length == 1) { 
        url += `search.php?f=${this.id}`;
    } else { // this has no value and id is not 1 char, so
        // must be random button
        url += "random.php";
    }
   
    // `search.php?f=` (for searching by first letter)
    // fetch the cocktails:
    fetch(url, {method: 'GET'}) // this returns a Promise object
    .then(jsonRes => jsonRes.json()) // parse the response json into usable js obj
    .then(obj => {

        cocktailBox.innerHTML = ''; // empty cocktail box of old drinks
        console.log('strDrink:', obj.drinks[0].strDrink);
        console.log('strGlass:', obj.drinks[0].strGlass);

        // make a div on the DOM for drinks[0] (first cocktail)
        const drink = obj.drinks[0]; // simplify name of first drink obj

        // alphabetize drinks
        obj.drinks.sort((a,b) => a.strDrink > b.strDrink ? 1 : -1);

        for(let drink of obj.drinks) {

            const drinkDiv = document.createElement('div'); // make a div
            drinkDiv.className = 'drink-div'; // assign div its class name

            const h1 = document.createElement('h1'); // make h1 for drink name
            h1.textContent = drink.strDrink; // put drink name in h1 tag
            drinkDiv.appendChild(h1);  // output h1 to drink div

            // make a div to hold instructions paragraph, followed by ingredients list
            const drinkTextDiv = document.createElement("div");
            drinkTextDiv.className = 'drink-text-div';
            // drinkTextDiv.style.border = '3px dashed orange';

            const instructions = document.createElement("p"); // to hold instructions
            instructions.innerText = drink.strInstructions;
            drinkTextDiv.appendChild(instructions);

            // add header text above ul list as h3
            const h3 = document.createElement('h3'); // make h1 for drink name
            h3.innerHTML = 'Ingredients &amp; Measures:';
            drinkTextDiv.appendChild(h3);  // output h1 to drink div
            
            // make bulleted list of ingredients - measures
            const ul = document.createElement("ul");
            // loop the strIngredient properties, concatenating the number: strIngredient1, etc.
            // use that key string as dynamic key to look up value on a loop that runs 15x
            // if less than 15 ingredients or measures, those values are all null
            for(let i = 1; i <= 15; i++) {
                    // concatenate a dynamic key string by adding number suffix
                    const ingredKey = `strIngredient${i}`; 
                    const measurKey = `strMeasure${i}`; 
                    const li = document.createElement("li"); // make an li
                    // look up value of dynamic key: drink['strIngredient1']
                    // console.log(drink[ingredKey]);
                    li.textContent = `${drink[ingredKey]} - ${drink[measurKey]}`; 
                    if(drink[ingredKey]) ul.appendChild(li); // output the li to the ul -- if ingredient is NOT null
            }

            drinkTextDiv.appendChild(ul);
            // now that instructions and ingredients are in text div, output that to drink div
            drinkDiv.appendChild(drinkTextDiv);

            // make drink image, assign its source and output to drink div
            // all imgs are absolute urls to API server; we do NOT have drink img files locally
            const pic = new Image();
            pic.src = drink.strDrinkThumb;
            drinkDiv.appendChild(pic);

            cocktailBox.appendChild(drinkDiv); // output drink div to DOM

        } // end loop

    }); // do stuff w the data

    /*
    API returns an object w ONE key: "drinks", which is an array of objects
    the drinks array values are all objects, one per drink
    each obj has lots of keys; the ones we want are:
    - strDrink (name of drink)
     (how-to-make text)
    - strDrinkThumb (url of drink image on API server)
    - strIngredient1 - strIngredient15 
      (each property is one ingredient string instead of having all ingredients in an array); 
    - if less than 15 ingredients, those values are all null
    - strMeasure1 - strMeasure15 works same as ingredient props
    */
    // "search-box" ""
    // "menu"
    // "GET"
    // .t
    // .t
        console.log('obj.drinks[0]:');
        // ""
        // sort results by strDrink (drink name from A-Z)
        // obj
        // a,b 1 -1
        // for
            console.log('drink:');
            // the ingredients come in as separate properties: 
            // 'strIngredient1': 'rum', 'strIngredient2': 'ginger ale', etc.
            // all obj have same number of 'strIngredientN' properties, so some of them 
            // are null; this makes outputting ingredients list difficult
            // start by getting all the non-null ingredients into an array of strings:
            // []
            // for
                // if key includes 'strIngredient', it is an ingredient
                // if drink[key] is true, the key is not null (not falsey)
                // 'strIngredient'
                    // Tequila Sour lists "lemon" twice as an ingredient
                    // so only push not-yet-included ingredients into array:
                    // if ! key
                        // push
                        // add the correspondingly numberered strMeasure to the array,
                        // getting the number from the last char of strIngredient
                        let num;
                        console.log('num:', num);
                        // "strMeasure"
     
            console.log('\ningredMeasurArr:');

            // "div"
            // "drink-div"
            // append

            // 'h1'
            // drink.
            // append

            // 'div'
            // 'drink-text-div'
            // append

            // 'p'
            // drink.
            // append
    
            // ingredients + measure list:
            // 'h3'
            // "Ingredients:"
            // append   

            // 'ul'
            // append
            
            // loop the ingredients + measures array, where these are consecutive items
            // increment by += 2 each time to get pairs: ingredient + measure
            // for
                // 'li'
                // add the ingredient and its measure as the text of the list item:
                let ingredient;
                let measure; // replace null measures with empty string
                // text
            //  append
            // }

            // Glass:
            // 'p'
            // append
            // "Serve in "
            // "italic"
            // 0
            // 0
            // append

            // new
            // src
            // append

            // if ! br
        // }
    // })
    // .catch(err => console.log("Something went wrong", err))

} // end function getCocktail()

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