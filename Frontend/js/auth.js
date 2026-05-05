function getCurrentUser() {
    const userStr = localStorage.getItem('cineverse_user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

function isLoggedIn() {
    return !!localStorage.getItem('cineverse_token');
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function logout() {
    localStorage.removeItem('cineverse_token');
    localStorage.removeItem('cineverse_user');
    window.location.href = 'index.html';
}

function redirectBasedOnRole(user) {
    if (user.role === 'admin') {
        window.location.href = 'admin/dashboard.html';
    } else {
        window.location.href = 'user/dashboard.html';
    }
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!requireAuth()) return false;
    if (!isAdmin()) {
        alert('Bạn không có quyền truy cập trang này!');
        window.location.href = 'user/dashboard.html';
        return false;
    }
    return true;
}