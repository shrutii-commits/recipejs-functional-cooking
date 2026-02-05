const RecipeApp = (() => {
  console.log("🍳 RecipeApp initializing...");

  /* ---------------- STATE ---------------- */

  let searchQuery = '';
  let currentFilter = 'all';
  let debounceTimer = null;

  let favorites =
    JSON.parse(localStorage.getItem('recipeFavorites')) || [];

  /* ---------------- DATA ---------------- */

  const recipes = [
    {
      id: 1,
      title: "Pasta Alfredo",
      description: "Creamy Italian pasta",
      ingredients: ["Pasta", "Butter", "Garlic", "Cream", "Cheese"],
      steps: [
        "Boil pasta",
        {
          text: "Prepare sauce",
          substeps: [
            "Heat butter",
            "Add garlic",
            {
              text: "Add cream and cheese",
              substeps: ["Stir", "Simmer"]
            }
          ]
        },
        "Mix pasta and sauce"
      ]
    },
    {
      id: 2,
      title: "Veg Sandwich",
      description: "Quick healthy sandwich",
      ingredients: ["Bread", "Tomato", "Cucumber", "Butter"],
      steps: [
        "Slice vegetables",
        "Butter bread",
        "Assemble sandwich"
      ]
    }
  ];

  /* ---------------- DOM ---------------- */

  const recipeContainer = document.querySelector('#recipe-container');
  const searchInput = document.querySelector('#search-input');
  const clearSearchBtn = document.querySelector('#clear-search');
  const recipeCounter = document.querySelector('#recipe-counter');

  /* ---------------- RECURSION ---------------- */

  const renderSteps = (steps, level = 0) =>
    steps.map(step => {
      if (typeof step === 'string') {
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
    }).join('');

  /* ---------------- UI ---------------- */

  const createRecipeCard = (recipe) => {
    const isFavorite = favorites.includes(recipe.id);

    return `
      <div class="recipe-card">
        <button
          class="favorite-btn ${isFavorite ? 'active' : ''}"
          data-recipe-id="${recipe.id}">
          ❤️
        </button>

        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>

        <button class="toggle-btn" data-toggle="steps">
          Show Steps
        </button>
        <button class="toggle-btn" data-toggle="ingredients">
          Show Ingredients
        </button>

        <div class="steps-container">
          <ul>${renderSteps(recipe.steps)}</ul>
        </div>

        <div class="ingredients-container">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  };

  const renderRecipes = (list) => {
    recipeContainer.innerHTML = list.map(createRecipeCard).join('');
  };

  /* ---------------- FILTERS ---------------- */

  const applySearchFilter = (list) => {
    if (!searchQuery) return list;

    const q = searchQuery.toLowerCase().trim();

    return list.filter(recipe => {
      const titleMatch =
        recipe.title.toLowerCase().includes(q);

      const ingredientMatch =
        recipe.ingredients.some(i =>
          i.toLowerCase().includes(q)
        );

      const descriptionMatch =
        recipe.description.toLowerCase().includes(q);

      return titleMatch || ingredientMatch || descriptionMatch;
    });
  };

  const applyFavoritesFilter = (list) =>
    list.filter(r => favorites.includes(r.id));

  const applyFilter = (list) => {
    if (currentFilter === 'favorites') {
      return applyFavoritesFilter(list);
    }
    return list;
  };

  /* ---------------- COUNTER ---------------- */

  const updateRecipeCounter = (shown, total) => {
    recipeCounter.textContent =
      `Showing ${shown} of ${total} recipes`;
  };

  /* ---------------- DISPLAY ---------------- */

  const updateDisplay = () => {
    let result = [...recipes];

    result = applySearchFilter(result);
    result = applyFilter(result);

    updateRecipeCounter(result.length, recipes.length);
    renderRecipes(result);
  };

  /* ---------------- FAVORITES ---------------- */

  const saveFavorites = () => {
    localStorage.setItem(
      'recipeFavorites',
      JSON.stringify(favorites)
    );
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      favorites = favorites.filter(f => f !== id);
    } else {
      favorites.push(id);
    }
    saveFavorites();
    updateDisplay();
  };

  /* ---------------- EVENTS ---------------- */

  const handleSearch = () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value;
      updateDisplay();
    }, 300);

    clearSearchBtn.classList.toggle(
      'hidden',
      !searchInput.value
    );
  };

  const clearSearch = () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('hidden');
    updateDisplay();
  };

  const handleClicks = (e) => {
    if (e.target.classList.contains('toggle-btn')) {
      const card = e.target.closest('.recipe-card');
      const type = e.target.dataset.toggle;
      const container =
        card.querySelector(`.${type}-container`);

      container.classList.toggle('visible');

      e.target.textContent =
        container.classList.contains('visible')
          ? `Hide ${type}`
          : `Show ${type}`;
    }

    if (e.target.classList.contains('favorite-btn')) {
      const id =
        Number(e.target.dataset.recipeId);
      toggleFavorite(id);
    }

    if (e.target.dataset.filter) {
      currentFilter = e.target.dataset.filter;
      updateDisplay();
    }
  };

  const setupEventListeners = () => {
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    document.addEventListener('click', handleClicks);
  };

  /* ---------------- INIT ---------------- */

  const init = () => {
    setupEventListeners();
    updateDisplay();
    console.log("✅ RecipeApp ready!");
  };

  return { init };
})();

RecipeApp.init();
