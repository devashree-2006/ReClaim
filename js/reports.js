/* ========================================
   RECLAIM - LOST ITEM REPORT
======================================== */

const lostItemForm = document.getElementById("lostItemForm");

if (lostItemForm) {

    lostItemForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Generate unique report ID
        const reportId =
            "RC-L" + Date.now().toString().slice(-6);

        // Create lost item object
        const lostItem = {

            id: reportId,

            type: "lost",

            itemName: document.getElementById("itemName").value.trim(),

            category: document.getElementById("category").value,

            color: document.getElementById("color").value.trim(),

            lostDate: document.getElementById("lostDate").value,

            lostLocation: document.getElementById("lostLocation").value.trim(),

            lostTime: document.getElementById("lostTime").value,

            description: document.getElementById("description").value.trim(),

            // PRIVATE VERIFICATION DETAILS
            verification: {

                uniqueDetail: document.getElementById("uniqueDetail").value.trim(),

                hiddenDetail: document.getElementById("hiddenDetail").value.trim(),

                itemContents: document.getElementById("itemContents").value.trim()
            },

            // CONTACT DETAILS
            contact: {

                name: document.getElementById("name").value.trim(),

                email: document.getElementById("email").value.trim()
            },

            status: "active",

            createdAt: new Date().toISOString()
        };

        // Get existing reports
        const existingReports =
            JSON.parse(
                localStorage.getItem("reclaimLostItems")
            ) || [];

        // Add new report
        existingReports.push(lostItem);

        // Save reports
        localStorage.setItem(
            "reclaimLostItems",
            JSON.stringify(existingReports)
        );


        // Save latest report ID
        localStorage.setItem(
            "reclaimLatestReport",
            reportId
        );


        // ========================================
        // CHECK FOR POSSIBLE FOUND ITEM MATCHES
        // ========================================

        const foundItems =
            JSON.parse(
                localStorage.getItem("reclaimFoundItems")
            ) || [];


        const possibleMatches =
            findPossibleMatches(
                lostItem,
                foundItems
            );


        localStorage.setItem(
            "reclaimLatestMatches",
            JSON.stringify(possibleMatches)
        );


        // Show success screen
        showReportSuccess(reportId);


    });

}



/* ========================================
   SUCCESS SCREEN
======================================== */

function showReportSuccess(reportId) {

    const formContainer =
        document.querySelector(".form-container");

    if (!formContainer) {
        return;
    }


    // Get possible matches
    const possibleMatches =
        JSON.parse(
            localStorage.getItem("reclaimLatestMatches")
        ) || [];


    let matchesHTML = "";


    /* ========================================
       MATCHES FOUND
    ======================================== */

    if (possibleMatches.length > 0) {

        matchesHTML =
            '<div class="possible-matches">' +

            '<div class="matches-heading">' +

            '<span class="match-icon">🔎</span>' +

            '<div>' +

            '<h3>Possible matches found</h3>' +

            '<p>' +
            'We found items that may match your report. ' +
            'Check the public details and verify ownership.' +
            '</p>' +

            '</div>' +

            '</div>';


        possibleMatches.forEach(function(match) {

            let matchLabel =
                "Possible Match";


            if (match.score >= 80) {

                matchLabel =
                    "High Match";

            } else if (match.score >= 60) {

                matchLabel =
                    "Good Match";

            }


            matchesHTML +=

                '<div class="match-card">' +

                '<div>' +

                '<span class="match-label">' +
                matchLabel +
                '</span>' +

                '<h4>' +
                match.itemName +
                '</h4>' +

                '<p>' +
                'Match confidence: ' +
                match.score +
                '%' +
                '</p>' +

                '</div>' +


                '<a href="claim.html?id=' +
                encodeURIComponent(
                    match.foundItemId
                ) +
                '" class="btn primary">' +

                'View & Verify →' +

                '</a>' +

                '</div>';

        });


        matchesHTML +=
            '</div>';


        /* ========================================
           NO MATCHES
        ======================================== */

    } else {

        matchesHTML =

            '<div class="no-matches">' +

            '<div class="no-match-icon">' +
            '🔍' +
            '</div>' +

            '<h3>' +
            'No possible matches yet' +
            '</h3>' +

            '<p>' +
            "Don't worry. Your report is saved. " +
            "We'll use the details to identify " +
            "potential matches when found items " +
            "are reported." +
            '</p>' +

            '</div>';
    }


    /* ========================================
       SUCCESS CARD
    ======================================== */

    formContainer.innerHTML =

        '<div class="success-card">' +

        '<div class="success-large-icon">' +
        '✓' +
        '</div>' +

        '<span class="section-label">' +
        'REPORT SUBMITTED' +
        '</span>' +

        '<h2>' +
        'Your lost item is now on ReClaim.' +
        '</h2>' +

        '<p>' +
        'We have saved your report and checked it ' +
        'against the found items currently available.' +
        '</p>' +


        '<div class="report-id-box">' +

        '<span>' +
        'Your Report ID' +
        '</span>' +

        '<strong>' +
        reportId +
        '</strong>' +

        '<small>' +
        'Save this ID to track your report.' +
        '</small>' +

        '</div>' +


        matchesHTML +


        '<div class="success-actions">' +

        '<a href="browse.html" class="btn primary">' +
        'Browse Found Items' +
        '</a>' +

        '<a href="index.html" class="btn secondary">' +
        'Back to Home' +
        '</a>' +

        '</div>' +

        '</div>';
}


/* ========================================
   RECLAIM - FOUND ITEM REPORT
======================================== */

const foundItemForm =
    document.getElementById("foundItemForm");


