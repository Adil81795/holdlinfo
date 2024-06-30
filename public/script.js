

document.addEventListener('DOMContentLoaded', () => {
    fetch('/tickers')
        .then(response => response.json())
        .then(data => {
            const tickerList = document.getElementById('tickerList');
            data.forEach(ticker => {
                const tickerElement = document.createElement('div');
                tickerElement.classList.add('ticker');
                tickerElement.innerHTML = `
                    <h2>${ticker.name}</h2>
                    <p>Last Price: ${ticker.last}</p>
                    <p>Buy Price: ${ticker.buy}</p>
                    <p>Sell Price: ${ticker.sell}</p>
                    <p>Volume: ${ticker.volume} ${ticker.base_unit}</p>
                `;
                tickerList.appendChild(tickerElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
