function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};

        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j];
        }

        data.push(row);
    }

    return data;
}

async function searchAndNavigate() {
    try {
        // Get the entered English term
        var englishTerm = document.getElementById('englishTerm').value;

        // Call the translations function and pass the term
        var translationsResult = await translations(englishTerm);

        // Navigate to detail.html and pass the result as a query parameter
        window.location.href = 'detail.html?result=' + encodeURIComponent(translationsResult);
    } catch (error) {
        console.error(error);
        // Handle the error, e.g., display an error message
        alert("Error: " + error);
    }
}


function handleKeyPress(event) {
    // Check if the pressed key is "Enter" (key code 13)
    if (event.key === "Enter") {
        // Call the translations function when Enter is pressed
        searchAndNavigate();
    }
}

// Function to read and translate from CSV
function translations(englishTerm) {
    return new Promise((resolve, reject) => {
        // Fetch the CSV file content
        fetch('data/vocab_example.csv')
            .then(response => response.text())
            .then(csvData => {
                const data = parseCSV(csvData);
                const translation = data.find(row => row.English === englishTerm);

                if (translation) {
                    resolve(translation.French);
                } else {
                    reject("Translation not found.");
                }
            })
            .catch(error => {
                reject('Error fetching CSV: ' + error);
            });
    });
}

