:: Combine all the relevant files 
powershell -Command "& {cat ../xhr.js, ../lite.js | sc lite.js}"
:: Remove unnecessary import statements
powershell -Command "(gc lite.js) -replace 'import.*', '' | Out-File -encoding ASCII lite.js"