import config from 'config';
import { authHeader } from '../_helpers';

export const collitypeService = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function create(collitype) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(collitype)
    };
    return fetch(`${config.apiUrl}/collitype/create`, requestOptions).then(handleResponse);
}

function getAll(projectId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(), 'Content-Type': 'application/json',
    };

    return fetch(`${config.apiUrl}/collitype/findAll/?projectId=${projectId}`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/collitype/findOne/?id=${id}`, requestOptions).then(handleResponse);
}

function update(collitype) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(collitype)
    };

    return fetch(`${config.apiUrl}/collitype/update?id=${collitype.id}`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/collitype/delete?id=${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        if (text == 'Unauthorized') {
            logout();
            location.reload(true);
        }
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}