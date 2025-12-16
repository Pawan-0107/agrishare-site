/* =========================================================
   AgriShare – Client-side functionality
   This file enables:
   1. Contact form submission
   2. Simple signup storage
   3. Review submission and display
   ========================================================= */

/* ---------- CONTACT FORM ---------- */
function handleContactForm(event) {
    event.preventDefault(); // Stop page reload

    const name = document.getElementById("name").value;
    const role = document.getElementById("role").value;
    const message = document.getElementById("message").value;

    if (!name || !message) {
        alert("Please fill all required fields.");
        return;
    }

    // Send data to Formspree (external form backend)
    fetch("https://formspree.io/f/mwkgrjkp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            role: role,
            message: message
        })
    })
    .then(() => {
        alert("Message sent successfully!");
        event.target.reset();
    })
    .catch(() => {
        alert("Error sending message. Try again later.");
    });
}

/* ---------- SIGN UP (FARMER / OWNER) ---------- */
function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("signup-name").value;
    const type = document.getElementById("signup-type").value;

    if (!username) {
        alert("Enter a valid name.");
        return;
    }

    // Store user locally (simulation of account creation)
    localStorage.setItem("agrishareUser", JSON.stringify({
        name: username,
        type: type
    }));

    alert("Signup successful! Welcome to AgriShare.");
    event.target.reset();
}

/* ---------- REVIEWS SYSTEM ---------- */
function submitReview(event) {
    event.preventDefault();

    const reviewText = document.getElementById("review-text").value;

    if (!reviewText) {
        alert("Review cannot be empty.");
        return;
    }

    let reviews = JSON.parse(localStorage.getItem("agrishareReviews")) || [];
    reviews.push(reviewText);

    localStorage.setItem("agrishareReviews", JSON.stringify(reviews));
    document.getElementById("review-text").value = "";

    loadReviews();
}

/* ---------- SHOW 3 MOST RECENT REVIEWS ON HOME PAGE ---------- */
function loadRecentReviews() {
    const list = document.getElementById("home-review-list");
    if (!list) return; // Only run on home page

    const reviews = JSON.parse(localStorage.getItem("agrishareReviews")) || [];

    // Take last 3 reviews (most recent)
    const recentReviews = reviews.slice(-3).reverse();

    list.innerHTML = "";

    if (recentReviews.length === 0) {
        list.innerHTML = "<li>No reviews yet. Be the first to share your experience.</li>";
        return;
    }

    recentReviews.forEach(review => {
        const li = document.createElement("li");

        // Bullet styling (matches your theme)
        const bullet = document.createElement("span");
        bullet.className = "icon-bullet";

        const text = document.createElement("span");
        text.textContent = review;

        li.appendChild(bullet);
        li.appendChild(text);
        list.appendChild(li);
    });
}
