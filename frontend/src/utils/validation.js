export const VALIDATION_LIMITS = {
    emailMax: 254,
    fullNameMin: 2,
    fullNameMax: 80,
    passwordMin: 8,
    passwordMax: 72,
    recipeTitleMin: 3,
    recipeTitleMax: 100,
    recipeDescriptionMin: 10,
    recipeDescriptionMax: 800,
    categoryNameMin: 2,
    categoryNameMax: 60,
    prepTimeMin: 1,
    prepTimeMax: 1440,
    portionsMin: 1,
    portionsMax: 100,
    ingredientMin: 2,
    ingredientMax: 180,
    stepMin: 5,
    stepMax: 500,
    searchMax: 80,
    imageMaxFiles: 5,
    imageMaxSizeBytes: 10 * 1024 * 1024,
};

export const acceptedImageTypes = ['image/jpeg', 'image/png'];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const fullNamePattern = /^[\p{L}\p{M}]+(?:[ '\-.][\p{L}\p{M}]+)*$/u;
const categoryNamePattern = /^[\p{L}\p{M}\d][\p{L}\p{M}\d\s&/.,'()-]*$/u;

export function normalizeSpaces(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

export function normalizeEmail(value) {
    return normalizeSpaces(value).toLowerCase();
}

export function validateRequiredText(value, {
    label,
    min = 1,
    max,
    pattern,
    patternMessage,
}) {
    const normalizedValue = normalizeSpaces(value);

    if (!normalizedValue) {
        return `Informe ${label}.`;
    }

    if (normalizedValue.length < min) {
        return `${label} deve ter pelo menos ${min} caracteres.`;
    }

    if (max && normalizedValue.length > max) {
        return `${label} deve ter no máximo ${max} caracteres.`;
    }

    if (pattern && !pattern.test(normalizedValue)) {
        return patternMessage || `${label} possui formato inválido.`;
    }

    return '';
}

export function validateEmail(value) {
    const email = normalizeEmail(value);

    if (!email) {
        return 'Informe o e-mail.';
    }

    if (email.length > VALIDATION_LIMITS.emailMax) {
        return `E-mail deve ter no máximo ${VALIDATION_LIMITS.emailMax} caracteres.`;
    }

    if (!emailPattern.test(email)) {
        return 'Informe um e-mail válido.';
    }

    return '';
}

export function validateFullName(value) {
    return validateRequiredText(value, {
        label: 'o nome completo',
        min: VALIDATION_LIMITS.fullNameMin,
        max: VALIDATION_LIMITS.fullNameMax,
        pattern: fullNamePattern,
        patternMessage: 'Nome completo deve conter apenas letras, espaços, apóstrofo, ponto ou hífen.',
    });
}

export function validatePasswordForRegister(value) {
    const password = String(value || '');

    if (!password) {
        return 'Informe a senha.';
    }

    if (password.length < VALIDATION_LIMITS.passwordMin) {
        return `Senha deve ter pelo menos ${VALIDATION_LIMITS.passwordMin} caracteres.`;
    }

    if (password.length > VALIDATION_LIMITS.passwordMax) {
        return `Senha deve ter no máximo ${VALIDATION_LIMITS.passwordMax} caracteres.`;
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return 'Senha deve conter letras e números.';
    }

    return '';
}

export function validatePasswordForLogin(value) {
    const password = String(value || '');

    if (!password) {
        return 'Informe a senha.';
    }

    if (password.length > VALIDATION_LIMITS.passwordMax) {
        return `Senha deve ter no máximo ${VALIDATION_LIMITS.passwordMax} caracteres.`;
    }

    return '';
}

export function validateCategoryName(value) {
    return validateRequiredText(value, {
        label: 'o nome da categoria',
        min: VALIDATION_LIMITS.categoryNameMin,
        max: VALIDATION_LIMITS.categoryNameMax,
        pattern: categoryNamePattern,
        patternMessage: 'Categoria deve começar com letra ou número e usar apenas texto e pontuação simples.',
    });
}

export function validateIntegerRange(value, {
    label,
    min,
    max,
}) {
    const normalizedValue = String(value || '').trim();

    if (!normalizedValue) {
        return `Informe ${label}.`;
    }

    if (!/^\d+$/.test(normalizedValue)) {
        return `${label} deve ser um número inteiro.`;
    }

    const numericValue = Number(normalizedValue);

    if (numericValue < min || numericValue > max) {
        return `${label} deve estar entre ${min} e ${max}.`;
    }

    return '';
}

export function validateImageFiles(files) {
    const selectedFiles = Array.from(files || []);

    if (selectedFiles.length > VALIDATION_LIMITS.imageMaxFiles) {
        return `Selecione no máximo ${VALIDATION_LIMITS.imageMaxFiles} imagens.`;
    }

    const invalidTypeFile = selectedFiles.find((file) => !acceptedImageTypes.includes(file.type));

    if (invalidTypeFile) {
        return 'Use apenas imagens PNG ou JPG.';
    }

    const oversizedFile = selectedFiles.find((file) => file.size > VALIDATION_LIMITS.imageMaxSizeBytes);

    if (oversizedFile) {
        return 'Cada imagem deve ter no máximo 10MB.';
    }

    return '';
}

export function getFirstValidationMessage(errors) {
    return Object.values(errors).find(Boolean) || '';
}
