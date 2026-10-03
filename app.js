// The heart. Each browser can leave one. The count lives in a small
// Cloudflare Worker (see worker/). Without an endpoint the heart still
// works, it just doesn't count.
const HEART_ENDPOINT = 'https://sp-heart.gombly.uk';

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('heartButton');
    const countEl = document.getElementById('heartCount');
    const colours = ['#364E96', '#3C5496', '#4E66A8', '#5A72AE', '#6C84BA'];
    const backgrounds = ['#E3E9F5', '#EAEFF8', '#DDE5F3', '#F0F3FA', '#E6ECF7'];

    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function alreadyGiven() {
        try { return localStorage.getItem('sotepedia-heart-given') === '1'; } catch (e) { return false; }
    }

    function remember() {
        try { localStorage.setItem('sotepedia-heart-given', '1'); } catch (e) {}
    }

    function show(count) {
        if (typeof count === 'number') countEl.textContent = count.toLocaleString('hu-HU');
    }

    async function call(method, path) {
        if (!HEART_ENDPOINT) return null;
        try {
            const response = await fetch(HEART_ENDPOINT + path, { method: method });
            if (!response.ok) return null;
            const data = await response.json();
            return data.count;
        } catch (e) {
            return null;
        }
    }

    function bloom() {
        button.style.color = pick(colours);
        button.style.backgroundColor = pick(backgrounds);
        button.classList.add('pulse');
        button.addEventListener('animationend', function () {
            button.classList.remove('pulse');
        }, { once: true });
    }

    if (alreadyGiven()) bloom();
    call('GET', '/count').then(show);

    button.addEventListener('click', async function () {
        bloom();
        if (alreadyGiven()) return;
        const count = await call('POST', '/add');
        if (count === null) return;
        remember();
        show(count);
        countEl.classList.add('given');
    });
});
