const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const recipeDetails = document.querySelector('.recipe-details');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const inputValue = event.target[0].value;
    searchRecipes(inputValue);
});

async function loadAllRecipes() {
    const response = await fetch('receitas.json');
    const data = await response.json();
    const localExtra = JSON.parse(localStorage.getItem("extraReceitas") || "[]");
    return [...data.receitas, ...localExtra];
}

async function searchRecipes(ingredient) {
    const receitas = await loadAllRecipes();
    const filteredRecipes = receitas.filter(recipe => {
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
    const receitas = await loadAllRecipes();
    const recipe = receitas.find(item => item.idReceita === id);
    if (!recipe) return;

    let ingredients = recipe.ingredientes
        .map(i => `<li>${i.nome} - ${i.quantidade}</li>`)
        .join('');

    const isLocal = String(id).length > 10;

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

        ${isLocal ? `
            <button onclick="openEditRecipe(${id})">Editar</button>
            <button onclick="deleteRecipe(${id}); location.reload()">Excluir</button>
        ` : ''}
    `;
}

function createRecipe(newRecipe) {
    const local = JSON.parse(localStorage.getItem("extraReceitas") || "[]");
    newRecipe.idReceita = Date.now();
    local.push(newRecipe);
    localStorage.setItem("extraReceitas", JSON.stringify(local));
}

function updateRecipe(id, updatedData) {
    const local = JSON.parse(localStorage.getItem("extraReceitas") || "[]");
    const index = local.findIndex(r => r.idReceita === id);
    if (index === -1) return false;
    local[index] = { ...local[index], ...updatedData };
    localStorage.setItem("extraReceitas", JSON.stringify(local));
    return true;
}

function deleteRecipe(id) {
    let local = JSON.parse(localStorage.getItem("extraReceitas") || "[]");
    local = local.filter(r => r.idReceita !== id);
    localStorage.setItem("extraReceitas", JSON.stringify(local));
}

function toggleCreateForm() {
    const box = document.getElementById("create-form");
    box.style.display = box.style.display === "none" ? "block" : "none";
}

function saveNewRecipe() {
    const nome = document.getElementById("r-nome").value;
    const imagem = document.getElementById("r-img").value;
    const categoria = document.getElementById("r-cat").value;
    const origem = document.getElementById("r-org").value;
    const instrucoes = document.getElementById("r-inst").value;
    const tags = document.getElementById("r-tags").value;
    const video = document.getElementById("r-video").value;

    const ingredientes = document.getElementById("r-ing").value
        .split("\n")
        .map(l => {
            const [nome, quantidade] = l.split("|");
            return { nome: nome.trim(), quantidade: quantidade.trim() };
        });

    const obj = {
        nome,
        imagem,
        categoria,
        origem,
        instrucoes,
        tags,
        video,
        ingredientes
    };

    createRecipe(obj);
    alert("Receita criada!");
    location.reload();
}

function openEditRecipe(id) {
    const local = JSON.parse(localStorage.getItem("extraReceitas") || "[]");
    const recipe = local.find(r => r.idReceita === id);
    if (!recipe) return;

    let newName = prompt("Nome da receita:", recipe.nome);
    if (!newName) return;

    updateRecipe(id, { nome: newName });
    alert("Receita editada.");
    location.reload();
}

