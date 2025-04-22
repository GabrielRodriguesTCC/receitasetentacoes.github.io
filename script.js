const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const recipeDetails = document.querySelector('.recipe-details');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const inputValue = event.target[0].value;

    searchRecipes(inputValue);
});

async function searchRecipes(ingredient) {
    const response = await fetch('receitas.json');
    const data = await response.json();

    const filteredRecipes = data.receitas.filter(recipe => {
        return recipe.nome.toLowerCase().includes(ingredient.toLowerCase()) ||
            recipe.ingredientes.some(ing => ing.nome.toLowerCase().includes(ingredient.toLowerCase()));
    });

    showRecipes(filteredRecipes);
}

function showRecipes(recipes) {
    recipeList.innerHTML = recipes.map(
        item => `
        <div class="recipe-card" onclick="getRecipeDetails(${item.idReceita})">
            <img src="${item.imagem}" alt="receita-foto">
            <h3>${item.nome}</h3>
        </div>
        `
    ).join('');
}

async function getRecipeDetails(id) {
    const response = await fetch('receitas.json');
    const data = await response.json();
    const recipe = data.receitas.find(item => item.idReceita === id);
    
    let ingredients = '';

    recipe.ingredientes.forEach(ingredient => {
        ingredients += `<li>${ingredient.nome} - ${ingredient.quantidade}</li>`;
    });

    recipeDetails.innerHTML = `
        <h2>${recipe.nome}</h2>
        <img src="${recipe.imagem}" alt="${recipe.nome}" class="recipe-img">
        <h3>Categoria: ${recipe.categoria}</h3>
        <h3>Origem: ${recipe.origem}</h3>
        <h3>Ingredientes:</h3>
        <ul>${ingredients}</ul>
        <h3>Instruções:</h3>
        <p>${recipe.instrucoes}</p>
        <p>Tags: ${recipe.tags}</p>
        <p>Vídeo: <a href="${recipe.video}" target="_blank">Assista no Youtube</a></p>
    `;
}
