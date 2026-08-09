/* ========================================
   RECLAIM - BROWSE FOUND ITEMS
======================================== */

const itemsGrid = document.getElementById("itemsGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");


/* ========================================
   LOAD FOUND ITEMS
======================================== */

let foundItems = [];

try {

    foundItems =
        JSON.parse(
            localStorage.getItem("reclaimFoundItems")
        ) || [];

} catch (error) {

    foundItems = [];

}


/* ========================================
   SHOW ONLY AVAILABLE ITEMS
======================================== */

foundItems = foundItems.filter(function(item) {

    return item.status === "active";

});


/* ========================================
   CATEGORY ICON
======================================== */

function getCategoryIcon(category) {

    if (category === "electronics") return "📱";

    if (category === "wallet") return "👛";

    if (category === "id") return "🪪";

    if (category === "bag") return "🎒";

    if (category === "clothing") return "👕";

    if (category === "jewellery") return "💍";

    if (category === "stationery") return "📚";

    if (category === "keys") return "🔑";

    return "📦";
}


/* ========================================
   FORMAT DATE
======================================== */

function formatDate(date) {

    if (!date) {
        return "Unknown date";
    }

    const dateObject =
        new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString(
        "en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* ========================================
   DISPLAY ITEMS
======================================== */

function displayItems(items) {

    itemsGrid.innerHTML = "";


    resultCount.textContent =
        items.length +
        (items.length === 1 ? " item" : " items");


    if (items.length === 0) {

        emptyState.style.display = "block";

        return;
    }


    emptyState.style.display = "none";


    items.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className = "item-card";


        card.innerHTML =

            '<div class="item-card-top">' +

            getCategoryIcon(item.category) +

            '</div>' +


            '<div class="item-card-body">' +

            '<span class="item-category">' +

            item.category +

            '</span>' +


            '<h3>' +

            item.itemName +

            '</h3>' +


            '<p class="item-description">' +

            item.description +

            '</p>' +


            '<div class="item-meta">' +

            '<span>📍 ' +

            item.foundLocation +

            '</span>' +


            '<span>📅 ' +

            formatDate(item.foundDate) +

            '</span>' +


            '<span>🎨 ' +

            item.color +

            '</span>' +

            '</div>' +


            '<a href="claim.html?id=' +

            encodeURIComponent(item.id) +

            '" class="claim-btn">' +

            'This is Mine →' +

            '</a>' +

            '</div>';


        itemsGrid.appendChild(card);

    });

}


/* ========================================
   SEARCH
======================================== */

function filterItems() {

    const searchTerm =
        searchInput.value
        .toLowerCase()
        .trim();


    const selectedCategory =
        categoryFilter.value;


    const filteredItems =
        foundItems.filter(function(item) {

            const text =

                (item.itemName || "") +
                " " +
                (item.category || "") +
                " " +
                (item.color || "") +
                " " +
                (item.foundLocation || "") +
                " " +
                (item.description || "");


            const matchesSearch =
                text
                .toLowerCase()
                .includes(searchTerm);


            const matchesCategory =

                selectedCategory === "all" ||

                item.category === selectedCategory;


            return matchesSearch &&
                matchesCategory;

        });


    displayItems(filteredItems);
}


/* ========================================
   EVENT LISTENERS
======================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterItems
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterItems
    );

}


/* ========================================
   DISPLAY ON PAGE LOAD
======================================== */

displayItems(foundItems);