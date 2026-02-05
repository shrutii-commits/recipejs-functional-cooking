const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  /* ---------------- DATA ---------------- */

  const recipes = [
    {
      id: 1,
      title: "Pasta Alfredo",
      ingredients: [
        "Pasta",
        "Butter",
        "Garlic",
        "Cream",
        "Cheese",
        "Salt"
      ],
      steps: [
        "Boil pasta",
        {
          text: "Prepare sauce",
          substeps: [
            "Heat butter",
            "Add garlic",
            {
              text: "Add cream and cheese",
              substeps: [
                "Stir continuously",
                "Simmer for 5 minutes"
              ]
            }
          ]
        },
        "Mix pasta with sauce",
        "Serve hot"
      ]
    },
    {
      id: 2,
      title: "Vegetable Sandwich",
      ingredients: [
        "Bread",
        "Tomato",
        "Cucumber",
        "Butter",
        "Salt"
      ],
      steps: [
        "Slice vegetables",
        "Butter the bread",
        "Assemble sandwich",
        "Serve"
      ]
    }
  ];

  const recipeContainer = document.querySelector("#recipe-container");

  /* ---------------- RECURSION ---------------- */

  const renderSteps = (steps, level = 0) => {
    return steps.map(step => {
      if (typeof step === "string") {
        return `<li class="step level-${level}">${step}</li>`;
      }

      return `
        <li class="step level-${level}">
          ${step.text}
          <ul>
            ${renderSteps(step.substeps, level + 1)}
          </ul>
        </li>
      `;
    }).join("");
  };

  const createStepsHTML = (steps) => `
    <div class="steps-container">
      <ul>
        ${renderSteps(steps)}
      </ul>
    </div>
  `;

  /* ---------------- UI ---------------- */

  const createRecipeCard = (recipe) => {
    return `
      <div class="recipe-card" data-recipe-id="${recipe.id}">
        <h3>${recipe.title}</h3>

        <button class="toggle-btn" data-toggle="steps">
          Show Steps
        </button>

        <button class="toggle-btn" data-toggle="ingredients">
          Show Ingredients
        </button>

        ${createStepsHTML(recipe.steps)}

        <div class="ingredients-container">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  };

  const renderRecipes = () => {
    recipeContainer.innerHTML = recipes
      .map(createRecipeCard)
      .join("");
  };

  /* ---------------- EVENT DELEGATION ---------------- */

  const handleToggleClick = (e) => {
    const button = e.target.closest(".toggle-btn");
    if (!button) return;

    const card = button.closest(".recipe-card");
    const type = button.dataset.toggle;

    const container = card.querySelector(`.${type}-container`);
    container.classList.toggle("visible");

    button.textContent = container.classList.contains("visible")
      ? `Hide ${type.charAt(0).toUpperCase() + type.slice(1)}`
      : `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  };

  const setupEventListeners = () => {
    recipeContainer.addEventListener("click", handleToggleClick);
    console.log("Event listeners attached!");
  };

  /* ---------------- INIT ---------------- */

  const init = () => {
    renderRecipes();
    setupEventListeners();
    console.log("RecipeApp ready!");
  };

  return { init };
})();

RecipeApp.init();
