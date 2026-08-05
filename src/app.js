document.addEventListener('app-button-click', (e) => {
    const variant = e.detail.variant;

    if (variant === 'primary') {
        console.log('create ticket');
    } else if (variant === 'login') {
        console.log('login');
    } else if (variant === 'signup') {
        console.log('signup');
    } else {
        console.log('unknown variant:', variant);
    }
});