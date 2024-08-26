/*
 * @Author: cyy
 * @Date: 2022-07-19 18:31:00
 * @LastEditors: cyy
 * @LastEditTime: 2022-07-19 18:31:01
 * @Description:
 */
import { menu, menuPlugin, defaultConfig } from '@milkdown/plugin-menu'

export default menu.configure(menuPlugin, {
    config: defaultConfig.map((section) =>
        section.map((item) => {
            if (item.type !== 'select') return item
            switch (item.text) {
                case 'Heading': {
                    return {
                        ...item,
                        text: '标题选择',
                        options: [
                            { id: '1', text: '一级标题' },
                            { id: '2', text: '二级标题' },
                            { id: '3', text: '三级标题' },
                            { id: '0', text: '正文' }
                        ]
                    }
                }
                default:
                    return item
            }
        })
    )
})
