export const setCookies = (user, id, email) => {
    sessionStorage.setItem('user', user);
    sessionStorage.setItem('userID', id);
    sessionStorage.setItem('email', email)
}

export const removeCookies = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('email')
}