/**
 * 生成带有随机线条效果的 Banner SVG
 * @param width SVG 宽度
 * @param height SVG 高度
 * @param text Banner 文本
 * @param backgroundColor 背景颜色
 * @returns SVG 字符串
 */
export function generateBannerSVG(
    width: number = 1920,
    height: number = 1080,
    text: string = 'DEFAULT BANNER',
    backgroundColor: string = '#1a1a1a'
): string {
    // 配置
    const numberOfLines: number = 30
    const centerX: number = width / 2
    const centerY: number = height / 2
    const centerSafeZone: number = 200 // 中心区域较少线条

    // 线条特性数组
    const strokeWidths: number[] = [0.5, 1, 2, 3, 5, 8, 12, 18, 25]
    const blurFilters: string[] = [
        'none',
        'url(#blur1)',
        'url(#blur2)',
        'url(#blur3)',
        'url(#blur4)',
        'url(#blur5)'
    ]
    const opacities: number[] = [0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8]
    const colors: string[] = [
        '#ffffff',
        '#f0f0f0',
        '#e0e0e0',
        '#d0d0d0',
        '#c0c0c0',
        '#a0a0a0',
        '#808080',
        '#606060',
        '#404040',
        '#202020'
    ]

    // 扩展线条超出可见区域以呈现"无限"效果
    const extensionFactor: number = 2
    const extendedWidth: number = width * extensionFactor
    const extendedHeight: number = height * extensionFactor
    const offsetX: number = (extendedWidth - width) / 2
    const offsetY: number = (extendedHeight - height) / 2

    // 创建 SVG 头部和滤镜定义
    let svgString: string = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="blur5" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        
        <!-- 背景 -->
        <rect width="${width}" height="${height}" fill="${backgroundColor}" />
        
        <!-- 线条容器 -->
        <g id="lines">
    `

    // 创建线条
    for (let i = 0; i < numberOfLines; i++) {
        // 生成线条的随机点
        let x1: number = -offsetX + Math.random() * extendedWidth
        let y1: number = -offsetY + Math.random() * extendedHeight
        let x2: number = -offsetX + Math.random() * extendedWidth
        let y2: number = -offsetY + Math.random() * extendedHeight
        let passesThroughCenter: boolean = true

        // 尝试直到获得不直接穿过中心的线条
        // (除非我们在后期迭代中需要填充空间)
        while (passesThroughCenter && Math.random() > 0.2) {
            // 生成扩展坐标以获得"无限"外观
            x1 = -offsetX + Math.random() * extendedWidth
            y1 = -offsetY + Math.random() * extendedHeight
            x2 = -offsetX + Math.random() * extendedWidth
            y2 = -offsetY + Math.random() * extendedHeight

            // 检查线条是否穿过中心区域
            // 使用点到线距离公式计算中心到线的距离
            const numerator: number = Math.abs(
                (y2 - y1) * centerX - (x2 - x1) * centerY + x2 * y1 - y2 * x1
            )
            const denominator: number = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
            const distanceToCenter: number = numerator / denominator

            passesThroughCenter = distanceToCenter < centerSafeZone
        }

        // 应用随机样式
        const color: string = colors[Math.floor(Math.random() * colors.length)]
        const strokeWidth: number = strokeWidths[Math.floor(Math.random() * strokeWidths.length)]
        const filter: string = blurFilters[Math.floor(Math.random() * blurFilters.length)]
        const opacity: number = opacities[Math.floor(Math.random() * opacities.length)]

        // 创建线条 SVG 元素
        let lineString: string = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}"`

        if (filter !== 'none') {
            lineString += ` filter="${filter}"`
        }

        lineString += ' />'
        svgString += lineString
    }
    const svgStringWithoutText = (svgString += `
</g>

<!-- 暗化叠加层 -->
<rect width="${width}" height="${height}" fill="rgba(0,0,0,0.3)" />

</svg>
`)
    // 完成 SVG
    svgString += `
        </g>
        
        <!-- 暗化叠加层 -->
        <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.3)" />
        
        <!-- 文本 -->
        <text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="middle" 
              fill="white" font-family="Arial, sans-serif" font-weight="900" font-size="80px" 
              letter-spacing="10">${text}</text>
      </svg>
    `

    return svgStringWithoutText
}
