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

interface EyeParameters {
    height_upper: number
    height_lower: number
    P0_upper_randX: number
    P3_upper_randX: number
    P0_upper_randY: number
    P3_upper_randY: number
    offset_upper_left_randY: number
    offset_upper_right_randY: number
    eye_true_width: number
    offset_upper_left_x: number
    offset_upper_right_x: number
    offset_upper_left_y: number
    offset_upper_right_y: number
    offset_lower_left_x: number
    offset_lower_right_x: number
    offset_lower_left_y: number
    offset_lower_right_y: number
    left_converge0: number
    right_converge0: number
    left_converge1: number
    right_converge1: number
}

interface EyeShape {
    upper: Point[]
    lower: Point[]
    center: [Point]
}

interface BothEyes {
    left: EyeShape
    right: EyeShape
}

function randomFromInterval(min: number, max: number): number {
    // min and max included
    return Math.random() * (max - min) + min
}

function cubicBezier(P0: Point, P1: Point, P2: Point, P3: Point, t: number): Point {
    const x =
        (1 - t) ** 3 * P0[0] +
        3 * (1 - t) ** 2 * t * P1[0] +
        3 * (1 - t) * t ** 2 * P2[0] +
        t ** 3 * P3[0]
    const y =
        (1 - t) ** 3 * P0[1] +
        3 * (1 - t) ** 2 * t * P1[1] +
        3 * (1 - t) * t ** 2 * P2[1] +
        t ** 3 * P3[1]
    return [x, y]
}

function generateEyeParameters(width: number): EyeParameters {
    const height_upper = (Math.random() * width) / 1.2 // Less height for the upper eyelid to make it sharper
    const height_lower = (Math.random() * width) / 1.2 // More height for the lower eyelid to make it rounder and droopier
    const P0_upper_randX = Math.random() * 0.4 - 0.2
    const P3_upper_randX = Math.random() * 0.4 - 0.2
    const P0_upper_randY = Math.random() * 0.4 - 0.2
    const P3_upper_randY = Math.random() * 0.4 - 0.2
    const offset_upper_left_randY = Math.random()
    const offset_upper_right_randY = Math.random()
    const P0_upper: Point = [
        -width / 2 + (P0_upper_randX * width) / 16,
        (P0_upper_randY * height_upper) / 16
    ]
    const P3_upper: Point = [
        width / 2 + (P3_upper_randX * width) / 16,
        (P3_upper_randY * height_upper) / 16
    ]
    const eye_true_width = P3_upper[0] - P0_upper[0]

    const offset_upper_left_x = randomFromInterval(-eye_true_width / 10.0, eye_true_width / 2.3) // Upper eyelid control point offset to create asymmetry
    const offset_upper_right_x = randomFromInterval(-eye_true_width / 10.0, eye_true_width / 2.3) // Upper eyelid control point offset to create asymmetry
    const offset_upper_left_y = offset_upper_left_randY * height_upper // Upper eyelid control point offset to create asymmetry
    const offset_upper_right_y = offset_upper_right_randY * height_upper // Upper eyelid control point offset to create asymmetry
    const offset_lower_left_x = randomFromInterval(offset_upper_left_x, eye_true_width / 2.1) // Lower eyelid control point offset
    const offset_lower_right_x = randomFromInterval(offset_upper_right_x, eye_true_width / 2.1) // Upper eyelid control point offset to create asymmetry
    const offset_lower_left_y = randomFromInterval(-offset_upper_left_y + 5, height_lower) // Upper eyelid control point offset to create asymmetry
    const offset_lower_right_y = randomFromInterval(-offset_upper_right_y + 5, height_lower) // Upper eyelid control point offset to create asymmetry
    // Generate points for the Bezier curves
    const left_converge0 = Math.random()
    const right_converge0 = Math.random()
    // Generate points for the Bezier curves
    const left_converge1 = Math.random()
    const right_converge1 = Math.random()

    return {
        height_upper,
        height_lower,
        P0_upper_randX,
        P3_upper_randX,
        P0_upper_randY,
        P3_upper_randY,
        offset_upper_left_randY,
        offset_upper_right_randY,
        eye_true_width,
        offset_upper_left_x,
        offset_upper_right_x,
        offset_upper_left_y,
        offset_upper_right_y,
        offset_lower_left_x,
        offset_lower_right_x,
        offset_lower_left_y,
        offset_lower_right_y,
        left_converge0,
        right_converge0,
        left_converge1,
        right_converge1
    }
}

