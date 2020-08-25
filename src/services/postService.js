import axios from 'axios';

class postService {
    fetchPosts(tokenId) {
        const requestUrl = 'https://api.supermetrics.com/assignment/posts?sl_token='+ tokenId;

        return axios.get(requestUrl)
        .then((response) => {
            return response && response.data && response.data.data;
        })
        .catch((error) => {
            console.log(error);
        });
    }
}

export default new postService();