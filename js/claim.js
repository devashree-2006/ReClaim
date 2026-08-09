/* ========================================
   RECLAIM - CLAIM VERIFICATION
======================================== */


const claimItem =
    document.getElementById("claimItem");

const claimForm =
    document.getElementById("claimForm");

const claimResult =
    document.getElementById("claimResult");


/* ========================================
   GET ITEM ID FROM URL
======================================== */

const urlParams =
    new URLSearchParams(window.location.search);

const itemId =
    urlParams.get("id");


/* ========================================
   GET FOUND ITEMS
======================================== */

const foundItems =
    JSON.parse(
        localStorage.getItem("reclaimFoundItems")
    ) || [];


const item =
    foundItems.find(function(foundItem) {

        return foundItem.id === itemId;

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
   DISPLAY ITEM
======================================== */

if (!item) {

    claimItem.innerHTML =

        '<div class="claim-item-label">' +
        'ITEM NOT FOUND' +
        '</div>' +

        '<h2>' +
        'This item is no longer available.' +
        '</h2>' +

        '<p>' +
        'Please return to the browse page and ' +
        'select another item.' +
        '</p>';

    claimForm.style.display = "none";

} else {

    claimItem.innerHTML =

        '<div class="claim-item-label">' +
        'YOU ARE CLAIMING' +
        '</div>' +

        '<h2>' +

        getCategoryIcon(item.category) +
        ' ' +
        item.itemName +

        '</h2>' +

        '<p>' +

        item.description +

        '</p>' +

        '<div class="claim-item-meta">' +

        '<span>' +
        '📍 ' +
        item.foundLocation +
        '</span>' +

        '<span>' +
        '📅 ' +
        formatDate(item.foundDate) +
        '</span>' +

        '<span>' +
        '🎨 ' +
        item.color +
        '</span>' +

        '</div>';

}


/* ========================================
   NORMALIZE ANSWERS
======================================== */

function normalizeAnswer(answer) {

    return answer
        .toLowerCase()
        .trim()
        .replace(/[.,!?]/g, "")
        .replace(/\s+/g, " ");
}


/* ========================================
   CHECK ANSWER
======================================== */

function answerMatches(
    userAnswer,
    correctAnswer
) {

    if (!correctAnswer) {
        return false;
    }


    const user =
        normalizeAnswer(userAnswer);

    const correct =
        normalizeAnswer(correctAnswer);


    if (!user) {
        return false;
    }


    // Exact match
    if (user === correct) {
        return true;
    }


    // Check whether important words overlap
    const correctWords =
        correct
        .split(" ")
        .filter(function(word) {

            return word.length > 2;

        });


    let matches = 0;


    correctWords.forEach(function(word) {

        if (user.includes(word)) {

            matches++;

        }

    });


    // At least 50% of meaningful words match
    return (
        correctWords.length > 0 &&
        matches / correctWords.length >= 0.5
    );
}


/* ========================================
   SUBMIT CLAIM
======================================== */

if (claimForm && item) {

    claimForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const answer1 =
                document
                .getElementById("answer1")
                .value;


            const answer2 =
                document
                .getElementById("answer2")
                .value;


            const answer3 =
                document
                .getElementById("answer3")
                .value;


            const claimerName =
                document
                .getElementById("claimerName")
                .value
                .trim();


            const claimerEmail =
                document
                .getElementById("claimerEmail")
                .value
                .trim();


            /* ========================================
               COMPARE PRIVATE DETAILS
            ======================================== */

            const verification =
                item.verification || {};


            const result1 =
                answerMatches(
                    answer1,
                    verification.uniqueDetail
                );


            const result2 =
                answerMatches(
                    answer2,
                    verification.hiddenDetail
                );


            const result3 =
                answerMatches(
                    answer3,
                    verification.contents
                );


            const score =

                Number(result1) +
                Number(result2) +
                Number(result3);


            /* ========================================
               REQUIRE AT LEAST 2 / 3
            ======================================== */

            const verified =
                score >= 2;


            /* ========================================
               SAVE CLAIM
            ======================================== */

            const claims =
                JSON.parse(
                    localStorage.getItem(
                        "reclaimClaims"
                    )
                ) || [];


            const claim = {

                id: "CL-" +
                    Date.now()
                    .toString()
                    .slice(-6),

                itemId: item.id,

                itemName: item.itemName,

                claimer: {

                    name: claimerName,

                    email: claimerEmail

                },

                verificationScore: score,

                status: verified ?
                    "verified" : "rejected",

                createdAt: new Date().toISOString()

            };


            claims.push(claim);


            localStorage.setItem(
                "reclaimClaims",
                JSON.stringify(claims)
            );


            /* ========================================
               SHOW RESULT
            ======================================== */

            claimForm.style.display =
                "none";


            claimResult.className =
                "claim-result success";


            if (verified) {

                claimResult.innerHTML =

                    '<div class="claim-result-icon">' +
                    '✓' +
                    '</div>' +

                    '<h2>' +
                    'Ownership verified!' +
                    '</h2>' +

                    '<p>' +

                    'Your answers matched the private ' +
                    'details provided for this item. ' +
                    'The finder can now be contacted ' +
                    'to arrange its safe return.' +

                    '</p>' +


                    '</p>' +

                    '<p>' +

                    '<strong>' +
                    'Your Claim ID: ' +
                    claim.id +
                    '</strong>' +

                    '</p>' +

                    '<p>' +

                    '<strong>' +
                    'Verification score: ' +
                    score +
                    '/3' +
                    '</strong>' +

                    '</p>' +


                    '<a href="status.html" ' +
                    'class="btn primary">' +

                    'Track Claim' +

                    '</a>' +

                    '<a href="browse.html" ' +
                    'class="btn secondary">' +

                    'Back to Found Items' +

                    '</a>';


            } else {

                claimResult.innerHTML =

                    '<div class="claim-result-icon">' +
                    '⚠️' +
                    '</div>' +

                    '<h2>' +
                    'We could not verify ownership.'
                '</h2>' +

                '<p>' +

                'Your answers did not match enough ' +
                'of the private details associated ' +
                'with this item.' +

                '</p>' +

                '<p>' +

                'For security, we cannot reveal ' +
                'which answers were incorrect.' +

                '</p>' +

                '<a href="browse.html" ' +
                'class="btn primary">' +

                'Back to Found Items' +

                '</a>';

            }

        }
    );

}