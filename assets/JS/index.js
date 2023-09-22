// main const declaration
const worksContainer = document.querySelector(".gallery");
const works = worksContainer.children;
const filtersSection = document.querySelector(".filters");
const backLink = 'https://api.zeghoudi-mohammed-walid.fr/sophie_bluel'
const origin =
  window.location.href.split(".html")[0].split("/").slice(0, -1).join("/") +
  "/";

// main const declaration after login
const logBtn = document.querySelector("#log");
const editBtnParents = [
  document.querySelector("#introduction_img"),
  document.querySelector("#introduction_article"),
  document.querySelector("#portfolio_title"),
];

// Usefull function in general

// fetch functions
async function fetchWork() {
  const res = await fetch(backLink + "/api/works");
  const data = await res.json();
  data.map(e => {
    e.imageUrl = e.imageUrl.split('images')[1]
  })
  return data;
}

async function fetchCategories() {
  const res = await fetch(backLink + "/api/categories");
  const data = await res.json();
  return data;
}

function listWorkTemplate(picture, title, id, idCat, catName) {
  const workTitle = title.replaceAll('"', "");
  const workTemplate = `
    <figure id='${id}' data-categorie='${idCat}' data-categorie-name='${catName}' class='work show'>
      <img src='${picture}' alt='${workTitle}' />
      <figcaption>${workTitle}</figcaption>
    </figure>
  `;
  worksContainer.insertAdjacentHTML("beforeend", workTemplate);
}

// function to get all categories then add filter buttons
function getAllCategories() {
  const portfolioElement = document.querySelectorAll("[data-categorie-name]");
  const allCategoriesNames = [];
  const allCategories = [];
  portfolioElement.forEach((e) => {
    if (!allCategoriesNames.includes(e.dataset.categorieName)) {
      allCategoriesNames.push(e.dataset.categorieName);
      allCategories.push(e.dataset.categorie);
    }
  });
  return [allCategories, allCategoriesNames];
}

function addFilterButtons() {
  const allFilterBtn = `<button id="Tout" class="filter active">Tout</button>`;
  filtersSection.insertAdjacentHTML("beforeend", allFilterBtn);
  const categories = getAllCategories();
  categories[1].forEach((e, i) => {
    const category = e.replace('"', "");
    const filterButtonTemplate = `
    <button 
    id="${category}" 
    class="filter" 
    data-categorie-id="${categories[0][i]}">
    ${category}
    </button>`;
    filtersSection.insertAdjacentHTML("beforeend", filterButtonTemplate);
  });
}

async function listWorkAction() {
  document.getElementById("gallery").innerText = "";
  filtersSection.innerText = "";
  const data = await fetchWork();
  data.forEach((e) => {
    const imgLink = backLink + '/images' + e.imageUrl;
    listWorkTemplate(imgLink, e.title, e.id, e.category.id, e.category.name);
  });
  addFilterButtons();
  const filtersButtons = document.querySelectorAll(".filter");
  for (var i = 0; i < filtersButtons.length; i++) {
    filtersButtons[i].addEventListener("click", toggleWorks);
  }
}

// function to toggle works displays
function toggleWorks() {
  this.parentNode.querySelector(".active").classList.remove("active");
  this.classList.add("active");
  if (!this.dataset.categorieId) {
    for (i = 0; i < works.length; i++) {
      works[i].classList.add("show");
    }
  } else {
    for (var i = 0; i < works.length; i++) {
      works[i].classList.add("show");
      if (!(works[i].dataset.categorie === this.dataset.categorieId)) {
        works[i].classList.remove("show");
      }
    }
  }
}

// Usefull function after login

// check login
async function checkLogin() {
  let isLog = true;
  let nowTime = new Date();
  nowTime = Date.parse(nowTime);
  const logOffTime = localStorage.logOffTime;
  const logOffMessageTemplate = `
    <div class="modal show">
      <div class="modal_wrapper">
        <div id="modal_body">
          <h3 class="logoff_Title">Votre session a expirer. <br>Vous allez etre rediriger vers la fenetre d'authentification dans un instant</h3>
        </div>
      </div>
    </div>
  `;
  if (nowTime >= logOffTime) {
    isLog = false;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    document
      .querySelector("body")
      .insertAdjacentHTML("beforeend", logOffMessageTemplate);
    setTimeout(function () {
      logOff();
    }, 5000);
  }
  return isLog;
}

