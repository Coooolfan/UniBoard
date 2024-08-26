/*
 * @Author: cyy
 * @Date: 2022-06-23 16:59:55
 * @LastEditors: cyy
 * @LastEditTime: 2022-07-19 15:38:45
 * @Description:
 */

const iconMapping = {
    h1: {
        label: 'h1',
        icon: 'h1'
    },
    h2: {
        label: 'h2',
        icon: 'h2'
    },
    h3: {
        label: 'h3',
        icon: 'h3'
    },
    loading: {
        label: 'loading',
        icon: 'hourglass'
    },
    quote: {
        label: '引用',
        icon: 'format_quote'
    },
    blockquote: {
        label: '块引用',
        icon: 'format_quote'
    },
    code: {
        label: '代码块',
        icon: 'code'
    },
    table: {
        label: '表格',
        icon: 'table'
    },
    divider: {
        label: '水平线',
        icon: 'horizontal-rule'
    },
    image: {
        label: '图片',
        icon: 'image'
    },
    brokenImage: {
        label: 'broken image',
        icon: 'broken_image'
    },
    bulletList: {
        label: '项目符号',
        icon: 'format-list-bulleted'
    },
    orderedList: {
        label: '编号',
        icon: 'format-list-numbered'
    },
    taskList: {
        label: '任务列表',
        icon: 'check_list'
    },
    bold: {
        label: '加粗',
        icon: 'format-bold'
    },
    italic: {
        label: '斜体',
        icon: 'format-italic'
    },
    inlineCode: {
        label: 'inline code',
        icon: 'code'
    },
    strikeThrough: {
        label: '删除线',
        icon: 'strike-throughs'
    },
    link: {
        label: '超链接',
        icon: 'link'
    },
    leftArrow: {
        label: 'left arrow',
        icon: 'chevron-left'
    },
    rightArrow: {
        label: 'right arrow',
        icon: 'chevron-right'
    },
    upArrow: {
        label: 'up arrow',
        icon: 'arrow-up'
    },
    downArrow: {
        label: 'down arrow',
        icon: 'arrow-down'
    },
    alignLeft: {
        label: 'align left',
        icon: 'formatalignleft'
    },
    alignRight: {
        label: 'align right',
        icon: 'formatalignright'
    },
    alignCenter: {
        label: 'align center',
        icon: 'formataligncenter'
    },
    delete: {
        label: '删除',
        icon: 'delete'
    },
    select: {
        label: '选择',
        icon: 'select-all'
    },
    unchecked: {
        label: 'unchecked',
        icon: 'checkboxoutlineblank'
    },
    checked: {
        label: 'checked',
        icon: 'check_box'
    },
    undo: {
        label: '撤销',
        icon: 'arrow-left'
    },
    redo: {
        label: '重做',
        icon: 'arrow-right'
    },
    liftList: {
        label: 'lift list',
        icon: 'format_indent_decrease'
    },
    sinkList: {
        label: 'sink list',
        icon: 'format_indent_increase'
    },
    diagram: {
        label: '图表',
        icon: 'diagram'
    },
    mathInline: {
        label: '行内公式',
        icon: 'math_inline'
    },
    mathBlock: {
        label: '块级公式',
        icon: 'math_block'
    },
    dragHandle: {
        label: '拖放',
        icon: 'drag'
    },
    text: {
        label: '文本',
        icon: 'text'
    }
}

export const getIcon = (id) => {
    const target = iconMapping[id]
    if (!target) {
        return
    }
    const span = document.createElement('span')
    span.className = `iconfont icon-${target.icon}`
    // span.textContent = iconMapping[id].icon;

    return {
        dom: span,
        label: target.label
    }
}
