function checkToken() {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));

    if (!token) {
        window.location.href = '/';
    }
}

checkToken();