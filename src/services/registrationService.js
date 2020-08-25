import axios from 'axios';

class registrationService {
    doRegistration(userName, userEmail) {
        return axios.post('https://api.supermetrics.com/assignment/register', {
            client_id: 'ju16a6m81mhid5ue1z3v2g0uh',
            email: userEmail,
            name: userName
        })
        .then((response) => {
            const { sl_token } = response.data && response.data.data;
            return sl_token;
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

export default new registrationService();