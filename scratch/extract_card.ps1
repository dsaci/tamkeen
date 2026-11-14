Expand-Archive -Path 'scratch/sample_card.docx' -DestinationPath 'scratch/sample_card_unzipped' -Force
$xml = Get-Content 'scratch/sample_card_unzipped/word/document.xml' -Raw -Encoding utf8
$clean = [System.Text.RegularExpressions.Regex]::Replace($xml, '<[^>]+>', ' ')
$clean = [System.Text.RegularExpressions.Regex]::Replace($clean, '\s+', ' ')
Set-Content -Path 'scratch/sample_card_text.txt' -Value $clean -Encoding utf8
Write-Host "Length: " $clean.Length
