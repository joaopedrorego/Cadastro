const popUp__cobranca = document.querySelector(".app__popUp__cobranca")
const popUp__cliente   = document.querySelector(".app__popUp__cliente")
const menuCobrancas = document.querySelector(".menuCobrancas")
const menuClientes = document.querySelector(".menuClientes")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const sidebar = document.getElementById("sidebar")
const body = document.querySelector("body")

// Event listeners
body.addEventListener("click", popUpControllers)
mobileMenuToggle.addEventListener("click", toggleMobileMenu)

// Fechar menu mobile ao clicar fora
document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove("show")
    }
})

// Fechar popups ao pressionar ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeAllPopups()
    }
})

function popUpControllers(e) {
    const cliqueElemento = e.target.innerText.toLowerCase()
    const isCloseBtn = e.target.classList.contains("close-btn")

    if (isCloseBtn) {
        closeAllPopups()
        return
    }

    if (cliqueElemento === "cobranças") {
        popUp__cobranca.classList.add("show")
        body.classList.add("scrollStop")
        closeMobileMenu()
    } else if (cliqueElemento === "clientes") {
        popUp__cliente.classList.add("show")
        body.classList.add("scrollStop")
        closeMobileMenu()
    }
}

function closeAllPopups() {
    popUp__cobranca.classList.remove("show")
    popUp__cliente.classList.remove("show")
    body.classList.remove("scrollStop")
}

function toggleMobileMenu() {
    sidebar.classList.toggle("show")
}

function closeMobileMenu() {
    sidebar.classList.remove("show")
}

// Adicionar funcionalidade de navegação ativa
const navButtons = document.querySelectorAll(".nav-btn")
navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all buttons
        navButtons.forEach(b => b.classList.remove("active"))
        // Add active class to clicked button
        btn.classList.add("active")
    })
})