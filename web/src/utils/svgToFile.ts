export function svgToFile(svgString: string, filename: string): File {
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    return new File([blob], filename, { type: 'image/svg+xml' })
}
