// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Retrieve the result from the URL
        var urlParams = new URLSearchParams(window.location.search);
        var result = urlParams.get('result');

        // Display the result on the page
        document.getElementById('detailResult').innerText = await getTranslatedResult(result);
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., display an error message
        document.getElementById('detailResult').innerText = "Error: " + error;
    }
});

// Function to fetch translated result
async function getTranslatedResult(result) {
    // Simulate an asynchronous operation, e.g., fetching additional details
    return new Promise(resolve => {
        setTimeout(() => {
            // Resolve with the result (or perform additional processing)
            resolve(result);
        }, 1000); // Simulating a delay of 1 second (adjust as needed)
    });
}
