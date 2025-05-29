const form = document.querySelector('.search-form')
const input = document.querySelector('.search-input')

const recipesList = document.querySelector('.recipes-list')
const recipeDetails = document.querySelector('.recipe-details')

/* Funcção responsavel por alocar as informações das receitas */
form.addEventListener('submit', event => {
  event.preventDefault()
  const inputValue = event.target[0].value

  searchRecipes(inputValue) // Chama a função e passa o valor do input
  getRecipesDetails(showRecipes)
})

/* Função para buscar as receitas no input */
async function searchRecipes(ingredient) {
  recipeDetails.innerHTML = `<p>Carregndo produtos</p>`

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
    )

    const data = await response.json()
    showRecipes(data.meals)
  } catch (error) {
    recipesList.innerHTML = `<h1 class="catchMensage">Produto inexistente ou indisponivel</h1>`
  }

  recipeDetails.innerHTML = ''
}

/* Função para exibir os cards das receitas */
function showRecipes(recipes) {
  recipesList.innerHTML = recipes
    .map(
      item => `
    <div class="itemCard" onclick="getRecipesDetails(${item.idMeal})">
       <img class="itemImage" src="${item.strMealThumb}" alt="Receita-foto"/>
       <h3 class="itemName">${item.strMeal}</h3>
    </div>
    `,
    )
    .join('')
}

/* Função para buscar as informações das receitas na api e exibir os detalhes de cada uma */
async function getRecipesDetails(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
  )

  const data = await response.json()
  const recipe = data.meals[0]

  let ingredients = ''

  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients += `<li>${recipe[`strIngredient${i}`]} - ${
        recipe[`strMeasure${i}`]
      } </li>`
    } else {
      break
    }
  }

  /* Adicionar dinamicamente todas as informações das receitas em detalhes*/
  recipeDetails.innerHTML = `
  <div class="recipeInfos">
   <h2 >${recipe.strMeal}</h2>
   <img src="${recipe.strMealThumb}" alt=${recipe.strMeal} class="recipeImage"/>
   <h3 >${recipe.strCategory}</h3>
   <h3>${recipe.strArea}</h3>

   <h3>Ingredientes:</h3>
   <ul >${ingredients}</ul>

   <h3>Instrucoes:</h3>
   <p>${recipe.strInstructions}</p>

   <p class="video">Video: <a href="${recipe.strYoutube}" target="_blank">Assista no youtube</a></p>
   </div>
  `
}
