const form = document.querySelector("form");
const errorDom = document.querySelector("#error");
const backLink = 'https://api.zeghoudi-mohammed-walid.fr/sophie_bluel'

async function onSubmit(event) {
  event.preventDefault();
  let user = {
    email: form.email.value,
    password: form.password.value,
  };
  let response = await fetch(backLink + "/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });
  let result = await response.json();

  if (response.status === 200) {
    const loginTime = new Date();
    let logOffTime = new Date();
    logOffTime = Date.parse(logOffTime) + +24 * 60 * 60 * 1000;
    localStorage.setItem("token", result.token);
    localStorage.setItem("loginTime", loginTime);
    localStorage.setItem("logOffTime", logOffTime);
    const origin =
      window.location.href.split(".html")[0].split("/").slice(0, -1).join("/") +
      "/";
    window.location.replace(`${origin}index.html`);
  } else if (response.status === 404 || response.status === 401) {
    errorDom.textContent =
      "Votre nom d'utilisateur ou votre mot de passe est incorrect";
    form.email.value = "";
    form.password.value = "";
  }
}
form.addEventListener("submit", onSubmit);
