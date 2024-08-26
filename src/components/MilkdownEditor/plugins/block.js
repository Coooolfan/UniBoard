/*
 * @Author: cyy
 * @Date: 2022-07-19 15:54:29
 * @LastEditors: cyy
 * @LastEditTime: 2022-07-19 16:08:53
 * @Description:
 */
import { block, defaultConfigBuilder, blockPlugin } from '@milkdown/plugin-block'
import zh from './zh'

export default block.configure(blockPlugin, {
    configBuilder: (ctx) =>
        defaultConfigBuilder(ctx).map((item) => {
            item.content = zh[item.icon] || item.content
            return item
        })
})
