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

interface ControlPoint {
    x: number
    y: number
}

function randomFromInterval(min: number, max: number): number {
    // min and max included
    return Math.random() * (max - min) + min
}

function factorial(n: number): number {
    if (n <= 1) return 1
    return n * factorial(n - 1)
}

function binomialCoefficient(n: number, k: number): number {
    return factorial(n) / (factorial(k) * factorial(n - k))
}

function calculateBezierPoint(t: number, controlPoints: ControlPoint[]): Point {
    let x = 0,
        y = 0
    const n = controlPoints.length - 1

    for (let i = 0; i <= n; i++) {
        const binCoeff = binomialCoefficient(n, i)
        const a = Math.pow(1 - t, n - i)
        const b = Math.pow(t, i)
        x += binCoeff * a * b * controlPoints[i].x
        y += binCoeff * a * b * controlPoints[i].y
    }

    return [x, y]
}

function computeBezierCurve(controlPoints: ControlPoint[], numberOfPoints: number): Point[] {
    const curve: Point[] = []
    for (let i = 0; i <= numberOfPoints; i++) {
        const t = i / numberOfPoints
        const point = calculateBezierPoint(t, controlPoints)
        curve.push(point)
    }
    return curve
}

export function generateHairLines0(faceCountour: Point[], numHairLines: number = 100): Point[][] {
    const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2)
    const results: Point[][] = []

    for (let i = 0; i < numHairLines; i++) {
        const numHairPoints = 20 + Math.floor(randomFromInterval(-5, 5))
        // we generate some hair lines
        let hair_line: ControlPoint[] = []
        const index_offset = Math.floor(randomFromInterval(30, 140))

        for (let j = 0; j < numHairPoints; j++) {
            hair_line.push({
                x: faceCountourCopy[
                    (faceCountourCopy.length - (j + index_offset)) % faceCountourCopy.length
                ][0],
                y: faceCountourCopy[
                    (faceCountourCopy.length - (j + index_offset)) % faceCountourCopy.length
                ][1]
            })
        }

        const d0 = computeBezierCurve(hair_line, numHairPoints)
        hair_line = []
        const index_offset2 = Math.floor(randomFromInterval(30, 140))

        for (let j = 0; j < numHairPoints; j++) {
            hair_line.push({
                x: faceCountourCopy[
                    (faceCountourCopy.length - (-j + index_offset2)) % faceCountourCopy.length
                ][0],
                y: faceCountourCopy[
                    (faceCountourCopy.length - (-j + index_offset2)) % faceCountourCopy.length
                ][1]
            })
        }

        const d1 = computeBezierCurve(hair_line, numHairPoints)
        const d: Point[] = []

        for (let j = 0; j < numHairPoints; j++) {
            const t = j * (1 / numHairPoints)
            d.push([
                d0[j][0] * t ** 2 + d1[j][0] * (1 - t ** 2),
                d0[j][1] * t ** 2 + d1[j][1] * (1 - t ** 2)
            ])
        }

        results.push(d)
    }
    return results
}

export function generateHairLines1(faceCountour: Point[], numHairLines: number = 100): Point[][] {
    const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2)
    const results: Point[][] = []

    for (let i = 0; i < numHairLines; i++) {
        const numHairPoints = 20 + Math.floor(randomFromInterval(-5, 5))
        // we generate some hair lines
        const hair_line: ControlPoint[] = []
        let index_start = Math.floor(randomFromInterval(20, 160))

        hair_line.push({
            x: faceCountourCopy[
                (faceCountourCopy.length - index_start) % faceCountourCopy.length
            ][0],
            y: faceCountourCopy[
                (faceCountourCopy.length - index_start) % faceCountourCopy.length
            ][1]
        })

        for (let j = 1; j < numHairPoints + 1; j++) {
            index_start = Math.floor(randomFromInterval(20, 160))
            hair_line.push({
                x: faceCountourCopy[
                    (faceCountourCopy.length - index_start) % faceCountourCopy.length
                ][0],
                y: faceCountourCopy[
                    (faceCountourCopy.length - index_start) % faceCountourCopy.length
                ][1]
            })
        }

        const d = computeBezierCurve(hair_line, numHairPoints)
        results.push(d)
    }
    return results
}