function logOff() {
  localStorage.removeItem("token");
  localStorage.removeItem("logOffTime");
  localStorage.removeItem("loginTime");
  window.location.replace(`${origin}login.html`);
}

// add edit button
function addEditButtons(id, el) {
  const editBtnTemplate = `
    <button id='${id}' class="edit_btn">
      <i class="fas fa-regular fa-pen-to-square fa-lg"></i>
      modifier
    </button>
  `;
  if ((editBtnParents.indexOf(el) + 1) % 2 === 0) {
    el.insertAdjacentHTML("afterbegin", editBtnTemplate);
  } else {
    el.insertAdjacentHTML("beforeend", editBtnTemplate);
  }
}

// modals function
function openModal(title, figure, mainAction, deleteAction, previous, id) {
  const body = document.querySelector("body");
  const blackBgTemplate = '<div class="grey-bg show"></div>';
  const modalTemplate = `
    <div class="modal show">
      <div class="modal_wrapper">
        <button id="close_modal" class="modal_icon_option">
          <i class="fas fa-solid fa-xmark fa-2xl"></i>
        </button>
        <button id="previous_modal" class="modal_icon_option">
          <i class="fas fa-solid fa-arrow-left fa-2xl"></i>
        </button>
        ${previous}
        <h3 id="modal_title">${title}</h3>
        <div id="modal_body">
          ${figure}
        </div>
        <div id="modal_actions">
          <button class="green_btn add_btn">${mainAction}</button>
          <button id='delete_all_btn' class="delete_btn">${deleteAction}</button>
        </div>
      </div>
    </div>
  `;
  body.insertAdjacentHTML("beforeend", blackBgTemplate);
  switch (id) {
    case "edit_portfolio_title":
      document
        .querySelector("#portfolio")
        .insertAdjacentHTML("beforeend", modalTemplate);
      break;
    case "edit_introduction_article":
      document
        .querySelector("#introduction")
        .insertAdjacentHTML("beforeend", modalTemplate);
      break;
    case "edit_introduction_img":
      document
        .querySelector("#introduction")
        .insertAdjacentHTML("beforeend", modalTemplate);
      break;
  }
  document.querySelector("#previous_modal").style.display = "none";
}

function setUpModal(data, element) {
  let figureTemplate = ``;
  const editTarget = element.id;
  switch (editTarget) {
    case "edit_portfolio_title":
      data.forEach((e) => {
        const imgLink = backLink + '/images' + e.imageUrl;
        let workTitle = e.title.replaceAll('"', "");
        figureTemplate =
          figureTemplate +
          `
          <div class='modal_picture'>
            <div class="modal_icon_wrapper">
              <button id="modal_icon_move_btn-${e.id}" class="modal_icon_move_btn-${e.id} modal_icon">
                <i class="fas fa-solid fa-up-down-left-right"></i>
              </button>
              <button id="modal_icon_delete_btn-${e.id}" class="modal_icon_delete_btn-${e.id} modal_icon_delete_btn modal_icon">
                <i class="modal_icon_delete_btn-${e.id} fas fa-solid fa-trash-can"></i>
              </button>
            </div>
            <img src="${imgLink}" alt="${workTitle}" />
            <button class="single_edit_btn">éditer</button>
          </div>
        `;
      });
      openModal(
        "Galerie photo",
        figureTemplate,
        "Ajouter une photo",
        "Supprimer la galerie",
        "",
        editTarget
      );
      break;
    case "edit_introduction_article":
      const intorductionTitle = document.querySelector("#introduction_article")
        .children["1"].textContent;
      const introduction = document.querySelector("#introduction_article")
        .children["2"].textContent;
      figureTemplate = `
        <form class='modal_introduction' action="POST" >
          <input type="text" id="introduction_title" value=${intorductionTitle}>
          <textarea id="story" name="story"
            rows="5" cols="33">${introduction}
          </textarea>
        </form>
      `;
      openModal(
        "Changer l'introduction",
        figureTemplate,
        "Modifier",
        "",
        "",
        editTarget
      );
      break;
    case "edit_introduction_img":
      figureTemplate = `
      <form id="drop_zone" class="modal_profile_picture" action="POST">
        <i class="fas fa-regular fa-image"></i>
        <label id="drop_label" >
          Glissez la photo ici
          <input id="modal_profile_picture_input" type="file" name="image" accept="image/png, image/jpg, image/jpeg">
        </label>
        <div class="picture_condition">jpg, png, jpeg : 4mo max</div>
      </form>
      `;
      openModal(
        "Changer la photo de profile",
        figureTemplate,
        "Modifier",
        "",
        "",
        editTarget
      );
      break;
  }
}

