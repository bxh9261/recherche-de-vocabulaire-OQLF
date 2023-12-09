// main.js

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchBtn').addEventListener('click', searchAndNavigate);
    document.getElementById('englishTerm').addEventListener('keypress', handleKeyPress);
    document.getElementById('indexBtn').addEventListener('click', indexx);
});


function handleKeyPress(event) {
    if (event.key === "Enter") {
        searchAndNavigate();
    }
}

function indexx() {
    fetch('data/vocab_example.csv')
        .then(response => response.text())
        .then(csvData => {
            const data = parseCSV(csvData);
            displayIndex(data);
        })
        .catch(error => {
            console.error('Error fetching CSV: ', error);
        });
}

function displayIndex(data) {
    const resultContainer = document.getElementById('result');
    
    // Clear previous content
    resultContainer.innerHTML = '';

    // Display the data on the page
    data.forEach(row => {
        const rowElement = document.createElement('h5');
        rowElement.textContent = `English: ${row.English}, French: ${row.French}`;
        resultContainer.appendChild(rowElement);
    });
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
                // multisensory information
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

async function searchAndNavigate() {
    try {
        var englishTerm = document.getElementById('englishTerm').value;
        // document.getElementById('result').innerText = 'Result: ' + englishTerm;

        var translationsResult = await translations(englishTerm);
        // Redirect to detail.html with the translation result as a query parameter
        window.location.href = `detail.html?term=${encodeURIComponent(englishTerm)}&translation=${encodeURIComponent(translationsResult)}`;
        // document.getElementById('result2').innerText = 'Result2: ' + translationsResult;
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerText = 'Error: ' + error;
    }
}


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
