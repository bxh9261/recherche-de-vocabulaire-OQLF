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

        const link = document.createElement('a');
        link.href = `detail.html?term=${encodeURIComponent(row.English)}&translation=${encodeURIComponent(row.French)}`;
        
        link.textContent = row.English;
        link.classList.add('linked-word');
        cell1.appendChild(link);

        cell2.textContent = row.French;

        cell1.classList.add('data-cell');
        cell2.classList.add('data-cell');
    });

    resultContainer.appendChild(tableElement);
}



function translations(term, direction) {
    return new Promise((resolve, reject) => {
        fetch('data/vocab_example.csv')
            .then(response => response.text())
            .then(csvData => {
                const data = parseCSV(csvData);

                let translation;
                const searchTerm = term.toLowerCase();

                if (direction === 'en-to-fr') {
                    translation = data.find(row => row.English.toLowerCase() === searchTerm);
                    if (translation) {
                        resolve(translation.French);
                    } else {
                        reject("We don't have translation for this word");
                    }
                } else if (direction === 'fr-to-en') {
                    translation = data.find(row => row.French.toLowerCase() === searchTerm);
                    if (translation) {
                        resolve(translation.English);
                    } else {
                        reject("We don't have translation for this word");
                    }
                } else {
                    reject("Invalid translation direction");
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
        var translationDirection = document.querySelector('input[name="translationDirection"]:checked');

        if (!translationDirection) {
            throw new Error("Please select a translation direction.");
        }

        translationDirection = translationDirection.value;

        var translationsResult = await translations(englishTerm, translationDirection);
        window.location.href = `detail.html?term=${encodeURIComponent(englishTerm)}&translation=${encodeURIComponent(translationsResult)}&direction=${encodeURIComponent(translationDirection)}`;
    } catch (error) {
        window.location.href = `detail.html?term=${encodeURIComponent('Sorry')}&translation=${encodeURIComponent(error)}`;
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
