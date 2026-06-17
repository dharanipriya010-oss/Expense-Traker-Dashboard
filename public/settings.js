const lightBtn = document.getElementById('lightModeBtn');
const darkBtn = document.getElementById('darkModeBtn');

lightBtn.addEventListener('click', () => {

    document.body.style.backgroundColor = '#f5f7fb';
    document.body.style.color = '#111';

    localStorage.setItem('theme', 'light');
});

darkBtn.addEventListener('click', () => {

    document.body.style.backgroundColor = '#1f2937';
    document.body.style.color = '#ffffff';

    localStorage.setItem('theme', 'dark');
});

window.onload = () => {

    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
        document.body.style.backgroundColor = '#1f2937';
        document.body.style.color = '#ffffff';
    }
};