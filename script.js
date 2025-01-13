document.addEventListener('DOMContentLoaded', () => {
    const typingText = "João Victor Faraco";
    let index = 0;
    function type() {
        const typingAnimation = document.getElementById("typing-animation");
        typingAnimation.textContent = typingText.slice(0, index);

        if (index >= typingText.length) clearInterval(interval);
        else index++;
    }
    const interval = setInterval(type, 100);
    document.getElementById("mobile_menu").addEventListener('click', () => {
        const navMenu = document.getElementById("nav_menu");
        navMenu.classList.toggle("active");
    });
    document.querySelectorAll('.copy-email, .copy-number').forEach(element => {
        element.addEventListener('click', () => {
            const text = element.getAttribute('data-email') || element.getAttribute('data-number');
            const textField = document.createElement('textarea');
            textField.innerText = text;
            document.body.appendChild(textField);
            textField.select();
            document.execCommand('copy');
            textField.remove();
            alert(`${text.includes('@') ? 'E-mail' : 'Número'} copiado: ${text}`);
        });
    });
chk.addEventListener('change', () => {
    document.body.classList.toggle('light');
});

});
