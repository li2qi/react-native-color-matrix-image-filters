import { Platform, processColor } from 'react-native';
import clamp from 'clamp';
const bias = (Platform.OS === 'ios'|| Platform.OS === 'harmony') ? 1 : 255
const biasRev = (Platform.OS === 'ios'|| Platform.OS === 'harmony') ? 255 : 1
const colorToRGB = (color) => [
    ((color >> 16) & 0xFF) / 255,
    ((color >> 8) & 0xFF) / 255,
    (color & 0xFF) / 255
];
const staticFilters = {
    normal: [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ],
    luminanceToAlpha: [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0.2125, 0.7154, 0.0721, 0, 0
    ],
    invert: [
        -1, 0, 0, 0, bias,
        0, -1, 0, 0, bias,
        0, 0, -1, 0, bias,
        0, 0, 0, 1, 0
    ],
    nightvision: [
        0.1, 0.4, 0, 0, 0,
        0.3, 1, 0.3, 0, 0,
        0, 0.4, 0.1, 0, 0,
        0, 0, 0, 1, 0
    ],
    warm: [
        1.06, 0, 0, 0, 0,
        0, 1.01, 0, 0, 0,
        0, 0, 0.93, 0, 0,
        0, 0, 0, 1, 0
    ],
    cool: [
        0.99, 0, 0, 0, 0,
        0, 0.93, 0, 0, 0,
        0, 0, 1.08, 0, 0,
        0, 0, 0, 1, 0
    ],
    technicolor: [
        1.9125277891456083, -0.8545344976951645, -0.09155508482755585, 0, 11.793603434377337 / biasRev,
        -0.3087833385928097, 1.7658908555458428, -0.10601743074722245, 0, -70.35205161461398 / biasRev,
        -0.231103377548616, -0.7501899197440212, 1.847597816108189, 0, 30.950940869491138 / biasRev,
        0, 0, 0, 1, 0
    ],
    polaroid: [
        1.438, -0.062, -0.062, 0, 0,
        -0.122, 1.378, -0.122, 0, 0,
        -0.016, -0.016, 1.483, 0, 0,
        0, 0, 0, 1, 0
    ],
    toBGR: [
        0, 0, 1, 0, 0,
        0, 1, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 0, 1, 0
    ],
    kodachrome: [
        1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502 / biasRev,
        -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203 / biasRev,
        -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946 / biasRev,
        0, 0, 0, 1, 0
    ],
    browni: [
        0.5997023498159715, 0.34553243048391263, -0.2708298674538042, 0, 47.43192855600873 / biasRev,
        -0.037703249837783157, 0.8609577587992641, 0.15059552388459913, 0, -36.96841498319127 / biasRev,
        0.24113635128153335, -0.07441037908422492, 0.44972182064877153, 0, -7.562075277591283 / biasRev,
        0, 0, 0, 1, 0
    ],
    vintage: [
        0.6279345635605994, 0.3202183420819367, -0.03965408211312453, 0, 9.651285835294123 / biasRev,
        0.02578397704808868, 0.6441188644374771, 0.03259127616149294, 0, 7.462829176470591 / biasRev,
        0.0466055556782719, -0.0851232987247891, 0.5241648018700465, 0, 5.159190588235296 / biasRev,
        0, 0, 0, 1, 0
    ],
    lsd: [
        2, -0.4, 0.5, 0, 0,
        -0.5, 2, -0.4, 0, 0,
        -0.4, -0.5, 3, 0, 0,
        0, 0, 0, 1, 0
    ],
    protanomaly: [
        0.817, 0.183, 0, 0, 0,
        0.333, 0.667, 0, 0, 0,
        0, 0.125, 0.875, 0, 0,
        0, 0, 0, 1, 0
    ],
    deuteranomaly: [
        0.8, 0.2, 0, 0, 0,
        0.258, 0.742, 0, 0, 0,
        0, 0.142, 0.858, 0, 0,
        0, 0, 0, 1, 0
    ],
    tritanomaly: [
        0.967, 0.033, 0, 0, 0,
        0, 0.733, 0.267, 0, 0,
        0, 0.183, 0.817, 0, 0,
        0, 0, 0, 1, 0
    ],
    protanopia: [
        0.567, 0.433, 0, 0, 0,
        0.558, 0.442, 0, 0, 0,
        0, 0.242, 0.758, 0, 0,
        0, 0, 0, 1, 0
    ],
    deuteranopia: [
        0.625, 0.375, 0, 0, 0,
        0.7, 0.3, 0, 0, 0,
        0, 0.3, 0.7, 0, 0,
        0, 0, 0, 1, 0
    ],
    tritanopia: [
        0.95, 0.05, 0, 0, 0,
        0, 0.433, 0.567, 0, 0,
        0, 0.475, 0.525, 0, 0,
        0, 0, 0, 1, 0
    ],
    achromatopsia: [
        0.299, 0.587, 0.114, 0, 0,
        0.299, 0.587, 0.114, 0, 0,
        0.299, 0.587, 0.114, 0, 0,
        0, 0, 0, 1, 0
    ],
    achromatomaly: [
        0.618, 0.320, 0.062, 0, 0,
        0.163, 0.775, 0.062, 0, 0,
        0.163, 0.320, 0.516, 0, 0,
        0, 0, 0, 1, 0
    ]
};
export default {
    normal: () => staticFilters.normal,
    rgba: (r = 1, g = 1, b = 1, a = 1) => [
        r, 0, 0, 0, 0,
        0, g, 0, 0, 0,
        0, 0, b, 0, 0,
        0, 0, 0, a, 0
    ],
    saturate: (v = 1) => [
        0.213 + 0.787 * v, 0.715 - 0.715 * v, 0.072 - 0.072 * v, 0, 0,
        0.213 - 0.213 * v, 0.715 + 0.285 * v, 0.072 - 0.072 * v, 0, 0,
        0.213 - 0.213 * v, 0.715 - 0.715 * v, 0.072 + 0.928 * v, 0, 0,
        0, 0, 0, 1, 0
    ],
    hueRotate: (v = 0) => {
        const cos = Math.cos(v);
        const sin = Math.sin(v);
        const a00 = (0.213) + (cos * 0.787) - (sin * 0.213);
        const a01 = (0.715) - (cos * 0.715) - (sin * 0.715);
        const a02 = (0.072) - (cos * 0.072) + (sin * 0.928);
        const a10 = (0.213) - (cos * 0.213) + (sin * 0.143);
        const a11 = (0.715) + (cos * 0.285) + (sin * 0.140);
        const a12 = (0.072) - (cos * 0.072) - (sin * 0.283);
        const a20 = (0.213) - (cos * 0.213) - (sin * 0.787);
        const a21 = (0.715) - (cos * 0.715) + (sin * 0.715);
        const a22 = (0.072) + (cos * 0.928) + (sin * 0.072);
        return [
            a00, a01, a02, 0, 0,
            a10, a11, a12, 0, 0,
            a20, a21, a22, 0, 0,
            0, 0, 0, 1, 0
        ];
    },
    luminanceToAlpha: () => staticFilters.luminanceToAlpha,
    invert: () => staticFilters.invert,
    grayscale: (v = 1) => {
        const cv = clamp(1 - v, 0, 1);
        return [
            0.2126 + 0.7874 * cv, 0.7152 - 0.7152 * cv, 0.0722 - 0.0722 * cv, 0, 0,
            0.2126 - 0.2126 * cv, 0.7152 + 0.2848 * cv, 0.0722 - 0.0722 * cv, 0, 0,
            0.2126 - 0.2126 * cv, 0.7152 - 0.7152 * cv, 0.0722 + 0.9278 * cv, 0, 0,
            0, 0, 0, 1, 0
        ];
    },
    sepia: (v = 1) => {
        const cv = clamp(1 - v, 0, 1);
        return [
            0.393 + 0.607 * cv, 0.769 - 0.769 * cv, 0.189 - 0.189 * cv, 0, 0,
            0.349 - 0.349 * cv, 0.686 + 0.314 * cv, 0.168 - 0.168 * cv, 0, 0,
            0.272 - 0.272 * cv, 0.534 - 0.534 * cv, 0.131 + 0.869 * cv, 0, 0,
            0, 0, 0, 1, 0
        ];
    },
    nightvision: () => staticFilters.nightvision,
    warm: () => staticFilters.warm,
    cool: () => staticFilters.cool,
    brightness: (v = 1) => [
        v, 0, 0, 0, 0,
        0, v, 0, 0, 0,
        0, 0, v, 0, 0,
        0, 0, 0, 1, 0
    ],
    contrast: (v = 1) => {
        const n = 0.5 * (1 - v);
        return [
            v, 0, 0, 0, bias * n,
            0, v, 0, 0, bias * n,
            0, 0, v, 0, bias * n,
            0, 0, 0, 1, 0
        ];
    },
    temperature: (v = 0) => [
        1 + v, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1 - v, 0, 0,
        0, 0, 0, 1, 0
    ],
    tint: (v = 0) => [
        1 + v, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1 + v, 0, 0,
        0, 0, 0, 1, 0
    ],
    threshold: (v = 0) => {
        const rLum = 0.03086;
        const gLum = 0.06094;
        const bLum = 0.00820;
        const r = rLum * 255;
        const g = gLum * 255;
        const b = bLum * 255;
        return [
            r, g, b, 0, -bias * v,
            r, g, b, 0, -bias * v,
            r, g, b, 0, -bias * v,
            0, 0, 0, 1, 0
        ];
    },
    technicolor: () => staticFilters.technicolor,
    polaroid: () => staticFilters.polaroid,
    toBGR: () => staticFilters.toBGR,
    kodachrome: () => staticFilters.kodachrome,
    browni: () => staticFilters.browni,
    vintage: () => staticFilters.vintage,
    night: (v = 0.1) => [
        v * (-2.0), -v, 0, 0, 0,
        -v, 0, v, 0, 0,
        0, v, v * 2.0, 0, 0,
        0, 0, 0, 1, 0
    ],
    predator: (v = 1) => [
        // row 1
        11.224130630493164 * v,
        -4.794486999511719 * v,
        -2.8746118545532227 * v,
        0 * v,
        0.40342438220977783 * v / biasRev,
        // row 2
        -3.6330697536468506 * v,
        9.193157196044922 * v,
        -2.951810836791992 * v,
        0 * v,
        -1.316135048866272 * v / biasRev,
        // row 3
        -3.2184197902679443 * v,
        -4.2375030517578125 * v,
        7.476448059082031 * v,
        0 * v,
        0.8044459223747253 * v / biasRev,
        // row 4
        0, 0, 0, 1, 0
    ],
    lsd: () => staticFilters.lsd,
    colorTone: (desaturation, toned, lightColor, darkColor) => {
        const [lR, lG, lB] = colorToRGB(lightColor === undefined ? 0xFFE580 : processColor(lightColor));
        const [dR, dG, dB] = colorToRGB(darkColor === undefined ? 0x338000 : processColor(darkColor));
        return [
            0.3, 0.59, 0.11, 0, 0,
            lR, lG, lB, (desaturation === undefined ? 0.2 : desaturation), 0,
            dR, dG, dB, (toned === undefined ? 0.15 : toned), 0,
            lR - dR, lG - dG, lB - dB, 0, 0
        ];
    },
    duoTone: (first, second) => {
        const [fR, fG, fB] = colorToRGB(first === undefined ? 0xFFE580 : processColor(first));
        const [sR, sG, sB] = colorToRGB(second === undefined ? 0x338000 : processColor(second));
        return [
            fR - sR, 0, 0, 0, sR * bias,
            fG - sG, 0, 0, 0, sG * bias,
            fB - sB, 0, 0, 0, sB * bias,
            0, 0, 0, 1, 0
        ];
    },
    protanomaly: () => staticFilters.protanomaly,
    deuteranomaly: () => staticFilters.deuteranomaly,
    tritanomaly: () => staticFilters.tritanomaly,
    protanopia: () => staticFilters.protanopia,
    deuteranopia: () => staticFilters.deuteranopia,
    tritanopia: () => staticFilters.tritanopia,
    achromatopsia: () => staticFilters.achromatopsia,
    achromatomaly: () => staticFilters.achromatomaly
};
//# sourceMappingURL=index.js.map