document.addEventListener('app-button-click', (e) => {
    const variant = e.detail.variant;

    if (variant === 'login') {
        console.log('login');
    } else if (variant === 'signup') {
        console.log('signup');
    } else {
        console.log('unknown variant:', variant);
    }
});
document.addEventListener('app-button-click', (e) => {
    if (e.detail.variant === 'ticket') {
        document.querySelector('create-ticket-modal').open();
    }
});

document.addEventListener('ticket-created', (e) => {
    console.log('New ticket:', e.detail);
});