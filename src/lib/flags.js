const modules = import.meta.glob('/src/lib/assets/flags/4x3/*.svg', {
    eager: true,
    as: 'url'
});

export function getFlagUrl(code) {
    return modules[`/src/lib/assets/flags/4x3/${code.toLowerCase()}.svg`];
}