export function generateEyePoints(rands: EyeParameters, width: number = 50): EyeShape {
    const P0_upper: Point = [
        -width / 2 + (rands.P0_upper_randX * width) / 16,
        (rands.P0_upper_randY * rands.height_upper) / 16
    ]
    const P3_upper: Point = [
        width / 2 + (rands.P3_upper_randX * width) / 16,
        (rands.P3_upper_randY * rands.height_upper) / 16
    ]
    const P0_lower: Point = P0_upper // Starting at the same point as the upper eyelid
    const P3_lower: Point = P3_upper // Ending at the same point as the upper eyelid

    // Upper eyelid control points
    const P1_upper: Point = [
        P0_upper[0] + rands.offset_upper_left_x,
        P0_upper[1] + rands.offset_upper_left_y
    ] // First control point
    const P2_upper: Point = [
        P3_upper[0] - rands.offset_upper_right_x,
        P3_upper[1] + rands.offset_upper_right_y
    ] // Second control point

    // Lower eyelid control points
    const P1_lower: Point = [
        P0_lower[0] + rands.offset_lower_left_x,
        P0_lower[1] - rands.offset_lower_left_y
    ] // First control point
    const P2_lower: Point = [
        P3_lower[0] - rands.offset_lower_right_x,
        P3_lower[1] - rands.offset_lower_right_y
    ] // Second control point

    // now we generate the points for the upper eyelid
    const upper_eyelid_points: Point[] = []
    const upper_eyelid_points_left_control: Point[] = []
    const upper_eyelid_points_right_control: Point[] = []
    const upper_eyelid_left_control_point: Point = [
        P0_upper[0] * (1 - rands.left_converge0) + P1_lower[0] * rands.left_converge0,
        P0_upper[1] * (1 - rands.left_converge0) + P1_lower[1] * rands.left_converge0
    ]
    const upper_eyelid_right_control_point: Point = [
        P3_upper[0] * (1 - rands.right_converge0) + P2_lower[0] * rands.right_converge0,
        P3_upper[1] * (1 - rands.right_converge0) + P2_lower[1] * rands.right_converge0
    ]

    for (let t = 0; t < 100; t++) {
        upper_eyelid_points.push(cubicBezier(P0_upper, P1_upper, P2_upper, P3_upper, t / 100))
        upper_eyelid_points_left_control.push(
            cubicBezier(upper_eyelid_left_control_point, P0_upper, P1_upper, P2_upper, t / 100)
        )
        upper_eyelid_points_right_control.push(
            cubicBezier(P1_upper, P2_upper, P3_upper, upper_eyelid_right_control_point, t / 100)
        )
    }

    for (let i = 0; i < 75; i++) {
        const weight = ((75.0 - i) / 75.0) ** 2
        upper_eyelid_points[i] = [
            upper_eyelid_points[i][0] * (1 - weight) +
                upper_eyelid_points_left_control[i + 25][0] * weight,
            upper_eyelid_points[i][1] * (1 - weight) +
                upper_eyelid_points_left_control[i + 25][1] * weight
        ]
        upper_eyelid_points[i + 25] = [
            upper_eyelid_points[i + 25][0] * weight +
                upper_eyelid_points_right_control[i][0] * (1 - weight),
            upper_eyelid_points[i + 25][1] * weight +
                upper_eyelid_points_right_control[i][1] * (1 - weight)
        ]
    }

    // now we generate the points for the lower eyelid
    const lower_eyelid_points: Point[] = []
    const lower_eyelid_points_left_control: Point[] = []
    const lower_eyelid_points_right_control: Point[] = []
    const lower_eyelid_left_control_point: Point = [
        P0_lower[0] * (1 - rands.left_converge0) + P1_upper[0] * rands.left_converge0,
        P0_lower[1] * (1 - rands.left_converge0) + P1_upper[1] * rands.left_converge0
    ]
    const lower_eyelid_right_control_point: Point = [
        P3_lower[0] * (1 - rands.right_converge1) + P2_upper[0] * rands.right_converge1,
        P3_lower[1] * (1 - rands.right_converge1) + P2_upper[1] * rands.right_converge1
    ]

    for (let t = 0; t < 100; t++) {
        lower_eyelid_points.push(cubicBezier(P0_lower, P1_lower, P2_lower, P3_lower, t / 100))
        lower_eyelid_points_left_control.push(
            cubicBezier(lower_eyelid_left_control_point, P0_lower, P1_lower, P2_lower, t / 100)
        )
        lower_eyelid_points_right_control.push(
            cubicBezier(P1_lower, P2_lower, P3_lower, lower_eyelid_right_control_point, t / 100)
        )
    }

    for (let i = 0; i < 75; i++) {
        const weight = ((75.0 - i) / 75.0) ** 2
        lower_eyelid_points[i] = [
            lower_eyelid_points[i][0] * (1 - weight) +
                lower_eyelid_points_left_control[i + 25][0] * weight,
            lower_eyelid_points[i][1] * (1 - weight) +
                lower_eyelid_points_left_control[i + 25][1] * weight
        ]
        lower_eyelid_points[i + 25] = [
            lower_eyelid_points[i + 25][0] * weight +
                lower_eyelid_points_right_control[i][0] * (1 - weight),
            lower_eyelid_points[i + 25][1] * weight +
                lower_eyelid_points_right_control[i][1] * (1 - weight)
        ]
    }

    for (let i = 0; i < 100; i++) {
        lower_eyelid_points[i][1] = -lower_eyelid_points[i][1]
        upper_eyelid_points[i][1] = -upper_eyelid_points[i][1]
    }

    let eyeCenter: Point = [
        upper_eyelid_points[50][0] / 2.0 + lower_eyelid_points[50][0] / 2.0,
        upper_eyelid_points[50][1] / 2.0 + lower_eyelid_points[50][1] / 2.0
    ]

    for (let i = 0; i < 100; i++) {
        // translate to center
        lower_eyelid_points[i][0] -= eyeCenter[0]
        lower_eyelid_points[i][1] -= eyeCenter[1]
        upper_eyelid_points[i][0] -= eyeCenter[0]
        upper_eyelid_points[i][1] -= eyeCenter[1]
    }
    eyeCenter = [0, 0]

    // we switch the upper and lower eyelid points because in svg the bottom is y+ and top is y-
    return { upper: upper_eyelid_points, lower: lower_eyelid_points, center: [eyeCenter] }
}