function closeModal() {
  const blackBg = document.querySelector(".grey-bg");
  const modal = document.querySelector(".modal");
  modal.remove();
  blackBg.remove();
}

async function addWorkModal(child, dataCat) {
  document.querySelector("#previous_modal").style.display = "block";
  const editActionPicture = "add_work";
  let catId, catName;
  let catOptions = `<option value=""></option>`;

  for (let i = 0; i < dataCat.length; i++) {
    catId = dataCat[i].id;
    catName = dataCat[i].name;
    catOptions = catOptions + `<option value="${catId}">${catName}</option>`;
  }
  const newBodyTemplate = `
    <form
      id="${editActionPicture}_picture"
      class="edit_picture_form"
      action="POST"
      >
      <div id="drop_zone" class="modal_picture_input">
        <i class="fas fa-regular fa-image"></i>
        <label id="drop_label">
          + Ajouter photo
          <input
            id="modal_work_picture_input"
            type="file"
            name="image"
            accept="image/png, image/jpg, image/jpeg"
            required
          />
        </label>
        <div class="picture_condition">jpg, png, jpeg : 4mo max</div>
      </div>
      <label for="picture_title">
        Titre
        <input type="text" name="title" class="modal_input" placeholder='nom de votre projet - la ville de votre projet' required/>
      </label>
      <label for="picture_categorie">
        Catégorie
        <select name="category" id="categories_select" required>
          ${catOptions}
        </select>
      </label>
    </form>
  `;
  let submitAddBtn = `<button id="submit" class="disable green_btn submit_add_btn">Valider</button>`;
  child[0].innerHTML = newBodyTemplate;
  child[1].innerHTML = "Ajout photo";
  child[2].innerHTML = submitAddBtn;
  let dropZone = document.querySelector("#drop_zone");
  const imageInput = document.querySelector("#modal_work_picture_input");
  // dropZone.addEventListener("click", function () {
  //   imageInput.click();
  // });
  const form = document.querySelector("form");
  let formData;
  let isFormFull = [false, false, false];
  submitAddBtn = document.querySelector(".submit_add_btn");
  form.addEventListener("change", function () {
    formData = new FormData(form);
    for (const [key, value] of formData) {
      if (key === "image") {
        if (value.name === "" || value.name === null) {
          isFormFull[0] = false;
        } else {
          isFormFull[0] = true;
        }
      }
      if (key === "title") {
        if (value) {
          isFormFull[1] = true;
        } else {
          isFormFull[1] = false;
        }
      }
      if (key === "category") {
        if (value) {
          isFormFull[2] = true;
        } else {
          isFormFull[2] = false;
        }
      }
    }
    if (!isFormFull.includes(false)) {
      submitAddBtn.classList.remove("disable");
    } else {
      submitAddBtn.classList.add("disable");
    }
  });
  submitAddBtn.addEventListener("click", function (event) {
    event.preventDefault();
    postWork(event);
  });

  imageInput.addEventListener("change", () => {
    let preview = `<img src="" alt="preview_image" class="preview_image">`;
    dropZone.insertAdjacentHTML("beforeend", preview);
    preview = document.querySelector(".preview_image");
    const file = imageInput.files[0];
    var reader = new FileReader(); // constructor
    reader.addEventListener("load", function () {
      preview.src = reader.result;
    });
    reader.readAsDataURL(file);
  });
}

