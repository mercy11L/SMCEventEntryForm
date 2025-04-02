param (
    [string]$inputDoc,
    [string]$outputPdf
)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
$doc = $word.Documents.Open($inputDoc)
$doc.SaveAs($outputPdf, 17)
$doc.Close()
}
catch {
    Write-Error "Failed to convert..: $_"
} finally {
    $word.Quit()
}