export function generateBothEyes(width: number = 50): BothEyes {
    const rands_left = generateEyeParameters(width)
    // Create a shallow copy of the object
    const rands_right: EyeParameters = { ...rands_left }

    // Define the numeric properties of EyeParameters
    const numericKeys: (keyof EyeParameters)[] = [
        'height_upper',
        'height_lower',
        'P0_upper_randX',
        'P3_upper_randX',
        'P0_upper_randY',
        'P3_upper_randY',
        'offset_upper_left_randY',
        'offset_upper_right_randY',
        'eye_true_width',
        'offset_upper_left_x',
        'offset_upper_right_x',
        'offset_upper_left_y',
        'offset_upper_right_y',
        'offset_lower_left_x',
        'offset_lower_right_x',
        'offset_lower_left_y',
        'offset_lower_right_y',
        'left_converge0',
        'right_converge0',
        'left_converge1',
        'right_converge1'
    ]

    // Iterate over the numeric keys
    for (const key of numericKeys) {
        rands_right[key] += randomFromInterval(-rands_right[key] / 2.0, rands_right[key] / 2.0)
    }

    const left_eye = generateEyePoints(rands_left, width)
    const right_eye = generateEyePoints(rands_right, width)

    // Define the array properties of EyeShape
    const arrayKeys: (keyof EyeShape)[] = ['upper', 'lower']

    // Iterate over the array keys
    for (const key of arrayKeys) {
        const points = left_eye[key]
        for (let i = 0; i < points.length; i++) {
            points[i][0] = -points[i][0]
        }
    }

    return { left: left_eye, right: right_eye }
}
