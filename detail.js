document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchBtn').addEventListener('click', searchAndNavigate);
    document.getElementById('englishTerm').addEventListener('keypress', handleKeyPress);
});

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve query parameters
    const params = new URLSearchParams(window.location.search);
    const term = params.get('term');
    const translation = params.get('translation');

    // Display the result on the page
    document.getElementById('detailResult').innerText = `French Translation: ${translation}`;
});
