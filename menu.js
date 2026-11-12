/* Menu latéral NégoBot. S’ajoute à chaque page avec :
   <script src="menu.js" data-base="" data-page="accueil"></script>
   data-base : chemin vers la racine du site ("" ou "../")
   data-page : accueil, doc ou dashboard */
(async function () {
  const script = document.currentScript;
  const base = script.dataset.base || "";
  const page = script.dataset.page || "";

  /* Adresse publique de l’API (ton tunnel), sans "/" à la fin */
 const API = "https://deem-cash-almighty.ngrok-free.dev";
  window.NEGOBOT = { api: API, pret: false };

  /* Retour de la connexion Discord : l’API renvoie vers la page avec #token=... */
  const retour = location.hash.match(/^#token=([\w-]+)$/);
  if (retour) {
    try {
      localStorage.setItem("negobot_token", retour[1]);
      history.replaceState(null, "", location.pathname + location.search);
      const r = await fetch(API + "/me", {
        headers: { Authorization: "Bearer " + retour[1], "ngrok-skip-browser-warning": "1" }
      });
      if (r.ok) localStorage.setItem("negobot_user", JSON.stringify(await r.json()));
    } catch (e) {}
  }

  /* Anciens éléments de navigation remplacés par ce menu */
  document.querySelectorAll(".nav-doc, .haut").forEach(e => e.remove());

  const css = `
  :root{--sb:250px}
  .sb{position:fixed;inset:0 auto 0 0;width:var(--sb);z-index:50;display:flex;flex-direction:column;gap:1.4rem;padding:1.3rem 1rem;background:rgba(2,3,79,.72);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-right:1px solid rgba(255,255,255,.14);font-family:var(--titre,'Sora','Helvetica Neue',Arial,sans-serif);transition:transform .3s}
  .sb-marque{display:flex;align-items:center;gap:.7rem;padding:.2rem .5rem;font-weight:800;font-size:1.2rem;letter-spacing:-.03em;color:#fff;text-decoration:none}
  .sb-marque img{width:2.2rem;height:2.2rem;border-radius:24%;display:block}
  .sb nav{display:grid;gap:.35rem}
  .sb nav a{display:flex;align-items:center;gap:.75rem;padding:.8rem 1rem;border-radius:999px;color:#c3d6ff;text-decoration:none;font-weight:700;font-size:.98rem;letter-spacing:-.01em}
  .sb nav a:hover{background:rgba(255,255,255,.1);color:#fff}
  .sb nav a[aria-current=page]{color:#00104f;background:linear-gradient(180deg,#fff,#c6d2ec);box-shadow:0 6px 24px rgba(0,120,255,.45)}
  .sb nav svg{width:1.15rem;height:1.15rem;flex:none}
  .sb-compte{margin-top:auto;padding:1rem;border-radius:24px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);display:grid;gap:.8rem}
  .sb-id{display:flex;align-items:center;gap:.7rem;min-width:0}
  .sb-av{width:2.4rem;height:2.4rem;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;color:#fff;background:#3b57d6;object-fit:cover}
  .sb-nom{font-weight:700;color:#fff;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sb-sous{display:block;font-size:.78rem;color:#a9c4ff;font-weight:400;white-space:normal}
  .sb-btn{display:block;text-align:center;padding:.75rem 1rem;border-radius:999px;font:700 .92rem/1.2 inherit;font-family:inherit;text-decoration:none;color:#fff;background:linear-gradient(180deg,#0a5cff,#0030c8);box-shadow:0 6px 20px rgba(0,60,255,.45);border:0;cursor:pointer}
  .sb-btn[aria-disabled=true]{opacity:.55;pointer-events:none}
  .sb-btn.sec{background:transparent;box-shadow:none;border:1.5px solid rgba(255,255,255,.35)}
  .sb :focus-visible,.sb-burger:focus-visible{outline:3px solid #00b4ff;outline-offset:3px}
  .sb-burger,.sb-voile{display:none}
  @media (min-width:900px){body.avec-menu{padding-left:var(--sb)}}
  @media (max-width:899px){
    .sb{transform:translateX(-100%)}
    body.menu-ouvert .sb{transform:none}
    .sb-burger{display:grid;place-items:center;position:fixed;top:.9rem;left:.9rem;z-index:60;width:2.8rem;height:2.8rem;border-radius:50%;border:1.5px solid rgba(255,255,255,.35);background:rgba(2,3,79,.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#fff;cursor:pointer}
    .sb-burger svg{width:1.3rem;height:1.3rem}
    body.menu-ouvert .sb-voile{display:block;position:fixed;inset:0;z-index:40;background:rgba(0,0,30,.55)}
  }
  @media (prefers-reduced-motion:reduce){.sb{transition:none}}`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const icones = {
    accueil: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 2 12h3v8h6v-5h2v5h6v-8h3z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H3zM21 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h8v10H3zm10 0h8v6h-8zM3 15h8v6H3zm10-4h8v10h-8z"/></svg>'
  };
  const liens = [
    ["accueil", "Accueil", base || "./"],
    ["doc", "Documentation", base + "documentation/"],
    ["dashboard", "Dashboard", base + "dashboard/"]
  ];
  const nav = liens.map(([cle, nom, href]) =>
    `<a href="${href}"${cle === page ? ' aria-current="page"' : ""}>${icones[cle]}${nom}</a>`
  ).join("");

  /* Compte : l’étape 2 enregistrera l’utilisateur connecté dans localStorage("negobot_user")
     sous la forme {"username":"...","avatar":"https://..."} */
  let user = null;
  try { user = JSON.parse(localStorage.getItem("negobot_user")); } catch (e) {}

  let compte;
  if (user && user.username) {
    const av = user.avatar
      ? `<img class="sb-av" src="${user.avatar}" alt="">`
      : `<span class="sb-av">${user.username.charAt(0).toUpperCase()}</span>`;
    const nom = document.createElement("span");
    nom.textContent = user.username;
    compte = `<div class="sb-id">${av}<div style="min-width:0"><div class="sb-nom">${nom.innerHTML}</div><span class="sb-sous">Connecté avec Discord</span></div></div>
      <button class="sb-btn sec" type="button" id="sb-deco">Se déconnecter</button>`;
  } else {
    const lien = API ? `href="${API}/login"` : 'href="#" aria-disabled="true"';
    compte = `<div class="sb-id"><span class="sb-av">?</span><div><div class="sb-nom">Non connecté</div>${API ? "" : '<span class="sb-sous">Connexion bientôt disponible</span>'}</div></div>
      <a class="sb-btn" ${lien}>Se connecter avec Discord</a>`;
  }

  const logo = `<img src="${base}logo.png" alt="" onerror="this.style.display='none'">`;
  const side = document.createElement("aside");
  side.className = "sb";
  side.id = "menu-lateral";
  side.setAttribute("aria-label", "Menu principal");
  side.innerHTML = `<a class="sb-marque" href="${base || "./"}">${logo}NégoBot</a><nav>${nav}</nav><div class="sb-compte">${compte}</div>`;

  const burger = document.createElement("button");
  burger.className = "sb-burger";
  burger.type = "button";
  burger.setAttribute("aria-label", "Ouvrir le menu");
  burger.setAttribute("aria-controls", "menu-lateral");
  burger.setAttribute("aria-expanded", "false");
  burger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  const voile = document.createElement("div");
  voile.className = "sb-voile";

  document.body.classList.add("avec-menu");
  document.body.append(voile, side, burger);

  const bascule = ouvert => {
    document.body.classList.toggle("menu-ouvert", ouvert);
    burger.setAttribute("aria-expanded", String(ouvert));
  };
  burger.addEventListener("click", () => bascule(!document.body.classList.contains("menu-ouvert")));
  voile.addEventListener("click", () => bascule(false));
  document.addEventListener("keydown", e => { if (e.key === "Escape") bascule(false); });

  const deco = document.getElementById("sb-deco");
  if (deco) deco.addEventListener("click", () => {
    try { localStorage.removeItem("negobot_user"); localStorage.removeItem("negobot_token"); } catch (e) {}
    location.reload();
  });

  window.NEGOBOT.pret = true;
  document.dispatchEvent(new Event("negobot-pret"));
})();
