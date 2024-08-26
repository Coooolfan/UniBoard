/*
 * @Author: cyy
 * @Date: 2022-06-23 17:00:19
 * @LastEditors: cyy
 * @LastEditTime: 2022-07-20 18:34:42
 * @Description:
 */

import { ThemeBorder, ThemeFont, ThemeScrollbar, ThemeSize } from '@milkdown/core'
import { getPalette } from '@milkdown/design-system'
import { injectProsemirrorView } from '@milkdown/theme-pack-helper'

export default (manager, emotion) => {
    const { injectGlobal, css } = emotion
    const palette = getPalette(manager)
    const radius = manager.get(ThemeSize, 'radius')
    const neutral = palette('neutral', 0.87)
    const surface = palette('surface')
    const line = palette('line')
    const highlight = palette('secondary', 0.38)

    const selection = css`
        .ProseMirror-selectednode {
            outline: ${manager.get(ThemeSize, 'lineWidth')} solid ${line};
        }
        li.ProseMirror-selectednode {
            outline: none;
        }
        li.ProseMirror-selectednode::after {
            ${manager.get(ThemeBorder, undefined)};
        }
        & ::selection {
            background: ${highlight};
        }
    `

    const editorLayout = css`
        padding: 1em 2em;
        outline: none;
        & > * {
            margin: 1em 0;
        }
    `

    const paragraph = css`
        p {
            font-size: 1em;
            line-height: 1.5;
            letter-spacing: 0.5px;
        }
    `

    const blockquote = css`
        blockquote {
            padding-left: 1em;
            line-height: 1.75em;
            border-left: 4px solid ${palette('primary')};
            margin-left: 0;
            margin-right: 0;
            * {
                font-size: 1em;
                line-height: 1.5em;
            }
        }
    `

    const heading = css`
        h1 {
            font-size: 2em;
            line-height: 1.25;
            font-weight: 600;
        }
        h2 {
            font-size: 1.5em;
            line-height: 1.25;
            font-weight: 500;
        }
        h3 {
            font-size: 1.25em;
            line-height: 1.25;
            font-weight: 500;
        }
        h4 {
            font-size: 1em;
            line-height: 1.25;
        }
        h5 {
            font-size: 0.875em;
            line-height: 1.25;
        }
        h6 {
            font-size: 0.85em;
            line-height: 1.25;
        }
        .heading {
            margin: 20px 0;
        }
    `

    const hr = css`
        hr {
            height: ${manager.get(ThemeSize, 'lineWidth')};
            background-color: ${line};
            border-width: 0;
        }
    `

    const list = css`
        ul,
        ol {
            margin: 0;
            padding: 0;
        }
        .list-item {
            display: flex;
            align-items: baseline;
            .list-item_label {
                margin-right: 0.5em;
            }
        }
        li {
            margin: 0.5em 0;
            &::marker {
                color: ${palette('primary')};
            }
            .paragraph {
                margin: 0;
            }
        }
        .task-list-item {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            .iconfont {
                font-size: 1.5em;
                padding: 0;
            }
            &_checkbox {
                margin: 0.5em 0.5em 0.5em 0;
                height: 1em;
            }
        }
    `

    const code = css`
        .code-fence {
            ::before {
                content: ' ';
                width: 54px;
                display: inline-block;
                background-repeat: no-repeat;
                height: 14px;
                margin-left: 1rem;
                margin-bottom: 1rem;
                background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDU0IDE0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEgMSkiPjxjaXJjbGUgY3g9IjYiIGN5PSI2IiByPSI2IiBmaWxsPSIjRkY1RjU2IiBzdHJva2U9IiNFMDQ0M0UiIHN0cm9rZS13aWR0aD0iLjUiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjI2IiBjeT0iNiIgcj0iNiIgZmlsbD0iI0ZGQkQyRSIgc3Ryb2tlPSIjREVBMTIzIiBzdHJva2Utd2lkdGg9Ii41Ij48L2NpcmNsZT48Y2lyY2xlIGN4PSI0NiIgY3k9IjYiIHI9IjYiIGZpbGw9IiMyN0M5M0YiIHN0cm9rZT0iIzFBQUIyOSIgc3Ryb2tlLXdpZHRoPSIuNSI+PC9jaXJjbGU+PC9nPjwvc3ZnPg==');
            }
            .code-fence_selector-wrapper {
                text-align: right;
                float: right;
                .code-fence_selector {
                    background-color: transparent;
                    box-shadow: none;
                    margin: 0;
                    height: 1rem;
                    border: 0;
                    width: initial;
                }
                .code-fence_selector-list {
                    top: 2em;
                    right: 0;
                    left: initial;
                    width: 7em;
                    padding: 0;
                    box-shadow: none;
                    border-radius: 4px;
                    li {
                        padding-right: 0.5em;
                        padding-left: 0;
                    }
                }
            }
            pre {
                font-family: ${manager.get(ThemeFont, 'code')};
                margin: 0 1.2em !important;
                white-space: pre;
                overflow: auto;
                ${manager.get(ThemeScrollbar, ['x'])}
                background-color: ${palette('background')};
                color: ${palette('neutral')};
                font-size: 0.875em;
                border-radius: ${radius};
                code {
                    line-height: 1.5;
                    font-family: ${manager.get(ThemeFont, 'code')};
                }
            }
        }
    `
    // 只读状态
    const codeReadonly = css`
        .code-fence_selector-wrapper {
            .code-fence_selector {
                margin-right: 1em;
                cursor: default;
            }
            .icon-arrow-down {
                display: none;
            }
        }
    `

    const img = css`
        .image {
            display: inline-block;
            margin: 0 auto;
            object-fit: contain;
            width: 100%;
            position: relative;
            height: auto;
            text-align: center;
        }
        .image-container {
            .icon-image {
                display: none;
            }
            &.system {
                .icon-image {
                    display: inline-block;
                }
            }
        }
    `

    const inline = css`
        .code-inline {
            background-color: ${palette('neutral')};
            color: ${palette('background')};
            border-radius: ${radius};
            font-weight: 500;
            font-family: ${code};
            padding: 0 0.2em;
            font-size: 1.2em;
        }
        .strong {
            font-weight: 600;
        }
        .link,
        a {
            color: ${palette('secondary')};
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            font-weight: 500;
            &:hover {
                background-color: ${palette('line')};
                box-shadow:
                    0 0.2em ${palette('line')},
                    0 -0.2em ${palette('line')};
            }
        }
        .strike-through {
            text-decoration-color: ${palette('secondary')};
        }
    `

    const footnote = css`
        .footnote-definition {
            ${manager.get(ThemeBorder, undefined)};
            border-radius: ${manager.get(ThemeSize, 'radius')};
            background-color: ${palette('background')};
            padding: 1em;
            display: flex;
            flex-direction: row;
            & > .footnote-definition_content {
                flex: 1;
                width: calc(100% - 1em);
                & > dd {
                    margin-inline-start: 1em;
                }
                & > dt {
                    color: ${palette('secondary')};
                    font-weight: 500;
                }
            }
            & > .footnote-definition_anchor {
                width: 1em;
            }
        }
    `

    const table = css`
        /* copy from https://github.com/ProseMirror/prosemirror-tables/blob/master/style/tables.css */
        .tableWrapper {
            overflow-x: auto;
            margin: 0;
            ${manager.get(ThemeScrollbar, ['x'])}
            width: 100%;
            * {
                margin: 0;
                box-sizing: border-box;
                font-size: 1em;
            }
        }
        table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            overflow: auto;
            border-radius: ${manager.get(ThemeSize, 'radius')};
            p {
                line-height: unset;
            }
        }
        tr {
            ${manager.get(ThemeBorder, 'bottom')};
        }
        td,
        th {
            padding: 0 1em;
            vertical-align: top;
            box-sizing: border-box;
            position: relative;
            min-width: 100px;
            ${manager.get(ThemeBorder, undefined)};
            text-align: left;
            line-height: 3;
            height: 3em;
        }
        th {
            background: ${palette('background', 0.5)};
            font-weight: 400;
        }
        .column-resize-handle {
            position: absolute;
            right: -2px;
            top: 0;
            bottom: 0;
            z-index: 20;
            pointer-events: none;
            background: ${palette('secondary')};
            width: ${manager.get(ThemeSize, 'lineWidth')};
        }
        .resize-cursor {
            cursor: ew-resize;
            cursor: col-resize;
        }
        .selectedCell {
            &::after {
                z-index: 2;
                position: absolute;
                content: '';
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background: ${palette('secondary', 0.38)};
                pointer-events: none;
            }
            & ::selection {
                background: transparent;
            }
        }
    `

    // 快捷下拉框
    const slashDropdown = css`
        .slash-dropdown {
            box-shadow: none;
            width: 10em;
            .slash-dropdown-item {
                height: 2.8em;
            }
        }
    `
    const blockHandle = css`
        .icon-drag {
            font-size: 24px;
        }
        .block-menu {
            box-shadow: none;
        }
    `
    const tooltip = css`
        .tooltip,
        .table-tooltip,
        .tooltip-input {
            box-shadow: none;
            span {
                font-size: 18px;
            }
        }
    `
    injectProsemirrorView(emotion)

    injectGlobal`
        .milkdown {
            .material-icons-outlined {
                font-size: 1.5em;
            }
            position: relative;
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
            color: ${neutral};
            background: ${surface};
            font-family: ${manager.get(ThemeFont, 'typography')};
            ${manager.get(ThemeScrollbar, undefined)}
            ${selection};
            ${blockHandle};
            ${tooltip};
            ${slashDropdown};
            .editor {
                ${editorLayout};
                ${paragraph};
                ${heading};
                ${blockquote};
                ${hr};
                ${list};
                ${code};
                ${img};
                ${table};
                ${footnote};
                ${inline};
            }
            .editor[contenteditable="false"] {
                ${codeReadonly};
            }
        }
    `
}