if (foundItemForm) {

    foundItemForm.addEventListener("submit", function(event) {

        event.preventDefault();


        // Generate unique found-item report ID
        const reportId =
            "RC-F" + Date.now().toString().slice(-6);


        // Create found item object
        const foundItem = {

            id: reportId,

            type: "found",


            // PUBLIC INFORMATION
            itemName: document
                .getElementById("foundItemName")
                .value
                .trim(),

            category: document
                .getElementById("foundCategory")
                .value,

            color: document
                .getElementById("foundColor")
                .value
                .trim(),

            foundDate: document
                .getElementById("foundDate")
                .value,

            foundLocation: document
                .getElementById("foundLocation")
                .value
                .trim(),

            foundTime: document
                .getElementById("foundTime")
                .value,

            description: document
                .getElementById("foundDescription")
                .value
                .trim(),


            // PRIVATE VERIFICATION INFORMATION
            verification: {

                uniqueDetail: document
                    .getElementById("foundUniqueDetail")
                    .value
                    .trim(),

                hiddenDetail: document
                    .getElementById("foundHiddenDetail")
                    .value
                    .trim(),

                contents: document
                    .getElementById("foundContents")
                    .value
                    .trim()
            },


            // FINDER CONTACT
            contact: {

                name: document
                    .getElementById("finderName")
                    .value
                    .trim(),

                email: document
                    .getElementById("finderEmail")
                    .value
                    .trim()
            },


            status: "active",

            createdAt: new Date().toISOString()
        };


        // Get existing found reports
        const existingFoundItems =
            JSON.parse(
                localStorage.getItem("reclaimFoundItems")
            ) || [];


        // Add new found item
        existingFoundItems.push(foundItem);


        // Save found items
        localStorage.setItem(
            "reclaimFoundItems",
            JSON.stringify(existingFoundItems)
        );


        // Save latest found report ID
        localStorage.setItem(
            "reclaimLatestFoundReport",
            reportId
        );


        // Show success screen
        showFoundSuccess(reportId);

    });

}


/* ========================================
   FOUND ITEM SUCCESS SCREEN
======================================== */

function showFoundSuccess(reportId) {

    const formContainer =
        document.querySelector(".form-container");


    if (!formContainer) {
        return;
    }


    formContainer.innerHTML =
        '<div class="success-card">' +

        '<div class="success-large-icon">' +
        '✓' +
        '</div>' +

        '<span class="section-label">' +
        'ITEM REPORTED' +
        '</span>' +

        '<h2>' +
        'Thank you for helping return an item.' +
        '</h2>' +

        '<p>' +
        'The item has been securely added to ReClaim. ' +
        'Its private details will be used to verify anyone ' +
        'who tries to claim it.' +
        '</p>' +

        '<div class="report-id-box">' +

        '<span>' +
        'Your Found Item ID' +
        '</span>' +

        '<strong>' +
        reportId +
        '</strong>' +

        '<small>' +
        'Save this ID for future reference.' +
        '</small>' +

        '</div>' +

        '<div class="success-actions">' +

        '<a href="browse.html" class="btn primary">' +
        'Browse Lost & Found Items' +
        '</a>' +

        '<a href="index.html" class="btn secondary">' +
        'Back to Home' +
        '</a>' +

        '</div>' +

        '</div>';
}

/* ========================================
   RECLAIM - FIND POSSIBLE MATCHES
======================================== */

function findPossibleMatches(lostItem, foundItems) {

    const matches = [];


    foundItems.forEach(function(foundItem) {

        let score = 0;


        /* ========================================
           CATEGORY MATCH
        ======================================== */

        if (
            lostItem.category &&
            foundItem.category &&
            lostItem.category === foundItem.category
        ) {

            score += 30;

        }


        /* ========================================
           COLOR MATCH
        ======================================== */

        if (
            lostItem.color &&
            foundItem.color &&
            lostItem.color
            .toLowerCase()
            .includes(
                foundItem.color.toLowerCase()
            )
        ) {

            score += 20;

        }


        /* ========================================
           LOCATION MATCH
        ======================================== */

        const lostLocation =
            lostItem.lostLocation
            .toLowerCase();

        const foundLocation =
            foundItem.foundLocation
            .toLowerCase();


        if (
            lostLocation.includes(foundLocation) ||
            foundLocation.includes(lostLocation)
        ) {

            score += 25;

        }


        /* ========================================
           DATE MATCH
        ======================================== */

        if (
            lostItem.lostDate &&
            foundItem.foundDate
        ) {

            const lostDate =
                new Date(lostItem.lostDate);

            const foundDate =
                new Date(foundItem.foundDate);


            const difference =
                Math.abs(
                    lostDate - foundDate
                );


            const days =
                difference /
                (1000 * 60 * 60 * 24);


            if (days <= 2) {

                score += 15;

            }

        }


        /* ========================================
           ITEM NAME MATCH
        ======================================== */

        const lostName =
            lostItem.itemName
            .toLowerCase();

        const foundName =
            foundItem.itemName
            .toLowerCase();


        if (
            lostName.includes(foundName) ||
            foundName.includes(lostName)
        ) {

            score += 10;

        }


        /* ========================================
           SAVE GOOD MATCHES
        ======================================== */

        if (score >= 40) {

            matches.push({

                foundItemId: foundItem.id,

                itemName: foundItem.itemName,

                score: score

            });

        }

    });


    /* ========================================
       HIGHEST MATCH FIRST
    ======================================== */

    matches.sort(function(a, b) {

        return b.score - a.score;

    });


    return matches;

}