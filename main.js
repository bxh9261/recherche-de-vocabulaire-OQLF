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

    // Sort the data alphabetically by the "English" property
    data.sort((a, b) => a.English.localeCompare(b.English));

    // Display the data in a table
    const tableElement = document.createElement('table');
    tableElement.classList.add('index-table');

    // Create table header
    const headerRow = tableElement.insertRow();
    const headerCell1 = headerRow.insertCell(0);
    const headerCell2 = headerRow.insertCell(1);
    headerCell1.textContent = 'English';
    headerCell2.textContent = 'French';

    // Add a class to the header cells for styling (optional)
    headerCell1.classList.add('header-cell');
    headerCell2.classList.add('header-cell');

    // Variable to store the previous first letter
    let previousFirstLetter = '';

    // Create table rows
    data.forEach(row => {
        // Check if the first letter is different from the previous entry
        if (row.English.charAt(0).toUpperCase() !== previousFirstLetter) {
            // Add a line break before this entry
            const lineBreakRow = tableElement.insertRow();
            const lineBreakCell1 = lineBreakRow.insertCell(0);
            const lineBreakCell2 = lineBreakRow.insertCell(1);
            lineBreakCell1.classList.add('line-break');
            lineBreakCell2.classList.add('line-break');
            // Update the previous first letter
            previousFirstLetter = row.English.charAt(0).toUpperCase();
        }

        const tableRow = tableElement.insertRow();
        const cell1 = tableRow.insertCell(0);
        const cell2 = tableRow.insertCell(1);
        cell1.textContent = row.English;
        cell2.textContent = row.French;

        // Add a class to the data cells for styling
        cell1.classList.add('data-cell');
        cell2.classList.add('data-cell');
    });

    // Append the table to the result container
    resultContainer.appendChild(tableElement);
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

async function searchAndNavigate() {
    try {
        var englishTerm = document.getElementById('englishTerm').value;
        var translationsResult = await translations(englishTerm);
        window.location.href = `detail.html?term=${encodeURIComponent(englishTerm)}&translation=${encodeURIComponent(translationsResult)}`;
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
