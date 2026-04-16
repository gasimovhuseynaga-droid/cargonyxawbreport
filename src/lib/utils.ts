export function exportCsv(
    rows: Array<Array<string | number | boolean | null | undefined>>,
    fileName: string
) {
    const csv = rows
        .map((row) =>
            row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')
        )
        .join('\n')

    const blob = new Blob(['\uFEFF' + csv], {
        type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
}