import { currencyConstants } from '../_constants';
import { currencyService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const currencyActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(currency) {
    return dispatch => {
        dispatch(request(currency));

        currencyService.create(currency)
            .then(
                currency => {
                    dispatch(success());
                    // history.push('/');
                    dispatch(alertActions.success('Currency successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(currency) { return { type: currencyConstants.CREATE_REQUEST, currency } }
    function success(currency) { return { type: currencyConstants.CREATE_SUCCESS, currency } }
    function failure(error) { return { type: currencyConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        currencyService.getAll()
            .then(
                currencies => dispatch(success(currencies)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: currencyConstants.GETALL_REQUEST } }
    function success(currencies) { return { type: currencyConstants.GETALL_SUCCESS, currencies } }
    function failure(error) { return { type: currencyConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        currencyService.getById(id)
            .then(
                currency => dispatch(success(currency)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: currencyConstants.GET_REQUEST } }
    function success(currency) { return { type: currencyConstants.GET_SUCCESS, currency } }
    function failure(id, error) { return { type: currencyConstants.GET_FAILURE, id, error } }
}

function update(currency) {
    return dispatch => {
        dispatch(request(currency));

        currencyService.update(currency)
            .then(
                currency => {
                    dispatch(success(currency)),
                    dispatch(alertActions.success('Currency successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: currencyConstants.UPDATE_REQUEST } }
    function success(currency) { return { type: currencyConstants.UPDATE_SUCCESS, currency } }
    function failure(error) { return { type: currencyConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        currencyService.delete(id)
            .then(
                currency => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: currencyConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: currencyConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: currencyConstants.DELETE_FAILURE, id, error } }
}