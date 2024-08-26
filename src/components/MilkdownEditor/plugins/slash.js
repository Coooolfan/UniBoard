/*
 * @Author: cyy
 * @Date: 2022-06-24 16:53:03
 * @LastEditors: cyy
 * @LastEditTime: 2022-07-20 17:20:43
 * @Description:
 */
import { themeManagerCtx, schemaCtx, commandsCtx, editorCtx } from '@milkdown/core'
import { slash, slashPlugin, createDropdownItem } from '@milkdown/plugin-slash'
import { insert } from '@milkdown/utils'
import zh from './zh'

export const defaultActions = (ctx, input = '/') => {
    const { nodes } = ctx.get(schemaCtx)
    const actions = [
        {
            id: 'h1',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Large Heading', 'h1'),
            command: () => ctx.get(commandsCtx).call('TurnIntoHeading', 1),
            keyword: ['h1', 'large heading'],
            typeName: 'heading'
        },
        {
            id: 'h2',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Medium Heading', 'h2'),
            command: () => ctx.get(commandsCtx).call('TurnIntoHeading', 2),
            keyword: ['h2', 'medium heading'],
            typeName: 'heading'
        },
        {
            id: 'h3',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Small Heading', 'h3'),
            command: () => ctx.get(commandsCtx).call('TurnIntoHeading', 3),
            keyword: ['h3', 'small heading'],
            typeName: 'heading'
        },
        {
            id: 'bulletList',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Bullet List', 'bulletList'),
            command: () => ctx.get(commandsCtx).call('WrapInBulletList'),
            keyword: ['bullet list', 'ul'],
            typeName: 'bullet_list'
        },
        {
            id: 'orderedList',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Ordered List', 'orderedList'),
            command: () => ctx.get(commandsCtx).call('WrapInOrderedList'),
            keyword: ['ordered list', 'ol'],
            typeName: 'ordered_list'
        },
        {
            id: 'taskList',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Task List', 'taskList'),
            command: () => ctx.get(commandsCtx).call('TurnIntoTaskList'),
            keyword: ['task list', 'task'],
            typeName: 'task_list_item'
        },
        {
            id: 'image',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Image', 'image'),
            command: () => ctx.get(commandsCtx).call('InsertImage'),
            keyword: ['image'],
            typeName: 'image'
        },
        {
            id: 'blockquote',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Quote', 'quote'),
            command: () => ctx.get(commandsCtx).call('WrapInBlockquote'),
            keyword: ['quote', 'blockquote'],
            typeName: 'blockquote'
        },
        {
            id: 'table',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Table', 'table'),
            command: () => ctx.get(commandsCtx).call('InsertTable'),
            keyword: ['table'],
            typeName: 'table'
        },
        {
            id: 'code',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Code Fence', 'code'),
            command: () => ctx.get(commandsCtx).call('TurnIntoCodeFence'),
            keyword: ['code'],
            typeName: 'fence'
        },
        {
            id: 'divider',
            dom: createDropdownItem(ctx.get(themeManagerCtx), 'Divide Line', 'divider'),
            command: () => ctx.get(commandsCtx).call('InsertHr'),
            keyword: ['divider', 'hr'],
            typeName: 'hr'
        },
        {
            id: 'diagram',
            dom: createDropdownItem(ctx.get(themeManagerCtx), '图表', 'diagram'),
            command: () => ctx.get(editorCtx).action(insert('```mermaid')),
            keyword: ['diagram', 'tu'],
            typeName: 'diagram'
        },
        {
            id: 'mathInline',
            dom: createDropdownItem(ctx.get(themeManagerCtx), '行内公式', 'mathInline'),
            command: () => ctx.get(editorCtx).action(insert('$E = mc^2$')),
            keyword: ['math_inline', 'gu'],
            typeName: 'math_inline'
        },
        {
            id: 'mathBlock',
            dom: createDropdownItem(ctx.get(themeManagerCtx), '块级公式', 'mathBlock'),
            command: () => ctx.get(editorCtx).action(insert('$$')),
            keyword: ['math_block', 'gu'],
            typeName: 'math_block'
        }
    ]

    const userInput = input.slice(1).toLocaleLowerCase()

    return actions
        .filter(
            (action) =>
                !!nodes[action.typeName] &&
                action.keyword.some((keyword) => keyword.includes(userInput))
        )
        .map(({ keyword, typeName, ...action }) => action)
}

export default slash.configure(slashPlugin, {
    config:
        (ctx) =>
        ({ content, isTopLevel, parentNode }) => {
            if (!isTopLevel) return null

            if (!content) {
                return { placeholder: '/ 👈 👩🏻‍💻' }
            }

            const mapActions = (action) => {
                const { id = '' } = action
                if (zh[id]) {
                    action.dom = createDropdownItem(ctx.get(themeManagerCtx), zh[id], id)
                }
                return action
            }

            if (content.startsWith('/')) {
                // if (parentNode.type.name === 'customNode') {
                //   actions.push({
                //     id: 'custom',
                //     dom: createDropdownItem(ctx.get(themeToolCtx), 'Custom', 'h1'),
                //     command: () => ctx.get(commandsCtx).call(/* Add custom command here */),
                //     keyword: ['custom'],
                //     enable: () => true
                //   })
                // }
                return content === '/'
                    ? {
                          placeholder: '🤔 ...',
                          actions: defaultActions(ctx).map(mapActions)
                      }
                    : {
                          actions: defaultActions(ctx, content).map(mapActions)
                      }
            }

            return null
        }
})
