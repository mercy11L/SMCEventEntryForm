param (
    [string]$inputDoc,
    [string]$outputPdf
)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($inputDoc)
$doc.SaveAs($outputPdf, 17)
$doc.Close()
$word.Quit()