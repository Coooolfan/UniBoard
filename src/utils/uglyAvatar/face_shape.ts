/**
 * This code is adapted from https://github.com/txstc55/ugly-avatar
 * Original project is under Attribution-NonCommercial 4.0 International License
 *
 * Main changes:
 * - Converted from JavaScript to TypeScript
 * - Added type definitions and interfaces
 * - Maintained original functionality and algorithm
 */

type Point = [number, number]

interface IntersectionPoint {
    x: number
    y: number
}

interface FaceResult {
    face: Point[]
    width: number
    height: number
    center: Point
}

function randomFromInterval(min: number, max: number): number {
    // min and max included
    return Math.random() * (max - min) + min
}

export function getEggShapePoints(
    a: number,
    b: number,
    k: number,
    segment_points: number
): Point[] {
    // the function is x^2/a^2 * (1 + ky) + y^2/b^2 = 1
    const result: Point[] = []

    for (let i = 0; i < segment_points; i++) {
        // x positive, y positive
        // first compute the degree
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 1.1 / segment_points, Math.PI / 1.1 / segment_points)
        const y: number = Math.sin(degree) * b
        const x: number =
            Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
            randomFromInterval(-a / 200.0, a / 200.0)
        result.push([x, y])
    }

    for (let i = segment_points; i > 0; i--) {
        // x is negative, y is positive
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 1.1 / segment_points, Math.PI / 1.1 / segment_points)
        const y: number = Math.sin(degree) * b
        const x: number =
            -Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
            randomFromInterval(-a / 200.0, a / 200.0)
        result.push([x, y])
    }

    for (let i = 0; i < segment_points; i++) {
        // x is negative, y is negative
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 1.1 / segment_points, Math.PI / 1.1 / segment_points)
        const y: number = -Math.sin(degree) * b
        const x: number =
            -Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
            randomFromInterval(-a / 200.0, a / 200.0)
        result.push([x, y])
    }

    for (let i = segment_points; i > 0; i--) {
        // x is positive, y is negative
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 1.1 / segment_points, Math.PI / 1.1 / segment_points)
        const y: number = -Math.sin(degree) * b
        const x: number =
            Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
            randomFromInterval(-a / 200.0, a / 200.0)
        result.push([x, y])
    }

    return result
}

function findIntersectionPoints(radian: number, a: number, b: number): IntersectionPoint {
    if (radian < 0) {
        radian = 0
    }
    if (radian > Math.PI / 2) {
        radian = Math.PI / 2
    }
    // a is width, b is height
    // Slope of the line
    const m: number = Math.tan(radian)
    // check if radian is close to 90 degrees
    if (Math.abs(radian - Math.PI / 2) < 0.0001) {
        return { x: 0, y: b }
    }
    // only checks the first quadrant
    const y: number = m * a
    if (y < b) {
        // it intersects with the left side
        return { x: a, y: y }
    } else {
        // it intersects with the top side
        const x: number = b / m
        return { x: x, y: b }
    }
}

export function generateRectangularFaceContourPoints(
    a: number,
    b: number,
    segment_points: number
): Point[] {
    // a is width, b is height, segment_points is the number of points
    const result: Point[] = []

    for (let i = 0; i < segment_points; i++) {
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 11 / segment_points, Math.PI / 11 / segment_points)
        const intersection: IntersectionPoint = findIntersectionPoints(degree, a, b)
        result.push([intersection.x, intersection.y])
    }

    for (let i = segment_points; i > 0; i--) {
        // x is negative, y is positive
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 11 / segment_points, Math.PI / 11 / segment_points)
        const intersection: IntersectionPoint = findIntersectionPoints(degree, a, b)
        result.push([-intersection.x, intersection.y])
    }

    for (let i = 0; i < segment_points; i++) {
        // x is negative, y is negative
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 11 / segment_points, Math.PI / 11 / segment_points)
        const intersection: IntersectionPoint = findIntersectionPoints(degree, a, b)
        result.push([-intersection.x, -intersection.y])
    }

    for (let i = segment_points; i > 0; i--) {
        // x is positive, y is negative
        const degree: number =
            (Math.PI / 2 / segment_points) * i +
            randomFromInterval(-Math.PI / 11 / segment_points, Math.PI / 11 / segment_points)
        const intersection: IntersectionPoint = findIntersectionPoints(degree, a, b)
        result.push([intersection.x, -intersection.y])
    }

    return result
}

export function generateFaceCountourPoints(numPoints: number = 100): FaceResult {
    const faceSizeX0: number = randomFromInterval(50, 100)
    const faceSizeY0: number = randomFromInterval(70, 100)

    const faceSizeY1: number = randomFromInterval(50, 80)
    const faceSizeX1: number = randomFromInterval(70, 100)
    const faceK0: number = randomFromInterval(0.001, 0.005) * (Math.random() > 0.5 ? 1 : -1)
    const faceK1: number = randomFromInterval(0.001, 0.005) * (Math.random() > 0.5 ? 1 : -1)
    const face0TranslateX: number = randomFromInterval(-5, 5)
    const face0TranslateY: number = randomFromInterval(-15, 15)

    const face1TranslateY: number = randomFromInterval(-5, 5)
    const face1TranslateX: number = randomFromInterval(-5, 25)
    const eggOrRect0: boolean = Math.random() > 0.1
    const eggOrRect1: boolean = Math.random() > 0.3

    const results0: Point[] = eggOrRect0
        ? getEggShapePoints(faceSizeX0, faceSizeY0, faceK0, numPoints)
        : generateRectangularFaceContourPoints(faceSizeX0, faceSizeY0, numPoints)
    const results1: Point[] = eggOrRect1
        ? getEggShapePoints(faceSizeX1, faceSizeY1, faceK1, numPoints)
        : generateRectangularFaceContourPoints(faceSizeX1, faceSizeY1, numPoints)

    for (let i = 0; i < results0.length; i++) {
        results0[i][0] += face0TranslateX
        results0[i][1] += face0TranslateY
        results1[i][0] += face1TranslateX
        results1[i][1] += face1TranslateY
    }

    const results: Point[] = []
    const center: Point = [0, 0]

    for (let i = 0; i < results0.length; i++) {
        results.push([
            results0[i][0] * 0.7 + results1[(i + results0.length / 4) % results0.length][1] * 0.3,
            results0[i][1] * 0.7 - results1[(i + results0.length / 4) % results0.length][0] * 0.3
        ])
        center[0] += results[i][0]
        center[1] += results[i][1]
    }

    center[0] /= results.length
    center[1] /= results.length

    // center the face
    for (let i = 0; i < results.length; i++) {
        results[i][0] -= center[0]
        results[i][1] -= center[1]
    }

    const width: number = results[0][0] - results[results.length / 2][0]
    const height: number = results[results.length / 4][1] - results[(results.length * 3) / 4][1]

    // add the first point to the end to close the shape
    results.push(results[0])
    results.push(results[1])

    return { face: results, width: width, height: height, center: [0, 0] }
}
