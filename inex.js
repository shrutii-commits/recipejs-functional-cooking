// =====================
// Recipe Data
// =====================
const recipes = [
    { id: 1, title: "Classic Spaghetti Carbonara", time: 25, difficulty: "easy", description: "A creamy Italian pasta dish.", category: "pasta" },
    { id: 2, title: "Chicken Tikka Masala", time: 45, difficulty: "medium", description: "Tender chicken in spiced sauce.", category: "curry" },
    { id: 3, title: "Homemade Croissants", time: 180, difficulty: "hard", description: "Buttery flaky French pastries.", category: "baking" },
    { id: 4, title: "Greek Salad", time: 15, difficulty: "easy", description: "Fresh veggies with feta.", category: "salad" },
    { id: 5, title: "Beef Wellington", time: 120, difficulty: "hard", description: "Beef wrapped in pastry.", category: "meat" },
    { id: 6, title: "Vegetable Stir Fry", time: 20, difficulty: "easy", description: "Quick mixed vegetables.", category: "vegetarian" },
    { id: 7, title: "Pad Thai", time: 30, difficulty: "medium", description: "Thai noodles with peanuts.", category: "noodles" },
    { id: 8, title: "Margherita Pizza", time: 60, difficulty: "medium", description: "Classic Italian pizza.", category: "pizza" }
];

// =====================
// State
// =====================
let currentFilter = "all";
let currentSort = "none";

// =====================
// DOM References
// =====================
const recipeContainer = document.querySelector("#recipe-container");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");

// =====================
// Pure Filter Functions
// =====================
const filterByDifficulty = (recipes, difficulty) =>
    recipes.filter(recipe => recipe.difficulty === difficulty);

const filterByTime = (recipes, maxTime) =>
    recipes.filter(recipe => recipe.time < maxTime);

const applyFilter = (recipes, filterType) => {
    switch (filterType) {
        case "easy":
        case "medium":
        case "hard":
            return filterByDifficulty(recipes, filterType);
        case "quick":
            return filterByTime(recipes, 30);
        default:
            return recipes;
    }
};

// =====================
// Pure Sort Functions
// =====================
const sortByName = (recipes) =>
    [...recipes].sort((a, b) => a.title.localeCompare(b.title));

const sortByTime = (recipes) =>
    [...recipes].sort((a, b) => a.time - b.time);

const applySort = (recipes, sortType) => {
    switch (sortType) {
        case "name":
            return sortByName(recipes);
        case "time":
            return sortByTime(recipes);
        default:
            return recipes;
    }
};

// =====================
// Render Functions
// =====================
const createRecipeCard = (recipe) => `
    <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
            <span>⏱️ ${recipe.time} min</span>
            <span class="difficulty ${recipe.difficulty}">
                ${recipe.difficulty}
            </span>
        </div>
        <p>${recipe.description}</p>
    </div>
`;

const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender
        .map(createRecipeCard)
        .join("");
};

// =====================
// UI Update Helpers
// =====================
const updateActiveButtons = () => {
    filterButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });

    sortButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.sort === currentSort);
    });
};

// =====================
// Main Update Function
// =====================
const updateDisplay = () => {
    let result = recipes;
    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);

    renderRecipes(result);
    updateActiveButtons();

    console.log(
        `Displaying ${result.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
    );
};

// =====================
// Event Handlers
// =====================
const handleFilterClick = (event) => {
    currentFilter = event.target.dataset.filter;
    updateDisplay();
};

const handleSortClick = (event) => {
    currentSort = event.target.dataset.sort;
    updateDisplay();
};

// =====================
// Event Listeners Setup
// =====================
const setupEventListeners = () => {
    filterButtons.forEach(btn =>
        btn.addEventListener("click", handleFilterClick)
    );

    sortButtons.forEach(btn =>
        btn.addEventListener("click", handleSortClick)
    );
};

// =====================
// Initialize App
// =====================
setupEventListeners();
updateDisplay();
