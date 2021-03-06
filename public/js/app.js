const URL = "http://localhost:8000/heroes";
const popup = document.getElementById("hero-details-popup");
const formPost = document.getElementById("form-post-hero");



// API requests

async function postNewHero() {
    const name = document.getElementById("hero_name").value;
    const id = document.getElementById("hero_id").value;
    console.log(name);
    console.log(id)
    try {
        await axios.post(URL, {
                name,
            })
            .then(res => console.log(res))
            .catch(err => console.error(err))

        getAllHeroes();

    } catch (err) {
        console.error(err);
    }

}

function getAllHeroes(list) {
    axios
        .get(URL + "?_sort=id&_order=asc")
        .then((apiRes) => {
            const heroes = apiRes.data;
            if (list != undefined)
                displayAllHeroes(list);
            else
                displayAllHeroes(heroes);
        })
        .catch((apiErr) => console.error(apiErr));
};

function getOneHero(id) {
    axios
        .get(`${URL}/${id}`)
        .then((apiRes) => {
            const hero = apiRes.data;
            displayOneHero(hero);
        })
        .catch((apiErr) => console.error(apiErr));
};

async function deleteOneHero(id) {
    console.log(id);
    try {
        await axios.delete(`${URL}/${id}`);
        removeHeroFromDocument(id);
    } catch (err) {
        console.error(err);
    }
}

// DOM FUNCTIONS

function removeHeroFromDocument(idHero) {
    const cardToRemove = document.querySelector(`[data-hero-id="${idHero}"]`);
    cardToRemove.remove();
}

function displayOneHero(hero) {
    const wrapper = document.createElement("div");
    popup.appendChild(wrapper);

    wrapper.outerHTML = `
      <div id="infos-hero">
      <h3>
      <span contenteditable class="id">${hero.id}</span>
      <span contenteditable class="name">${hero.name}</span>
      </h3>
      </div>`;
    popup.querySelector(".id").onblur = () => updateHero(hero.id);
    popup.querySelector(".name").onblur = () => updateHero(hero.name);

    popup.classList.remove("is-hidden");

};

function removePopup() {
    const wrapper = popup.querySelector("div");
    wrapper.remove();
    popup.classList.add("is-hidden");
}

function displayAllHeroes(list) {
    const ul = document.getElementById("list-all-heroes");
    ul.innerHTML = "";
    list.forEach((hero) => {
        const li = document.createElement("li");
        li.classList.add("hero");
        li.setAttribute("data-hero-id", hero.id);
        li.innerHTML = `
            <h3>${hero.name} ${hero.id}</h3>
            <p>intelligence:</p>
            <p>strength:${hero.powerstats.strength}</p>
            <p>speed:${hero.powerstats.speed}</p>
            <p>durability:${hero.powerstats.durability}</p>
            <p>power:${hero.powerstats.power}</p>
            <p>combat:${hero.powerstats.combat}</p>


            <div class="buttons">
            <img class="img" src="${hero.image.url}">
                <button class="btn remove">remove</button>
                <button class="btn details">details</button>
            </div>
        `;
        // console.log("###############", hero.powerstats.intelligence);

        const btnDetails = li.querySelector(".btn.details");
        const btnRemove = li.querySelector(".btn.remove");
        btnDetails.onclick = () => {
            getOneHero(hero.id);
        };
        btnRemove.onclick = () => {
            deleteOneHero(hero.id);
        };
        ul.appendChild(li);

        const boutonOrder = document.querySelector(".btnOrder");
        boutonOrder.onclick = () => filter(list);

    });
};

function filter(list) {
    const filter = document.getElementById("hero-list");
    console.log('filter res : ', filter.value);

    if (filter.value == "croissant")
        list.sort((a, b) => {
            return a.id - b.id
        })
    if (filter.value == "decroissant")
        list.sort(function (a, b) {
            return b.id - a.id
        })
    if (filter.value == "combat")
        list.sort((a, b) => {
            return b.powerstats.combat - a.powerstats.combat
        })


    console.log(list)
    getAllHeroes(list)
}


getAllHeroes();
//event listenners
document.getElementById("btn-get-all").addEventListener("click", getAllHeroes);
document.getElementById("close-hero-popup").onclick = removePopup;

formPost.querySelector(".btn").onclick = postNewHero;
// fonction filters (à voir après)