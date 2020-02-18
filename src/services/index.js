import Api from './api.js'

export default {
    getList (url) {
        return Api().get(url)
    },
    postList(url, formsData){
        return Api().post(url, formsData)
    },
    putList(url, formsData){
        return Api().put(url, formsData)
    },
    deleteList(url, formsData){
        return Api().delete(url, formsData)
    }
}
