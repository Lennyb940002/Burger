document.addEventListener("DOMContentLoaded", () => {
  const getJson = (url) => {
    return fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`(${res.status})`);
      }
      return res.json();
    });
  };

  const resultMenu = document.querySelector(".result-menu");
  const searchButton = document.getElementById("searchButton");

  searchButton.addEventListener("click", () => {
    const selectedIngredients = Array.from(
      document.querySelectorAll("input[type='checkbox']:checked")
    ).map((checkbox) => checkbox.value);

    const ingredientsQuery = selectedIngredients.join(",");

    getJson(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=102acf298df8426e9e72b6e6e79c7ff9&query=burger&includeIngredients=${ingredientsQuery}&number=1000`
    )
      .then((data) => {
        resultMenu.innerHTML = "";

        if (data.results && data.results.length > 0) {
          data.results.forEach((recipe) => {
            const hasChicken = recipe.extendedIngredients
              ? recipe.extendedIngredients.some((ingredient) =>
                  ingredient.name.toLowerCase().includes("chicken")
                )
              : false;

            const imageUrl = hasChicken
              ? "image/b_poulet.png"
              : "image/b_viande.png";

            renderBurger(recipe, imageUrl);
          });
        } else {
          resultMenu.innerHTML = "<p>Aucune recette trouvée.</p>";
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        resultMenu.innerHTML =
          "<p>Erreur lors de la récupération des données.</p>";
      });
  });

  function renderBurger(data, imageUrl) {
    const ingredients = data.extendedIngredients
      ? data.extendedIngredients.map((ingredient) => ingredient.name)
      : ["Ingrédients non disponibles"];

    const description = data.summary || "Description non disponible.";

    const html = `
      <article class='burger'>
        <img class="burger__img" src='${imageUrl}' alt='${data.title}'/>
        <div class="burger__data">
          <h3 class="burger__name">${data.title}</h3>
          <p class="burger__ingredients">Ingrédients: ${ingredients.join(
            ", "
          )}</p>
          <p class="burger__description">${description}</p>
        </div>
      </article>
    `;

    resultMenu.insertAdjacentHTML("beforeend", html);
  }
});

document.getElementById("searchButton").addEventListener("click", function () {
  this.classList.toggle("clicked");
});