export function generateHairLines2(faceCountour: Point[], numHairLines: number = 100): Point[][] {
    const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2)
    const results: Point[][] = []
    const pickedIndices: number[] = []

    for (let i = 0; i < numHairLines; i++) {
        pickedIndices.push(Math.floor(randomFromInterval(10, 180)))
    }
    pickedIndices.sort()

    for (let i = 0; i < numHairLines; i++) {
        const numHairPoints = 20 + Math.floor(randomFromInterval(-5, 5))
        // we generate some hair lines
        const hair_line: ControlPoint[] = []
        const index_offset = pickedIndices[i]
        const lower = randomFromInterval(0.8, 1.4)
        const reverse = Math.random() > 0.5 ? 1 : -1

        for (let j = 0; j < numHairPoints; j++) {
            const powerscale = randomFromInterval(0.1, 3)
            const portion = (1 - (j / numHairPoints) ** powerscale) * (1 - lower) + lower
            hair_line.push({
                x:
                    faceCountourCopy[
                        (faceCountourCopy.length - (reverse * j + index_offset)) %
                            faceCountourCopy.length
                    ][0] * portion,
                y:
                    faceCountourCopy[
                        (faceCountourCopy.length - (reverse * j + index_offset)) %
                            faceCountourCopy.length
                    ][1] * portion
            })
        }

        let d = computeBezierCurve(hair_line, numHairPoints)
        if (Math.random() > 0.7) d = d.reverse()

        if (results.length === 0) {
            results.push(d)
            continue
        }

        const lastHairPoint = results[results.length - 1][results[results.length - 1].length - 1]
        const lastPointsDistance = Math.sqrt(
            (d[0][0] - lastHairPoint[0]) ** 2 + (d[0][1] - lastHairPoint[1]) ** 2
        )

        if (Math.random() > 0.5 && lastPointsDistance < 100) {
            results[results.length - 1] = results[results.length - 1].concat(d)
        } else {
            results.push(d)
        }
    }
    return results
}

export function generateHairLines3(faceCountour: Point[], numHairLines: number = 100): Point[][] {
    const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2)
    const results: Point[][] = []
    const pickedIndices: number[] = []

    for (let i = 0; i < numHairLines; i++) {
        pickedIndices.push(Math.floor(randomFromInterval(10, 180)))
    }
    pickedIndices.sort()

    const splitPoint = Math.floor(randomFromInterval(0, 200))

    for (let i = 0; i < numHairLines; i++) {
        const numHairPoints = 30 + Math.floor(randomFromInterval(-8, 8))
        // we generate some hair lines
        const hair_line: ControlPoint[] = []
        const index_offset = pickedIndices[i]
        let lower = randomFromInterval(1, 2.3)
        if (Math.random() > 0.9) lower = randomFromInterval(0, 1)
        const reverse = index_offset > splitPoint ? 1 : -1

        for (let j = 0; j < numHairPoints; j++) {
            const powerscale = randomFromInterval(0.1, 3)
            const portion = (1 - (j / numHairPoints) ** powerscale) * (1 - lower) + lower
            hair_line.push({
                x:
                    faceCountourCopy[
                        (faceCountourCopy.length - (reverse * j * 2 + index_offset)) %
                            faceCountourCopy.length
                    ][0] * portion,
                y: faceCountourCopy[
                    (faceCountourCopy.length - (reverse * j * 2 + index_offset)) %
                        faceCountourCopy.length
                ][1]
            })
        }

        const d = computeBezierCurve(hair_line, numHairPoints)
        results.push(d)
    }
    return results
}
