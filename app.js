/*
TODO: upload photo
TODO: star rating
*/

const app = new Vue({
  el: '#app',
  data: {
    editingRecipe: false,
    addingRecipe: false,
    newName: "",
    newPic: "",
    newIngredient: "",
    newQuantity: "",
    ingredientsList: [],
    newSteps: "",
    recipesList: [],
    searchInput: ""
  },
  methods: {
    showModal(mode) {
      if(mode == 'create') {
        this.addingRecipe = true;
      } else if(mode == "edit") {
        this.editingRecipe = true;
      }
    },
    hideModal() {
      this.addingRecipe = false;
      this.editingRecipe = false;
      this.newName = "";
      this.newIngredient = "";
      this.ingredientsList = [];
      this.newSteps = "";
      this.newPic = "";
    },
    addIngredient() {
      if(this.newIngredient == "") {
        alert('Add an ingredient to the recipe');
      } else {
        this.ingredientsList.push({name: this.newIngredient, quantity: this.newQuantity});
        this.newIngredient = "";
        this.newQuantity = "";
      }
    },
    deleteIngredient(i) {
      this.ingredientsList.splice(i, 1);
    },
    keyMonitor(e) {
      if(e.key == "Enter") {
        this.addIngredient();
      }
    },
    addRecipe() {
      if(this.newName == "") {
        alert('Please add the name of your recipe');
      } else if(this.ingredientsList.length == 0) {
        alert('Please add at least one ingredient');
      } else {
        // create an object to send to local storage
        let recipe = {
          name: this.newName,
          ingredients: this.ingredientsList,
          steps: this.newSteps,
          pic: this.newPic
        };

        // send object to local storage
        if(localStorage.getItem('recipes') === null) {
          let recipes = [];
          recipes.push(recipe);
          localStorage.setItem('recipes', JSON.stringify(recipes));
        } else {
          let recipes = JSON.parse(localStorage.getItem('recipes'));
          recipes.push(recipe);
          recipes.sort((a, b) => {
            let nameA = a.name.toUpperCase(); // ignore upper and lowercase
            let nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
          localStorage.setItem('recipes', JSON.stringify(recipes));
        }

        // resets the form & closes the modal
        this.hideModal();
        this.fetchRecipes();
      }
    },
    readRecipe(index) {
      let recipeTexts = document.querySelectorAll(".recipe-text");
      let style = window.getComputedStyle(recipeTexts[index], null);
      if(style.display == "none") {
        for(let i=0; i < recipeTexts.length; i++) {
          recipeTexts[i].style.display = "none";
        }
        recipeTexts[index].style.display = "block";
      } else {
        recipeTexts[index].style.display = "none";
      }
    },
    editRecipe(index) {
      // populates the modals with the data from local storage
      let recipes = JSON.parse(localStorage.getItem('recipes'));
      this.newName = recipes[index].name;
      this.ingredientsList = recipes[index].ingredients;
      this.newSteps = recipes[index].steps;
      this.newPic = recipes[index].pic;
      this.deleteRecipe(index);
      this.showModal('edit');
    },
    deleteRecipe(index) {
      let recipeTexts = document.querySelectorAll(".recipe-text");
      for(let i=0; i < recipeTexts.length; i++) {
        recipeTexts[i].style.display = "none";
      }
      let recipes = JSON.parse(localStorage.getItem('recipes'));
      recipes.splice(index, 1);
      localStorage.setItem('recipes', JSON.stringify(recipes));
      this.fetchRecipes();
    },
    fetchRecipes() {
      if(localStorage.getItem('recipes') !== null) {
        let recipes = JSON.parse(localStorage.getItem('recipes'));
        this.recipesList = recipes;
      }
    },
    addPic(e) {
      let file = e.target.files[0];
      let reader = new FileReader();

      reader.addEventListener("load", () => {
        this.newPic = reader.result;
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  },
  computed: {
    filteredList() {
      return this.recipesList.filter((recipe) => {
        return recipe.name.includes(this.searchInput);
      });
    }
  },
  mounted() {
    this.fetchRecipes()
 }
})
