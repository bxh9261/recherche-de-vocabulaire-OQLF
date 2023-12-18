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

    resultContainer.innerHTML = '';

    data.sort((a, b) => a.English.localeCompare(b.English));

    const tableElement = document.createElement('table');
    tableElement.classList.add('index-table');

    const headerRow = tableElement.insertRow();
    const headerCell1 = headerRow.insertCell(0);
    const headerCell2 = headerRow.insertCell(1);
    headerCell1.textContent = 'English';
    headerCell2.textContent = 'French';

    headerCell1.classList.add('header-cell');
    headerCell2.classList.add('header-cell');

    let previousFirstLetter = '';

    data.forEach(row => {
        if (row.English.charAt(0).toUpperCase() !== previousFirstLetter) {
            const lineBreakRow = tableElement.insertRow();
            const lineBreakCell1 = lineBreakRow.insertCell(0);
            const lineBreakCell2 = lineBreakRow.insertCell(1);
            lineBreakCell1.classList.add('line-break');
            lineBreakCell2.classList.add('line-break');
            previousFirstLetter = row.English.charAt(0).toUpperCase();
        }

        const tableRow = tableElement.insertRow();
        const cell1 = tableRow.insertCell(0);
        const cell2 = tableRow.insertCell(1);
        cell1.textContent = row.English;
        cell2.textContent = row.French;

        cell1.classList.add('data-cell');
        cell2.classList.add('data-cell');
    });

    resultContainer.appendChild(tableElement);
}




function translations(englishTerm) {
    return new Promise((resolve, reject) => {
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
