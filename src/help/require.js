export const getLocalUser = () => {
    const user = localStorage.getItem('user')
    if (!user) { return null }
    return JSON.parse(user)
}

export const auth = (url, body) => {
    const uri = `${import.meta.env.VITE_API_URL_HTTP}/auth/${import.meta.env.VITE_API_VERSION}/${url}`
    return fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => data)
}

export const get = (url) => {
    const uri = `${import.meta.env.VITE_API_URL_HTTP}/${import.meta.env.VITE_API_VERSION}/${url}`
    const user = getLocalUser()
    return fetch(uri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': user.token
        }
    })
    .then(res => res.json())
    .then(data => data)
}

export const post = (url, body) => {
    const uri = `${import.meta.env.VITE_API_URL_HTTP}/${import.meta.env.VITE_API_VERSION}/${url}`
    const user = getLocalUser()
    return fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': user.token
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => data)
}

export const getId = (url, id) => {
    const uri = `${import.meta.env.VITE_API_URL_HTTP}/${import.meta.env.VITE_API_VERSION}/${url}/${id}`
    const user = getLocalUser()
    return fetch(uri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': user.token
        }
    })
    .then(res => res.json())
    .then(data => data)
}

export const putId = (url, body, id) => {
    const uri = `${import.meta.env.VITE_API_URL_HTTP}/${import.meta.env.VITE_API_VERSION}/${url}/${id}`
    const user = getLocalUser()
    return fetch(uri, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': user.token
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => data)
}

export const deleteId = (url, id) => {
    const uri = `${import.meta.env.VITE_API_URL_HTTP}/${import.meta.env.VITE_API_VERSION}/${url}/${id}`
    const user = getLocalUser()
    return fetch(uri, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': user.token
        }
    })
}