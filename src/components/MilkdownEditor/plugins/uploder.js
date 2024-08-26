/*
 * @Author: cyy
 * @Date: 2022-06-24 11:39:34
 * @LastEditors: cyy
 * @LastEditTime: 2022-07-20 18:16:42
 * @Description:
 */

import { upload, uploadPlugin } from '@milkdown/plugin-upload'

const createUploader = (uploaderFn) => {
    const uploader = async (files, schema) => {
        const images = []
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)
            if (!file) {
                continue
            }
            if (!file.type.includes('image')) {
                continue
            }
            images.push(file)
        }
        let result = []
        try {
            result = await uploaderFn(images)
        } catch (e) {
            console.error(e)
        }
        if (Array.isArray(result) && result.length) {
            const nodes = result.map((image) => {
                const src = image.url
                const alt = image.name
                return schema.nodes.image.createAndFill({ src, alt, title: alt })
            })
            return nodes
        }
    }
    return uploader
}

export default (uploaderFn) => {
    if (uploaderFn) {
        return upload.configure(uploadPlugin, {
            uploader: createUploader(uploaderFn)
        })
    }
    return upload
}