async function postWork(event) {
  event.preventDefault();
  const form = document.querySelector("form");
  const bearerToken = localStorage.token;
  let formData = new FormData(form);
  let res = await fetch(backLink + "/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    body: formData,
  });
  if (res.status === 201) {
    filtersSection.querySelector(".active").classList.remove("active");
    filtersSection.children[0].classList.add("active");
    closeModal();
    listWorkAction();
  } else {
    const error = `<h3 id="error">Une erreur s'est produite veuillez ressayer de nouveau</h3>`;
    form.insertAdjacentHTML("afterbegin", error);
    form.reset();
    document.querySelector(".preview_image").replaceWith("");
  }
}
async function deleteWork(event, workIds) {
  let res;
  const bearerToken = localStorage.token;
  if (workIds) {
    for (let i = 0; i < workIds.length; i++) {
      res = await fetch(`${backLink}/api/works/${workIds[i]}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
    }
    if (res.status === 204) {
      filtersSection.querySelector(".active").classList.remove("active");
      filtersSection.children[0].classList.add("active");
      closeModal();
      await listWorkAction();
    } else {
      const error = `<h3 id="error">Une erreur s'est produite veuillez ressayer de nouveau</h3>`;
      document
        .querySelector("#modal_body")
        .insertAdjacentHTML("afterbegin", error);
    }
  } else if (workIds === null) {
    const targetId = "#" + event.target.classList[0].toString();
    const target = document.querySelector(targetId).parentElement.parentElement;
    const workId = event.target.classList[0].split("-")[1];
    res = await fetch(`${backLink}/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (res.status === 204) {
      filtersSection.querySelector(".active").classList.remove("active");
      filtersSection.children[0].classList.add("active");
      await listWorkAction();
      target.remove();
    } else {
      const error = `<h3 id="error">Une erreur s'est produite veuillez ressayer de nouveau</h3>`;
      document
        .querySelector("#modal_body")
        .insertAdjacentHTML("afterbegin", error);
    }
  }
}

async function editEvent(e, data, dataCat) {
  const isLog = await checkLogin();
  if (isLog) {
    const workIds = data.map((e) => e.id);
    setUpModal(data, e.target);
    const modalIconClose = document.querySelector("#close_modal");
    const blackBg = document.querySelector(".grey-bg");
    const deleteItem = document.querySelectorAll(".modal_icon_delete_btn");
    const deleteAll = document.querySelector("#delete_all_btn");
    blackBg.addEventListener("click", closeModal);
    modalIconClose.addEventListener("click", closeModal);
    if (e.target.id === "edit_portfolio_title") {
      let addBtn = document.querySelector(".add_btn");
      const modalChild = [
        document.querySelector("#modal_body"),
        document.querySelector("#modal_title"),
        document.querySelector("#modal_actions"),
      ];
      addBtn.addEventListener("click", function (event) {
        event.preventDefault();
        addWorkModal(modalChild, dataCat);
      });
      deleteItem.forEach((e) => {
        e.addEventListener("click", function (event) {
          event.preventDefault();
          deleteWork(event, null);
        });
      });
      deleteAll.addEventListener("click", function (event) {
        event.preventDefault();
        deleteWork(event, workIds);
      });
    }
  }
}

async function init() {
  const token = localStorage.getItem("token");
  let data = await fetchWork();
  await listWorkAction();
  if (token) {
    const loginModeTemplate = `
    <div class="edit_mode">
      <i class="fas fa-regular fa-pen-to-square fa-lg"></i>
      <p>Mode édition</p>
      <button class="edit_mode_btn">publier les changements</button>
    </div>`;
    const header = document.querySelector("header");
    header.style.marginTop = "70px";
    header.insertAdjacentHTML("afterbegin", loginModeTemplate);
    setTimeout(logOff, 24 * 60 * 60 * 1000); //on peut rajouter une modal etes vous toujours la pour reset la connexion et le token
    const dataCat = await fetchCategories();
    // logOff button
    let navLoginButton = document.querySelector("#log");
    navLoginButton.innerHTML = "<a>logout</a>";
    navLoginButton = document.querySelector("#log");
    navLoginButton.addEventListener("click", logOff);

    // add edit button
    for (var i = 0; i < editBtnParents.length; i++) {
      let id = "edit_";
      id = id + editBtnParents[i].id;
      addEditButtons(id, editBtnParents[i]);
    }

    // set up Modal for edits
    const portfolioEditBtn = document.querySelector("#edit_portfolio_title");
    const introEditBtn = [
      document.querySelector("#edit_introduction_article"),
      document.querySelector("#edit_introduction_img"),
    ];
    portfolioEditBtn.addEventListener("click", async function (event) {
      data = await fetchWork();
      editEvent(event, data, dataCat);
    });
    introEditBtn[0].addEventListener("click", async function (event) {
      data = await fetchWork();
      editEvent(event, data);
    });
    introEditBtn[1].addEventListener("click", async function (event) {
      data = await fetchWork();
      editEvent(event, data);
    });
  }
}

init();
