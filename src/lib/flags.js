const modules = import.meta.glob('/src/lib/assets/flags/4x3/*.svg', {
    eager: true,
    query: '?url',
    import: 'default'
});

export function getFlagUrl(code) {
    return modules[`/src/lib/assets/flags/4x3/${code.toLowerCase()}.svg`];
}
