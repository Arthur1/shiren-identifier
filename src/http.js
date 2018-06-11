import axios from 'axios'

export default {
	request(method, url, data, successCb = null, errorCb = null) {
		axios.request({
			url,
			data,
			method: method.toLowerCase()
		}).then(successCb).catch(errorCb)
	},

	get(url, successCb = null, errorCb = null) {
		return this.request('get', url, {}, successCb, errorCb)
	},

	post(url, data, successCb = null, errorCb = null) {
		return this.request('post', url, data, successCb, errorCb)
	},
}