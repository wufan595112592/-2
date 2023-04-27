import { axios } from '@/utils/request'

//消息列表
export function findBlackNameInfo(params) {
    return axios({
        url: `/gwzl/core/business/findBlackNameInfo?creditCode=${params.creditCode || ''}`,
        method: 'get',
    })
}
/**
 * 文件上传
 *
 * @param url 请求地址
 * @param formData 上传信息
 * @param {Function} uploadProcess 上传进度回调函数
 * @author 乐享生活522
 * @date 2022/6/14 11:19
 */
export async function upload(url, formData, uploadProcess) {
    return axios.post(url, formData, {
        onUploadProgress: progressEvent => {
            let percent = (progressEvent.loaded / progressEvent.total * 100 | 0)
            uploadProcess && uploadProcess(percent)
        }
    })
}