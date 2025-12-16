/* =========================================================
   AgriShare – Client-side functionality
   Enables:
   1. Contact form submission
   2. Simple signup storage
   3. Review submission
   4. Display all reviews (review page)
   5. Display 3 most recent reviews (home page)
   ========================================================= */


/* ---------- CONTACT FORM ---------- */
function handleContactForm(event) {
    event.preventDefault(); // Prevent page reload

    const name = document.getElementById("name")?.value.trim();
    const role = document.getElementById("role")?.value;
    const message = document.getElementById("message")?.value.trim();

    if (!name || !message) {
        alert("Please fill all required fields.");
        return;
    }

    fetch("https://formspree.io/f/mwkgrjkp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ name, role, message })
    })
        .then(response => {
            if (!response.ok) throw new Error("Submission failed");
            alert("Message sent successfully!");
            event.target.reset();
        })
        .catch(() => {
            alert("Error sending message. Please try again later.");
        });
}


/* ---------- SIGN UP (FARMER / OWNER) ---------- */
function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("signup-name")?.value.trim();
    const type = document.getElementById("signup-type")?.value;

    if (!username) {
        alert("Enter a valid name.");
        return;
    }

    localStorage.setItem(
        "agrishareUser",
        JSON.stringify({ name: username, type })
    );

    alert("Signup successful! Welcome to AgriShare.");
    event.target.reset();
}


/* ---------- REVIEWS: ADD REVIEW ---------- */
function submitReview(event) {
    event.preventDefault();

    const reviewInput = document.getElementById("review-text");
    if (!reviewInput) return;

    const reviewText = reviewInput.value.trim();

    if (!reviewText) {
        alert("Review cannot be empty.");
        return;
    }

    const reviews = JSON.parse(
        localStorage.getItem("agrishareReviews")
    ) || [];

    reviews.push(reviewText);
    localStorage.setItem("agrishareReviews", JSON.stringify(reviews));

    reviewInput.value = "";
    loadReviews();
    loadRecentReviews();
}


/* ---------- REVIEWS: FULL LIST (REVIEW PAGE) ---------- */
function loadReviews() {
    const list = document.getElementById("review-list");
    if (!list) return;

    list.innerHTML = "";

    const reviews = JSON.parse(
        localStorage.getItem("agrishareReviews")
    ) || [];

    reviews.forEach(review => {
        const li = document.createElement("li");
        li.textContent = review;
        list.appendChild(li);
    });
}


/* ---------- REVIEWS: LAST 3 (HOME PAGE) ---------- */
function loadRecentReviews() {
    const list = document.getElementById("home-review-list");
    if (!list) return;

    list.innerHTML = "";

    const reviews = JSON.parse(
        localStorage.getItem("agrishareReviews")
    ) || [];

    const recentReviews = reviews.slice(-3).reverse();

    if (recentReviews.length === 0) {
        list.innerHTML =
            "<li>No reviews yet. Be the first to share your experience.</li>";
        return;
    }

    recentReviews.forEach(review => {
        const li = document.createElement("li");

        const bullet = document.createElement("span");
        bullet.className = "icon-bullet";

        const text = document.createElement("span");
        text.textContent = review;

        li.appendChild(bullet);
        li.appendChild(text);
        list.appendChild(li);
    });
}


/* ---------- INITIAL LOAD ---------- */
document.addEventListener("DOMContentLoaded", () => {
    loadReviews();
    loadRecentReviews();
});
