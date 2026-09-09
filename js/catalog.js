document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("product-search");
    const searchForm = document.querySelector(".search-form");
    const filtersForm = document.querySelector(".filters-form");
    const sortSelect = document.getElementById("sort-products");
    const resultsCount = document.querySelector(".catalog-header__results");
    const catalogGrid = document.querySelector(".catalog-grid");
    const clearButton = document.querySelector(".filters-form__reset");

    if (!catalogGrid) return;

    // Guardar referencia a todas las tarjetas originales y su orden inicial
    const productCards = Array.from(catalogGrid.querySelectorAll(".product-card"));
    productCards.forEach((card, index) => {
        card.dataset.initialIndex = index;
    });

    // Función principal para filtrar y ordenar
    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

        // Obtener categorías seleccionadas
        const checkedCategories = Array.from(
            filtersForm.querySelectorAll('input[name="category"]:checked')
        ).map((cb) => cb.value.toLowerCase());

        // Obtener plataformas seleccionadas
        const checkedPlatforms = Array.from(
            filtersForm.querySelectorAll('input[name="platform"]:checked')
        ).map((cb) => cb.value.toLowerCase());

        // Obtener rango de precio seleccionado
        const selectedPriceRadio = filtersForm.querySelector('input[name="price"]:checked');
        const priceFilter = selectedPriceRadio ? selectedPriceRadio.value : null;

        // Disponibilidad
        const availabilityCheckbox = filtersForm.querySelector('input[name="availability"]');
        const onlyAvailable = availabilityCheckbox ? availabilityCheckbox.checked : false;

        let visibleCount = 0;

        productCards.forEach((card) => {
            const name = (card.dataset.name || card.querySelector(".product-card__title")?.textContent || "").toLowerCase();
            const category = (card.dataset.category || card.querySelector(".product-card__category")?.textContent || "").toLowerCase();
            const platforms = (card.dataset.platform || "pc playstation xbox").toLowerCase().split(" ");
            const price = parseFloat(card.dataset.price || "0");
            const isAvailable = card.dataset.available !== "false";

            // 1. Filtro por buscador
            const matchesSearch = !query || name.includes(query) || category.includes(query);

            // 2. Filtro por categoría
            const matchesCategory =
                checkedCategories.length === 0 || checkedCategories.includes(category);

            // 3. Filtro por plataforma
            const matchesPlatform =
                checkedPlatforms.length === 0 ||
                checkedPlatforms.some((platform) => platforms.includes(platform));

            // 4. Filtro por precio
            let matchesPrice = true;
            if (priceFilter === "low") {
                matchesPrice = price < 20000;
            } else if (priceFilter === "medium") {
                matchesPrice = price >= 20000 && price <= 40000;
            } else if (priceFilter === "high") {
                matchesPrice = price > 40000;
            }

            // 5. Filtro por disponibilidad
            const matchesAvailability = !onlyAvailable || isAvailable;

            // Comprobar si cumple con todas las condiciones
            const isVisible =
                matchesSearch &&
                matchesCategory &&
                matchesPlatform &&
                matchesPrice &&
                matchesAvailability;

            if (isVisible) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Aplicar ordenamiento
        applySorting();

        // Actualizar contador de resultados
        if (resultsCount) {
            resultsCount.textContent = `${visibleCount} game${visibleCount === 1 ? "" : "s"} available`;
        }

        // Mostrar u ocultar mensaje si no hay resultados
        let noResultsMessage = document.getElementById("no-results-message");
        if (visibleCount === 0) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement("p");
                noResultsMessage.id = "no-results-message";
                noResultsMessage.style.gridColumn = "1 / -1";
                noResultsMessage.style.textAlign = "center";
                noResultsMessage.style.padding = "2rem";
                noResultsMessage.style.color = "#888";
                noResultsMessage.style.fontSize = "1.1rem";
                noResultsMessage.textContent = "No games found matching your filters.";
                catalogGrid.appendChild(noResultsMessage);
            }
            noResultsMessage.style.display = "block";
        } else if (noResultsMessage) {
            noResultsMessage.style.display = "none";
        }
    }

    // Función de ordenamiento
    function applySorting() {
        const sortValue = sortSelect ? sortSelect.value : "relevance";

        const sortedCards = [...productCards].sort((a, b) => {
            const priceA = parseFloat(a.dataset.price || "0");
            const priceB = parseFloat(b.dataset.price || "0");
            const nameA = (a.dataset.name || a.querySelector(".product-card__title")?.textContent || "").toLowerCase();
            const nameB = (b.dataset.name || b.querySelector(".product-card__title")?.textContent || "").toLowerCase();
            const indexA = parseInt(a.dataset.initialIndex || "0", 10);
            const indexB = parseInt(b.dataset.initialIndex || "0", 10);

            if (sortValue === "price-low") {
                return priceA - priceB;
            } else if (sortValue === "price-high") {
                return priceB - priceA;
            } else if (sortValue === "name") {
                return nameA.localeCompare(nameB);
            } else {
                // "relevance" / default
                return indexA - indexB;
            }
        });

        sortedCards.forEach((card) => {
            catalogGrid.appendChild(card);
        });
    }

    // Event listeners
    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            applyFilters();
        });
    }

    if (filtersForm) {
        filtersForm.addEventListener("change", applyFilters);
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", applyFilters);
    }

    if (clearButton) {
        clearButton.addEventListener("click", function () {
            setTimeout(() => {
                if (searchInput) searchInput.value = "";
                if (sortSelect) sortSelect.value = "relevance";
                applyFilters();
            }, 0);
        });
    }

    // Ejecutar al inicio para asegurar estado consistente
    applyFilters();
});
