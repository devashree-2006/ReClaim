/* ========================================
   RECLAIM - CLAIM STATUS
======================================== */

const claimIdInput =
    document.getElementById("claimId");

const trackButton =
    document.getElementById("trackButton");

const statusResult =
    document.getElementById("statusResult");


/* ========================================
   TRACK CLAIM
======================================== */

function trackClaim() {

    const claimId =
        claimIdInput.value
        .trim()
        .toUpperCase();


    // Check if user entered an ID
    if (!claimId) {

        showResult(
            "⚠️",
            "Enter a Claim ID",
            "Please enter the Claim ID you received after ownership verification."
        );

        return;
    }


    // Get saved claims
    const claims =
        JSON.parse(
            localStorage.getItem("reclaimClaims")
        ) || [];


    // Find matching claim
    const claim =
        claims.find(function(item) {

            return (
                item.id &&
                item.id.toUpperCase() === claimId
            );

        });


    // Claim not found
    if (!claim) {

        showResult(
            "🔍",
            "Claim not found",
            "We couldn't find a claim with that ID. Please check the Claim ID and try again."
        );

        return;
    }


    // Claim found
    displayClaim(claim);
}


/* ========================================
   DISPLAY CLAIM
======================================== */

function displayClaim(claim) {

    const verified =
        claim.status === "verified";


    const rejected =
        claim.status === "rejected";


    const returned =
        claim.status === "returned";


    /* ========================================
       STATUS MESSAGE
    ======================================== */

    if (returned) {

        showResult(
            "✓",
            "Item returned",
            "This claim has been completed and the item has been safely returned."
        );

    } else if (verified) {

        showResult(
            "✓",
            "Ownership verified",
            "Your answers matched enough of the private details associated with this item."
        );

    } else if (rejected) {

        showResult(
            "⚠️",
            "Verification unsuccessful",
            "The submitted answers did not match enough of the private details."
        );

    } else {

        showResult(
            "📋",
            "Claim submitted",
            "Your claim has been submitted and is currently being processed."
        );

    }


    /* ========================================
       RESULT MESSAGE
    ======================================== */

    const resultMessage =
        statusResult.querySelector(
            ".result-message"
        );


    resultMessage.innerHTML +=

        '<div class="claim-details">' +

        '<div class="claim-detail">' +

        '<span>Claim ID</span>' +

        '<strong>' +
        claim.id +
        '</strong>' +

        '</div>' +


        '<div class="claim-detail">' +

        '<span>Item</span>' +

        '<strong>' +
        claim.itemName +
        '</strong>' +

        '</div>' +


        '<div class="claim-detail">' +

        '<span>Submitted</span>' +

        '<strong>' +
        formatDate(claim.createdAt) +
        '</strong>' +

        '</div>' +


        '<div class="claim-detail">' +

        '<span>Score</span>' +

        '<strong>' +
        claim.verificationScore +
        '/3' +
        '</strong>' +

        '</div>' +

        '</div>' +


        /* ========================================
           PROGRESS
        ======================================== */

        '<div class="progress">' +

        '<div class="progress-step active">' +

        '<div class="progress-circle">' +
        '✓' +
        '</div>' +

        '<span>Submitted</span>' +

        '</div>' +


        '<div class="progress-step ' +
        (verified || returned ? "active" : "") +
        '">' +

        '<div class="progress-circle">' +
        (verified || returned ? "✓" : "2") +
        '</div>' +

        '<span>Verified</span>' +

        '</div>' +


        '<div class="progress-step ' +
        (returned ? "active" : "") +
        '">' +

        '<div class="progress-circle">' +
        (returned ? "✓" : "3") +
        '</div>' +

        '<span>Returned</span>' +

        '</div>' +

        '</div>' +


        /* ========================================
           RETURN BUTTON
        ======================================== */

        (
            verified && !returned

            ?

            '<button ' +
            'type="button" ' +
            'class="btn primary" ' +
            'id="returnButton">' +

            '✓ Mark Item as Returned' +

            '</button>'

            :

            returned

            ?

            '<div class="returned-message">' +

            '✓ Item successfully marked as returned.' +

            '</div>'

            :

            ''
        );


    /* ========================================
       RETURN BUTTON EVENT
    ======================================== */

    const returnButton =
        document.getElementById(
            "returnButton"
        );


    if (returnButton) {

        returnButton.addEventListener(
            "click",
            function() {

                const confirmed =
                    confirm(
                        "Have you received the item safely?"
                    );


                if (confirmed) {

                    markAsReturned(
                        claim.id
                    );

                }

            }
        );

    }

}


/* ========================================
   SHOW RESULT
======================================== */

function showResult(
    icon,
    title,
    message
) {

    statusResult.innerHTML =

        '<div class="status-icon">' +
        icon +
        '</div>' +

        '<h2>' +
        title +
        '</h2>' +

        '<div class="result-message">' +

        '<p>' +
        message +
        '</p>' +

        '</div>';


    statusResult.classList.add(
        "visible"
    );
}


/* ========================================
   FORMAT DATE
======================================== */

function formatDate(date) {

    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}

/* ========================================
   MARK ITEM AS RETURNED
======================================== */

function markAsReturned(claimId) {

    const claims =
        JSON.parse(
            localStorage.getItem(
                "reclaimClaims"
            )
        ) || [];


    const claimIndex =
        claims.findIndex(
            function(claim) {

                return claim.id === claimId;

            }
        );


    if (claimIndex === -1) {

        return;

    }


    /* ========================================
       UPDATE CLAIM STATUS
    ======================================== */

    claims[claimIndex].status =
        "returned";


    claims[claimIndex].returnedAt =
        new Date().toISOString();


    localStorage.setItem(
        "reclaimClaims",
        JSON.stringify(claims)
    );


    /* ========================================
       UPDATE FOUND ITEM STATUS
    ======================================== */

    const foundItems =
        JSON.parse(
            localStorage.getItem(
                "reclaimFoundItems"
            )
        ) || [];


    const foundItemIndex =
        foundItems.findIndex(
            function(item) {

                return (
                    item.id ===
                    claims[claimIndex].itemId
                );

            }
        );


    if (foundItemIndex !== -1) {

        foundItems[foundItemIndex].status =
            "returned";


        foundItems[foundItemIndex].returnedAt =
            new Date().toISOString();


        localStorage.setItem(
            "reclaimFoundItems",
            JSON.stringify(foundItems)
        );

    }


    /* ========================================
       REFRESH CLAIM STATUS
    ======================================== */

    displayClaim(
        claims[claimIndex]
    );

}


/* ========================================
   EVENTS
======================================== */

if (trackButton) {

    trackButton.addEventListener(
        "click",
        trackClaim
    );

}


if (claimIdInput) {

    claimIdInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                trackClaim();

            }

        }
    );

}