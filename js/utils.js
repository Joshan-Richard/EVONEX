// js/utils.js

const quotes = [
    { text: "The greatest threat to our planet is the belief that someone else will save it.", author: "Robert Swan" },
    { text: "We don’t inherit the earth from our ancestors, we borrow it from our children.", author: "Native American Proverb" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "An understanding of the natural world is a source of not only great curiosity, but great fulfillment.", author: "David Attenborough" },
    { text: "The Earth is what we all have in common.", author: "Wendell Berry" },
    { text: "Never doubt that a small group of thoughtful, committed citizens can change the world.", author: "Margaret Mead" },
    { text: "He that plants trees loves others besides himself.", author: "Thomas Fuller" }
];

// We use 'export' to make this function available to other files
export function displayRandomQuote() {
    const quoteTextElem = document.getElementById('quote-text');
    const quoteAuthorElem = document.getElementById('quote-author');
    if (!quoteTextElem || !quoteAuthorElem) return;
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteTextElem.textContent = `"${randomQuote.text}"`;
    quoteAuthorElem.textContent = `– ${randomQuote.author}`;
}