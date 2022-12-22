export const getChatsData = (chatId) => {
    if (localStorage.getItem('lobby_chats')) {
        const localStorageData = JSON.parse(localStorage.getItem('lobby_chats'))

        if (localStorageData[chatId]) {
            return localStorageData[chatId]
        }

        localStorageData[chatId] = []
        localStorage.setItem('lobby_chats', JSON.stringify(localStorageData))
        return localStorageData[chatId];
    }

    const prefObject = {};
    prefObject[chatId] = []

    localStorage.setItem('lobby_chats', JSON.stringify(prefObject))
    return prefObject[chatId]
}

export const pushMessagesToChat = (chat, message) => {
    if (chat) {
        if (localStorage.getItem('lobby_chats')) {
            const localStorageData = JSON.parse(localStorage.getItem('lobby_chats'))
            localStorageData[chat].push(message)
            localStorage.setItem('lobby_chats', JSON.stringify(localStorageData))
        } else {
            const prefObject = {};
            prefObject[chat] = []
            prefObject[chat].push(message)

            localStorage.setItem('lobby_chats', JSON.stringify(prefObject))
        }
        return;
    }

    console.log('no chat selected')
}

export const removeChat = chat => {
    if(chat) {
        if(localStorage.getItem('lobby_chats')) {
            const localStorageData = JSON.parse(localStorage.getItem('lobby_chats'));
            delete localStorageData[chat]
            localStorage.setItem('lobby_chats', JSON.stringify(localStorageData))
        }
    }
}